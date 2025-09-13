// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/slice";
import { transReducer } from "./transactions/slice";
import { modalsReducer } from "./modal/slice";
import { statsReducer } from "./statistics/slice";
import { currencyReducer } from "./currency/slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ новий імпорт для інтерсептора та thunk
import { attachAuthInterceptor } from "./auth/api";
import { logoutThunk } from "./auth/operations";

const persistConfig = {
  key: "auth-data",
  version: 1,
  whitelist: ["token"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// ---------- Створюємо store ----------
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    transactions: transReducer,
    statistics: statsReducer,
    currency: currencyReducer,
    modals: modalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ---------- Реєструємо інтерсептор після створення store ----------
attachAuthInterceptor(store, logoutThunk);

// ---------- Persistor ----------
export const persistor = persistStore(store);
