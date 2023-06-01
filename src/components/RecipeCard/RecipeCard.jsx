import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';


function RecipeCard({props}) {
    

    return (
        <div className="recipeCard">
            
            <img src={props.image} alt="" />
            <div className="recipeCard__info">
                <h3>{props.recipeName}</h3>
                <p>{props.description}</p>
                <div className="recipeCard__rating">
                    <div className="recipeCard__time">
                        <AccessTimeIcon fontSize = "small"></AccessTimeIcon>
                        <p>{props.cookingTime}</p>
                    </div>
                    <Rating name="ratingPoint" defaultValue={props.ratingPoint} precision={0.1} readOnly size="small"/>
                </div>
            </div>
        </div>
    )
}

export default RecipeCard;