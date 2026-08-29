/* =========================================================
   LOGIN_SIGNUP.JS
   Реальные вызовы бэкенда для входа и регистрации.
   При успехе токен сохраняется в localStorage (см. Auth в base.js)
   и пользователь редиректится на главную.
   ========================================================= */

(function() {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  // If already logged in, no reason to show this page
  if (Auth.isAuthenticated()) {
    window.location.href = 'main.html';
    return;
  }

  // ===== Tabs switching =====
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('tab--active'));
      this.classList.add('tab--active');

      const tabName = this.dataset.tab;
      if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      }
    });
  });

  // ===== Toggle password visibility =====
  document.querySelectorAll('.input-wrapper__icon--right').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.closest('.input-wrapper').querySelector('input');
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  function showError(el, message) {
    el.textContent = message;
    el.classList.remove('hidden');
  }
  function hideError(el) {
    el.classList.add('hidden');
  }

  // ===== Login =====
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError(loginError);

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = document.getElementById('loginSubmit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';
    try {
      const jwtResponse = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      Auth.saveSession(jwtResponse);
      window.location.href = 'main.html';
    } catch (err) {
      showError(loginError, err.message || 'Invalid email or password');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  // ===== Register =====
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError(registerError);

    const fullName = document.getElementById('registerFullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const submitBtn = document.getElementById('registerSubmit');

    if (!document.getElementById('terms').checked) {
      showError(registerError, 'You need to agree to the Terms of Service');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';
    try {
      const jwtResponse = await apiFetch('/auth/register', {
        method: 'POST',
        body: { email, password, fullName, privateSeller: true },
      });
      Auth.saveSession(jwtResponse);
      window.location.href = 'main.html';
    } catch (err) {
      showError(registerError, err.message || 'Registration failed');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });

  // ===== Close modal =====
  document.querySelector('.modal__close').addEventListener('click', function() {
    window.location.href = 'main.html';
  });
})();