import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";

const RecipeCardList = ({props,pending}) => {
  return (
    <div className="recipe-list" pending={pending}>
      {props.map((item) => (   
        <RecipeCard
          key={item.id}
          props={item}
          pending={pending}
        />
      ))}
    </div>
  );
};

export default RecipeCardList;


