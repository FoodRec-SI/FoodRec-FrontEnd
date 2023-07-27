// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak.jsx";
import { CircularProgress, Box } from "@mui/material";
import {QueryClient , QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'




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

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} LoadingComponent={loadingComponent}>
    {/* <React.StrictMode> */}
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    {/* </React.StrictMode> */}
    
  </ReactKeycloakProvider>
);
