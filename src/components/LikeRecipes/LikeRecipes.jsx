import PlayListHeader from "../PlayListHeader/PlayListHeader";
import LikedRecipesList from "../LikedRecipesList/LikedRecipesList";

import "./LikeRecipes.css";

const LikeRecipes = () => {
    const recipes = [
        {
          "name": "Recipe 1",
          "author": "Author 1",
          "cookingTime": "30 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 2",
          "author": "Author 2",
          "cookingTime": "45 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 3",
          "author": "Author 3",
          "cookingTime": "60 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 4",
          "author": "Author 1",
          "cookingTime": "30 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 5",
          "author": "Author 2",
          "cookingTime": "45 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 6",
          "author": "Author 3",
          "cookingTime": "60 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 7",
          "author": "Author 1",
          "cookingTime": "30 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 8",
          "author": "Author 2",
          "cookingTime": "45 minutes",
          "image": "./src/assets/healthyFood.jpg"
        },
        {
          "name": "Recipe 9",
          "author": "Author 3",
          "cookingTime": "60 minutes",
          "image": "./src/assets/healthyFood.jpg"
        }
      ];
    
      return (
        <div className='like-page-container'>
          <PlayListHeader />
          <LikedRecipesList recipes={recipes} />
        </div>
      );
}
 
export default LikeRecipes;