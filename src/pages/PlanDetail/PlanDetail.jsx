import "./PlanDetail.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PlanApi } from "../../api/PlanApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { IconButton } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const PlanDetail = () => {

  const {mealId} = useParams();
  const {keycloak}= useKeycloak();

  const fetchPlanDetail = () =>{
    const response = PlanApi.getPlanDetail(mealId,keycloak.token)
    console.log(response);
    return response;
  }

  const {data,status} = useQuery("planDetail",fetchPlanDetail)

  console.log(data)



  const DATA = [
    {
      id: "1",
      name: "meal 1",
      recipes: [
        {
          id: "1",
          name: "name 1",
          image: "url(/assets/healthyFood.jpg)",
        },
        {
          id: "2",
          name: "name 2",
          image: "url(/assets/healthyFood.jpg)",
        },
        {
          id: "4",
          name: "name 4",
          image: "url(/assets/healthyFood.jpg)",
        },
      ],
    },
    {
      id: "2",
      name: "meal 2",
      recipes: [
        {
          id: "3",
          name: "name 3",
          image: "url(/assets/healthyFood.jpg)",
        },
      ],
    },
    {
      id: "3",
      name: "meal 3",
      recipes: [],
    },
  ];

  const [meal, setMeal] = useState(DATA);

  console.log(meal);


  const handleDragDrop = (result) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "group") {
      const newMeal = [...meal];
      const [removed] = newMeal.splice(source.index, 1);
      newMeal.splice(destination.index, 0, removed);
      setMeal(newMeal);
      return;
    }

    console.log({source, destination});

    const mealSourceIndex = meal.findIndex( (item) => item.id === source.droppableId);
    const mealDestinationIndex = meal.findIndex( (item) => item.id === destination.droppableId);
    const newSourceFoods = [...meal[mealSourceIndex].recipes];
    const newDestinationFoods = source.droppableId !== destination.droppableId ?  [...meal[mealDestinationIndex].recipes] : newSourceFoods;

    const [removed] = newSourceFoods.splice(source.index, 1);
    newDestinationFoods.splice(destination.index, 0, removed);
    
    const newMealList = [...meal];

    newMealList[mealSourceIndex] = {
      ...meal[mealSourceIndex],
      recipes: newSourceFoods
    }

    newMealList[mealDestinationIndex] = {
      ...meal[mealDestinationIndex],
      recipes: newDestinationFoods
    }

    setMeal(newMealList);
  };



  const RecipeCard = ({ props }) => {
    return (
      <div className="plan-detail-recipe-card">
        <div className="plan-detail-card">
          <div className="plan-detail-card-image">
            <div
              style={{
                background: "url(/assets/healthyFood.jpg)",
                backgroundSize: "auto 50px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </div>
          <div className="plan-detail-card-title">
            <div className="food-name">{props.name}</div>
            <span className="food-serve">1 serving</span>
          </div>
          <div className="plan-detail-card-button">
            <IconButton>
              <MoreHorizOutlinedIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  };

  const MealCard = ({ props }) => {

    console.log(props);
 
    return (
      <div className="plan-detail-meal-card" >
        <div className="meal-card-header">
          <div className="meal-card-header-title">
            <h3>{props.name}</h3>
            <span>Calories</span>
          </div>
        </div>
        <Droppable droppableId={props.id} >
          {(provided) => (
            <div className="meal-card-body" {...provided.droppableProps} ref={provided.innerRef}>
              {   props.recipes.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <RecipeCard key={item.id} props={item} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>       
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="plan-detail">
      <div className="plan-detail-container">
        <div className="plan-detail-header">
          <span
          // className={active ? "active" : "plan-tray"}
          >
            Plan
          </span>
          <span
          // className={active ? "active" : "shop-list-tray"}
          >
            Shop
          </span>
        </div>
        <div className="plan-detail-body">
          <div className="plan-detail-name-total-calories">
            <div className="plan-detail-name">Plan Name</div>
            <div className="plan-deatil-calories">
              <span className="calo">Total Calories</span>
            </div>
          </div>
          <DragDropContext onDragEnd={handleDragDrop}>
            <div className="plan-detail-meal-list">
              {meal.map((item) => (
                <MealCard key={item.id} props={item} />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
