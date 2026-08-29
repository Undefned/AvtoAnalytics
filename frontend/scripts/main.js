/* =========================================================
   MAIN.JS
   Главная страница: подтягивает объявления с бэкенда и для
   каждого показывает "справедливую цену" (средняя цена по
   модели авто), сравнивая её с текущей ценой объявления.
   ========================================================= */

const grid = document.getElementById('catalogGrid');

function formatPrice(value) {
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
  grid.innerHTML = '<p style="grid-column:1/-1;">Загружаем объявления…</p>';

  try {
    const page = await apiFetch('/ads?page=0&size=6');
    const ads = page.content || [];

    if (ads.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;">Пока нет объявлений.</p>';
      return;
    }

    // Fetch the average market price per car model in parallel (deduped by carId)
    const carIds = [...new Set(ads.map(ad => ad.car?.id).filter(Boolean))];
    const averages = {};
    await Promise.all(carIds.map(async (carId) => {
      try {
        averages[carId] = await apiFetch(`/analytics/average/${carId}`);
      } catch (_) {
        averages[carId] = null;
      }
    }));

    const items = ads.map(ad => {
      const car = ad.car || {};
      const fairPrice = car.id != null ? averages[car.id] : null;
      return {
        id: ad.id,
        title: [car.make, car.model].filter(Boolean).join(' ') || ad.title,
        trim: [car.engineVolume ? `${car.engineVolume}L` : null, car.transmission].filter(Boolean).join(' '),
        price: ad.price,
        year: car.year,
        mileage: ad.mileage,
        transmission: car.transmission,
        photoUrls: ad.photoUrls,
        fairPrice: fairPrice,
        flag: fairPrice != null ? (ad.price > fairPrice ? 'up' : 'down') : null,
      };
    });

    grid.innerHTML = items.map(cardHTML).join('');
  } catch (err) {
    grid.innerHTML = `<p style="grid-column:1/-1; color:#934344;">Не удалось загрузить объявления: ${err.message}</p>`;
  }
}

loadCatalogPreview();

// ===== Search: redirect to the catalogue with the entered filters =====
document.getElementById('searchForm').addEventListener('submit', (e) => {
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