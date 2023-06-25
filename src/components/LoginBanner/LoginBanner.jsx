import "./LoginBanner.css";
import ChipsBanner from "../ChipsBanner/ChipsBanner";

import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";

import { Rating } from "@mui/material";

const LoginBanner = () => {

  const { keycloak } = useKeycloak();
  

  const fetchTags = async () => {
    const response = await TagApi.getTags(keycloak.token)
    return response.data;
  }

  const { status , data : items } = useQuery('items' , fetchTags);

  // if (status === 'loading') {
  //   return <div>Loading...</div>
  // }

  // if (status === 'error') {
  //   return <div>No Tags Found</div>
  // }


  const onItemClick = (item) => {
    console.log(item);
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
      <div className="block"></div>
      {items && <ChipsBanner items={items} onItemClick={onItemClick} />}
    </div>
  );
};

export default LoginBanner;
