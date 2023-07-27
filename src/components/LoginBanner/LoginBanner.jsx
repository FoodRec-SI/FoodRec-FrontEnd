import "./LoginBanner.css";
import ChipsBanner from "../ChipsBanner/ChipsBanner";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { Rating } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginBanner = (props) => {
  const { keycloak } = useKeycloak();
  const { searchName } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [recipeName, setRecipeName] = useState(searchName);

  const handleSearch = (e) => {
    e.preventDefault();
    const recipeName = e.target.recipeName.value;
    setRecipeName(recipeName);
    navigate(`/search/${recipeName}`);
  }
  const fetchTags = async () => {
    const response = await TagApi.getTags(keycloak.token);
    return response.data;
  };

  const { data: items } = useQuery("items", fetchTags);

  const onItemClick = (item) => {
  
    props.onItemClick(item);
  };

  return (
    <div className="login-banner">
      <div className="user-banner">
        <div className="banner-wrapper">
        <div className="weekly-content">
        <div className="popular">
          <h6>POPULAR</h6>
        </div>
        <div className="banner-info">
          <h1 className="recipe-name">Top Recipes to Make Your Taste Buds Dance!</h1>
        </div>
        <a href="/top-list" className="weekly-button">
          <div className="button-text">View Weekly Recipes</div>
        </a>
        </div>
      </div>
      <div className="search-wrapper">
      <div className="search-bar-container-in-home">
        <div className="search-bar">
          <span id="search-icon" className="pi pi-search"></span>
          <form className="search-bar-form" onSubmit={handleSearch}>
            <input
              className="in-search-bar"
              type="text"
              placeholder="  What are you craving today ?"
              name="recipeName"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        </div>
      </div>
      </div>
      {/* <div className="block"></div> */}
      {items && <ChipsBanner items={items} onItemClick={onItemClick} />}
    </div>
  );
};

export default LoginBanner;
