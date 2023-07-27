import "./Sidebar.css";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import { useNavigate } from "react-router-dom";
import HistoryIcon from '@mui/icons-material/History';

import { isModerator } from "../../utills/Helper";
import keycloak from "../../keycloak";

const Sidebar = ({ isOpen, showBackdrop, toggle }) => {

  const navigate = useNavigate();
  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      navigate("/");
      keycloak.logout();
    } else {
      navigate("/");
      keycloak.login();
    }
  };

  useEffect(() => {
    if(isModerator(keycloak)){
      navigate('/PendingRecipe');
    }
  }, [keycloak.authenticated])

  

  const UserMenuItems = [
    {
      name: "Discover Recipes",
      icon: <HomeRoundedIcon sx={{ fontSize: "1.5rem" }} />,
      image: "/assets/1.jpg",
      path: "/",
    },
    {
      name: "Meal Planner",
      icon: <FormatListBulletedRoundedIcon sx={{ fontSize: "1.5rem" }} />,
      image: "/assets/2.jpg",
      path: "/meal",
    },
    {
      name: "Liked Recipes",
      icon: <ThumbUpRoundedIcon sx={{ fontSize: "1.5rem" }} />,
      image: "/assets/3.jpg",
      path: "/liked",
    },
    {
      name: "My Collection",
      icon: <BookmarkRoundedIcon sx={{ fontSize: "1.5rem" }} />,
      image: "/assets/4.jpg",
      path: "/collection",
    },
  ];

  const ModeratorMenuItems = [
    {
      name: "Pending Recipe",
      icon: <AccessTimeIcon sx={{ fontSize: "1.5rem" }} />,
      path: "/PendingRecipe",
      image:"/assets/4.jpg",
    },
    {
      name: "History",
      icon: <HistoryIcon sx={{ fontSize: "1.5rem" }} />,
      path: "/History",
      image: "/assets/3.jpg",
    },
  ];

  if (isModerator(keycloak)) {
    UserMenuItems.splice(0, UserMenuItems.length, ...ModeratorMenuItems);
  }

  return (
    <div className="sidebar-container" >
      <div
        style={{
          width: isOpen ? "400px" : "0px",
          transition: "all 0.2s ease-in-out",
        }}
        className="open-menu"
      >
        <div className="body-section" >
          <div className="card-wrapper" >
            {UserMenuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={(link) => (link.isActive ? "active" : "link")}
                onClick={toggle}
              >
                <div className="nav-card-container"
                  style={{
                    display: isOpen ? "block" : "none",
                    opacity: isOpen ? "1" : "0",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <div className="nav-card"
                    style={{
                      display: isOpen ? "flex" : "none",
                      opacity: isOpen ? "1" : "0",
                      transition: "all 0.3s ease-in-out",
                      backgroundImage: `url(${item.image})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="nav-card-content"
                    >
                      <div className="nav-card-icon" style={{
                        display: isOpen ? "block" : "none"
                      }}>{item.icon}</div>
                      <div
                        style={{
                          display: isOpen ? "block" : "none",
                          transition: "all 0.5s ease-in-out",
                        }}
                        className="nav-card-title"
                      >
                        {item.name}
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
          {isModerator(keycloak) == false && <div className="profile-btn" style={{
            display: isOpen ? "flex" : "none",
            marginTop: "32px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#000000",
            lineHeight: "22px",
            cursor: "pointer",
          }}
            onClick={() => {
              navigate('/profile');
              toggle();
            }
            }
          >
            My Account
          </div>}
          <div className="sign-out" style={{
            display: isOpen ? "flex" : "none",
            marginTop: "32px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#FF283F",
            lineHeight: "22px",
            cursor: "pointer",
          }
          }
            onClick={() => handleLogInOut()}
          >
            Sign out
          </div>
        </div>
      </div>
      <div
        className="backdrop"
        style={{ display: showBackdrop ? "block" : "none" }}
        onClick={() => toggle()}
      ></div>
    </div>
  );
};

export default Sidebar;
