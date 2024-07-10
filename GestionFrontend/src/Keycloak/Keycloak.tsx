import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080/",
  realm: "said",
  clientId: "gestion-rest-api", // Replace with your Keycloak client ID
});

const initOptions = {
  onLoad: 'login-required', // or 'check-sso'
  checkLoginIframe: false,
};

export default keycloak;
