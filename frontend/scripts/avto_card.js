/* =========================================================
   AVTO_CARD.JS
   Страница объявления: реальные данные с бэкенда.
   - GET /api/ads/{id}            -> текст, цена, фото, продавец, локация
   - GET /api/analytics/ad/{id}   -> средняя цена по модели и история цен

   Блок Q&A и "похожие предложения" остаются статичными —
   под них нет REST-эндпоинтов на бэкенде.
   ========================================================= */

function getAdId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : 1; // фоллбэк на объявление #1, если id не передан в URL
}

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

/* ===== Gallery ===== */
let photos = [];
let currentPhoto = 0;

function renderPhoto() {
  const mainPhotoEl = document.getElementById('mainPhoto');
  const counterEl = document.getElementById('photoCounter');

  if (photos.length === 0) {
    mainPhotoEl.src = 'https://placehold.co/598x349?text=No+photo';
    counterEl.textContent = '0 / 0';
    return;
  }

  mainPhotoEl.src = photos[currentPhoto];
  mainPhotoEl.alt = `Фото ${currentPhoto + 1} из ${photos.length}`;
  counterEl.textContent = `${currentPhoto + 1} / ${photos.length}`;

  document.querySelectorAll('.gallery__thumb').forEach((thumb, i) => {
    thumb.style.outline = i === currentPhoto ? '2px solid #2563EB' : '';
  });
}

function renderThumbs() {
  const thumbsEl = document.getElementById('galleryThumbs');
  thumbsEl.innerHTML = photos.map((url, i) => `
    <div class="gallery__thumb" data-index="${i}"><img src="${url}" alt="Фото ${i + 1}"></div>
  `).join('');

  thumbsEl.querySelectorAll('.gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentPhoto = Number(thumb.dataset.index);
      renderPhoto();
    });
  });
}

document.getElementById('nextPhoto').addEventListener('click', () => {
  if (photos.length === 0) return;
  currentPhoto = (currentPhoto + 1) % photos.length;
  renderPhoto();
});
document.getElementById('prevPhoto').addEventListener('click', () => {
  if (photos.length === 0) return;
  currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  renderPhoto();
});

/* ===== Price history chart ===== */
function renderChart(priceHistory) {
  const svg = document.getElementById('priceChart');
  const labelsEl = document.getElementById('chartLabels');

  const entries = Object.entries(priceHistory || {})
    .map(([date, price]) => ({ date: new Date(date), price }))
    .sort((a, b) => a.date - b.date);

  if (entries.length === 0) {
    svg.innerHTML = '';
    labelsEl.innerHTML = '<span>Нет данных об истории цены</span>';
    return;
  }

  const prices = entries.map(e => e.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const W = 494, H = 99, PAD = 8;
  const points = entries.map((e, i) => {
    const x = entries.length === 1 ? 0 : (i / (entries.length - 1)) * W;
    const y = PAD + (1 - (e.price - min) / range) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const lastPoint = points[points.length - 1].split(',');

  svg.innerHTML = `
    <polyline points="${points.join(' ')}" fill="none" stroke="#F97316" stroke-width="3" />
    <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4.5" fill="#F97316" />
  `;

  labelsEl.innerHTML = entries.map(e =>
    `<span>${e.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>`
  ).join('');
}

/* ===== Main load ===== */
async function loadAd() {
  const adId = getAdId();

  try {
    const [ad, analytics] = await Promise.all([
      apiFetch(`/ads/${adId}`),
      apiFetch(`/analytics/ad/${adId}`).catch(() => null),
    ]);

    const title = `${ad.carMake || ''} ${ad.carModel || ''}${ad.carYear ? `, ${ad.carYear}` : ''}`.trim() || ad.title;

    document.getElementById('pageTitle').textContent = `${title} — AvtoAnalytics`;
    document.getElementById('breadcrumbCurrent').textContent = title;
    document.getElementById('adTitle').textContent = title;
    document.getElementById('adSpecs').textContent = ad.description || '';
    document.getElementById('adPrice').textContent = formatPrice(ad.price);
    document.getElementById('sellerName').textContent = ad.sellerName || 'Seller';
    document.getElementById('adLocation').textContent = [ad.city, ad.address].filter(Boolean).join(', ') || '—';

    photos = (ad.photoUrls && ad.photoUrls.length > 0) ? ad.photoUrls : ['https://placehold.co/598x349?text=No+photo'];
    currentPhoto = 0;
    renderThumbs();
    renderPhoto();

    if (analytics) {
      document.getElementById('avgPriceInline').textContent = formatPrice(analytics.averagePrice);
      document.getElementById('avgPriceValue').textContent = formatPrice(analytics.averagePrice);

      if (analytics.priceDifference != null && analytics.averagePrice) {
        const pct = Math.abs(analytics.priceDifference / analytics.averagePrice * 100).toFixed(1);
        const noteEl = document.getElementById('chartNote');
        const iconEl = document.getElementById('chartNoteIcon');
        const textEl = document.getElementById('chartNoteText');

        noteEl.style.display = 'flex';
        iconEl.style.transform = analytics.aboveAverage ? 'rotate(180deg)' : 'none';
        textEl.innerHTML = analytics.aboveAverage
          ? `<span class="chart-note__value">${pct}% above</span> the average market price`
          : `<span class="chart-note__value">${pct}% below</span> the average market price`;
      }

      renderChart(analytics.priceHistory);
    } else {
      document.getElementById('avgPriceInline').textContent = 'н/д';
      document.getElementById('avgPriceValue').textContent = 'н/д';
      document.getElementById('chartLabels').innerHTML = '<span>Аналитика недоступна</span>';
    }
  } catch (err) {
    document.getElementById('adTitle').textContent = 'Объявление не найдено';
    document.getElementById('adSpecs').textContent = err.message;
  }
}

loadAd();