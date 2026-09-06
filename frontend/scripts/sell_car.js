/* =========================================================
   SELL_CAR.JS - COMPLETE WITH ALL FIELDS
   ========================================================= */

const form = document.querySelector('.sell__grid');
const makeInput = document.getElementById('sellMake');
const modelInput = document.getElementById('sellModel');
const yearInput = document.getElementById('sellYear');
const mileageInput = document.getElementById('sellMileage');
const priceInput = document.getElementById('sellPrice');
const cityInput = document.getElementById('sellCity');
const addressInput = document.getElementById('sellAddress');
const descriptionInput = document.getElementById('sellDescription');
const priceFeedback = document.querySelector('.price-feedback');
const submitBtn = document.querySelector('.btn-submit');
const uploadArea = document.querySelector('.upload-area');
const photoPreview = document.getElementById('photoPreview');

let matchedCar = null;
let matchedAverage = null;
let uploadedPhotoUrls = [];
let uploadedFiles = [];

// ===== CUSTOM MODAL SYSTEM =====
function showModal(options) {
  const { title, message, type = 'info', confirmText = 'OK', onConfirm = null, showCancel = false, cancelText = 'Cancel' } = options;

  const existingModal = document.querySelector('.custom-modal-overlay');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'custom-modal-overlay';
  overlay.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal__icon ${type}">
        ${type === 'error' ? '✕' : type === 'success' ? '✓' : 'ℹ'}
      </div>
      <h3 class="custom-modal__title">${title}</h3>
      <p class="custom-modal__message">${message}</p>
      <div class="custom-modal__actions">
        ${showCancel ? `<button class="custom-modal__btn custom-modal__btn--cancel" data-action="cancel">${cancelText}</button>` : ''}
        <button class="custom-modal__btn custom-modal__btn--${type === 'error' ? 'danger' : 'primary'}" data-action="confirm">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const confirmBtn = overlay.querySelector('[data-action="confirm"]');
  const cancelBtn = overlay.querySelector('[data-action="cancel"]');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (onConfirm) onConfirm();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
}

function closeModal() {
  const modal = document.querySelector('.custom-modal-overlay');
  if (modal) modal.remove();
}

function showErrorModal(message) {
  showModal({ title: 'Error', message, type: 'error', confirmText: 'OK' });
}

function showSuccessModal(message, onConfirm) {
  showModal({ title: 'Success', message, type: 'success', confirmText: 'OK', onConfirm });
}

// ===== ADD MODAL STYLES =====
const modalStyles = document.createElement('style');
modalStyles.textContent = `
  .custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .custom-modal {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    max-width: 440px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .custom-modal__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    margin: 0 auto 16px;
  }
  .custom-modal__icon.error { background: #FEF2F2; color: #B91C1C; }
  .custom-modal__icon.success { background: #ECFDF5; color: #065F46; }
  .custom-modal__icon.info { background: #EFF6FF; color: #1D4ED8; }
  .custom-modal__title { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 8px; }
  .custom-modal__message { font-size: 14px; color: #6B7280; line-height: 1.6; margin: 0 0 24px; }
  .custom-modal__actions { display: flex; gap: 12px; justify-content: center; }
  .custom-modal__btn {
    padding: 10px 28px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .custom-modal__btn--primary { background: #2563EB; color: #fff; }
  .custom-modal__btn--primary:hover { background: #1D4ED8; }
  .custom-modal__btn--danger { background: #DC2626; color: #fff; }
  .custom-modal__btn--danger:hover { background: #B91C1C; }
  .custom-modal__btn--cancel { background: #F3F4F6; color: #374151; }
  .custom-modal__btn--cancel:hover { background: #E5E7EB; }

  .upload-area {
    border: 2px dashed #DDDDDD;
    border-radius: 8px;
    background: #fff;
    padding: 40px 20px;
    text-align: center;
    margin-top: 24px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .upload-area:hover { border-color: #2563EB; background: #F8FAFF; }
  .upload-area.dragover { border-color: #2563EB; background: #EFF6FF; }
  .upload-area input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .upload-area__preview {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
    justify-content: center;
  }
  .upload-area__preview-item {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #DDDDDD;
  }
  .upload-area__preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .upload-area__preview-item .remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #DC2626;
    color: #fff;
    border: none;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.head.appendChild(modalStyles);

// Redirect anonymous visitors
if (!Auth.isAuthenticated()) {
  window.location.href = 'login_signup.html';
}

/* ===== IMAGE UPLOAD ===== */
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;
fileInput.accept = 'image/jpeg,image/png,image/webp';
fileInput.style.display = 'none';
uploadArea.appendChild(fileInput);

uploadArea.addEventListener('click', function(e) {
  if (e.target.closest('.remove-btn')) return;
  fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  handleFiles(Array.from(e.dataTransfer.files));
});

fileInput.addEventListener('change', function() {
  handleFiles(Array.from(this.files));
  this.value = '';
});

async function handleFiles(files) {
  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  if (imageFiles.length === 0) {
    showErrorModal('Please select image files (JPG, PNG, or WebP).');
    return;
  }

  const maxFiles = 15;
  if (uploadedFiles.length + imageFiles.length > maxFiles) {
    showErrorModal(`You can upload a maximum of ${maxFiles} images.`);
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  for (const file of imageFiles) {
    if (file.size > maxSize) {
      showErrorModal(`File "${file.name}" exceeds 10MB limit.`);
      return;
    }
  }

  uploadedFiles = [...uploadedFiles, ...imageFiles];
  renderUploadPreviews();
  await uploadImages(imageFiles);
}

function renderUploadPreviews() {
  if (!photoPreview) return;

  if (uploadedFiles.length === 0) {
    photoPreview.innerHTML = '';
    return;
  }

  photoPreview.innerHTML = uploadedFiles.map((file, index) => `
    <div class="upload-area__preview-item">
      <img src="${URL.createObjectURL(file)}" alt="Upload ${index + 1}" />
      <button class="remove-btn" data-index="${index}">×</button>
    </div>
  `).join('');

  photoPreview.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const index = Number(this.dataset.index);
      uploadedFiles.splice(index, 1);
      uploadedPhotoUrls.splice(index, 1);
      renderUploadPreviews();
    });
  });
}

async function uploadImages(files) {
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      // Was hardcoded to http://localhost:8080 — broke under Docker for the
      // same reason as the old API_BASE_URL. Now goes through the same
      // origin-aware base URL as every other request.
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Auth.getToken()}` },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to upload ${file.name}`);

      const data = await response.json();
      uploadedPhotoUrls.push(data.url);
    }
    console.log('✅ Uploaded images:', uploadedPhotoUrls);
  } catch (err) {
    console.error('Upload error:', err);
    showErrorModal(`Failed to upload images: ${err.message}`);
  }
}

/* ===== Live lookup ===== */
async function lookupCar() {
  const make = makeInput.value.trim();
  const model = modelInput.value.trim();
  if (!make || !model) return;

  try {
    const results = await apiFetch(`/cars/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
    if (!results || results.length === 0) {
      matchedCar = null;
      matchedAverage = null;
      priceFeedback.innerHTML = `This model isn't in our catalog yet.`;
      return;
    }

    const year = Number(yearInput.value);
    matchedCar = results[0];

    if (year && !isNaN(year) && year > 1900) {
      const yearMatch = results.find(c => Number(c.year) === year);
      if (yearMatch) matchedCar = yearMatch;
    }

    matchedAverage = await apiFetch(`/analytics/average/${matchedCar.id}`).catch(() => null);
    updatePriceFeedback();
  } catch (err) {
    matchedCar = null;
    matchedAverage = null;
    priceFeedback.textContent = `Couldn't look up this model: ${err.message}`;
  }
}

function updatePriceFeedback() {
  const price = Number(priceInput.value);
  if (matchedAverage == null) {
    priceFeedback.textContent = matchedCar
      ? `Found "${matchedCar.make} ${matchedCar.model}" in the catalog.`
      : 'Fill in the make and model to see market data.';
    return;
  }
  if (!price) {
    priceFeedback.innerHTML = `Average market price: <strong>${Math.round(matchedAverage).toLocaleString('ru-RU')} ₽</strong>`;
    return;
  }
  const diffPct = ((price - matchedAverage) / matchedAverage * 100);
  const dir = diffPct >= 0 ? 'higher' : 'lower';
  priceFeedback.innerHTML = `Average market price: <strong>${Math.round(matchedAverage).toLocaleString('ru-RU')} ₽</strong>. Your price is <span class="highlight">${Math.abs(diffPct).toFixed(1)}% ${dir}</span>`;
}

[makeInput, modelInput, yearInput].forEach(el => el.addEventListener('blur', lookupCar));
priceInput.addEventListener('input', updatePriceFeedback);
makeInput.addEventListener('input', () => { matchedCar = null; matchedAverage = null; });
modelInput.addEventListener('input', () => { matchedCar = null; matchedAverage = null; });

/* ===== Submit ===== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const make = makeInput.value.trim();
  const model = modelInput.value.trim();
  const year = Number(yearInput.value);
  const price = Number(priceInput.value);
  const mileage = Number(mileageInput.value) || null;
  const city = cityInput.value.trim();
  const address = addressInput.value.trim() || null;
  const description = descriptionInput.value.trim() || null;

  // Validation
  if (!make || !model) { showErrorModal('Please enter both make and model.'); return; }
  if (!year || year < 1900 || year > 2026) { showErrorModal('Please enter a valid year (1900-2026).'); return; }
  if (!price || price <= 0) { showErrorModal('Please enter a valid price.'); return; }
  if (!mileage || mileage < 0) { showErrorModal('Please enter a valid mileage.'); return; }
  if (!city) { showErrorModal('Please enter a city.'); return; }

  submitBtn.disabled = true;
  const originalLabel = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Publishing…';

  try {
    if (!matchedCar) await lookupCar();

    if (!matchedCar) {
      const results = await apiFetch(`/cars/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
      if (results && results.length > 0) {
        matchedCar = results[0];
        matchedAverage = await apiFetch(`/analytics/average/${matchedCar.id}`).catch(() => null);
      }
    }

    if (!matchedCar) {
      showErrorModal(`"${make} ${model}" isn't in our catalog. Available: Toyota RAV4, BMW X5, Audi Q5, etc.`);
      return;
    }

    const created = await apiFetch('/ads', {
      method: 'POST',
      auth: true,
      body: {
        carId: matchedCar.id,
        title: `${make} ${model} ${year}`,
        price: price,
        mileage: mileage,
        city: city,
        address: address,
        description: description,
        photoUrls: uploadedPhotoUrls,
      },
    });

    showSuccessModal('Your ad has been published successfully!', () => {
      window.location.href = `avto_card.html?id=${created.id}`;
    });

  } catch (err) {
    console.error('Publish error:', err);
    showErrorModal(`Failed to publish: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
});