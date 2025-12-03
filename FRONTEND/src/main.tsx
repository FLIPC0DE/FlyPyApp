import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { AuthProvider } from "./context/AutenticacionContexto.tsx";
import { RedireccionProvider } from "./context/redireccion.contexto.tsx";
import { CursoProvider }  from "./context/CursoContexto";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <RedireccionProvider>
          <AuthProvider>
            <CursoProvider>
              <App />
            </CursoProvider>
          </AuthProvider>
        </RedireccionProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
