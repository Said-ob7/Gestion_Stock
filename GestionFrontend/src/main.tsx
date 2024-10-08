
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak/Keycloak.tsx";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
);
