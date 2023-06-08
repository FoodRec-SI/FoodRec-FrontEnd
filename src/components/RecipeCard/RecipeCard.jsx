import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';

import { useNavigate } from 'react-router-dom';


function RecipeCard({props,pending}) {
    
    const navigate = useNavigate();

    const handleClick = () => {
        if(pending == ""){
            navigate('/recipeDetail/' + props.id);
        }
        if(pending == "pending"){
            navigate('/pendingRecipeDetail/' + props.id, {state: "pending"});
        }
    }

    return (
        <div className={"recipeCard" + pending} onClick={handleClick}>
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
            {/* {pending == "" ?
            <NavLink to= {'/recipeDetail/' + props.id} className="pendingPage__button" >
                    <button id='navigateButton' style={{display: "none"}}></button>
            </NavLink>
            :
            <NavLink to= {'/pendingRecipeDetail/' + props.id} className="pendingPage__button" state={{pending:"pending"}} >
                    <button id='navigateButton' style={{display: "none"}}></button>
            </NavLink>
            } */}
        </div>
        
    )
}

export default RecipeCard;