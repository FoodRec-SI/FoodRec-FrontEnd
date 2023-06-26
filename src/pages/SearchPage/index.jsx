import { useLocation } from "react-router-dom";
import RecipeCardList from '../../components/RecipeCardList/RecipeCardList';
// import { useEffect } from "react";
// import { useState } from "react";
import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";

const SearchPage = () => {

  const { keycloak } = useKeycloak();
  const location = useLocation();
  const recipeName = new URLSearchParams(location.search).get("recipes") 
  


  // useEffect(() => {
  //   PostApi.getPostsByName(recipeName, keycloak.token).then((response) => {
  //     setRecipes(response.data.content);
  //   });
  // }, [recipeName]);

  const fetchSearchRecipes = async () => {
    const response = await PostApi.getPostsByName(recipeName, keycloak.token)
    return response.data.content;
  }

  const { status , data : recipes } = useQuery(['recipes', recipeName] , fetchSearchRecipes);

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>No Recipes Found</div>
  }

  return ( 
    <div>
      <RecipeCardList props={recipes} pending="" />
    </div>
   );
}
 
export default SearchPage;