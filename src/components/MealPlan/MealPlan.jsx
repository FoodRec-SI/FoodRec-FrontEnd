import "./MealPlan.css";

const FoodName = () => {
    return(
        <div className="foodName">
            <img src="" alt="" />
            <h1 className="title">Food Name</h1>
        </div>
    )
} 

const MealPlan = ({foodName}) => {
    return (
        <div className="mealPlan">
            <form className="searchForm" method="GET" action="">
                <input className="input" type="text" name="search" id="search" placeholder="    Search for a meal plan" />
            </form>
                <h1 className="title">Breakfast</h1>
                <FoodName />
                <h1 className="title">Lunch</h1>
                <h1 className="title">Dinner</h1>
            <button className="add"></button>
            <button className="addToSchedule"></button>
        </div>
    )
}

export default MealPlan;