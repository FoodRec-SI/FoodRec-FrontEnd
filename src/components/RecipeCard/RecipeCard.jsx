import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';
import './RecipeCart.css';


function RecipeCard({image,recipeName,description,cookingTime,ratingPoint}) {
    return (
        <div className="recipeCard">
            <img src={image} alt="" />
            <div className="recipeCard__info">
                <h3>{recipeName}</h3>
                <p>{description}</p>
                <div className="recipeCard__rating">
                    <div className="recipeCard__time">
                        <AccessTimeIcon fontSize = "small"></AccessTimeIcon>
                        <p>{cookingTime}</p>
                    </div>
                    <Rating name="ratingPoint" defaultValue={ratingPoint} precision={0.1} readOnly size="small"/>
                </div>
            </div>
        </div>
    )
}

export default RecipeCart;