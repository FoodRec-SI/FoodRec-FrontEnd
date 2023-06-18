import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';

import { useNavigate } from 'react-router-dom';


function RecipeCard({props,pending}) {
    
    const navigate = useNavigate();

    const handleClick = () => {
        if(pending == ""){
            navigate('/recipeDetail/' + props.recipeId);
        }
        if(pending == "pending"){
            navigate('/pendingRecipeDetail/' + props.recipeId);
        }
    }

    // src='./src/assets/healthyFood.jpg'
    // src={`"data:image/png;base64, ${props.image}"`}

    return (
        <div key={props.key} className={"recipeCard" + pending} onClick={handleClick}>
            <img src='./src/assets/healthyFood.jpg' alt="" loading="lazy" />
            <div className={"recipeCard__info" + pending}>
                <h3>{props.recipeName}</h3>
                <p>{props.description}</p>
                <div className= {"recipeCard__rating" + pending}>
                    <div className={"recipeCard__time" + pending} >
                        <AccessTimeIcon fontSize = "medium"></AccessTimeIcon>
                        <p style={{marginLeft:"5px"}}>{props.duration} min</p>
                    </div>
                    {props.ratingPoint && <Rating name="ratingPoint" defaultValue={props.ratingPoint} precision={0.1} readOnly size="small"/>}
                </div>
            </div>
        </div>
        
    )
}

export default RecipeCard;