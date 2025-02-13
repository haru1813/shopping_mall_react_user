import { configureStore } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { rootReducer } from "./rootReducer.ts";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root', // 저장 키
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // persistedReducer 생성

const useLogger = process.env.NODE_ENV !== "production";

const initializeStore = () => {
  const store = configureStore({ reducer: persistedReducer, middleware: [] });
  return store;
};

export function useStore() {
  const store = useMemo(() => initializeStore(), []);
  return store;
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: [],
});

const persistor = persistStore(store);

export { store, persistor };