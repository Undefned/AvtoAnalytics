/* =========================================================
   CATALOGUE.JS
   Реальные объявления с бэкенда. Бэкенд отдаёт список через
   GET /api/ads (без реальной фильтрации по цене/пробегу —
   CarService.buildSpecification их не применяет), поэтому весь
   список забирается один раз, а фильтрация/сортировка/пагинация
   сделаны на фронте.

   "Engine Type" (Petrol/Diesel/Electric) визуально оставлен —
   у Car нет поля типа топлива, поэтому эти чекбоксы ни на что
   не влияют (только Transmission реально фильтрует список).
   ========================================================= */

const PAGE_SIZE = 6;

let allItems = [];          // все объявления, уже смэппленные под карточку
let filteredItems = [];     // после фильтров/сортировки
let currentPage = 1;
let favoriteIds = new Set();
const selectedForCompare = new Set();

const gridEl = document.querySelector('.cards-grid');
const countEl = document.querySelector('.main__count');
const paginationEl = document.querySelector('.pagination');

function parseNumber(str) {
  if (!str) return null;
  const n = Number(String(str).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && str.trim() !== '' ? n : null;
}

function formatPrice(value) {
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

/* ===== Loading data ===== */
async function loadAds() {
  gridEl.innerHTML = '<p style="grid-column:1/-1;">Загружаем объявления…</p>';

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
      const fairPrice = car.id != null ? averages[car.id] : null;
      return {
        id: ad.id,
        title: [car.make, car.model].filter(Boolean).join(' ') || ad.title,
        make: car.make || '',
        model: car.model || '',
        specs: [car.engineVolume ? `${car.engineVolume}L` : null, car.horsepower ? `${car.horsepower} hp` : null].filter(Boolean).join(' · '),
        price: ad.price,
        year: car.year,
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

    applyInitialQueryParams();
    applyFiltersAndRender();
  } catch (err) {
    gridEl.innerHTML = `<p style="grid-column:1/-1; color:#934344;">Не удалось загрузить объявления: ${err.message}</p>`;
  }
}

/* ===== Pre-fill from ?make=&model=&priceTo= coming from the main page search ===== */
function applyInitialQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const priceTo = params.get('priceTo');
  if (priceTo) {
    document.querySelectorAll('.price-range__inputs input')[1].value = priceTo;
  }
  // make/model are matched silently against the fetched list (no dedicated sidebar field exists)
  window.__quickMake = params.get('make') || '';
  window.__quickModel = params.get('model') || '';
}

/* ===== Reading current filter/sort state from the sidebar ===== */
function readFilters() {
  const priceInputs = document.querySelectorAll('.price-range__inputs input');
  const yearInputs = document.querySelectorAll('.filter-group')[1].querySelectorAll('input');
  const mileageInputs = document.querySelectorAll('.filter-group')[2].querySelectorAll('input');
  const transmissionBoxes = document.querySelectorAll('.filter-group')[4].querySelectorAll('input[type="checkbox"]');

  const transmissionMap = ['AUTOMATIC', 'MANUAL', 'CVT'];
  const checkedTransmissions = transmissionMap.filter((_, i) => transmissionBoxes[i]?.checked);

  return {
    priceFrom: parseNumber(priceInputs[0]?.value),
    priceTo: parseNumber(priceInputs[1]?.value),
    yearFrom: parseNumber(yearInputs[0]?.value),
    yearTo: parseNumber(yearInputs[1]?.value),
    mileageFrom: parseNumber(mileageInputs[0]?.value),
    mileageTo: parseNumber(mileageInputs[1]?.value),
    // all 3 checked (or none) => no filtering
    transmissions: checkedTransmissions.length === 3 ? [] : checkedTransmissions,
  };
}

function readSort() {
  return document.querySelector('.main__sort-select').value;
}

function applyFiltersAndRender() {
  const f = readFilters();

  filteredItems = allItems.filter(item => {
    if (f.priceFrom != null && item.price < f.priceFrom) return false;
    if (f.priceTo != null && item.price > f.priceTo) return false;
    if (f.yearFrom != null && item.year != null && item.year < f.yearFrom) return false;
    if (f.yearTo != null && item.year != null && item.year > f.yearTo) return false;
    if (f.mileageFrom != null && item.mileage != null && item.mileage < f.mileageFrom) return false;
    if (f.mileageTo != null && item.mileage != null && item.mileage > f.mileageTo) return false;
    if (f.transmissions.length && !f.transmissions.includes(item.transmission)) return false;
    if (window.__quickMake && !item.make.toLowerCase().includes(window.__quickMake.toLowerCase())) return false;
    if (window.__quickModel && !item.model.toLowerCase().includes(window.__quickModel.toLowerCase())) return false;
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
}

function renderCount() {
  countEl.textContent = `${filteredItems.length} cars found`;
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
        <a href="avto_card.html?id=${item.id}"><img src="${image}" alt="${item.title}"></a>
        <input type="checkbox" class="card__checkbox" data-id="${item.id}" ${selectedForCompare.has(item.id) ? 'checked' : ''} />
        <div class="card__favorite" data-id="${item.id}">
          <img src="${favIcon}">
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
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(start, start + PAGE_SIZE);

  if (pageItems.length === 0) {
    gridEl.innerHTML = '<p style="grid-column:1/-1;">По вашим фильтрам ничего не найдено.</p>';
    return;
  }
  gridEl.innerHTML = pageItems.map(cardHTML).join('');
}

function renderPagination() {
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
document.querySelectorAll('.filter-group input, .main__sort-select').forEach(el => {
  el.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
});
document.querySelectorAll('.filter-group input[type="text"]').forEach(el => {
  el.addEventListener('keyup', () => { currentPage = 1; applyFiltersAndRender(); });
});

document.querySelector('.sidebar__reset').addEventListener('click', () => {
  document.querySelectorAll('.filter-group input[type="text"]').forEach(i => i.value = '');
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(i => i.checked = true);
  window.__quickMake = '';
  window.__quickModel = '';
  currentPage = 1;
  applyFiltersAndRender();
});

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
  window.scrollTo({ top: gridEl.offsetTop - 100, behavior: 'smooth' });
});

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

document.querySelector('.main__compare-btn').addEventListener('click', () => {
  if (selectedForCompare.size === 0) {
    alert('Выберите хотя бы одно объявление для сравнения.');
    return;
  }
  window.location.href = `compare.html?ids=${[...selectedForCompare].join(',')}`;
});

loadAds();