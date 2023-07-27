import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";



const RecipeCardList = ({ props, pending, renderMeal, setRenderMeal, mealId }) => {

  return (
    <div className="recipe-list-wrapper">
      <div className="recipe-list">
        {props&&props.map((item, index) => (
          <RecipeCard
            key={index}
            props={item}
            pending={pending}
            renderMeal={renderMeal}
            setRenderMeal={setRenderMeal}
            mealId={mealId}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeCardList;


