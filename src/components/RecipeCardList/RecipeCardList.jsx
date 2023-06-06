import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";

const RecipeCardList = ({props,style,pending,handleClick}) => {
  return (
    <div className="recipe-list" style={style && { flexWrap: 'nowrap' }}>
      {props.map((item) => (
        <RecipeCard
          key={item.id}
          props={item}
          pending={pending}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};

export default RecipeCardList;


