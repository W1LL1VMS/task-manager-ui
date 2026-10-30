import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// L'access token vit uniquement en mémoire : jamais dans localStorage ni sessionStorage
let accessToken = null;
let onSessionExpired = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // permet l'envoi du cookie HttpOnly du refresh token
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

// Renouvelle la session via le cookie de refresh token.
// Un seul renouvellement à la fois, même si plusieurs requêtes échouent en parallèle.
export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        accessToken = res.data.accessToken;
        return res.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Si une requête reçoit un 401, on tente un renouvellement puis on rejoue la requête une fois
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthRoute = original?.url?.startsWith("/auth/");

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        await refreshAccessToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        accessToken = null;
        if (onSessionExpired) onSessionExpired();
      }
    }

    return Promise.reject(error);
  }
);