import './PlanDetail.css'

const PlanDetail = () => {



  const MealCard = () => {

    return (
      <div className="plan-detail-meal-card">
        <div className="meal-card-header">
          <div className="meal-card-header-title">
            <h3>Meal Name</h3>
            <span>Calories</span>
          </div>  
        </div>
        <div className="meal-card-header">
             
        </div>
      </div>
    )
  }  

  return ( 
    <div className="plan-detail">
      <div className="plan-detail-container">
      <div className="plan-detail-header">
          <span className="plan-tray">Plan</span>
          <span className="shop-list-tray">Shop</span>
      </div>
      <div className="plan-detail-body">
        <div className="plan-detail-name-total-calories">
          <div className="plan-detail-name">
            <h3>Plan Name</h3>
          </div>
          <div className="plan-deatil-calories">
            <h3>Total Calories</h3>
          </div> 
        </div>
        <div className="plan-detail-meal-list">
          <MealCard />
        </div>  
      </div>  
      </div>
    </div>
   );
}
 
export default PlanDetail;