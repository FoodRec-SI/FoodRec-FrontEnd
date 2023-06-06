import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';


function RecipeCard({props,pending}) {
    

    return (
        <div className={"recipeCard" + pending}>
            <img src={props.image} alt="" />
            <div className={"recipeCard__info" + pending}>
                <h3>{props.recipeName}</h3>
                <p>{props.description}</p>
                <div className= {"recipeCard__rating" + pending}>
                    <div className={"recipeCard__time" + pending}>
                        <AccessTimeIcon fontSize = "small"></AccessTimeIcon>
                        <p>{props.cookingTime}</p>
                    </div>
                    {props.ratingPoint && <Rating name="ratingPoint" defaultValue={props.ratingPoint} precision={0.1} readOnly size="small"/>}
                </div>
            </div>
        </div>
    )
}

export default RecipeCard;