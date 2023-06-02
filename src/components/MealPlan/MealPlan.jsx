import "./MealPlan.css";

const mealName = () => {

}

const MealPlan = () => {
    return (
        <div className="mealPlan">
            <input className="input" type="text" name="search" id="search" placeholder="    Search for a meal plan" />
            <div>
                <h1 className="title">Breakfast</h1>
            </div>
            <div>
                <h1 className="title">Lunch</h1>
            </div>
            <div>
                <h1 className="title">Dinner</h1>
            </div>

            <button className="add"></button>
            <button className="addToSchedule"></button>
            

        </div>
    )
}

export default MealPlan;