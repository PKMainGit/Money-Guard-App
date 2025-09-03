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

const persistConfig = {
  key: "auth-data",
  version: 1,
  whitelist: ["token"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

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

export const persistor = persistStore(store);
