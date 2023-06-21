import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

import {useNavigate} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";


import { Tooltip } from "@mui/material";
import { Navigate } from "react-router-dom";

import { AccountApi } from "../../api/AccountApi";




const Navbar = ({ title }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      keycloak.logout();
      <Navigate to="/" />
    } else {
      keycloak.login();
    }
  };

  const createAccount = async () => {
    const response = await AccountApi.createAccount(keycloak.token)
    if (response.status === 200) {
      return response.status;
    }
  }

  const { status } = useQuery('createAccount', createAccount);

  if (status === 'success') {
    console.log('success')
  }

  if (status === 'error') {
    console.log('error')
  }


  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Sign in";
  };

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSearch = (e) => {
    e.preventDefault();
    const recipeName = e.target.recipeName.value;
    navigate(`/search?recipes=${recipeName}`);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-start">
        <span className="food">Food</span>
        <span className="rec">Rec.</span>
      </div>
      <div className="navbar-middle">
        <div className="greeting">
          <h5 className="hello">Hello, </h5>
          <h3 className="title">{title}</h3>
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="in-search-bar"
          
          type="text"
          placeholder="  Search for recipes"
          name="recipeName"
        />
        </form>
      </div>
      <div className="navbar-end">
        {keycloak.authenticated ? (
          <div className="navbar-end">
            <div className="notification-icon">
              <Tooltip title="Notifications">
              <NotificationsOutlinedIcon />
              </Tooltip>
            </div>
            <div className="avatar">
              <Avatar
                alt="Remy Sharp"
                src=""
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              />
            </div>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem  onClick={()=>{
                            navigate('/profile');
                          }}>
                          <ListItemIcon>
                            <PersonAdd fontSize="small" />
                          </ListItemIcon>
                          Profile
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          Settings
                        </MenuItem>
                        <MenuItem
                          onClick={
                            handleLogInOut
                          }
                        >
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogInOut}>
            {getLogInOutText()}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
