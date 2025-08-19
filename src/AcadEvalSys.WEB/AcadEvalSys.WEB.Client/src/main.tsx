import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./shared/providers/app-providers";
import { AuthRouter } from "./features/auth/components";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AppProviders>
    <AuthRouter />
  </AppProviders>
);
