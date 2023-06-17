import './RecommendRecipe.css'

import { useNavigate } from 'react-router-dom';

const recommendRecipe = [
    {
        "name": "Recipe 1",
        "author": "Author 1",
    },
    {
        "name": "Recipe 2",
        "author": "Author 2",
    },
    {
        "name": "Recipe 3",
        "author": "Author 3",
    },
    {
        "name": "Recipe 4",
        "author": "Author 1",
    },
    {
        "name": "Recipe 5",
        "author": "Author 2",
    },
    {
        "name": "Recipe 6",
        "author": "Author 3",
    },
    {
        "name": "Recipe 7",
        "author": "Author 1",
    },
    {
        "name": "Recipe 8",
        "author": "Author 2",
    },
]


const RecommendRecipe = () => {
    
    return (
        <div className="recommend_recipe">
            <h2>Recommend Recipe</h2>
            <div className="recommend-recipe__list">
                {recommendRecipe.map((recipe, index) => (
                    <Recommend key={index} props={recipe} />
                ))}
            </div>
        </div>
    );
}

function Recommend({ props }) {

    const navigate = useNavigate();

    const handleClickRecommend = () => {
        navigate('/recipeDetail');
    }
    return (
        <div className="recommend" onClick={handleClickRecommend}>
            <img src="./src/assets/healthyFood.jpg" alt="" />
            <div className="recommend__info">
                <h4>{props.name}</h4>
                <p>{props.author}</p>
            </div>
        </div>
    )
}

export default RecommendRecipe;