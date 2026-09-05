/* =========================================================
   MAIN.JS - FIXED (Fair Price)
   ========================================================= */

const grid = document.getElementById('catalogGrid');

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

function cardHTML(item) {
  const flagClass = item.flag === 'down' ? 'car-card__flag--down' : 'car-card__flag--up';
  const flagIcon  = item.flag === 'down' ? '↓' : '↑';
  const flagText  = item.flag === 'down' ? 'Ниже рынка' : 'Выше рынка';
  const image = (item.photoUrls && item.photoUrls[0]) || 'https://placehold.co/186x119';

  return `
    <a class="car-card" href="avto_card.html?id=${item.id}" style="text-decoration:none; color:inherit;">
      <div class="car-card__top">
        <img class="car-card__image" src="${image}" alt="${item.title}">
        <div class="car-card__info">
          <h3 class="car-card__title">${item.title}</h3>
          <p class="car-card__trim">${item.trim}</p>
        </div>
      </div>

      <p class="car-card__price">${formatPrice(item.price)}</p>
      ${item.flag ? `<span class="car-card__flag ${flagClass}">${flagIcon} ${flagText}</span>` : ''}

      <div class="car-card__stats">
        <span class="stat"><span class="stat__icon"><img src="assets/calendar.svg"></span>${item.year ?? '—'}</span>
        <span class="stat"><span class="stat__icon"><img src="assets/graphic_big.svg"></span>${item.mileage != null ? item.mileage.toLocaleString('ru-RU') + ' км' : '—'}</span>
        <span class="stat"><span class="stat__icon"><img src="assets/checked.svg"></span>${item.transmission ?? ''}</span>
      </div>

      <hr class="car-card__divider">
      <p class="car-card__fair-price">
        <span class="label">Справедливая цена: </span><span class="value">${item.fairPrice != null ? formatPrice(item.fairPrice) : '—'}</span>
      </p>
    </a>
  `;
}

async function loadCatalogPreview() {
  if (!grid) return;
  grid.innerHTML = '<p style="grid-column:1/-1;">Загружаем объявления…</p>';

  try {
    const page = await apiFetch('/ads?page=0&size=6');
    const ads = page.content || [];

    if (ads.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;">Пока нет объявлений.</p>';
      return;
    }

    console.log('📦 Ads loaded:', ads.length);

    // ✅ Get car IDs from the ad data - try multiple sources
    const carIds = [];
    ads.forEach(ad => {
      // Try ad.car.id
      if (ad.car && ad.car.id) {
        carIds.push(ad.car.id);
      }
      // Try ad.carId (some responses use this)
      else if (ad.carId) {
        carIds.push(ad.carId);
      }
    });
    
    // Remove duplicates
    const uniqueCarIds = [...new Set(carIds.filter(Boolean))];
    console.log('🔍 Unique car IDs:', uniqueCarIds);

    // ✅ Fetch averages for each car
    const averages = {};
    await Promise.all(uniqueCarIds.map(async (carId) => {
      try {
        const avg = await apiFetch(`/analytics/average/${carId}`);
        averages[carId] = avg;
        console.log(`✅ Average for car ${carId}:`, avg);
      } catch (err) {
        console.log(`⚠️ No average for car ${carId}:`, err.message);
        averages[carId] = null;
      }
    }));

    console.log('📊 Averages loaded:', averages);

    const items = ads.map(ad => {
      const car = ad.car || {};
      
      // ✅ Get car ID from multiple sources
      let carId = car.id;
      if (!carId && ad.carId) carId = ad.carId;
      
      // Extract year from title if car.year is null
      let year = car.year;
      if (year == null && ad.title) {
        const yearMatch = ad.title.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          year = parseInt(yearMatch[0]);
        }
      }
      
      // Try description if still null
      if (year == null && ad.description) {
        const yearMatch = ad.description.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          year = parseInt(yearMatch[0]);
        }
      }

      // ✅ Get fair price using the car ID
      const fairPrice = carId != null ? averages[carId] : null;
      
      console.log(`🚗 ${car.make || 'Unknown'} ${car.model || ''} - carId: ${carId}, fairPrice: ${fairPrice}`);

      return {
        id: ad.id,
        title: [car.make, car.model].filter(Boolean).join(' ') || ad.title,
        trim: [car.engineVolume ? `${car.engineVolume}L` : null, car.transmission].filter(Boolean).join(' '),
        price: ad.price,
        year: year,
        mileage: ad.mileage,
        transmission: car.transmission,
        photoUrls: ad.photoUrls,
        fairPrice: fairPrice,
        flag: fairPrice != null ? (ad.price > fairPrice ? 'up' : 'down') : null,
      };
    });

    grid.innerHTML = items.map(cardHTML).join('');
  } catch (err) {
    console.error('❌ Load error:', err);
    grid.innerHTML = `<p style="grid-column:1/-1; color:#934344;">Не удалось загрузить объявления: ${err.message}</p>`;
  }
}

// ===== Search: redirect to the catalogue with the entered filters =====
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const make = document.getElementById('searchMake').value.trim();
    const model = document.getElementById('searchModel').value.trim();
    const price = document.getElementById('searchPrice').value.trim();

    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (price) params.set('priceTo', price);

    window.location.href = `catalogue.html${params.toString() ? '?' + params.toString() : ''}`;
  });
}

// Load when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCatalogPreview);
} else {
  loadCatalogPreview();
}