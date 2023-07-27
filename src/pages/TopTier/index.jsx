import TopRecipe from "../../components/TopRecipe/TopRecipe";
import { PostApi } from "../../api/PostApi";
import { useQuery } from "react-query";
import { useKeycloak } from "@react-keycloak/web";

const TopTier = () => {
  const { keycloak } = useKeycloak();

  const fetchTopRecipe = async () => {
    try {
      const response = await PostApi.getTopPost(keycloak.token);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery("topRecipe", fetchTopRecipe);

  return (
    <>
      <div className="hero-content-wrapper">
        <div className="hero-content-button">TRENDING</div>
        <div className="hero-topic">
          Culinary Delights: Recipes for Every Kind of Dish
        </div>
        <div className="hero-description">
          Explore the world of gastronomy with this diverse recipe compilation,
          catering to all tastes and occasions. From appetizers to desserts, and
          everything in between, discover a vast array of culinary delights that
          are sure to tantalize your taste buds. Whether you're a seasoned chef
          or a cooking enthusiast, this collection offers step-by-step
          instructions and expert tips for creating delectable dishes from
          different cuisines and cultures. From comforting classics to
          innovative twists, embark on a culinary journey that celebrates the
          art of cooking and the joy of sharing delicious meals with family and
          friends.
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data?.content.map((recipe) => (
            <TopRecipe key={recipe.postId} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
};

export default TopTier;
