// utils/logoutTimer.js
let logoutTimerId = null;
let midLogTimerId = null;

export const startLogoutTimer = (dispatch, logoutThunk, delay = 60000) => {
  // При кожному старті прибираємо старі таймери
  if (logoutTimerId) clearTimeout(logoutTimerId);
  if (midLogTimerId) clearTimeout(midLogTimerId);

  // 1️⃣ Таймер на сам логаут
  logoutTimerId = setTimeout(() => {
    dispatch(logoutThunk());
  }, delay);

  // 2️⃣ Таймер на лог через 30 секунд після запуску
  midLogTimerId = setTimeout(() => {
    console.log("[AutoLogout] 60 seconds have passed since login");
    // За бажанням можна зробити dispatch або toast
    // dispatch(showInfoMessage('30 seconds have passed since login'));
  }, 60000);
};

export const clearLogoutTimer = () => {
  if (logoutTimerId) {
    clearTimeout(logoutTimerId);
    logoutTimerId = null;
  }
  if (midLogTimerId) {
    clearTimeout(midLogTimerId);
    midLogTimerId = null;
  }
};
