import LikedRecipesList from "../../components/LikedRecipesList/LikedRecipesList";
import PlayListHeader from "../../components/PlayListHeader/PlayListHeader";
import Nothing from "../../components/Nothing/Nothing";
import Loading from "../../components/Loading/Loading";
import { CollectionApi } from "../../api/CollectionApi";
import { useQuery } from "react-query";
import { useKeycloak } from "@react-keycloak/web";
import { useParams } from "react-router-dom";



const CollectionDetail = () => {
  const { id } = useParams();
  const { keycloak } = useKeycloak();

  const fetchCollectionList = async ({ pageParam = 0, pageSize = 10 }) => {
    const response = await CollectionApi.getPostFromCollection(
      id,
      pageParam,
      pageSize,
      keycloak.token
    );
    return response.data;
  };

  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery(["collection", id], fetchCollectionList);


  return (
    <div className="like-page-container">
      <PlayListHeader id={id} recipes={recipes} />
      {isLoading ? (
         <div className="liked-recipe-list-container">
          <Loading />
      </div>
      ) : isError || (recipes.postDTOS && recipes.postDTOS.content.length === 0) ? (
        <div className="liked-recipe-list-container">
          <Nothing />
      </div>
      ) : (
        <LikedRecipesList recipes={recipes.postDTOS ? recipes.postDTOS.content : recipes} id={id} />
      )}
    </div>
  );
};

export default CollectionDetail;