import "./RecipeCardList.css";

import RecipeCard from "../RecipeCard/RecipeCard";

const RecipeCardList = ({props,style}) => {
  return (
    <div className="recipe-list" style={style && { flexWrap: 'nowrap' }}>
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


