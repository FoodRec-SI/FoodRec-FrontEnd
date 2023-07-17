import "./LoginBanner.css";
import ChipsBanner from "../ChipsBanner/ChipsBanner";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { Rating } from "@mui/material";

const LoginBanner = (props) => {
  const { keycloak } = useKeycloak();
  const fetchTags = async () => {
    const response = await TagApi.getTags(keycloak.token);
    return response.data;
  };

  const { data: items } = useQuery("items", fetchTags);

  const onItemClick = (item) => {
    console.log(item);
    props.onItemClick(item);
  };

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
      <div className="search-bar-container-in-home">
        <div className="search-bar">
          <span id="search-icon" className="pi pi-search"></span>
          <form className="search-bar-form" >
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
      {/* <div className="block"></div> */}
      {items && <ChipsBanner items={items} onItemClick={onItemClick} />}
    </div>
  );
};

export default LoginBanner;
