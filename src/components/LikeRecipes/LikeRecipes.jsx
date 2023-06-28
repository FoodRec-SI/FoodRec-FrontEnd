import PlayListHeader from "../PlayListHeader/PlayListHeader";
import LikedRecipesList from "../LikedRecipesList/LikedRecipesList";
import { useQuery } from "react-query";
import { LikeApi } from "../../api/LikeApi";
import { useKeycloak } from "@react-keycloak/web";

import "./LikeRecipes.css";

const LikeRecipes = () => {
  const { keycloak } = useKeycloak();

  const fetchLikedRecipes = async ({ pageParam = 0, pageSize = 30 }) => {
    const response = await LikeApi.getLikes(
      pageParam,
      pageSize,
      keycloak.token
    );
    return response.data.content;
  };

  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery("likedRecipes", fetchLikedRecipes);

  return (
    <div className="like-page-container">
      <PlayListHeader likerecipes={recipes} />
      {isLoading ? (
        <div className="liked-recipe-list-container">
          <p>Loading...</p>
        </div>
      ) : isError|| (recipes && recipes.length === 0) ? (
        <div className="liked-recipe-list-container">
          <p>There is no recipe in this like page</p>
        </div>
      ) : (
        <LikedRecipesList recipes={recipes} />
      )}
    </div>
  );
};

export default LikeRecipes;
