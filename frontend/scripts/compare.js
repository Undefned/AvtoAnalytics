/* =========================================================
   COMPARE.JS
   Список авто для сравнения приходит через ?ids=1,2,3 (кнопка
   "Compare selected" в catalogue.js кладёт их туда).

   Данные:
   - GET  /api/ads/{id}         -> цена, фото, название (по каждому id)
   - POST /api/compare          -> характеристики авто (Engine/HP/Drive),
                                     тем же порядком, что и adIds на входе
   - GET  /api/analytics/average/{carId} -> средняя цена по модели

   "Registration date" — в схеме нет отдельного поля, поэтому здесь
   показывается дата создания объявления (ad.createdAt).
   "Active listings count" — считается на фронте по уже загруженному
   списку объявлений (нет отдельного эндпоинта для агрегации).
   ========================================================= */

const cardsEl = document.querySelector('.compare__cards');
const tableWrap = document.querySelector('.compare__table');

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

function driveLabel(drive) {
  return { FRONT: 'Front-Wheel Drive', REAR: 'Rear-Wheel Drive', ALL: 'All-Wheel Drive' }[drive] || drive || '—';
}

function getIds() {
  const raw = new URLSearchParams(window.location.search).get('ids') || '';
  return [...new Set(raw.split(',').map(s => Number(s.trim())).filter(Boolean))];
}

function setIds(ids) {
  const url = new URL(window.location.href);
  if (ids.length) url.searchParams.set('ids', ids.join(','));
  else url.searchParams.delete('ids');
  window.history.replaceState({}, '', url);
}

function emptyState() {
  cardsEl.innerHTML = '';
  tableWrap.innerHTML = `
    <p style="padding:32px; text-align:center; color:#6B7280;">
      Пока нечего сравнивать. Выберите машины в
      <a href="catalogue.html" style="color:#2563EB;">каталоге</a> и нажмите «Compare selected».
    </p>`;
}

async function load() {
  let ids = getIds();
  if (ids.length === 0) { emptyState(); return; }

  cardsEl.innerHTML = '<p style="grid-column:1/-1;">Загружаем…</p>';
  tableWrap.innerHTML = '';

  try {
    const [ads, specs, allAdsPage] = await Promise.all([
      Promise.all(ids.map(id => apiFetch(`/ads/${id}`).catch(() => null))),
      apiFetch('/compare', { method: 'POST', body: ids }).catch(() => []),
      apiFetch('/ads?page=0&size=200').catch(() => ({ content: [] })),
    ]);

    // drop any ids that failed to load (deleted ad, bad id, etc.)
    const items = ids
      .map((id, i) => ({ id, ad: ads[i], spec: specs[i] }))
      .filter(x => x.ad);

    if (items.length === 0) { emptyState(); return; }

    const allAds = allAdsPage.content || [];
    const carIds = [...new Set(items.map(x => x.ad.carId).filter(Boolean))];
    const averages = {};
    await Promise.all(carIds.map(async (carId) => {
      try { averages[carId] = await apiFetch(`/analytics/average/${carId}`); }
      catch (_) { averages[carId] = null; }
    }));

    const cars = items.map(({ id, ad, spec }) => {
      const avg = ad.carId != null ? averages[ad.carId] : null;
      const diff = avg != null ? ad.price - avg : null;
      const diffPct = avg ? (diff / avg * 100) : null;
      const activeListings = allAds.filter(a => a.status === 'ACTIVE' && a.car?.id === ad.carId).length;

      return {
        adId: id,
        name: `${ad.carMake || ''} ${ad.carModel || ''}`.trim() || ad.title,
        image: (ad.photoUrls && ad.photoUrls[0]) || 'https://placehold.co/335x162',
        price: ad.price,
        engine: spec ? [spec.engineVolume ? `${spec.engineVolume}L` : null].filter(Boolean).join(' ') || '—' : '—',
        hp: spec?.horsepower != null ? `${spec.horsepower} hp` : '—',
        drive: spec ? driveLabel(spec.driveType) : '—',
        avgPrice: avg,
        diff,
        diffPct,
        activeListings,
        createdAt: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }) : '—',
      };
    });

    renderCards(cars);
    renderTable(cars);
  } catch (err) {
    tableWrap.innerHTML = `<p style="padding:32px; color:#934344;">Не удалось загрузить сравнение: ${err.message}</p>`;
  }
}

function renderCards(cars) {
  cardsEl.style.gridTemplateColumns = `repeat(${cars.length}, 1fr)`;
  cardsEl.innerHTML = cars.map(car => `
    <div class="card-compare" data-ad-id="${car.adId}">
      <div class="card-compare__remove" data-remove="${car.adId}">
        <img src="assets/checkboxTrue.svg"> Remove
      </div>
      <div class="card-compare__image">
        <img src="${car.image}" alt="${car.name}" />
      </div>
      <div class="card-compare__name">${car.name}</div>
      <div class="card-compare__label">Current Price</div>
      <div class="card-compare__price">${formatPrice(car.price)}</div>
    </div>
  `).join('');

  cardsEl.querySelectorAll('[data-remove]').forEach(el => {
    el.addEventListener('click', () => {
      const removeId = Number(el.dataset.remove);
      const ids = getIds().filter(id => id !== removeId);
      setIds(ids);
      load();
    });
  });
}

function row(label, cells) {
  return `<tr><td>${label}</td>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
}
function sectionRow(icon, title, colCount) {
  return `<tr class="section-header"><td colspan="${colCount + 1}"><span class="icon"><img src="assets/${icon}"></span> ${title}</td></tr>`;
}

function renderTable(cars) {
  const n = cars.length;

  const priceVsMarketCells = cars.map(car => {
    if (car.avgPrice == null) return '—';
    const dir = car.diff >= 0 ? 'text-red' : 'text-green';
    const sign = car.diff >= 0 ? '+' : '';
    const note = car.diff >= 0 ? 'more expensive' : 'cheaper';
    const barColor = car.diff >= 0 ? 'red' : 'green';
    const barWidth = Math.min(100, Math.abs(car.diffPct)).toFixed(0);
    return `
      <div class="${dir}">${sign}${formatPrice(car.diff)}</div>
      <div style="font-size:12px; color:#374151;">${Math.abs(car.diffPct).toFixed(2)}% ${note}</div>
      <div class="price-bar"><div class="price-bar__fill ${barColor}" style="width:${barWidth}%;"></div></div>
    `;
  });

  tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th></th>
          ${cars.map(c => `<th>${c.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${sectionRow('settings.svg', 'TECHNICAL SPECS', n)}
        ${row('Engine', cars.map(c => c.engine))}
        ${row('HP', cars.map(c => c.hp))}
        ${row('Drive', cars.map(c => c.drive))}

        ${sectionRow('graphics.svg', 'MARKET ANALYTICS', n)}
        ${row('Average Price', cars.map(c => formatPrice(c.avgPrice)))}
        ${row('Price vs Market', priceVsMarketCells)}

        ${sectionRow('people.svg', 'SELLER SCORE', n)}
        ${row('Active listings count', cars.map(c => c.activeListings))}
        ${row('Ad posted', cars.map(c => c.createdAt))}
      </tbody>
    </table>
  `;
}

document.querySelector('.compare__search').addEventListener('click', () => {
  window.location.href = 'catalogue.html';
});

load();