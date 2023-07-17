import './MealPlan.css'
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { useState } from "react";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const MealPlan = () => {
 
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentDate(subWeeks(currentDate, 1));
    }
    if (btnType === "next") {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const renderHeader = () => {
    const firstDayOfWeek = startOfWeek(currentDate);
    const lastDayOfWeek = endOfWeek(currentDate);
    const formattedFirstDay = format(firstDayOfWeek, "MMM-dd");
    const formattedLastDay = format(lastDayOfWeek, "MMM-dd");
    
    return (
      <div className="meal-plan-header">
        <div className='title-container'>
        <div className="header-text">My Meal Plan</div> 
        <div className="header-subtext"></div> 
        </div>
        <div className='header-dateview'>
        <div className="navi">
          <button className="navi-left-right" onClick={() => changeWeekHandle("prev")}>
             <ChevronLeftIcon />
          </button>
        </div>
        <div className="dateview">
          <span>
            {formattedFirstDay} - {formattedLastDay}   
          </span>
        </div>
        <div className="navi">
          <button className="navi-left-right" onClick={() => changeWeekHandle("next")}>
            <ChevronRightIcon />
          </button>
        </div>
        </div>
      </div>
    );
  };

  const handleDateClick = (day) => {
    console.log(day);
  };

  const renderCells = () => {
    const cells = [];
    const startDate = startOfWeek(currentDate);
  
    // Render cells for Monday to Sunday
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const isCurrentDate = isSameDay(currentDate, new Date());
  
      cells.push(
        <div
          className={`cell ${isCurrentDate ? "current-day" : ""}`}
          key={i}
          onClick={() => handleDateClick(currentDate)}
        >
          <WeekListCard day={currentDate} />
        </div>
      );
    }
  
    const cellsPerRow = Math.ceil(cells.length / 2); // Calculate the number of cells per row
  
    // Check if the number of cells is odd
    if (cells.length % 2 !== 0) {
      cells.push(<div className="cell empty-cell" key={cells.length}></div>);
    }
  
    const renderedRows = [];
    let rowIndex = 0;
  
    // Split cells into two rows
    while (cells.length > 0) {
      const rowCells = cells.splice(0, cellsPerRow);
      renderedRows.push(
        <div className="weeklist-row" key={rowIndex}>
          {rowCells}
        </div>
      );
      rowIndex++;
    }
  
    return (
      <div>
        <div className="calendar">{renderedRows}</div>
      </div>
    );
  };
  
  const WeekListCard = ({ day }) => {
    return (
      <div className="weeklist-card">
        <div className="weeklist-card-header">
          <div className="weeklist-card-header-title">
            <h3>{format(day, "EEEE")}</h3>
          </div>
          <button className='add-meal-button'>+ ADD</button>
        </div>
        <div className="weeklist-card-body">
          <WeekListCardPlan />
        </div>
      </div>
    );
  };

  const WeekListCardPlan= () =>{
     
    return (
      <div className="weeklist-plan-card">
        <a className='weeklist-plan-card-container' href="">
          <div className='meal-plan-card-cover'>
           <img className='delete-plan-image' src="public/assets/du12fuc9b8u__7_13_2023..png" alt="" /> 
          <img className='plan-image' src="public/assets/healthyFood.jpg" alt="" />
          </div>
          <div className="meal-plan-card-body">
            <h3>Plan Name</h3>
           </div>  
        </a>
      </div>
    );
  }
  
    

    

  return (
    <div className="meal-plan">
      {renderHeader()}
      {renderCells()}
    </div>
  );
};

export default MealPlan;
