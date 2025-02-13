import React from 'react';
import { BrowserRouter } from "react-router-dom";
import RoutesSetup from "./routes/RoutesSetup.tsx";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/useStore.ts';
//import { Provider as ReduxProvider } from "react-redux";
//import { useStore } from "./store/index.ts";

export default function App() {
  //const store = useStore();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <RoutesSetup />
        </BrowserRouter>
      </PersistGate>
    </Provider >
  );
}

