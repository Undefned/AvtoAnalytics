/* =========================================================
   PROFILE.JS
   - GET /api/users/me            -> текущий пользователь (auth)
   - GET /api/ads/seller/{userId} -> мои объявления
   - GET /api/users/favorites     -> избранное (auth)

   "Questions answered" — на бэкенде нет контроллера для вопросов,
   поэтому эта метрика показывается как "—".
   ========================================================= */

if (!Auth.isAuthenticated()) {
  window.location.href = 'login_signup.html';
}

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

const myAdsRow = document.querySelector('.cards-row');
const favoritesGrid = document.querySelector('.favorites-grid');
const activeAdsValue = document.querySelectorAll('.stat-card__value')[0];
const savedCarsValue = document.querySelectorAll('.stat-card__value')[1];
const questionsValue = document.querySelectorAll('.stat-card__value')[2];

function myAdCardHTML(ad) {
  const car = ad.car || {};
  const title = [car.make, car.model, car.year].filter(Boolean).join(' ');
  const image = (ad.photoUrls && ad.photoUrls[0]) || 'https://placehold.co/261x128';

  return `
    <a class="card-horizontal" href="avto_card.html?id=${ad.id}" style="text-decoration:none; color:inherit;">
      <div class="card-horizontal__image">
        <img src="${image}" alt="${title}" />
      </div>
      <div class="card-horizontal__body">
        <div class="card-horizontal__info">
          <div class="card-horizontal__title">${title || ad.title}</div>
          <div class="card-horizontal__location">${ad.city || '—'}</div>
        </div>
        <div class="card-horizontal__price">${formatPrice(ad.price)}</div>
      </div>
    </a>
  `;
}

function favoriteCardHTML(ad) {
  const image = (ad.photoUrls && ad.photoUrls[0]) || 'https://placehold.co/201x99';
  return `
    <div class="card-favorite" data-ad-id="${ad.id}">
      <a href="avto_card.html?id=${ad.id}">
        <div class="card-favorite__image">
          <img src="${image}" alt="Car" />
          <div class="card-favorite__price-tag">${formatPrice(ad.price)}</div>
        </div>
      </a>
      <div class="card-favorite__heart" data-remove-favorite="${ad.id}" title="Remove from favorites">
        <svg viewBox="0 0 18 18"><path d="M9 16L2.7 9.7C1.2 8.2 1.2 5.8 2.7 4.3C4.2 2.8 6.6 2.8 8.1 4.3L9 5.2L9.9 4.3C11.4 2.8 13.8 2.8 15.3 4.3C16.8 5.8 16.8 8.2 15.3 9.7L9 16Z" fill="#2563EB"/></svg>
      </div>
    </div>
  `;
}

async function load() {
  myAdsRow.innerHTML = '<p>Загружаем…</p>';
  favoritesGrid.innerHTML = '<p>Загружаем…</p>';

  try {
    const me = await apiFetch('/users/me', { auth: true });

    const [myAds, favorites] = await Promise.all([
      apiFetch(`/ads/seller/${me.id}`, { auth: true }).catch(() => []),
      apiFetch('/users/favorites', { auth: true }).catch(() => []),
    ]);

    activeAdsValue.textContent = myAds.filter(a => a.status === 'ACTIVE').length;
    savedCarsValue.textContent = favorites.length;
    questionsValue.textContent = '—';

    myAdsRow.innerHTML = myAds.length
      ? myAds.map(myAdCardHTML).join('')
      : '<p>You haven\'t published any ads yet.</p>';

    favoritesGrid.innerHTML = favorites.length
      ? favorites.map(favoriteCardHTML).join('')
      : '<p>No favorites yet.</p>';

    favoritesGrid.addEventListener('click', async (e) => {
      const heart = e.target.closest('[data-remove-favorite]');
      if (!heart) return;
      e.preventDefault();
      const adId = Number(heart.dataset.removeFavorite);
      try {
        await apiFetch(`/users/favorites/${adId}`, { method: 'DELETE', auth: true });
        heart.closest('.card-favorite').remove();
        savedCarsValue.textContent = Number(savedCarsValue.textContent) - 1;
      } catch (err) {
        alert(`Couldn't remove from favorites: ${err.message}`);
      }
    });
  } catch (err) {
    myAdsRow.innerHTML = `<p style="color:#934344;">Failed to load profile: ${err.message}</p>`;
    favoritesGrid.innerHTML = '';
  }
}

/* ===== Sidebar: scroll to the matching section instead of navigating away,
   since both "My Ads" and "Favorites" already live on this same page ===== */
document.querySelectorAll('.sidebar__item').forEach((item, i) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar__item').forEach(el => el.classList.remove('sidebar__item--active'));
    item.classList.add('sidebar__item--active');
    const sections = document.querySelectorAll('.main > section');
    if (i === 1 && sections[0]) sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (i === 2 && sections[1]) sections[1].scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

load();