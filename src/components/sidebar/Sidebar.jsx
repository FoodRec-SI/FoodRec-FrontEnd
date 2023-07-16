import "./Sidebar.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ClickAwayListener from "@mui/base/ClickAwayListener";

import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HistoryIcon from '@mui/icons-material/History';

import { isModerator } from "../../utills/Helper";
import keycloak from "../../keycloak";
import { Tooltip } from "@mui/material";

const Sidebar = ({ setTitle }) => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen), setShowBackdrop(!showBackdrop);
  };
  const location = useLocation();

  useEffect(() => {
    // Get the current pathname from the location object
    const { pathname } = location;

    // Set the title based on the name of the page
    // Here, you can implement your logic to match the pathname with the page names

    // Example logic:
    if (pathname === "/") {
      setName("Discover Recipes");
    } else if (pathname.includes("/meal")) {
      setName("Meal planner");
    } else if (pathname.includes("/liked")) {
      setName("Liked Recipes");
    } else if (pathname.includes("/collection")) {
      setName("My Collection");
    } else {
      setName("");
    }
  }, []);

  useEffect(() => {
    setTitle(name);
  }, [name, setTitle]);

  const UserMenuItems = [
    {
      name: "Discover Recipes",
      icon: <SearchRoundedIcon sx={{ fontSize: "1.3rem" }} />,
      path: "/",
    },
    {
      name: "Meal planner",
      icon: <ChecklistOutlinedIcon sx={{ fontSize: "1.3rem" }} />,
      path: "/meal",
    },
    {
      name: "Liked Recipes",
      icon: <ThumbUpOutlinedIcon sx={{ fontSize: "1.2rem" }} />,
      path: "/liked",
    },
    {
      name: "My Collection",
      icon: <PlaylistAddRoundedIcon sx={{ fontSize: "1.5rem" }} />,
      path: "/collection",
    },
  ];

  const ModeratorMenuItems = [
    {
      name: "Pending Recipe",
      icon: <AccessTimeIcon sx={{ fontSize: "1.5rem" }} />,
      path: "/PendingRecipe",
    },
    {
      name: "History",
      icon: <HistoryIcon sx={{ fontSize: "1.5rem" }} />,
      path: "/History",
    },
  ];

  if (isModerator(keycloak)) {
    UserMenuItems.splice(0, UserMenuItems.length, ...ModeratorMenuItems);
  }

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="sidebar-container">
        <div
          style={{
            width: isOpen ? "224px" : "64px",
            transition: "all 0.3s ease-in-out",
          }}
          className="open-menu"
        >
          <div className="top-section">
            <div className="bars">
              <DehazeOutlinedIcon
                sx={{ fontSize: "1.5rem" }}
                onClick={toggle}
              />
            </div>
            <div className="sidebar-logo">
              <span
                style={{ display: isOpen ? "block" : "none" }}
                className="food"
              >
                Food
              </span>
              <span
                style={{ display: isOpen ? "block" : "none" }}
                className="rec"
              >
                Rec.
              </span>
            </div>
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              transition: "all 0.8s ease-in-out",
            }}
            className="bl-text"
          >
            Menu
          </div>
          <div
            style={{
              display: isOpen ? "none" : "block",
              transition: "all 0.5s ease-in-out",
            }}
            className="bl"
          ></div>
          <div className="body-section">
            {UserMenuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={(link) => (link.isActive ? "active" : "link")}
                onClick={() => setName(item.name)}
              >
                <div className="icon">
                  <Tooltip
                    title={item.name}
                    placement="bottom-end"
                    enterDelay={600}
                    leaveDelay={0}
                  >
                    {item.icon}
                  </Tooltip>
                </div>
                <div
                  style={{
                    display: isOpen ? "block" : "none",
                    transition: "all 0.5s ease-in-out",
                  }}
                  className="name"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <div
          className="backdrop"
          style={{ display: showBackdrop ? "block" : "none" }}
          onClick={toggle}
        ></div>
      </div>
    </ClickAwayListener>
  );
};

export default Sidebar;
