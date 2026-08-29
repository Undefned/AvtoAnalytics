/* =========================================================
   MAIN.JS
   Данные каталога на главной странице и рендер карточек.
   ========================================================= */

// Catalog data — kept separate from markup so cards render from one source
const cars = [
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"2 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"down", image:"https://placehold.co/186x119" },
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"3 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"up",   image:"https://placehold.co/186x119" },
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"2 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"down", image:"https://placehold.co/186x119" },
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"2 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"down", image:"https://placehold.co/186x119" },
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"3 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"up",   image:"https://placehold.co/186x119" },
  { title:"Volkswagen Tiguan", trim:"1.4 TSI 4Motion", price:"2 000 000 ₽", year:"2018", mileage:"105 000 км", fairPrice:"2 050 000", flag:"down", image:"https://placehold.co/186x119" },
];

const grid = document.getElementById('catalogGrid');

function cardHTML(car){
  const flagClass = car.flag === 'down' ? 'car-card__flag--down' : 'car-card__flag--up';
  const flagIcon  = car.flag === 'down' ? '↓' : '↑';
  const flagText  = car.flag === 'down' ? 'Ниже рынка' : 'Выше рынка';

  return `
    <article class="car-card">
      <div class="car-card__top">
        <img class="car-card__image" src="${car.image}" alt="${car.title}">
        <div class="car-card__info">
          <h3 class="car-card__title">${car.title}</h3>
          <p class="car-card__trim">${car.trim}</p>
        </div>
      </div>

      <p class="car-card__price">${car.price}</p>
      <span class="car-card__flag ${flagClass}">${flagIcon} ${flagText}</span>

      <div class="car-card__stats">
        <span class="stat"><span class="stat__icon"><img src="assets/calendar.svg"></span>${car.year}</span>
        <span class="stat"><span class="stat__icon"><img src="assets/graphic_big.svg"></span>${car.mileage}</span>
        <span class="stat"><span class="stat__icon"><img src="assets/checked.svg"></span>AT</span>
      </div>

      <hr class="car-card__divider">
      <p class="car-card__fair-price">
        <span class="label">Справедливая цена: </span><span class="value">${car.fairPrice}</span>
      </p>
    </article>
  `;
}

grid.innerHTML = cars.map(cardHTML).join('');

document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('catalogGrid').scrollIntoView({ behavior:'smooth', block:'start' });
});