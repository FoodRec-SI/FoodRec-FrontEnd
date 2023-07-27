import "./PlanDetail.css";
import { useState, useRef, useEffect } from "react";
import { Menu as PrimeMenu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { PlanApi } from "../../api/PlanApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { IconButton } from "@mui/material";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../components/Loading/Loading";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { handleLogError } from "../../utills/Helper";
import SearchPage from "../SearchPage";

import { Toast } from 'primereact/toast';
const PlanDetail = () => {
  const { mealId } = useParams();
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [renderMeal, setRenderMeal] = useState([]);
  const [shopVisible, setShopVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // const [addNewRecipe, setAddNewRecipe] = useState(false);



  const menu1 = useRef(null);
  const toast = useRef(null);
  const formik = useFormik({
    initialValues: {
      mealName: "",
      maxCalories: "",
      tagIds: [],
    },
    validationSchema: Yup.object({
      mealName: Yup.string().required("Required"),
      maxCalories: Yup.number()
        .positive("Please enter a positive number")
        .required("Required")
        .typeError("Please enter a positive number"),
      tagIds: Yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      createNewPlan(values);
      setVisible(false);
      formik.resetForm();
    },
  });

  const generateIngredientList = async () => {
    const response = await PlanApi.generateIngredientList(
      mealId,
      keycloak.token
    );
        return response.data; };

  const {
    data: ingredients,
    refetch,
    isFetching,
  } = useQuery("ingredientList", generateIngredientList, {
    enabled: false,
  });

  const handleGeneratedIngredientList = () => {
    setShopVisible(true);
    refetch();
  };

  const planItems = [
    {
      label: "Save plan",
      icon: "pi pi-save",
      command: () => setSaved(true),
    },
    {
      label: "Generate new meal",
      icon: "pi pi-sync",
      command: () => setVisible(true),
    },
    {
      label: "Generate shopping list",
      icon: "pi pi-shopping-bag",
      command: () => handleGeneratedIngredientList(),
    },
  ];

  const fetchPlanDetail = async () => {
    const response = await PlanApi.getPlanDetail(mealId, keycloak.token);
    return response.data;
  };
  const { data, isLoading, isError } = useQuery("planDetail", fetchPlanDetail);

  const [meal, setMeal] = useState([]);

  useEffect(() => {
    if (data && data.mealSet) {
      setMeal(data);
      setRenderMeal(generatedMeal(data.mealSet));
    } else {
      setMeal({ mealSet: [] });
    }
  }, [data]);

  

  const createMeal = async (data) => {
    // try {
    const response = await PlanApi.createMeal(data, keycloak.token);
    setMeal([...(!meal.mealSet ? meal : meal.mealSet), response.data]);
    setRenderMeal(
      generatedMeal([...(!meal.mealSet ? meal : meal.mealSet), response.data])
    );
    return response.data;
    // }
    // catch(error){
    //   toast.current.show({ severity: 'error', summary: 'Error', detail: 'Your Meal Calories not suitable ', life: 3000 });
    //   handleLogError(error);
    // }
  };

  const { mutate: createNewPlan } = useMutation(createMeal);

  const { data: recipeTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const data = await TagApi.getTags(keycloak.token);
      return data;
    },
  });

  const updatePlan = async (data) => {
    const response = await PlanApi.updatePlan(data, keycloak.token);
    return response.data;
  };

  const { mutate: updatePlanDetail } = useMutation(updatePlan, {
    onSuccess: () => {
      queryClient.invalidateQueries("planDetail");
    },
  });

  const handleUpdatePlan = () => {
    const updatedData = {
      planId: mealId,
      mealPerPlanList: renderMeal.map((item) => ({
        mealId: item.mealId,
        mealName: item.mealName,
        currentCalories: item.currentCalories,
        postList: item.postDTOList.map((post) => ({
          postId: post.postId,
        })),
      })),
    };
    updatePlanDetail(updatedData);
    setSaved(false);
  };

  const handleDialogHide = () => {
    formik.resetForm(); // Reset formik state
    setVisible(false); // Hide the dialog
  };

  const generatedMeal = (meal) => {
    if (!Array.isArray(meal) || meal.length === 0) {
      return [];
    }
    meal &&
      meal.map((item) => {
        item.postDTOList &&
          item.postDTOList.map((post, index) => {
            post.id = item.mealId + post.postId + index;
          });
      });
    return meal;
  };


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
      const newMeal = [...renderMeal];
      const [removed] = newMeal.splice(source.index, 1);
      newMeal.splice(destination.index, 0, removed);
      setMeal(newMeal);
      return;
    }


    const mealSourceIndex = renderMeal.findIndex(
      (item) => item.mealId === source.droppableId
    );
    const mealDestinationIndex = renderMeal.findIndex(
      (item) => item.mealId === destination.droppableId
    );
    const newSourceFoods = [...renderMeal[mealSourceIndex].postDTOList];
    const newDestinationFoods =
      source.droppableId !== destination.droppableId
        ? [...renderMeal[mealDestinationIndex].postDTOList]
        : newSourceFoods;

    const [removed] = newSourceFoods.splice(source.index, 1);
    newDestinationFoods.splice(destination.index, 0, removed);

    const newMealList = [...renderMeal];

    newMealList[mealSourceIndex] = {
      ...renderMeal[mealSourceIndex],
      postDTOList: newSourceFoods,
    };

    newMealList[mealDestinationIndex] = {
      ...renderMeal[mealDestinationIndex],
      postDTOList: newDestinationFoods,
    };

    setRenderMeal(newMealList);
  };

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }
  const deletePost = (mealId, postId) => {
    setRenderMeal((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.mealId === mealId) {
          meal.postDTOList = meal.postDTOList.filter(
            (post) => post.postId !== postId
          );
        }
        return meal;
      })
    );
  };

  const RecipeCard = ({ props, mealId }) => {
    const handleDeletePost = () => {
      deletePost(mealId, props.postId);
    };
    return (
      <div className="plan-detail-recipe-card">
        <div className="plan-detail-card">
          <div className="plan-detail-card-image">
            <div
              style={{
                background: `url(${props.image})`,
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
            <div className="food-name">{props.recipeName}</div>
            <span className="food-serve">1 serving</span>
          </div>
          <div className="plan-detail-card-button">
            <IconButton onClick={handleDeletePost}>
              <RemoveCircleOutlineRoundedIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  };

  const MealCard = ({ props }) => {

    const [open, setOpen] = useState(false);  
    const anchorRef = useRef(null);
    const [changeName, setChangeName] = useState(false);
    const [addNewRecipe, setAddNewRecipe] = useState(false);

    const [tempName, setTempName] = useState("");
    const [isErrorTempName, setIsErrorTempName] = useState(false);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    function handleListKeyDown(event) {
      if (event.key === "Tab") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }

      prevOpen.current = open;
    }, [open]);
    

    const deleteMeal = (mealId) => {
      setRenderMeal((prevMeals) =>{
       const testMeal = prevMeals.filter((meal) => meal.mealId !== mealId)
        return testMeal;
    });
      // Remove the deleted meal from the `meal` state as well.
      setMeal([...(!meal.mealSet ? meal : meal.mealSet)].filter((meal) => meal.mealId !== mealId))

    };
    const totalCalories = props.postDTOList&&props.postDTOList.reduce(
      (total, item) => total + item.calories,
      0
    );

    const handleChangeMealName = (mealId) => {
      if (tempName === "") {
        setIsErrorTempName(true);
      } else {
        setRenderMeal((prevMeals) =>
          prevMeals.map((meal) => {
            if (meal.mealId === mealId) {
              meal.mealName = tempName;
            }
            return meal;
          })
        );
        setChangeName(false);
      }
    };

    return (
      <div className="plan-detail-meal-card">
        <div className="meal-card-header">
          <div className="meal-card-header-title">
            <h3>{props.mealName}</h3>
            <span>{totalCalories} Calories</span>
          </div>
          <div
            className="meal-card-header-button"
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <IconButton>
              <MoreHorizOutlinedIcon />
            </IconButton>
          </div>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="top-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem onClick={() => { 
                        setChangeName(true) 
                        setTempName(props.mealName)
                        }}>
                          <ListItemIcon>
                        <DriveFileRenameOutlineIcon fontSize="small" />
                      </ListItemIcon>
                        Change meal name
                      </MenuItem>
                      <MenuItem onClick={() => setAddNewRecipe(true)}>
                      <ListItemIcon>
                        <ControlPointDuplicateIcon fontSize="small" />
                      </ListItemIcon>
                        Add new recipe
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          deleteMeal(props.mealId);
                           
                        }}
                      >
                        <ListItemIcon>
                        <DeleteForeverOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                        Delete this meal
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <Droppable droppableId={props.mealId}>
          {(provided) => (
            <div
              className="meal-card-body"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {props.postDTOList&&props.postDTOList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <RecipeCard
                        key={item.postId}
                        props={item}
                        mealId={props.mealId}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Dialog
          header="Change your meal name"
          visible={changeName}
          onHide={() => setChangeName(false)}
          style={{ width: "50vw" }}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        >
          <div className="flex flex-column gap-2 mb-3">
            <label htmlFor="mealName" style={isErrorTempName ? { color: "red" } : null}>Meal name</label>
            <InputText
              id="mealName"
              name="mealName"
              type="text"
              className="p-inputtext-sm p-d-block"
              onChange={(e) => { setTempName(e.target.value) }}
              value={tempName}
            />
            {isErrorTempName && <p style={{ color: "red" }}>Required*</p>}
          </div>
          <button
            className="add-plan-submit"
            onClick = {handleChangeMealName}
          >
            Submit
          </button>
        </Dialog>

        <Dialog
            header="Add new recipe"
            visible={addNewRecipe}
            onHide={() => setAddNewRecipe(false)}
            style={{ width: "80vw" }}
          >
            <SearchPage isAddToPlan ={"AddToPlan"} renderMeal={renderMeal} setRenderMeal={setRenderMeal} mealId={props.mealId}/>
          </Dialog>

      </div>
    );
  };

  const totalCaloriesInPlan = renderMeal.reduce(
    (totalCalories, meal) =>
      totalCalories +
      meal.postDTOList&&meal.postDTOList.reduce((total, post) => total + post.calories, 0),
    0
  );

  return (
    <div className="plan-detail">
      <Toast ref={toast} />
      <div className="plan-detail-container">
        <div className="plan-detail-header">
          {/* <span
          // className={active ? "active" : "plan-tray"}
          >
            Plan
          </span>
          <span
          // className={active ? "active" : "shop-list-tray"}
          >
            Shop
          </span> */} 

          <Dialog
            header="Shopping List"
            visible={shopVisible}
            style={{ width: "50vw" }}
            onHide={() => setShopVisible(false)}
          >
            {isFetching ? (
              <Loading />
            ) : (
              ingredients &&
              ingredients?.map((item) => (
                <div key={item}>
                  {item}
                </div>
              ))
            )}
          </Dialog>
          <Dialog
            visible={saved}
            style={{ width: "30vw" }}
            onHide={() => setSaved(false)}
          >
            <div className="confirm-delete">
              <div className="check-again">Save your plan?</div>
              <div className="check-again-text">This plan will be updated</div>
              <div className="check-button">
                <button
                  className="cancel-confirm"
                  onClick={() => setSaved(false)}
                >
                  CANCEL
                </button>
                <button
                  className="delete-confirm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdatePlan();
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="plan-detail-body">
          <div className="plan-detail-name-total-calories">
            <div className="plan-detail-name-wrapper">
              <div className="plan-detail-name">{data && data?.planName}</div>
              <div
                className="plan-detail-plan-button"
                onClick={(event) => menu1.current.toggle(event)}
              >
                <PrimeMenu model={planItems} popup ref={menu1} />
                <IconButton>
                  <MoreHorizOutlinedIcon />
                </IconButton>
              </div>
              <Dialog
                header="Create new meal"
                visible={visible}
                onHide={handleDialogHide}
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "75vw", "641px": "100vw" }}
              >
                <form className="m-0">
                  <div className="p-fluid p-formgrid p-grid">
                    <div className="flex flex-column gap-2 mb-3">
                      <label htmlFor="mealName">Meal name</label>
                      <InputText
                        id="mealName"
                        name="mealName"
                        type="text"
                        className="p-inputtext-sm p-d-block"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mealName}
                      />
                      {formik.touched.mealName && formik.errors.mealName ? (
                        <small className="p-error">
                          {formik.errors.mealName}
                        </small>
                      ) : null}
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                      <label htmlFor="maxCalories">Max calories</label>
                      <InputText
                        id="maxCalories"
                        name="maxCalories"
                        type="text"
                        className="p-inputtext-sm p-d-block"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.maxCalories}
                      />
                      {formik.touched.maxCalories &&
                        formik.errors.maxCalories ? (
                        <small className="p-error">
                          {formik.errors.maxCalories}
                        </small>
                      ) : null}
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                      <label htmlFor="tagIds">Tags</label>
                      <MultiSelect
                        id="tagIds"
                        name="tagIds"
                        className="p-inputtext-sm p-d-block"
                        options={recipeTags?.data?.map((tag) => ({
                          value: tag.tagId,
                          label: tag.tagName,
                        }))}
                        display="chip"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tagIds}
                      />
                      {formik.touched.tagIds && formik.errors.tagIds ? (
                        <small className="p-error">
                          {formik.errors.tagIds}
                        </small>
                      ) : null}
                    </div>
                    <button
                      className="add-plan-submit"
                      type="submit"
                      onClick={formik.handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog>
            </div>

            <div className="plan-deatil-calories">
              <span className="calo">
                Total Calories : {totalCaloriesInPlan}
              </span>
            </div>
          </div>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <div>Error fetching data...</div>
          ) : (
            <>
              <DragDropContext onDragEnd={handleDragDrop}>
                <div className="plan-detail-meal-list">
                  {renderMeal.length === 0 ? (
                    <p>No meal</p>
                  ) : (
                    renderMeal.map((item) => (
                      <MealCard key={item.mealId} props={item}/>
                    ))
                  )}
                </div>
              </DragDropContext>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
