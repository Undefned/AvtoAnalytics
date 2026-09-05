/* =========================================================
   CATALOGUE.JS - WITH URL SYNC
   ========================================================= */

const PAGE_SIZE = 6;

let allItems = [];
let filteredItems = [];
let currentPage = 1;
let favoriteIds = new Set();
const selectedForCompare = new Set();
let isUpdatingFromUrl = false;

const gridEl = document.querySelector('.cards-grid');
const countEl = document.querySelector('.main__count');
const paginationEl = document.querySelector('.pagination');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// ===== URL PARAMETER HELPERS =====
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    make: params.get('make') || '',
    model: params.get('model') || '',
    priceFrom: params.get('priceFrom') || '',
    priceTo: params.get('priceTo') || '',
    yearFrom: params.get('yearFrom') || '',
    yearTo: params.get('yearTo') || '',
    mileageFrom: params.get('mileageFrom') || '',
    mileageTo: params.get('mileageTo') || '',
  };
}

function updateUrlParams() {
  // Don't update URL if we're loading from URL params
  if (isUpdatingFromUrl) return;
  
  const priceFromEl = document.getElementById('priceFrom');
  const priceToEl = document.getElementById('priceTo');
  const yearFromEl = document.getElementById('yearFrom');
  const yearToEl = document.getElementById('yearTo');
  const mileageFromEl = document.getElementById('mileageFrom');
  const mileageToEl = document.getElementById('mileageTo');
  
  const searchTerm = searchInput ? searchInput.value.trim() : '';
  
  const params = new URLSearchParams();
  
  // Parse search term to extract make and model
  if (searchTerm) {
    const parts = searchTerm.split(' ');
    if (parts.length >= 1 && parts[0]) params.set('make', parts[0]);
    if (parts.length >= 2 && parts[1]) params.set('model', parts.slice(1).join(' '));
  }
  
  if (priceFromEl && priceFromEl.value) params.set('priceFrom', priceFromEl.value);
  if (priceToEl && priceToEl.value) params.set('priceTo', priceToEl.value);
  if (yearFromEl && yearFromEl.value) params.set('yearFrom', yearFromEl.value);
  if (yearToEl && yearToEl.value) params.set('yearTo', yearToEl.value);
  if (mileageFromEl && mileageFromEl.value) params.set('mileageFrom', mileageFromEl.value);
  if (mileageToEl && mileageToEl.value) params.set('mileageTo', mileageToEl.value);
  
  // Build new URL
  const queryString = params.toString();
  const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
  
  // Update URL without reloading the page
  if (window.location.search !== (queryString ? '?' + queryString : '')) {
    window.history.replaceState({}, '', newUrl);
  }
}

function applyUrlParamsToFilters() {
  isUpdatingFromUrl = true;
  const urlParams = getUrlParams();
  
  // Build search term from make + model
  const searchTerm = [urlParams.make, urlParams.model].filter(Boolean).join(' ');
  if (searchInput && searchTerm) {
    searchInput.value = searchTerm;
  }
  
  const priceFromEl = document.getElementById('priceFrom');
  const priceToEl = document.getElementById('priceTo');
  const yearFromEl = document.getElementById('yearFrom');
  const yearToEl = document.getElementById('yearTo');
  const mileageFromEl = document.getElementById('mileageFrom');
  const mileageToEl = document.getElementById('mileageTo');
  
  if (priceFromEl && urlParams.priceFrom) priceFromEl.value = urlParams.priceFrom;
  if (priceToEl && urlParams.priceTo) priceToEl.value = urlParams.priceTo;
  if (yearFromEl && urlParams.yearFrom) yearFromEl.value = urlParams.yearFrom;
  if (yearToEl && urlParams.yearTo) yearToEl.value = urlParams.yearTo;
  if (mileageFromEl && urlParams.mileageFrom) mileageFromEl.value = urlParams.mileageFrom;
  if (mileageToEl && urlParams.mileageTo) mileageToEl.value = urlParams.mileageTo;
  
  isUpdatingFromUrl = false;
}

function parseNumber(str) {
  if (!str || str.trim() === '') return null;
  const cleaned = String(str).replace(/[^\d]/g, '');
  if (cleaned === '') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

/* ===== Loading data ===== */
async function loadAds() {
  if (gridEl) gridEl.innerHTML = '<p style="grid-column:1/-1;">Загружаем объявления…</p>';

  try {
    const page = await apiFetch('/ads?page=0&size=200');
    const ads = page.content || [];

    const carIds = [...new Set(ads.map(ad => ad.car?.id).filter(Boolean))];
    const averages = {};
    await Promise.all(carIds.map(async (carId) => {
      try {
        averages[carId] = await apiFetch(`/analytics/average/${carId}`);
      } catch (_) {
        averages[carId] = null;
      }
    }));

    allItems = ads.map(ad => {
      const car = ad.car || {};
      
      let year = car.year;
      if (year == null && ad.title) {
        const yearMatch = ad.title.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          year = parseInt(yearMatch[0]);
        }
      }

      const fairPrice = car.id != null ? averages[car.id] : null;

      return {
        id: ad.id,
        title: [car.make, car.model].filter(Boolean).join(' ') || ad.title,
        make: car.make || '',
        model: car.model || '',
        specs: [car.engineVolume ? `${car.engineVolume}L` : null, car.horsepower ? `${car.horsepower} hp` : null].filter(Boolean).join(' · '),
        price: ad.price,
        year: year,
        mileage: ad.mileage,
        transmission: car.transmission,
        photoUrls: ad.photoUrls,
        fairPrice,
        aboveMarket: fairPrice != null ? ad.price > fairPrice : null,
      };
    });

    if (Auth.isAuthenticated()) {
      try {
        const favs = await apiFetch('/users/favorites', { auth: true });
        favoriteIds = new Set((favs || []).map(a => a.id));
      } catch (_) {
        favoriteIds = new Set();
      }
    }

    // Apply URL parameters BEFORE rendering
    applyUrlParamsToFilters();
    applyFiltersAndRender();
  } catch (err) {
    console.error('Load ads error:', err);
    if (gridEl) {
      gridEl.innerHTML = `<p style="grid-column:1/-1; color:#934344;">Не удалось загрузить объявления: ${err.message}</p>`;
    }
  }
}

/* ===== Reading filters ===== */
function readFilters() {
  const priceFrom = document.getElementById('priceFrom');
  const priceTo = document.getElementById('priceTo');
  const yearFrom = document.getElementById('yearFrom');
  const yearTo = document.getElementById('yearTo');
  const mileageFrom = document.getElementById('mileageFrom');
  const mileageTo = document.getElementById('mileageTo');

  return {
    priceFrom: parseNumber(priceFrom?.value),
    priceTo: parseNumber(priceTo?.value),
    yearFrom: parseNumber(yearFrom?.value),
    yearTo: parseNumber(yearTo?.value),
    mileageFrom: parseNumber(mileageFrom?.value),
    mileageTo: parseNumber(mileageTo?.value),
  };
}

function readSort() {
  const el = document.querySelector('.main__sort-select');
  return el ? el.value : 'Price: Low to High';
}

function getSearchTerm() {
  return searchInput ? searchInput.value.trim() : '';
}

function applyFiltersAndRender() {
  const f = readFilters();
  const searchTerm = getSearchTerm().toLowerCase();

  filteredItems = allItems.filter(item => {
    // Price
    if (f.priceFrom != null && item.price < f.priceFrom) return false;
    if (f.priceTo != null && item.price > f.priceTo) return false;
    
    // Year
    if (f.yearFrom != null) {
      if (item.year != null) {
        const yearNum = Number(item.year);
        if (yearNum < f.yearFrom) return false;
      }
    }
    if (f.yearTo != null) {
      if (item.year != null) {
        const yearNum = Number(item.year);
        if (yearNum > f.yearTo) return false;
      }
    }
    
    // Mileage
    if (f.mileageFrom != null && item.mileage != null && item.mileage < f.mileageFrom) return false;
    if (f.mileageTo != null && item.mileage != null && item.mileage > f.mileageTo) return false;
    
    // Search
    if (searchTerm) {
      const matchMake = item.make.toLowerCase().includes(searchTerm);
      const matchModel = item.model.toLowerCase().includes(searchTerm);
      const matchTitle = item.title.toLowerCase().includes(searchTerm);
      if (!matchMake && !matchModel && !matchTitle) return false;
    }
    
    return true;
  });

  const sort = readSort();
  const sorters = {
    'Price: Low to High': (a, b) => a.price - b.price,
    'Price: High to Low': (a, b) => b.price - a.price,
    'Year: Newest': (a, b) => (b.year || 0) - (a.year || 0),
    'Year: Oldest': (a, b) => (a.year || 0) - (b.year || 0),
    'Mileage: Low to High': (a, b) => (a.mileage || 0) - (b.mileage || 0),
  };
  if (sorters[sort]) filteredItems.sort(sorters[sort]);

  currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)));
  renderCount();
  renderGrid();
  renderPagination();
  
  // ✅ Update URL after filtering
  updateUrlParams();
}

function renderCount() {
  if (countEl) countEl.textContent = `${filteredItems.length} cars found`;
}

function cardHTML(item) {
  const image = (item.photoUrls && item.photoUrls[0]) || 'https://placehold.co/280x138';
  const isFav = favoriteIds.has(item.id);
  const favIcon = isFav ? 'assets/favouriteBigBlue.svg' : 'assets/favourite.svg';
  const tagClass = item.aboveMarket === null ? '' : (item.aboveMarket ? 'card__tag--bad' : 'card__tag--good');
  const tagText = item.aboveMarket === null ? '' : (item.aboveMarket ? 'Bad price' : 'Good price');

  return `
    <div class="card" data-id="${item.id}">
      <div class="card__image">
        <a href="avto_card.html?id=${item.id}"><img src="${image}" alt="${item.title}" loading="lazy"></a>
        <input type="checkbox" class="card__checkbox" data-id="${item.id}" ${selectedForCompare.has(item.id) ? 'checked' : ''} />
        <div class="card__favorite" data-id="${item.id}">
          <img src="${favIcon}" alt="favorite">
        </div>
      </div>
      <div class="card__body">
        <a href="avto_card.html?id=${item.id}" style="text-decoration:none; color:inherit;">
          <div class="card__title">${item.title}</div>
          <div class="card__price">${formatPrice(item.price)}</div>
          <div class="card__specs">${item.year ?? '—'} · ${item.mileage != null ? item.mileage.toLocaleString('ru-RU') + ' km' : '—'}</div>
        </a>
        ${tagText ? `<span class="card__tag ${tagClass}">${tagText}</span>` : ''}
      </div>
    </div>
  `;
}

function renderGrid() {
  if (!gridEl) return;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(start, start + PAGE_SIZE);

  if (pageItems.length === 0) {
    gridEl.innerHTML = '<p style="grid-column:1/-1;">По вашим фильтрам ничего не найдено.</p>';
    return;
  }
  gridEl.innerHTML = pageItems.map(cardHTML).join('');
}

function renderPagination() {
  if (!paginationEl) return;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pages = [];
  const window_ = 2;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - window_ && p <= currentPage + window_)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const prevArrow = `<div class="pagination__arrow" data-nav="prev"><svg viewBox="0 0 6 10"><path d="M5.5 0.5L1 5L5.5 9.5"/></svg></div>`;
  const nextArrow = `<div class="pagination__arrow" data-nav="next"><svg viewBox="0 0 6 10"><path d="M0.5 0.5L5 5L0.5 9.5"/></svg></div>`;

  const middle = pages.map(p => p === '…'
    ? `<span class="pagination__dots">...</span>`
    : `<div class="pagination__item ${p === currentPage ? 'pagination__item--active' : ''}" data-page="${p}">${p}</div>`
  ).join('');

  paginationEl.innerHTML = prevArrow + middle + nextArrow;
}

/* ===== Events ===== */
// ✅ Filter inputs - update URL on every change
document.querySelectorAll('.filter-group input[type="text"]').forEach(el => {
  el.addEventListener('input', () => { 
    currentPage = 1; 
    applyFiltersAndRender(); 
  });
});

// ✅ Sort - update URL on change
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', () => { 
    currentPage = 1; 
    applyFiltersAndRender(); 
  });
}

// ✅ Search input - update URL on Enter
if (searchInput) {
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      currentPage = 1;
      applyFiltersAndRender();
    }
  });
}

// ✅ Search button
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    currentPage = 1;
    applyFiltersAndRender();
  });
}

// ✅ Reset button - clear all filters and URL
const resetBtn = document.querySelector('.sidebar__reset');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.filter-group input[type="text"]').forEach(i => i.value = '');
    if (searchInput) searchInput.value = '';
    currentPage = 1;
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
    applyFiltersAndRender();
  });
}

// ✅ Pagination
if (paginationEl) {
  paginationEl.addEventListener('click', (e) => {
    const pageEl = e.target.closest('[data-page]');
    const navEl = e.target.closest('[data-nav]');
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

    if (pageEl) {
      currentPage = Number(pageEl.dataset.page);
    } else if (navEl) {
      currentPage = navEl.dataset.nav === 'prev' ? Math.max(1, currentPage - 1) : Math.min(totalPages, currentPage + 1);
    } else {
      return;
    }
    renderGrid();
    renderPagination();
    if (gridEl) {
      window.scrollTo({ top: gridEl.offsetTop - 100, behavior: 'smooth' });
    }
  });
}

// ✅ Favorites & Compare
if (gridEl) {
  gridEl.addEventListener('click', async (e) => {
    const favEl = e.target.closest('.card__favorite');
    const checkboxEl = e.target.closest('.card__checkbox');

    if (favEl) {
      e.preventDefault();
      const adId = Number(favEl.dataset.id);

      if (!Auth.isAuthenticated()) {
        window.location.href = 'login_signup.html';
        return;
      }

      try {
        if (favoriteIds.has(adId)) {
          await apiFetch(`/users/favorites/${adId}`, { method: 'DELETE', auth: true });
          favoriteIds.delete(adId);
        } else {
          await apiFetch(`/users/favorites/${adId}`, { method: 'POST', auth: true });
          favoriteIds.add(adId);
        }
        renderGrid();
      } catch (err) {
        alert(`Не удалось обновить избранное: ${err.message}`);
      }
      return;
    }

    if (checkboxEl) {
      const adId = Number(checkboxEl.dataset.id);
      if (checkboxEl.checked) selectedForCompare.add(adId);
      else selectedForCompare.delete(adId);
    }
  });
}

// ✅ Compare button
const compareBtn = document.querySelector('.main__compare-btn');
if (compareBtn) {
  compareBtn.addEventListener('click', () => {
    if (selectedForCompare.size === 0) {
      alert('Выберите хотя бы одно объявление для сравнения.');
      return;
    }
    window.location.href = `compare.html?ids=${[...selectedForCompare].join(',')}`;
  });
}

// Load ads when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAds);
} else {
  loadAds();
}