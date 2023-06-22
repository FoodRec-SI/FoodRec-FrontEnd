import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";


const RecipeCardList = ({props,pending}) => {
  return (
    <div className="recipe-list">
      {props.map((item,index) => (   
        <RecipeCard
          key={index}
          props={item}
          pending={pending}
        />
      ))}
    </div>
  );
};

export default RecipeCardList;


