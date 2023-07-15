import { Rating, IconButton } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from '@mui/icons-material/Delete';

import { ConfirmDialog } from 'primereact/confirmdialog';

import "./RecipeDetail.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PendingRecipeDetail from "../PendingRecipeDetail/PendingRecipeDetail";
import ChipList from "../ChipList/ChipList";
import RatingArea from "../RatingArea/RatingArea";
import RecommendeRcipe from "../RecommendRecipe/RecommendRecipe";
import SkeletonRecipeDetail from "../Skeleton/SkeletonRecipeDetail";
import MyRecipeDetail from "../MyRecipeDetail/MyRecipeDetail";

import { CollectionApi } from "../../api/CollectionApi";

import { useState, useRef, useEffect } from "react";

import { PostApi } from "../../api/PostApi";
import { PendingApi } from "../../api/PendingApi";
import { LikeApi } from "../../api/LikeApi";
import { PersonalRecipeApi } from "../../api/PersonalRecipeApi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useKeycloak } from "@react-keycloak/web";

const RecipeDetail = () => {

  const { keycloak } = useKeycloak();
  const { postId } = useParams();
  const location = useLocation();
  let isPending = false;
  let isMyRecipe = false;
  const url = location.pathname;
  let fetchPostById;


  if (url.includes("pendingRecipeDetail")) {
    isPending = true;
  } else if (url.includes("myRecipeDetail")) {
    isMyRecipe = true;
  } else if (url.includes("recipeDetail")) {
    isPending = false;
    isMyRecipe = false;
  }

  if (isPending === true) {
    fetchPostById = async () => {
      const response = await PendingApi.getPendingRecipeDetail(postId, keycloak.token);
      if (response.status === 200) {
        return response.data;
      }
    };
  } else if (isMyRecipe === true) {
    const { recipeId } = useParams();
    fetchPostById = async () => {
      const response = await PersonalRecipeApi.getPersonalRecipeByRecipeID(keycloak.token, recipeId);
      if (response.status === 200) {
        return response.data;
      }
    };
  } else {
    fetchPostById = async () => {
      const response = await PostApi.getPostById(postId, keycloak.token);
      if (response.status === 200) {
        return response.data;
      }
    };
  }

  const { data: post, isSuccess: isPostSuccess, status } = useQuery(["post", postId], fetchPostById);

  if (status === "loading") {
    return (
      <>
        <SkeletonRecipeDetail />
      </>
    )
  }

  return (
    isPostSuccess &&
    <div className="recipeDetail__wrapper">
      <div className="recipeDetailContainer">
        {isPending === true && (
          <PendingRecipeDetail postId={postId} />
        )}
        {post && <div className="recipeDetail">
          <img src={post.image} alt="" />

          <Introduction props={post} isPostSuccess isMyRecipe={isMyRecipe} />
          <Ingredients isPostSuccess />
          <Description props={post} isPostSuccess />
          <Instruction isPostSuccess />
          {isPending === false && isMyRecipe == false &&
            <div className="recipeDetail__rating">
              <RatingArea isPostSuccess />
            </div>
          }
          {isMyRecipe == true && isPending == false && <div className="myRecipeDetail">
            <MyRecipeDetail recipeId={post.recipeId} />
          </div>}
        </div>}
      </div>
      {isPending === false && isMyRecipe == false && <div className="recommendRecipe">
        <RecommendeRcipe />
      </div>}
    </div>

  );
};

function Introduction({ props, isMyRecipe }) {


  const { keycloak } = useKeycloak();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current.contains(event)) {
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

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);


  const fetchCollections = async ({ pageParam = 0, pageSize = 30 }) => {
    const response = await CollectionApi.getCollection(
      pageParam,
      pageSize,
      keycloak.token
    );
    return response.data.content;
  };

  const { data: items } = useQuery("collections", fetchCollections);


  const handleAddToCollection = async (collectionId) => {

    const response = await CollectionApi.addPostToCollection(
      {
        collectionId: collectionId,
        postId: props.postId,
      },
      keycloak.token)
    console.log(response);
  };



  const { mutate: addToCollection } = useMutation(handleAddToCollection);


  const likePost = async () => {
    const response = await LikeApi.likePost({
      postId: props.postId,
    }, keycloak.token);
    return response.status;
  };

  const { mutate: like } = useMutation(likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("likedRecipes");
    },
  });

  const deletePost = async () => {
    const response = await PersonalRecipeApi.deletePersonalRecipe(keycloak.token, props.recipeId);
    if (response.status === 200) {
      navigate("/profile")
    }
    return response.status;
  };

  const { mutate: deleteRecipe } = useMutation(deletePost);


  return (
    <>
      {props && (
        <div className="introduction">
          <h1>{props.recipeName}</h1>
          <p>Author</p>
          <Rating
            name="ratingPoint"
            defaultValue={props.averageScore}
            precision={0.1}
            readOnly
          />
          <div className="showTag">
            {<ChipList tags={props.tagDTOList} />}
          </div>
          <div className="userFeature">
            {/* button x 3*/}
            <Tooltip title="Add to collection" placement="top">
              <IconButton
                aria-label="addToCollection"
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <PlaylistAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
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
                        {items.map((item) => (
                          <MenuItem
                            key={item.collectionId}
                            onClick={() => {
                              addToCollection(item.collectionId);
                              handleClose();
                            }
                            }
                          >
                            {item.collectionName}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Tooltip title="Add to favorite" placement="top">
              <IconButton aria-label="addToFavorite"
                onClick={like}
              >
                <FavoriteBorderIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share recipe" placement="top">
              <IconButton aria-label="shareRecipe">
                <ShareIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            {isMyRecipe == true && <Tooltip title="Delete Recipe" placement="top">
              <IconButton aria-label="delete" color="error"
                onClick={() => { setOpenDeleteDialog(true) }}
              >
                <DeleteIcon fontSize="large" />
              </IconButton>
            </Tooltip>}

          </div>
          <div className="recipeStatistic">
            <Statistic amount={9} nameOfStatisic="ingredients" />
            <Statistic amount={props.duration} nameOfStatisic="minutes" />
            <Statistic amount={props.calories} nameOfStatisic="calories" />
          </div>
          <ConfirmDialog
            visible={openDeleteDialog}
            onHide={() => setOpenDeleteDialog(false)}
            message="Are you sure you want to delete this recipe?"
            header="Delete Recipe"
            icon="pi pi-exclamation-triangle"
            acceptClassName="p-button-danger"
            accept={() => {
              deleteRecipe();
              setOpenDeleteDialog(false);
            }}
            reject={() => {
              setOpenDeleteDialog(false);
              console.log("cancel");
            }}
          />
        </div>
      )}

    </>
  );
}

function Statistic({ amount, nameOfStatisic }) {
  return (
    <div className="statistic">
      <div className="amount">
        <h2>{amount}</h2>
      </div>
      <p>{nameOfStatisic}</p>
    </div>
  );
}

function Ingredients() {
  let listOfIngredients = [
    "1/2 cup butter, softened",
    "1½ cup Basmati rice",

    "100 grams bell peppers (cut in long strips)",

    "150 grams cabbage (finely chopped)",

    "50 grams French beans (finely chopped)",

    "6 tbsp. salad oil",

    "1/2 tsp. aginomotto",

    "1/2 tbsp. chili sauce",

    "1-tbsp. white vinegar",

    "3 tbsp. Sugar",

    "salt",
  ];

  return (
    <div className="ingredients">
      <h1>Ingredients</h1>
      <ul>
        {listOfIngredients.map((ingredient) => (
          <li key={ingredient}> {ingredient} </li>
        ))}
      </ul>
    </div>
  );
}

function Description({ props }) {
  return (
    <div className="description">
      <h1>Description</h1>
      {props && <p>{props.description}</p>}
    </div>
  );
}

function Instruction() {
  let instruction =
    "Wash and soak rice in cold water. After 2 hour boiled water, add salt and rice. Cook the rice. Spread the rice in a plate.Put all chopped vegetables in a cold water for 2 hours. In a pot, heat oil and add squeezed beans, and aginomotto. Cover with a lid and cook for 10 minutes on a low heat. Mix squeezed beans and bell pepper. Stir for 10 minutes. Add salt and mix.Take 3 tbsp. oil in a frying pan. Heat the oil and add sugar. Don 1/2t stir the sugar. Heat until the oil turns brown.Mix rice, vinegar, chili sauce, Soya sauce. Mix all vegetables, and spread chopped spring.Serve with spring in an oval plate.It can be served with curry, chutney or soy sauce.";

  return (
    <div className="instruction">
      <h1>Instruction</h1>
      <p>{instruction}</p>
    </div>
  );
}

export default RecipeDetail;
