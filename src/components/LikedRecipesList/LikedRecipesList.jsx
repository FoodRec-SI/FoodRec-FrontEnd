import "./LikedRecipesList.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const LikedRecipe = (props) => {
  return (
    <div className="liked-container">
      <div className="index-container">
        <div className="index">{props.index}</div>
      </div>
      <div className="recipe-container">
        <div className="liked-recipe-thumbnail">
          <img src={props.image} alt="" />
        </div>
        <div className="liked-recipe-detail">
          <div className="liked-recipe-name">{props.name}</div>
          <div className="small-detail">
            <div className="liked-recipe-author">{props.author}</div>
            <div className="separator">&#183;</div>
            <div className="liked-recipe-time">{props.cookingTime}</div>
          </div>
        </div>
      </div>
      <div className="action-menu">
        <button className="menu-button">
          <MoreVertIcon />
        </button>
      </div>
    </div>
  );
};

const LikedRecipeList = (props) => {
  return (
    <div className="liked-recipe-list-container">
      {props.recipes.map((recipe, index) => (
        <LikedRecipe
          key={index}
          index={index + 1}
          name={recipe.name}
          author={recipe.author}
          cookingTime={recipe.cookingTime}
          image={recipe.image}
        />
      ))}
    </div>
  );
};

export default LikedRecipeList;
