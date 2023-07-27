import './TopRecipe.css'

const TopRecipe = (props) => {

  console.log(props)

  return ( 
    <div className="top-recipe-container">
       <h3 className="top-title">{props.recipe.recipeName}</h3>
       <a className="top-card-hover" href={`/recipeDetail/${props.recipe.postId}`}>
          <img className="top-image" src={props.recipe.image} alt="recipe" />
        </a>
        <div className="top-recipe-body">
          {props.recipe.description}
        </div>
    </div>
   );
}
 
export default TopRecipe;