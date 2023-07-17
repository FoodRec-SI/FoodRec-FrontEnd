import "./Navbar.css";
import 'primeicons/primeicons.css';
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";

import { Tooltip } from "@mui/material";
import { AccountApi } from "../../api/AccountApi";

import { isModerator } from "../../utills/Helper";

const Navbar = ({toggle}) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      keycloak.logout();
    } else {
      // keycloak.login();
      keycloak.login();
    }
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      isModerator(keycloak) ? navigate("/PendingRecipe") : navigate("/");
    }
  }, [keycloak.authenticated]);

  const createAccount = async () => {
    const response = await AccountApi.createAccount(keycloak.token);
    if (response.status === 409) {
      console.log("Account already exists");
    }
    if (response.status === 200) {
      return response.status;
    }
  };

  const { status, refetch } = useQuery("createAccount", createAccount, {
      enabled: keycloak.authenticated,
    });

  if (status === "error") {
    console.log("error");
  }

  // const getLogInOutText = () => {
  //   return keycloak.authenticated ? "Sign out" : "Sign in";
  // };

  return (
    <header className="navbar-container">
      <div className="navbar-start">
        <div className="bars" onClick={toggle}>
          <DehazeOutlinedIcon sx={{ fontSize: "1.5rem" }} />
        </div>
        <span className="food">Food</span>
        <span className="rec">Rec.</span>
      </div>
      <div className="navbar-end">
        {isModerator ? null : <div className="search-icon"
        onClick={() => {
          navigate("/search");
        }
        }
        >
          {<Tooltip title="Search">
          <span className="pi pi-search"></span>
          </Tooltip>}
        </div>}
        {keycloak.authenticated ? <div className="notification-icon">
          <Tooltip title="Notifications">
          <span className="pi pi-bell"></span>
          </Tooltip>
        </div> : ""}
        {keycloak.authenticated ? <div className="settings-icon">
          <Tooltip title="Settings">
          <span className="pi pi-spin pi-cog"></span>
          </Tooltip>
        </div> : ""}
        { !keycloak.authenticated  ? <div className="login-btn" onClick={handleLogInOut}> 
          Sign in
        </div> : ""}
      </div>
    </header>
  );
};

export default Navbar;
