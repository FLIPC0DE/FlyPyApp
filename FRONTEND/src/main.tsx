import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { AutenticacionProvider } from "./context/autenticacionProvider.tsx";
import { RedireccionProvider } from "./context/redireccionProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <RedireccionProvider>
          <AutenticacionProvider>
            <App />
          </AutenticacionProvider>
        </RedireccionProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
