import { configureStore } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { rootReducer } from "./rootReducer.ts";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const useLogger = process.env.NODE_ENV !== "production";

const persistConfig = {
  key: 'haru1813', // 저장 키
  storage,
  whitelist: ['dataStore'],
  blacklist: ['join','buy'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // persistedReducer 생성

const store = configureStore({
  reducer: persistedReducer,
  middleware: [],
});

const persistor = persistStore(store);

export { store, persistor };