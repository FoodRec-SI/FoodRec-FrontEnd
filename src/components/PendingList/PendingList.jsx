import { useState } from 'react'


import RecipeCardList from "../RecipeCardList/RecipeCardList"
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';


import './PendingList.css'
import { NavLink } from 'react-router-dom';

const PendingList = () => {

    const [soft, setSoft] = useState(true);

    const handleClck = () => {
        setSoft(!soft);
    }

    const handlePendingClick = () => {
        document.getElementById('navigateButton').click();
    }

    const recipes = [
        {
            id: 1,
            recipeName: 'Spaghetti Bolognese',
            description: 'The murder hornet was disappointed by the preconceived ideas people had of him A quiet house is nice until you are ordered to stay in it for months.They say people remember important moments in their life well, yet no one even remembers their own birth.Nothing is as cautiously cuddly as a pet porcupine.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '1 hour',
            //   ratingPoint: 4.5
        },
        {
            id: 2,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            //   ratingPoint: 4.7
        },
        {
            id: 3,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            //   ratingPoint: 4.7
        },
        {
            id: 4,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            //   ratingPoint: 4.7
        },
        {
            id: 5,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            //   ratingPoint: 4.7
        },
        {
            id: 6,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            //   ratingPoint: 4.7
        },

        // Add more recipes here
    ];

    return (
        <>
            <div className="pendingPage">
                <div className="pendingPage__header">
                    {soft == true ? <h1>Newest</h1> : <h1>Oldest</h1>}
                    <IconButton aria-label="delete" onClick={handleClck}>
                        {soft==true ? <SortIcon fontSize="large"/> :<SortIcon fontSize="large" sx={{transform: "scaleY(-1)"}}/>}
                    </IconButton>
                </div>

                <RecipeCardList props={recipes} pending="pending" handleClick={handlePendingClick}/>
                {/* <RecipeCard props={recipes[0]} pending="pending" /> */}

                <NavLink to="/meal" className="pendingPage__button">
                    <button id='navigateButton' style={{display: "none"}}>Discover</button>
                </NavLink>
            </div>
        </>
    )
}

export default PendingList;