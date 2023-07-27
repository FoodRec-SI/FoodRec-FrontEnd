import "./MealPlan.css";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
  formatISO,
} from "date-fns";
import { useState } from "react";
import Loading from "../Loading/Loading";
import { Dialog } from "primereact/dialog";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PlanApi } from "../../api/PlanApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import * as Yup from "yup";

const MealPlan = () => {
  const { keycloak } = useKeycloak();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const formik = useFormik({
    initialValues: {
      planName: "",
      planDescription: "",
      day: "",
    },
    validationSchema: Yup.object({
      planName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      planDescription: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Plan Name:", values.planName);
      console.log("Plan Description:", values.planDescription);
      console.log("Day:", values.day);

      createNewPlan(values);
      console.log(values);
      setVisible(false);
      formik.resetForm();
    },
  });

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

  const { data: planList, isLoading } = useQuery(
    ["planList", firstDayOfWeek, lastDayOfWeek],
    fetchPlanList
  );

  const createPlan = async (data) => {
    console.log(data);
    // const newPlanDate = formatISO(planDate, { representation: "date" });
    // console.log(newPlanDate);
    const response = await PlanApi.createPlan(data, keycloak.token);
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

  // const handleDateClick = (day) => {
  //   console.log(day);
  // };

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
          // onClick={() => handleDateClick(currentDate)}
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
          <button
            className="add-meal-button"
            // onClick={(e) =>{
            //   e.preventDefault();
            //   handleAddPlan(day)}}
            onClick={() => {
              setVisible(true);
              formik.setFieldValue(
                "day",
                formatISO(day, { representation: "date" })
              );
            }}
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

  const handleDeletePlan = async (planId) => {
    deleteExistedPlan(planId);
    console.log(planId);
    setVisibleDelete(false);
  };

  const WeekListCardPlan = ({ day }) => {

    

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
                // onClick={(e) => {
                //   e.preventDefault();
                //   handleDeletePlan(plan.planId);
                // }}
                onClick={(e) => {
                  e.preventDefault();
                  setDeletePlanId(plan.planId);
                  setVisibleDelete(true);
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

  return (
    <div className="meal-plan">
      {renderHeader()}
      {!isLoading ? renderCells() : <Loading />}
      <Dialog
        header="Create new plan"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <form className="m-0" onSubmit={formik.handleSubmit}>
          <div className="flex flex-column gap-2 mb-3">
            <label htmlFor="mealName">Plan name</label>
            <InputText
              id="planName"
              name="planName"
              type="text"
              className="p-inputtext-sm p-d-block"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.planName}
            />
            {formik.touched.planName && formik.errors.planName ? (
              <small className="p-error">{formik.errors.planName}</small>
            ) : null}
          </div>
          <div className="flex flex-column gap-2 mb-3">
            <label htmlFor="mealName">Plan Description</label>
            <InputText
              id="planDescription"
              name="planDescription"
              type="text"
              className="p-inputtext-sm p-d-block"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.planDescription}
            />
            {formik.touched.planDescription && formik.errors.planDescription ? (
              <small className="p-error">{formik.errors.planDescription}</small>
            ) : null}
          </div>
          <button
            className="add-plan-submit"
            type="submit"
            onClick={formik.handleSubmit}
          >
            Submit
          </button>
        </form>
      </Dialog>
      <Dialog
        visible={visibleDelete}
        onHide={() => setVisibleDelete(false)}
        style={{ width: "30vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <div className="confirm-delete">
        <div className="check-again">Are you sure?</div>
        <div className="check-again-text">This plan will be removed from meal planner</div>
        <div className="check-button">
          <button className="cancel-confirm" onClick={
            () => setVisibleDelete(false)
          }>CANCEL</button>
          <button className="delete-confirm"
          onClick={(e) => {
            e.preventDefault();
            handleDeletePlan(deletePlanId);
            
          }}
          >DELETE</button>
        </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MealPlan;
