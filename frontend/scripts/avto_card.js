/* =========================================================
   AVTO_CARD.JS - FIXED QUESTION FORM VISIBILITY
   ========================================================= */

function getAdId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : 1;
}

function formatPrice(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// ===== GLOBAL STATE =====
let adData = null;
let isFavorite = false;
let currentUserId = null;

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

/* ===== FAVORITE HEART ON GALLERY ===== */
function renderFavoriteHeart() {
  const galleryMain = document.querySelector('.gallery__main');
  if (!galleryMain) return;
  
  let heartEl = document.querySelector('.gallery-favorite-heart');
  if (heartEl) heartEl.remove();
  
  heartEl = document.createElement('div');
  heartEl.className = 'gallery-favorite-heart';
  heartEl.innerHTML = `
    <button class="favorite-btn-gallery" id="favoriteBtnGallery" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
      <svg viewBox="0 0 24 24" fill="${isFavorite ? '#2563EB' : 'none'}" stroke="${isFavorite ? '#2563EB' : 'white'}" stroke-width="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </button>
  `;
  
  galleryMain.appendChild(heartEl);
  
  const favBtn = document.getElementById('favoriteBtnGallery');
  if (favBtn) {
    favBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFavorite();
    });
  }
}

async function toggleFavorite() {
  if (!Auth.isAuthenticated()) {
    window.location.href = 'login_signup.html';
    return;
  }
  
  const adId = getAdId();
  
  try {
    if (isFavorite) {
      await apiFetch(`/users/favorites/${adId}`, { method: 'DELETE', auth: true });
      isFavorite = false;
    } else {
      await apiFetch(`/users/favorites/${adId}`, { method: 'POST', auth: true });
      isFavorite = true;
    }
    renderFavoriteHeart();
  } catch (err) {
    alert(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites: ${err.message}`);
  }
}

async function checkFavoriteStatus(adId) {
  if (!Auth.isAuthenticated()) return;
  
  try {
    isFavorite = await apiFetch(`/users/favorites/${adId}/check`, { auth: true });
  } catch (err) {
    console.log('Favorite check failed:', err);
    isFavorite = false;
  }
}

/* ===== Price history chart ===== */
function renderChart(priceHistory, range = 'all') {
  const svg = document.getElementById('priceChart');
  const labelsEl = document.getElementById('chartLabels');

  let entries = Object.entries(priceHistory || {})
    .map(([date, price]) => ({ date: new Date(date), price }))
    .sort((a, b) => a.date - b.date);

  if (range === '3m') {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    entries = entries.filter(e => e.date >= cutoff);
  } else if (range === '1m') {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 1);
    entries = entries.filter(e => e.date >= cutoff);
  }

  if (entries.length === 0) {
    svg.innerHTML = '';
    labelsEl.innerHTML = '<span style="color:#94A3B8; font-size:12px;">Нет данных об истории цены</span>';
    return;
  }

  const prices = entries.map(e => e.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const rangeVal = max - min || 1;

  const W = 494, H = 99, PAD = 8;
  const points = entries.map((e, i) => {
    const x = entries.length === 1 ? 0 : (i / (entries.length - 1)) * W;
    const y = PAD + (1 - (e.price - min) / rangeVal) * (H - PAD * 2);
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

/* ===== Similar offers ===== */
async function loadSimilarAds(city, currentAdId) {
  const container = document.getElementById('similarList');
  const note = document.getElementById('similarNote');

  if (!city) {
    note.textContent = 'Similar offers — no location specified';
    return;
  }

  try {
    const page = await apiFetch(`/ads?city=${encodeURIComponent(city)}&page=0&size=6`);
    const ads = page.content || [];

    const filtered = ads
      .filter(a => a.id !== currentAdId)
      .slice(0, 5);

    if (filtered.length === 0) {
      note.textContent = 'No similar offers in this city';
      container.innerHTML = '';
      return;
    }

    note.textContent = `${filtered.length} similar offers nearby`;
    container.innerHTML = filtered.map(ad => {
      const car = ad.car || {};
      const photo = ad.photoUrls?.[0] || 'https://placehold.co/48x28';
      return `
        <a href="avto_card.html?id=${ad.id}" style="text-decoration:none; color:inherit;">
          <div class="similar-item">
            <span class="similar-item__rank">${filtered.indexOf(ad) + 1}</span>
            <img class="similar-item__img" src="${photo}" alt="" />
            <div class="similar-item__info">
              <p class="similar-item__price">${formatPrice(ad.price)}</p>
              <p class="similar-item__spec">${car.year || ''} · ${car.engineVolume || ''}L</p>
            </div>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    note.textContent = 'Failed to load similar offers';
    container.innerHTML = '';
  }
}

/* ===== Q&A ===== */
async function loadQuestions(adId) {
  const container = document.getElementById('questionsContainer');
  if (!container) return;

  try {
    const questions = await apiFetch(`/questions/ad/${adId}`).catch(() => []);
    
    const user = Auth.getUser();
    const loggedInUserId = user ? user.userId : null;
    const isOwner = loggedInUserId && adData && adData.sellerId === loggedInUserId;
    
    console.log('📝 Q&A Debug:', {
      loggedInUserId,
      sellerId: adData?.sellerId,
      isOwner,
      hasQuestions: questions?.length > 0
    });
    
    let html = '';
    
    if (!questions || questions.length === 0) {
      html = `
        <div class="no-questions" style="padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          No questions yet. Be the first to ask!
        </div>
      `;
    } else {
      html = questions.map(q => {
        const askerName = q.askerName || 'Anonymous';
        const askerAvatar = q.askerAvatar || null;
        const isAnswered = q.answer && q.answeredAt;
        const isOwnerOfQuestion = loggedInUserId === q.askerId;
        
        return `
          <div class="qa-item" data-question-id="${q.id}">
            <div class="qa-item__avatar" style="${askerAvatar ? `background-image: url(${askerAvatar}); background-size: cover;` : ''}">
              ${askerAvatar ? '' : getInitials(askerName)}
            </div>
            <div style="flex: 1; text-align: left;">
              <p class="qa-item__author">${askerName} ${isOwnerOfQuestion ? '👤' : ''}</p>
              <p class="qa-item__date">${formatDateTime(q.createdAt)}</p>
              <p class="qa-item__q"><b>Q:</b> ${q.question}</p>
              ${isAnswered ? `
                <p class="qa-item__a"><b>A:</b> ${q.answer}</p>
                <p class="qa-item__answered-by">Seller · ${formatDateTime(q.answeredAt)}</p>
              ` : `
                <p class="qa-item__a" style="color: #94A3B8; font-style: italic;">Awaiting seller's response...</p>
                ${isOwner ? `
                  <button class="qa-answer-btn" data-question-id="${q.id}" style="
                    margin-top: 8px;
                    background: #10B981;
                    color: white;
                    border: none;
                    padding: 4px 16px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background 0.2s;
                    text-align: center;
                  ">Answer</button>
                ` : ''}
              `}
            </div>
          </div>
        `;
      }).join('');
    }
    
    container.innerHTML = html;
    
    // Show/hide the question form
    const questionForm = document.getElementById('askQuestionForm');
    if (questionForm) {
      if (Auth.isAuthenticated() && !isOwner) {
        questionForm.style.display = 'block';
      } else {
        questionForm.style.display = 'none';
      }
    }

    // Submit Question button
    const submitBtn = document.getElementById('submitQuestionBtn');
    const cancelBtn = document.getElementById('cancelQuestionBtn');
    const questionInput = document.getElementById('questionInput');
    
    if (submitBtn && questionInput) {
      const newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
      
      newSubmitBtn.addEventListener('click', () => {
        const question = questionInput.value.trim();
        if (!question) {
          alert('Please enter a question.');
          return;
        }
        if (!Auth.isAuthenticated()) {
          window.location.href = 'login_signup.html';
          return;
        }
        submitQuestion(adId, question);
      });
    }
    
    if (cancelBtn && questionInput) {
      const newCancelBtn = cancelBtn.cloneNode(true);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
      
      newCancelBtn.addEventListener('click', () => {
        questionInput.value = '';
      });
    }
    
    if (questionInput) {
      questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault();
          const submitBtn = document.getElementById('submitQuestionBtn');
          submitBtn?.click();
        }
      });
    }
    
    // Answer buttons
    container.querySelectorAll('.qa-answer-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const questionId = Number(this.dataset.questionId);
        const answer = prompt('Enter your answer:');
        if (answer && answer.trim()) {
          submitAnswer(questionId, answer.trim());
        }
      });
    });

  } catch (err) {
    console.error('Error loading questions:', err);
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #934344; font-size: 14px;">
        Failed to load questions: ${err.message}
      </div>
    `;
  }
}

async function submitQuestion(adId, question) {
  const submitBtn = document.getElementById('submitQuestionBtn');
  const questionInput = document.getElementById('questionInput');
  
  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
    }
    
    await apiFetch('/questions', {
      method: 'POST',
      auth: true,
      body: {
        adId: adId,
        question: question,
        isPublic: true
      }
    });
    
    if (questionInput) questionInput.value = '';
    alert('Your question has been posted!');
    loadQuestions(adId);
  } catch (err) {
    alert(`Failed to post question: ${err.message}`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Question';
    }
  }
}

async function submitAnswer(questionId, answer) {
  try {
    await apiFetch(`/questions/${questionId}/answer`, {
      method: 'POST',
      auth: true,
      body: {
        answer: answer
      }
    });
    alert('Your answer has been posted!');
    loadQuestions(getAdId());
  } catch (err) {
    alert(`Failed to post answer: ${err.message}`);
  }
}

/* ===== Range select ===== */
document.getElementById('rangeSelect').addEventListener('change', function() {
  const range = this.value;
  const priceHistory = window.__priceHistory || {};
  renderChart(priceHistory, range);
});

/* ===== Main load ===== */
async function loadAd() {
  const adId = getAdId();

  try {
    const [ad, analytics] = await Promise.all([
      apiFetch(`/ads/${adId}`),
      apiFetch(`/analytics/ad/${adId}`).catch(() => null),
    ]);

    adData = ad;
    console.log('Ad data:', ad);

    const title = `${ad.carMake || ''} ${ad.carModel || ''}${ad.carYear ? `, ${ad.carYear}` : ''}`.trim() || ad.title;

    document.getElementById('pageTitle').textContent = `${title} — AvtoAnalytics`;
    
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = title;
    }
    
    document.getElementById('adTitle').textContent = title;
    document.getElementById('adSpecs').textContent = ad.description || '';
    document.getElementById('adPrice').textContent = formatPrice(ad.price);
    
    // Seller avatar
    const avatarEl = document.getElementById('sellerAvatar');
    if (avatarEl) {
      avatarEl.src = ad.sellerAvatar || 'https://placehold.co/48x48';
    }
    
    // Seller name
    document.getElementById('sellerName').textContent = ad.sellerName || 'Seller';
    currentUserId = ad.sellerId;
    
    // Member since
    const sinceEl = document.getElementById('sellerSince');
    if (sinceEl) {
      sinceEl.textContent = ad.sellerSince ? `Member since: ${formatDate(ad.sellerSince)}` : 'Member since: —';
    }
    
    document.getElementById('adLocation').textContent = [ad.city, ad.address].filter(Boolean).join(', ') || '—';

    // Photos
    photos = (ad.photoUrls && ad.photoUrls.length > 0) ? ad.photoUrls : ['https://placehold.co/598x349?text=No+photo'];
    currentPhoto = 0;
    renderThumbs();
    renderPhoto();

    // Analytics
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

      window.__priceHistory = analytics.priceHistory;
      renderChart(analytics.priceHistory, document.getElementById('rangeSelect').value);
    } else {
      document.getElementById('avgPriceInline').textContent = 'н/д';
      document.getElementById('avgPriceValue').textContent = 'н/д';
      document.getElementById('chartLabels').innerHTML = '<span style="color:#94A3B8; font-size:12px;">Аналитика недоступна</span>';
    }

    // ✅ Check if ad is in favorites
    await checkFavoriteStatus(adId);
    
    // ✅ Render favorite heart on gallery image
    renderFavoriteHeart();

    // Similar offers
    if (ad.city) {
      loadSimilarAds(ad.city, adId);
    }

    // ✅ Load real Q&A
    await loadQuestions(adId);

  } catch (err) {
    console.error('Error loading ad:', err);
    document.getElementById('adTitle').textContent = 'Объявление не найдено';
    document.getElementById('adSpecs').textContent = err.message;
  }
}

loadAd();