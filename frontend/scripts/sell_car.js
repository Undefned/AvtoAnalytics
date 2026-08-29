/* =========================================================
   SELL_CAR.JS

   ВАЖНОЕ ОГРАНИЧЕНИЕ БЭКЕНДА: CreateAdRequest требует carId
   уже существующей модели в таблице cars — эндпоинта "создать
   новую модель авто" (POST /api/cars) на бэкенде нет. Поэтому
   форма ищет модель по Make+Model через GET /api/cars/search и
   публикует объявление на неё. Поля Generation/Engine Volume/
   Power/Transmission можно ввести для наглядности и для более
   точного поиска среди найденных моделей — реальную характеристику
   машины они не меняют, если введённые значения расходятся с тем,
   что уже записано в справочнике cars.
   ========================================================= */

const form = document.querySelector('.sell__grid');
const makeInput = document.getElementById('sellMake');
const modelInput = document.getElementById('sellModel');
const yearInput = document.getElementById('sellYear');
const mileageInput = document.getElementById('sellMileage');
const priceInput = document.getElementById('sellPrice');
const priceFeedback = document.querySelector('.price-feedback');
const submitBtn = document.querySelector('.btn-submit');

let matchedCar = null;
let matchedAverage = null;

// Redirect anonymous visitors — POST /api/ads needs a valid Bearer token
if (!Auth.isAuthenticated()) {
  window.location.href = 'login_signup.html';
}

/* ===== Live lookup: find a matching car in the catalog as soon as
   Make + Model are filled in, and preload its market average ===== */
async function lookupCar() {
  const make = makeInput.value.trim();
  const model = modelInput.value.trim();
  if (!make || !model) return;

  try {
    const results = await apiFetch(`/cars/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
    if (!results || results.length === 0) {
      matchedCar = null;
      priceFeedback.innerHTML = `This model isn't in our catalog yet — we can't attach price analytics to it, but you can still try publishing.`;
      return;
    }

    const year = Number(yearInput.value);
    matchedCar = (year && results.find(c => c.year === year)) || results[0];

    matchedAverage = await apiFetch(`/analytics/average/${matchedCar.id}`).catch(() => null);
    updatePriceFeedback();
  } catch (err) {
    matchedCar = null;
    priceFeedback.textContent = `Couldn't look up this model: ${err.message}`;
  }
}

function updatePriceFeedback() {
  const price = Number(priceInput.value);
  if (matchedAverage == null) {
    priceFeedback.textContent = matchedCar
      ? `Found "${matchedCar.make} ${matchedCar.model}" in the catalog, but there isn't enough market data yet for a price comparison.`
      : '';
    return;
  }
  if (!price) {
    priceFeedback.innerHTML = `Average market price for this model is <strong>${Math.round(matchedAverage).toLocaleString('ru-RU')} ₽</strong>.`;
    return;
  }
  const diffPct = ((price - matchedAverage) / matchedAverage * 100);
  const dir = diffPct >= 0 ? 'higher' : 'lower';
  priceFeedback.innerHTML = `Average market price for this model is <strong>${Math.round(matchedAverage).toLocaleString('ru-RU')} ₽</strong>. Your price is <span class="highlight">${Math.abs(diffPct).toFixed(1)}% ${dir}</span>`;
}

[makeInput, modelInput, yearInput].forEach(el => el.addEventListener('blur', lookupCar));
priceInput.addEventListener('keyup', updatePriceFeedback);

/* ===== Submit: create the ad on the matched car ===== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const make = makeInput.value.trim();
  const model = modelInput.value.trim();
  const price = Number(priceInput.value);
  const mileage = Number(mileageInput.value) || null;

  if (!make || !model) { alert('Please enter make and model.'); return; }
  if (!price || price <= 0) { alert('Please enter a valid price.'); return; }

  submitBtn.disabled = true;
  const originalLabel = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Publishing…';

  try {
    if (!matchedCar) await lookupCar();
    if (!matchedCar) {
      throw new Error(`"${make} ${model}" isn't in our catalog yet — we can only publish ads for existing models.`);
    }

    const created = await apiFetch('/ads', {
      method: 'POST',
      auth: true,
      body: {
        carId: matchedCar.id,
        title: `${make} ${model}${yearInput.value ? ' ' + yearInput.value : ''}`,
        price,
        mileage,
      },
    });

    window.location.href = `avto_card.html?id=${created.id}`;
  } catch (err) {
    alert(`Failed to publish: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
});