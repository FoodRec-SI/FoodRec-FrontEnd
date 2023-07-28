import "./RecommendRecipe.css";
import { PostApi } from "../../api/PostApi";
import { useQuery } from "react-query";
import { useKeycloak } from "@react-keycloak/web";
import Loading from "../Loading/Loading";
import RecipeCard from "../RecipeCard/RecipeCard";
import { handleLogError } from "../../utills/Helper";

const RecommendRecipe = (props) => {
 
  const {keycloak} = useKeycloak();
  const tags = props.tags.map((tag) => tag.tagId);



    const fetchRecommendRecipe = async () => {
      try{
        const tagIdsString = tags.join(',');
        const response = await PostApi.getPostsByTags(tagIdsString, 0, 4, keycloak.token);
        return response.data;
      }
      catch(error){
         handleLogError(error);
      }
    };

    const { data: recommendRecipe, status } = useQuery(
        ["recommendRecipe", { tags }],
        fetchRecommendRecipe
    );



  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="recommend_recipe">
      <h2>Recommend Recipe</h2>
      <div className="recommend-recipe__list">
        {recommendRecipe&&recommendRecipe.content.map((recipe, index) => (
           <RecipeCard key={index} props={recipe} pending=""/>      
        ))}
      </div>
    </div>
  );
};

// function Recommend({ props }) {
//   const navigate = useNavigate();

//   const handleClickRecommend = () => {
//     navigate("/recipeDetail");
//   };
//   return (
//     <div className="recommend" onClick={handleClickRecommend}>
//       <img src="./src/assets/healthyFood.jpg" alt="" />
//       <div className="recommend__info">
//         <h4>{props.recipeName}</h4>
//         <p>{props.author}</p>
//       </div>
//     </div>
//   );
// }

export default RecommendRecipe;
