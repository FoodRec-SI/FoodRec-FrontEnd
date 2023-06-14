import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak.jsx";
import { CircularProgress, Box } from "@mui/material";



const initOptions = {
  onLoad: "check-sso",
  pkceMethod: "S256",
  checkLoginIframe: false,
};

const loadingComponent = (
  <Box sx={{ 
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
  alignItems: 'center',
  }}>
    <CircularProgress />
    </Box>
);

console.log(keycloak);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} LoadingComponent={loadingComponent}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactKeycloakProvider>
);
