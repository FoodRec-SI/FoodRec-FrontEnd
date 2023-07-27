import './RecipeCard.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Rating } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { useQuery } from 'react-query';
import { PostApi } from '../../api/PostApi';
import { render } from 'react-dom';


function RecipeCard({ props, pending, renderMeal, setRenderMeal, mealId }) {
    const navigate = useNavigate();

    let isAddToPlan = false;

    if (pending == "AddToPlan") {
        isAddToPlan = true;
    }

    const handleClick = () => {
        if (pending == "") {
            navigate('/recipeDetail/' + props.postId);
        }
        if (pending == "pending") {
            navigate('/pendingRecipeDetail/' + props.postId);
        }
        if (pending == "myRecipe") {
            navigate('/myRecipeDetail/' + props.recipeId);
        }
    }

    const { data, isSuccess } = useQuery(
        ['post', props.postId],
        async () => {
            const response = await PostApi.getPostById(props.postId);
            return response.data;
        },
    );

    const handleAddToPlan = () => {
        const newId =
            renderMeal.mealId + data.postId + Math.floor(Math.random() * 1000);
            const newData = { ...data, id: newId };
        setRenderMeal((prevMeals) =>
            prevMeals.map((meal) => {
                if (meal.mealId === mealId) {
                    meal.postDTOList.push(newData);
                }
                return meal;
            })
        );
    }



    return (
        <div key={props.key} className={"recipeCard"} onClick={handleClick}>
            <img src={props.image} alt="" loading="lazy" />
            <div className={"recipeCard__info"}>
                <h3>{props.recipeName}</h3>
                <p>{props.description}</p>
                <div className={"recipeCard__rating"}>
                    <div className={"recipeCard__time"} >
                        <AccessTimeIcon fontSize="medium"></AccessTimeIcon>
                        <p style={{ marginLeft: "5px", textAlign: "center", marginBottom: "0px" }}>{props.duration} min</p>
                    </div>
                    <Rating name="ratingPoint" defaultValue={props.averageScore} precision={0.1} readOnly size="small" />
                </div>
            </div>
            {isAddToPlan == true && isSuccess && <button
                className="add-meal-button"
                onClick={
                    handleAddToPlan
                }
            >
                + ADD
            </button>}
        </div>
    )
}

export default RecipeCard;