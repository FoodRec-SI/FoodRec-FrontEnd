import Keycloak from "keycloak-js";
const keycloakConfig = {
  url: "https://keycloak.yp2743.me",
  realm: "swp",
  clientId: "FoodRec",
};

const keycloak = new Keycloak(keycloakConfig);
export default keycloak;
