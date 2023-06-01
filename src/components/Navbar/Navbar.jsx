
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


const Navbar = ({title}) => {

 

  return (
    <header className="navbar-container">
      <div className="navbar-start">
        <span className="food">Food</span>
        <span className="rec">Rec.</span>
      </div>
      <div className="greeting">
          <h5 className="hello">Hello, </h5>
          <h3 className="title">{title}</h3>
        </div>
      <div className="navbar-middle">
        
        <div className="search">
          <input className="search-bar" type="text" placeholder="  Search for recipes" />
          <div className="icon-search-bar">
            <SearchRoundedIcon sx={{fontSize:"1.3rem"}}/>
          </div>
        </div>
      </div>
      <div className="navbar-end">
        <div className="notification-icon">
          <NotificationsOutlinedIcon />
        </div>
        <div className="avatar">
          <Avatar alt="Remy Sharp" src="" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;