import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';

import ChipList from '../ChipList/ChipList';
import RecipeCardList from '../RecipeCardList/RecipeCardList'
import './Profile.css'

const Profile = () => {

    const navigate = useNavigate();

    const recipes = [
        {
            id: 1,
            recipeName: 'Spaghetti Bolognese',
            description: 'The murder hornet was disappointed by the preconceived ideas people had of him A quiet house is nice until you are ordered to stay in it for months.They say people remember important moments in their life well, yet no one even remembers their own birth.Nothing is as cautiously cuddly as a pet porcupine.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '1 hour',
            ratingPoint: 4.5
        },
        {
            id: 2,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            ratingPoint: 4.7
        },
        {
            id: 3,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            ratingPoint: 4.7
        },
        {
            id: 4,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            ratingPoint: 4.7
        },
        {
            id: 5,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            ratingPoint: 4.7
        },
        {
            id: 6,
            recipeName: 'Chicken Tikka Masala',
            description: 'Indian-inspired dish made with marinated chicken and creamy tomato sauce.',
            image: './src/assets/healthyFood.jpg',
            cookingTime: '45 minutes',
            ratingPoint: 4.7
        }
    ]

    const handleAddRecipeNavigate = () => {
        navigate('/AddRecipe');
    }

    return (
        <>
            <div className="profile">
                <div className="profile__cover">
                    <img src="src/assets/Yae FullHD tỉ lệ 16- 9 .png" alt="" />
                    <div className="profile__cover__avatar">
                        <img id='avatar' src="src/assets/bcb112771cb88230bbe7374e9f43bd1a.jpg" alt="" />
                        <div className="profile__cover__name">
                            <h2>Yae Sakura</h2>
                            <p>Thiên Hà</p>
                        </div>

                    </div>
                </div>
                <div className="profile__info">
                    <div className="profile__info__preference">
                        <h2>Preference</h2>
                        <h6>What do you like ?</h6>
                        <br></br>
                        <ChipList />
                        
                    </div>
                    <div className="profile__info__yourRecipe">
                        <div className="profile__info__yourRecipe__title">
                            <h2>Your Recipe</h2>
                            <Button variant="outlined" startIcon={<AddIcon />} size="large" onClick={handleAddRecipeNavigate}>
                                Add your recipe
                            </Button>
                        </div>
                        <RecipeCardList props={recipes} pending="" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;