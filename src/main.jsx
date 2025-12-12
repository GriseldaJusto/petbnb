import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import "./styles/style.css";
import "./styles/responsivo.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* REMOVA BrowserRouter daqui */}
    <AuthProvider>
      <DataProvider>
        <App /> {/* O App.jsx já tem seu próprio BrowserRouter */}
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
