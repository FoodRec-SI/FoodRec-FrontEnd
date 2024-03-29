import "./Navbar.css";
import 'primeicons/primeicons.css';
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";

import {Dialog} from 'primereact/dialog';
import { useState } from "react";

import { Tooltip } from "@mui/material";
import { AccountApi } from "../../api/AccountApi";

import { isModerator } from "../../utills/Helper";
import { set } from "date-fns";

const Navbar = ({ toggle }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleBacktoHome = () => {
    navigate("/");
  }

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      navigate("/");
      keycloak.logout();
    } else {
      // keycloak.login();
      navigate("/");
      keycloak.login();
    }
  };

  // useEffect(() => {
  //   if (keycloak.authenticated) {
  //     isModerator(keycloak) ? navigate("/PendingRecipe") : navigate("/");
  //   }
  // }, [keycloak.authenticated]);

  const createAccount = async () => {
    
    const response = await AccountApi.createAccount(keycloak.token);
    if (response.status === 409) {

    }
    if (response.status === 200) {
      return response.data;
    }
  };

  const { data: isFirstTime , status } = useQuery("createAccount", createAccount, {
    enabled: keycloak.authenticated,
  });

  if (status === "error") {

  }

  // const getLogInOutText = () => {
  //   return keycloak.authenticated ? "Sign out" : "Sign in";
  // };

  const handleCompleteProfile = () => {
    setOpen(false);
    navigate("/profile", {state:"new"});
  }

  return (
    <>
    <header className="navbar-container">
      <div className="navbar-wrapper">
      <div className="navbar-start">
        <div className="bars" onClick={toggle}>
          <DehazeOutlinedIcon sx={{ fontSize: "1.5rem" }} />
        </div>
        <div className="logo" onClick={handleBacktoHome}>
        <span className="food">Food</span>
        <span className="rec">Rec.</span>
        </div>
      </div>
      <div className="navbar-end">
        {isModerator == true ? "" :
          <div className="search-icon"
            onClick={() => {
              navigate("/search");
            }
            }
          >
            {<Tooltip title="Search">
              <span className="pi pi-search"></span>
            </Tooltip>}
          </div>}
        {/* {keycloak.authenticated ? <div className="notification-icon">
          <Tooltip title="Notifications">
            <span className="pi pi-bell"></span>
          </Tooltip>
        </div> : ""} */}
        {/* {keycloak.authenticated ? <div className="settings-icon">
          <Tooltip title="Settings">
            <span className="pi pi-spin pi-cog"></span>
          </Tooltip>
        </div> : ""} */}
        {!keycloak.authenticated ? <div className="login-btn" onClick={handleLogInOut}>
          Sign in
        </div> : ""}
      </div>
      </div>
    </header>
    <Dialog header="Welcome to FoodRec" visible={open} style={{ width: '50vw' }} onHide={() => setOpen(false)}>
      <p>Thank you for joining us. Please fill in your information to get started.</p>
      <p>Click <span onClick={handleCompleteProfile} style={{color:"blue",textDecoration:"underline",cursor:"pointer"}}>HERE</span> to fill in your information.</p>
    </Dialog>
    </>
  );
};

export default Navbar;
