import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080/",
  realm: "Gestion_Stock",
  clientId: "S256",
});

export default keycloak;
