/* =========================================================
   LOGIN_SIGNUP.JS
   Переключение табов Login/Register, показ/скрытие пароля,
   демо-обработка отправки форм и закрытия модалки.
   ========================================================= */

(function() {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // ===== Tabs switching =====
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active tab
      tabs.forEach(t => t.classList.remove('tab--active'));
      this.classList.add('tab--active');

      // Show/hide forms
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
  const toggleBtns = document.querySelectorAll('.input-wrapper__icon--right');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.closest('.input-wrapper').querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
      }
    });
  });

  // ===== Form submit (demo) =====
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Login form submitted');
  });

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Register form submitted');
  });

  // ===== Close modal (demo) =====
  document.querySelector('.modal__close').addEventListener('click', function() {
    alert('Close modal');
  });
})();