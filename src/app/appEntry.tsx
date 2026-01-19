import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "./providers/router/RouterProvider";
import { AuthProvider } from "@/shared/auth/AuthProvider";
import "../styles.css";
import '@/shared/config/i18n'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  </React.StrictMode>
);
