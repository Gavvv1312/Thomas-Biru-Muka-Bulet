import axios from "axios";

/**
 * CycleWaste — API client.
 *
 * Maps to the actual cyclewaste-backend routes (not a hypothetical schema):
 *   /api/auth/*                          → auth.*
 *   /api/devices/*                       → devices.*  (valuation lives under devices/:id/valuation)
 *   /api/transactions/*                  → transactions.*
 *   /api/dropoff-points                  → dropoff.*  (the backend route is /dropoff-points, not /dropoff)
 *   /api/users/:id/dashboard             → users.dashboard(id)
 *   /api/users/:id/points(/history)      → users.points(id) / users.pointsHistory(id)
 *
 * Every backend response is wrapped as { success, message, data }. The
 * response interceptor below unwraps that so callers just get `data`
 * directly, and turns failures into a plain Error with a human message.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL belum diset");
}

const STORAGE_KEYS = {
  access: "cw_access_token",
  refresh: "cw_refresh_token",
  user: "cw_user",
};

export const session = {
  getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession({ accessToken, refreshToken, user }) {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.access, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.user);
  },
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.access);
  },
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.refresh);
  },
  isLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.access);
  },
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = session.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;
function refreshAccessToken() {
  const rt = session.getRefreshToken();
  if (!rt) return Promise.reject(new Error("Tidak ada sesi aktif"));
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post(`${BASE_URL}/auth/refresh`, { refreshToken: rt })
    .then((res) => {
      const data = res.data.data;
      session.setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

client.interceptors.response.use(
  (res) => res.data.data,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry && !original.skipAuth) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return client(original);
      } catch {
        session.clearSession();
        const sessionErr = new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        sessionErr.status = 401;
        throw sessionErr;
      }
    }
    const message = error.response?.data?.message || error.message || "Terjadi kesalahan";
    const err = new Error(message);
    err.status = error.response?.status;
    err.details = error.response?.data?.errors;
    throw err;
  }
);

export const api = {
  auth: {
    register: (payload) => client.post("/auth/register", payload, { skipAuth: true }),
    login: (email, password) => client.post("/auth/login", { email, password }, { skipAuth: true }),
    logout: () => {
      const rt = session.getRefreshToken();
      const done = rt
        ? client.post("/auth/logout", { refreshToken: rt }, { skipAuth: true }).catch(() => {})
        : Promise.resolve();
      return done.then(() => session.clearSession());
    },
    me: () => client.get("/auth/me"),
  },

  devices: {
    create: (payload) => client.post("/devices", payload),
    listMine: () => client.get("/devices"),
    get: (id) => client.get(`/devices/${id}`),
    createValuation: (id) => client.post(`/devices/${id}/valuation`),
    getValuation: (id) => client.get(`/devices/${id}/valuation`),
  },

  transactions: {
    create: (payload) => client.post("/transactions", payload),
    list: (status) => client.get("/transactions", { params: status ? { status } : {} }),
    get: (id) => client.get(`/transactions/${id}`),
    makeOffer: (id, hargaTawar) => client.patch(`/transactions/${id}/offer`, { harga_tawar: hargaTawar }),
    verify: (id, verifiedWeightGrams, notes) =>
      client.patch(`/transactions/${id}/verify`, {
        verified_weight_grams: verifiedWeightGrams,
        verification_notes: notes,
      }),
    complete: (id, hargaFinal) =>
      client.patch(`/transactions/${id}/complete`, hargaFinal ? { harga_final: hargaFinal } : {}),
    cancel: (id) => client.patch(`/transactions/${id}/cancel`),
  },

  dropoff: {
    list: (filters = {}) => {
      const params = {};
      Object.keys(filters).forEach((k) => {
        if (filters[k]) params[k] = filters[k];
      });
      return client.get("/dropoff-points", { params });
    },
    create: (payload) => client.post("/dropoff-points", payload),
    update: (id, payload) => client.patch(`/dropoff-points/${id}`, payload),
  },

  users: {
    points: (id) => client.get(`/users/${id}/points`),
    pointsHistory: (id) => client.get(`/users/${id}/points/history`),
    dashboard: (id) => client.get(`/users/${id}/dashboard`),
  },
};

export default api;
