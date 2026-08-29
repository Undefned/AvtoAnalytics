/* =========================================================
   AVTO_CARD.JS
   Логика галереи фото на странице объявления.
   ========================================================= */

// Simple gallery: cycles through a small set of placeholder photos
const totalPhotos = 20;
let currentPhoto = 1;
const counterEl = document.getElementById('photoCounter');
const mainPhotoEl = document.getElementById('mainPhoto');

function renderPhoto() {
  counterEl.textContent = currentPhoto + ' / ' + totalPhotos;
  mainPhotoEl.alt = 'Toyota Camry, фото ' + currentPhoto + ' из ' + totalPhotos;
  // placeholder image service just needs a different seed to look "new"
  mainPhotoEl.src = 'https://placehold.co/598x349?text=Photo+' + currentPhoto;
}

document.getElementById('nextPhoto').addEventListener('click', () => {
  currentPhoto = currentPhoto < totalPhotos ? currentPhoto + 1 : 1;
  renderPhoto();
});

document.getElementById('prevPhoto').addEventListener('click', () => {
  currentPhoto = currentPhoto > 1 ? currentPhoto - 1 : totalPhotos;
  renderPhoto();
});

document.querySelectorAll('.gallery__thumb').forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    currentPhoto = i + 1;
    renderPhoto();
  });
});