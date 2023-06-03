import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";

const RecipeCardList = ({props}) => {
  return (
    <div className="recipe-list">
      {props.map((item) => (
        <RecipeCard
          key={item.id}
          props={item}
        />
      ))}
    </div>
  );
};

export default RecipeCardList;


