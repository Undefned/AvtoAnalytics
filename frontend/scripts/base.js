/* =========================================================
   BASE.JS
   Общая логика для всех страниц: клиент к бэкенду и работа
   с JWT-токеном (localStorage). Используется всеми *.js файлами
   через глобальные объекты `API_BASE_URL`, `Auth`, `apiFetch`.
   ========================================================= */

/* API_BASE_URL резолвится в зависимости от того, откуда открыта страница:
   - Live Server (обычно порт 5500) не проксирует /api — бьём в бэкенд напрямую.
   - Всё остальное (Docker/nginx, прод) — относительный путь: браузер сам
     подставит текущий origin, а nginx проксирует /api/ на бэкенд контейнер.
   Это чинит основную причину "работает в Live Server, но не в Docker":
   раньше URL был жёстко зашит на http://localhost:8080, а "localhost" в
   браузере — это машина ЗРИТЕЛЯ, а не сервер, где крутится бэкенд. */
const API_BASE_URL = (() => {
  const { port } = window.location;
  if (port === '5500' || port === '5501') {
    return 'http://localhost:8080/api';
  }
  return '/api';
})();

/* ===== AUTH: хранение JWT-токена и данных пользователя ===== */
const Auth = {
  TOKEN_KEY: 'aa_token',
  USER_KEY: 'aa_user',

  // Сохраняет ответ /api/auth/login или /api/auth/register
  saveSession(jwtResponse) {
    localStorage.setItem(this.TOKEN_KEY, jwtResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      userId: jwtResponse.userId,
      email: jwtResponse.email,
      fullName: jwtResponse.fullName,
      role: jwtResponse.role,
    }));
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },
};

/* ===== API CLIENT =====
   apiFetch(path, { method, body, auth })
   - path: например '/ads' или '/ads/5'
   - auth: true — добавит заголовок Authorization, если есть токен
   Бросает Error с сообщением из ответа бэкенда при ошибке. */
async function apiFetch(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options;

  const finalHeaders = { ...headers };
  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = Auth.getToken();
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data && data.message) message = data.message;
    } catch (_) {
      // response wasn't JSON — keep the default message
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;

  return response.json();
}