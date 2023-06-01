import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";

const Discover = () => {

  const recipes = [
    {
      id: 1,
      recipeName: 'Spaghetti Bolognese',
      description: 'Classic Italian dish made with ground beef, tomato sauce and herbs.',
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
    },
    // Add more recipes here
  ];
  return ( 
    <div className="page-container">
    <LoginBanner/>
    <RecipeCardList props={recipes}/>
    </div>
   );
}
 
export default Discover;