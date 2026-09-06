/* =========================================================
   PROFILE.JS - COMPLETE FIX WITH QUESTIONS COUNTER
   ========================================================= */

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

const myAdsRow = document.querySelector('.cards-row');
const favoritesGrid = document.querySelector('.favorites-grid');
const activeAdsValue = document.querySelectorAll('.stat-card__value')[0];
const savedCarsValue = document.querySelectorAll('.stat-card__value')[1];
const questionsValue = document.querySelectorAll('.stat-card__value')[2];

function myAdCardHTML(ad) {
  const car = ad.car || {};
  const title = [car.make, car.model, car.year].filter(Boolean).join(' ') || ad.title || 'Untitled';
  const image = (ad.photoUrls && ad.photoUrls[0]) || 'https://placehold.co/261x128?text=No+photo';

  return `
    <a class="card-horizontal" href="avto_card.html?id=${ad.id}" style="text-decoration:none; color:inherit;">
      <div class="card-horizontal__image">
        <img src="${image}" alt="${title}" loading="lazy" />
      </div>
      <div class="card-horizontal__body">
        <div class="card-horizontal__info">
          <div class="card-horizontal__title">${title}</div>
          <div class="card-horizontal__location">${ad.city || '—'}</div>
        </div>
        <div class="card-horizontal__price">${formatPrice(ad.price)}</div>
      </div>
    </a>
  `;
}

function favoriteCardHTML(ad) {
  const image = (ad.photoUrls && ad.photoUrls[0]) || 'https://placehold.co/201x99?text=No+photo';
  const car = ad.car || {};
  const title = [car.make, car.model, car.year].filter(Boolean).join(' ') || ad.title || 'Car';

  return `
    <div class="card-favorite" data-ad-id="${ad.id}">
      <a href="avto_card.html?id=${ad.id}" style="text-decoration:none; color:inherit;">
        <div class="card-favorite__image">
          <img src="${image}" alt="${title}" loading="lazy" />
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
  // ✅ Check authentication first
  if (!Auth.isAuthenticated()) {
    window.location.href = 'login_signup.html';
    return;
  }

  if (myAdsRow) myAdsRow.innerHTML = '<p>Loading…</p>';
  if (favoritesGrid) favoritesGrid.innerHTML = '<p>Loading…</p>';

  try {
    // ✅ Get current user
    const me = await apiFetch('/users/me', { auth: true });
    console.log('✅ User loaded:', me);

    // ✅ Update dropdown with user info
    updateDropdownUser(me);

    // ✅ Get user's ads using the same /api/ads endpoint with filter
    let myAds = [];
    let favorites = [];
    
    try {
      // Try to get ads by seller using the main ads endpoint
      const allAds = await apiFetch('/ads?page=0&size=200', { auth: true });
      const ads = allAds.content || [];
      // Filter ads by seller ID
      myAds = ads.filter(ad => ad.sellerId === me.id || ad.seller?.id === me.id);
    } catch (err) {
      console.warn('Could not fetch ads:', err);
      myAds = [];
    }

    try {
      favorites = await apiFetch('/users/favorites', { auth: true });
      if (!Array.isArray(favorites)) favorites = [];
    } catch (err) {
      console.warn('Could not fetch favorites:', err);
      favorites = [];
    }

    console.log('✅ My ads:', myAds);
    console.log('✅ Favorites:', favorites);

    // ✅ Update stats
    const activeCount = Array.isArray(myAds) ? myAds.filter(a => a.status === 'ACTIVE').length : 0;
    const favoritesCount = Array.isArray(favorites) ? favorites.length : 0;

    if (activeAdsValue) activeAdsValue.textContent = activeCount;
    if (savedCarsValue) savedCarsValue.textContent = favoritesCount;

    // ✅ FIXED: Get questions answered count from backend
    try {
      const answeredCount = await apiFetch('/questions/answered/count', { auth: true });
      if (questionsValue) questionsValue.textContent = answeredCount || 0;
    } catch (err) {
      console.warn('Could not fetch answered questions count:', err);
      if (questionsValue) questionsValue.textContent = '0';
    }

    // ✅ Render My Ads
    if (myAdsRow) {
      if (Array.isArray(myAds) && myAds.length > 0) {
        myAdsRow.innerHTML = myAds.map(ad => myAdCardHTML(ad)).join('');
      } else {
        myAdsRow.innerHTML = '<p style="color:#6B7280; padding: 20px; text-align: center;">You haven\'t published any ads yet.</p>';
      }
    }

    // ✅ Render Favorites
    if (favoritesGrid) {
      if (Array.isArray(favorites) && favorites.length > 0) {
        favoritesGrid.innerHTML = favorites.map(ad => favoriteCardHTML(ad)).join('');
        
        // ✅ Event listeners for removing favorites
        favoritesGrid.querySelectorAll('[data-remove-favorite]').forEach(el => {
          el.addEventListener('click', async function(e) {
            e.stopPropagation();
            const adId = Number(this.dataset.removeFavorite);
            try {
              await apiFetch(`/users/favorites/${adId}`, { method: 'DELETE', auth: true });
              const card = this.closest('.card-favorite');
              if (card) card.remove();
              if (savedCarsValue) {
                savedCarsValue.textContent = Number(savedCarsValue.textContent) - 1;
              }
            } catch (err) {
              alert(`Couldn't remove from favorites: ${err.message}`);
            }
          });
        });
      } else {
        favoritesGrid.innerHTML = '<p style="color:#6B7280; padding: 20px; text-align: center;">No favorites yet.</p>';
      }
    }

  } catch (err) {
    console.error('❌ Profile load error:', err);
    if (myAdsRow) myAdsRow.innerHTML = `<p style="color:#934344;">Failed to load profile: ${err.message}</p>`;
    if (favoritesGrid) favoritesGrid.innerHTML = '';
  }
}

// ✅ Update dropdown with user info
function updateDropdownUser(user) {
  const nameEl = document.getElementById('dropdownUserName');
  const emailEl = document.getElementById('dropdownUserEmail');
  const avatarEl = document.getElementById('dropdownAvatar');

  if (nameEl) nameEl.textContent = user.fullName || user.email || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl && user.avatarUrl) {
    avatarEl.src = user.avatarUrl;
  }
}

/* ===== Sidebar navigation ===== */
document.querySelectorAll('.sidebar__item').forEach((item, i) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar__item').forEach(el => el.classList.remove('sidebar__item--active'));
    item.classList.add('sidebar__item--active');
    const sections = document.querySelectorAll('.main > section');
    if (i === 1 && sections[0]) sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (i === 2 && sections[1]) sections[1].scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
//  PROFILE DROPDOWN
// ============================================================
(function() {
  const profileBtn = document.getElementById('profileBtn');
  const dropdown = document.getElementById('profileDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('header__dropdown--open');
    });

    document.addEventListener('click', function(e) {
      if (profileBtn && !profileBtn.contains(e.target) && dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('header__dropdown--open');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (window.Auth) {
        Auth.logout();
      } else {
        localStorage.removeItem('aa_token');
        localStorage.removeItem('aa_user');
      }
      window.location.href = 'login_signup.html';
    });
  }
})();

// ============================================================
//  INIT
// ============================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', load);
} else {
  load();
}