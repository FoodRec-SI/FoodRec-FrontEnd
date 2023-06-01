import "./LoginBanner.css";
import ChipsBanner from "../ChipsBanner/ChipsBanner";

import { Rating } from "@mui/material";

const LoginBanner = () => {

  const items = [
    { id: 1, label: "Vegetarian" },
    { id: 2, label: "Vegan" },
    { id: 3, label: "Gluten Free" },
    { id: 4, label: "Dairy Free" },
    { id: 5, label: "Low FODMAP" },
    { id: 6, label: "Ketogenic" },
    { id: 7, label: "Whole30" },
    { id: 8, label: "Paleo" },
    { id: 9, label: "Primal" },
    { id: 10, label: "Pescatarian" },
    { id: 11, label: "Whole30" },
    { id: 12, label: "Paleo" },
    { id: 13, label: "Primal" },
    { id: 14, label: "Pescatarian" },
    { id: 15, label: "Pescatarian" },
    { id: 16, label: "Pescatarian" },
    { id: 17, label: "Pescatarian" },
    { id: 18, label: "Pescatarian" },
    { id: 19, label: "Pescatarian" },
    { id: 20, label: "Pescatarian" },
    { id: 21, label: "Pescatarian" },
    { id: 22, label: "Pescatarian" },
  ]

  const onItemClick = (item) => {
    console.log(item);
  }

  return (
    <div className="login-banner">
      <div className="user-banner">
        <div className="popular">
          <h6>POPULAR</h6>
        </div>
        <div className="banner-info">
          <h1 className="recipe-name">Supreme Burger</h1>
          <div className="rate">
            <Rating name="read-only" value={5} readOnly />
          </div>
        </div>
      </div>
        <ChipsBanner items={items} onItemClick={onItemClick}/>       
    </div>
  );
};

export default LoginBanner;
