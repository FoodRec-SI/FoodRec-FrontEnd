
import "./Sidebar.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';

const Sidebar = ({setTitle}) => {

  const [name, setName] = useState(""); 
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  useEffect(() => {
    // Get the current pathname from the location object
    const { pathname } = location;

    // Set the title based on the name of the page
    // Here, you can implement your logic to match the pathname with the page names

    // Example logic:
    if (pathname === '/') {
      setName('Discover Recipes');
    } else if (pathname === '/meal') {
      setName('Meal planner');
    } else if (pathname === '/liked') {
      setName('Liked Recipes');
    } else if (pathname === '/collection') {
      setName('My Collection');
    } else {
      setName('');
    }
  }, []);

  useEffect(() => {
    setTitle(name);
  }, [name,setTitle]);


  const menuItems =[
    {
      name: "Discover Recipes",
      icon: <SearchRoundedIcon sx={{fontSize:"1.3rem"}}/>,
      path: "/",
      
    },
    {
      name: "Meal planner",
      icon: <ChecklistOutlinedIcon sx={{fontSize:"1.3rem"}} />,
      path: "/meal",
    },
    {
      name: "Liked Recipes",
      icon: <ThumbUpOutlinedIcon sx={{fontSize:"1.2rem"}} />,
      path: "/liked",
    },
    {
      name: "My Collection",
      icon: <PlaylistAddRoundedIcon sx={{fontSize:"1.5rem"}}/>,
      path: "/collection",
    }
  ]


  

  return (
    <div className="sidebar-container">
      <div style={{width: isOpen ? "224px" : "64px" ,  transition: "all 0.3s ease-in-out"}} className="open-menu">
        <div className="top-section">
        <div  className="bars">
            <DehazeOutlinedIcon sx={{fontSize:"1.5rem"}} onClick={toggle}/>
          </div>
          <div  className="sidebar-logo">
          <span style={{display: isOpen ? "block" : "none",  }} className="food">Food</span>
          <span style={{display: isOpen ? "block" : "none",   }} className="rec">Rec.</span>
          </div>
        </div>
        <div style={{display: isOpen ? "block" : "none" ,  transition: "all 0.5s ease-in-out"}}  className="bl-text">Menu</div>
        <div style={{display: isOpen ? "none" : "block" ,  transition: "all 0.5s ease-in-out"}} className="bl"></div>
        <div className="body-section">
        {
          menuItems.map((item,index) => (
            <NavLink to={item.path} key={index}  className={(link) => (link.isActive ? "active" : "link")} onClick={() => setName(item.name)} >
               <div className="icon" >{item.icon}</div>           
                <div style={{display: isOpen ? "block" : "none" ,  transition: "all 0.5s ease-in-out"}} className="name">{item.name}</div>
            </NavLink>
          ))
        }
        </div>
      </div>
     
    </div>
  );
};

export default Sidebar;
