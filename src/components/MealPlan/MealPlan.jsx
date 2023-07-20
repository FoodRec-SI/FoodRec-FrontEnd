import "./MealPlan.css";
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
  formatISO,
} from "date-fns";
import { useEffect, useState } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PlanApi } from "../../api/PlanApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const MealPlan = () => {
  const { keycloak } = useKeycloak();
  const [currentDate, setCurrentDate] = useState(new Date());
  

  
  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentDate(subWeeks(currentDate, 1));
    }
    if (btnType === "next") {
      setCurrentDate(addWeeks(currentDate, 1));
    }

  };


  const queryClient = useQueryClient();

  const firstDayOfWeek = startOfWeek(currentDate);
  const lastDayOfWeek = endOfWeek(currentDate);
  const formattedFirstDay = format(firstDayOfWeek, "MMM-dd");
  const formattedLastDay = format(lastDayOfWeek, "MMM-dd");



  const fetchPlanList = async () => {
    console.log(firstDayOfWeek);
    console.log(lastDayOfWeek);
    const response = await PlanApi.getPlan(
      firstDayOfWeek,
      lastDayOfWeek,
      keycloak.token
    );
    return response.data;
  };

  const { data: planList, status } = useQuery(["planList",firstDayOfWeek,lastDayOfWeek], fetchPlanList);
 

  const planName = "test";
  const planDescription = "test";

  const createPlan = async (planDate) => {
    const newPlanDate = formatISO(planDate, { representation: "date" });
    console.log(newPlanDate);
    const response = await PlanApi.createPlan(
      { planName, planDescription, planDate: newPlanDate },
      keycloak.token
    );
    console.log(planDate);
    return response.data;
  };

  const { mutate: createNewPlan } = useMutation(createPlan, {
    onSuccess: () => {
      queryClient.invalidateQueries("planList");
    },
  });

  const deletePlan = async (planId) => {
    const response = await PlanApi.deletePlan(planId, keycloak.token);
    console.log(planId);
    return response.data;
  };

  const { mutate: deleteExistedPlan } = useMutation(deletePlan, {
    onSuccess: () => {
      queryClient.invalidateQueries("planList");
    },
  });

  

  const renderHeader = () => {
    return (
      <div className="meal-plan-header">
        <div className="title-container">
          <div className="header-text">My Meal Plan</div>
          <div className="header-subtext"></div>
        </div>
        <div className="header-dateview">
          <div className="navi">
            <button
              className="navi-left-right"
              onClick={() => changeWeekHandle("prev")}
            >
              <ChevronLeftIcon />
            </button>
          </div>
          <div className="dateview">
            <span>
              {formattedFirstDay} - {formattedLastDay}
            </span>
          </div>
          <div className="navi">
            <button
              className="navi-left-right"
              onClick={() => changeWeekHandle("next")}
            >
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
    const handleAddPlan = async (day) => {
      createNewPlan(day);
    };

    return (
      <div className="weeklist-card">
        <div className="weeklist-card-header">
          <div className="weeklist-card-header-title">
            <h3>{format(day, "EEEE")}</h3>
          </div>
          <button
            className="add-meal-button"
            onClick={() => handleAddPlan(day)}
          >
            + ADD
          </button>
        </div>
        <div className="weeklist-card-body">
          <WeekListCardPlan day={day} />
        </div>
      </div>
    );
  };

  const WeekListCardPlan = ({ day }) => {
    const handleDeletePlan = async (planId) => {
      deleteExistedPlan(planId);
      console.log(planId);
    };

    const plansForDay = planList?.filter((plan) =>
      isSameDay(day, new Date(plan.date))
    );

    if (!plansForDay) {
      return null; // or you can render a loading state or an error message
    }

    return (
      <div className="weeklist-plan-card">
        {plansForDay.map((plan) => (
          <Link
            className="weeklist-plan-card-container"
            to={`/meal/${plan.planId}`}
            key={plan.planId}
          >
            <div className="meal-plan-card-cover">
              <img
                className="delete-plan-image"
                src="/assets/du12fuc9b8u__7_13_2023..png"
                alt=""
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePlan(plan.planId);
                }}
              />
              <img
                className="plan-image"
                src="/assets/healthyFood.jpg"
                alt=""
              />
            </div>
            <div className="meal-plan-card-body">
              <h3>{plan.planName}</h3>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="meal-plan">
      {renderHeader()}
      {renderCells()}
    </div>
  );
};

export default MealPlan;
