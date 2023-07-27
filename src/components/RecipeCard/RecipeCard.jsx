import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';

import { useNavigate } from 'react-router-dom';


function RecipeCard({props,pending}) {

    const navigate = useNavigate();

    const handleClick = () => {
        if(pending == ""){
            navigate('/recipeDetail/' + props.postId);
        }
        if(pending == "pending"){
            navigate('/pendingRecipeDetail/' + props.postId);
        }
        if(pending == "myRecipe"){
            navigate('/myRecipeDetail/' + props.recipeId);
        }
    }

    return (
        <div key={props.key} className={"recipeCard"} onClick={handleClick}>
            <img src={props.image} alt="" loading="lazy" />
            <div className={"recipeCard__info"}>
                <h3>{props.recipeName}</h3>
                <p>{props.description}</p>
                <div className= {"recipeCard__rating"}>
                    <div className={"recipeCard__time"} >
                        <AccessTimeIcon fontSize = "medium"></AccessTimeIcon>
                        <p style={{marginLeft:"5px", textAlign:"center", marginBottom:"0px"}}>{props.duration} min</p>
                    </div>
                    <Rating name="ratingPoint" defaultValue={props.averageScore} precision={0.1} readOnly size="small"/>
                </div>
            </div>
        </div>
        
    )
}

export default RecipeCard;