import PlayListHeader from "../PlayListHeader/PlayListHeader";
import LikedRecipesList from "../LikedRecipesList/LikedRecipesList";
import { useQuery } from "react-query";
import { LikeApi } from "../../api/LikeApi";
import { useKeycloak } from "@react-keycloak/web";


import "./LikeRecipes.css";

const LikeRecipes = () => {

    const { keycloak } = useKeycloak();

    const fetchLikedRecipes = async ({pageParam= 0,pageSize = 30}) => {
        const response = await LikeApi.getLikes(pageParam,pageSize,keycloak.token);
        return response.data.content;
    }

    const { data : recipes, isLoading ,isError} = useQuery(
        "likedRecipes",
        fetchLikedRecipes
    );


      console.log(recipes);
    
      return (
        <div className='like-page-container'>
          <PlayListHeader likerecipes = {recipes}/>
          {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>There is no recipe in this like page</p>
      ) : (
          <LikedRecipesList recipes={recipes}  />
      )}
        </div>
      );
}
 
export default LikeRecipes;