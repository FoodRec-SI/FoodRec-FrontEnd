import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";


const Navbar = ({ title }) => {
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

        <input
          className="search-bar"
          type="text"
          placeholder="  Search for recipes"
        />
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
