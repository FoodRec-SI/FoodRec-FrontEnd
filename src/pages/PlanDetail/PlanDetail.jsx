import './PlanDetail.css'
import { useState } from 'react';

const PlanDetail = () => {


  const [ active, setActive ] = useState(false);

  const handleActive = () => {
    setActive(!active);
  }


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
          <span className={active ? "active" : "plan-tray"} onClick={handleActive}>Plan</span>
          <span className={active ? "active" : "shop-list-tray"} onClick={handleActive}>Shop</span>
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