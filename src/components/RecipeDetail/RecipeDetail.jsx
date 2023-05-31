import { Rating, IconButton } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import './RecipeDetail.css';


function RecipeDetail() {
    let imageFood = "src/assets/healthyFood.jpg";
    return (
        <>
            <div className="recipeDetail">
                <img src={imageFood} alt="" />
                <Introduction />
                <Ingredients />
                <Description />
                <Instruction />
            </div>
        </>

    )
}

function Introduction() {
    return (
        <div className="introduction">
            <h1>Recipe Name</h1>
            <p>Author</p>
            <Rating name="ratingPoint" defaultValue={5} precision={0.1} readOnly  />
            <div className="showTag">
                tag x 3
            </div>
            <div className="userFeature">
                {/* button x 3*/}
                <IconButton aria-label="addToCollection">
                    <PlaylistAddIcon fontSize="large"/>
                </IconButton>
                <IconButton aria-label="addToFavorite">
                    <FavoriteBorderIcon fontSize="large" />
                </IconButton>
                <IconButton aria-label="shareRecipe">
                    <ShareIcon fontSize="large"/>
                </IconButton>
            </div>
            <div className="recipeStatistic">
                <Statistic  amount = {9} nameOfStatisic ='ingredients' />
                <Statistic  amount = {30} nameOfStatisic ='minutes' />
                <Statistic  amount = {250} nameOfStatisic ='calories' />
            </div>
        </div>
    )
}

function Statistic({amount, nameOfStatisic}) {
    return (

        <div className="statistic">
            <div className="amount">
                <h2>{amount}</h2>
            </div>         
            <p>{nameOfStatisic}</p>
        </div>
    )
}

function Ingredients (){
   let listOfIngredients = ['ingredient 1', 'ingredient 2', 'ingredient 3', 'ingredient 4', 'ingredient 5', 'ingredient 6', 'ingredient 7', 'ingredient 8', 'ingredient 9'];
    
    return(
        <div className="ingredients">
            <h1>Ingredients</h1>
            <ul>
            {listOfIngredients.map((ingredient,index) => 
                <li key = {ingredient}> {index+1}. {ingredient}  </li>
            )}
            </ul>
        </div>

    )
}

function Description(){
    return(
        <div className="description">
            <h1>Description</h1>
            <p>description</p>
        </div>
    )
}

function Instruction(){

let instruction = 'The bridge spanning a 100-foot gully stood in front of him as the last obstacle blocking him from reaching his destination. While people may have called it a "bridge", the reality was it was nothing more than splintered wooden planks held together by rotting ropes. It was questionable whether it would hold the weight of a child, let alone the weight of a grown man. The problem was there was no other way across the gully, and this played into his calculations of whether or not it was worth the risk of trying to cross it.'

    return(
        <div className="instruction">
            <h1>Instruction</h1>
            <p>{instruction}</p>
        </div>
    )
}

export default RecipeDetail;