import axios from "axios";

export const moneyGuardAPI = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

export const setAuthHeader = (token) =>
  (moneyGuardAPI.defaults.headers.common.Authorization = `Bearer ${token}`);
export const resetAuthHeader = () =>
  (moneyGuardAPI.defaults.headers.common.Authorization = "");

/**
 * Підключає інтерсептор.
 * store і logoutThunk передаємо після ініціалізації, щоб уникнути циклу.
 */
export const attachAuthInterceptor = (store, logoutThunk) => {
  let isRefreshing = false;
  let subscribers = [];

  function onRefreshed(token) {
    subscribers.forEach((cb) => cb(token));
    subscribers = [];
  }
  const addSubscriber = (cb) => subscribers.push(cb);

  moneyGuardAPI.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status !== 401) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve) =>
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(moneyGuardAPI(originalRequest));
          })
        );
      }

      isRefreshing = true;
      try {
        const { data } = await moneyGuardAPI.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;

        store.dispatch({ type: "auth/setToken", payload: newToken });
        setAuthHeader(newToken);

        isRefreshing = false;
        onRefreshed(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return moneyGuardAPI(originalRequest);
      } catch (err) {
        isRefreshing = false;
        subscribers = [];
        store.dispatch(logoutThunk()); // ✅ тепер можна викликати
        return Promise.reject(err);
      }
    }
  );
};
