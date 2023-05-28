import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';
import './RecipeCart.css';


function RecipeCart({image,recipeName,description,cookingTime,ratingPoint}) {
    return (
        <div className="recipeCart">
            <img src={image} alt="" />
            <div className="recipeCart__info">
                <h3>{recipeName}</h3>
                <p>{description}</p>
                <div className="recipeCart__rating">
                    <div className="recipeCart__time">
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