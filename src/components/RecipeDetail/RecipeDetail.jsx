import { Rating, IconButton, Button } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';


import "./RecipeDetail.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PendingRecipeDetail from "../PendingRecipeDetail/PendingRecipeDetail";
import ChipList from "../ChipList/ChipList";
import RatingArea from "../RatingArea/RatingArea";
import RecommendeRcipe from "../RecommendRecipe/RecommendRecipe";
import SkeletonRecipeDetail from "../Skeleton/SkeletonRecipeDetail";
import MyRecipeDetail from "../MyRecipeDetail/MyRecipeDetail";
import AddRecipeForm from "../AddRecipeForm/AddRecipeForm";
import PleaseLogin from "../PleaseLogin/PleaseLogin";

import { useState, useRef, useEffect } from "react";

import { CollectionApi } from "../../api/CollectionApi";
import { PostApi } from "../../api/PostApi";
import { PendingApi } from "../../api/PendingApi";
import { LikeApi } from "../../api/LikeApi";
import { PersonalRecipeApi } from "../../api/PersonalRecipeApi";
import { useQuery, useMutation } from "react-query";
import { useKeycloak } from "@react-keycloak/web";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";

const RecipeDetail = ({ recipeId }) => {

  const { keycloak } = useKeycloak();
  const isLogin = keycloak?.authenticated;

  

  let postId = null;
  const location = useLocation();
  let isPending = false;
  let isMyRecipe = false;
  const url = location.pathname;
  let fetchPostById;

  if (recipeId != null) {
    postId = recipeId;
    isPending = true;
  } else {
    postId = useParams().postId;
    if (url.includes("pendingRecipeDetail")) {
      isPending = true;
    } else if (url.includes("myRecipeDetail")) {
      isMyRecipe = true;
    } else if (url.includes("recipeDetail")) {
      isPending = false;
      isMyRecipe = false;
    }
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
      const response = await PostApi.getPostById(postId);
      if (response.status === 200) {
        return response.data;
      }
    };
  }

  const { data: post, isSuccess: isPostSuccess, status, refetch: refetchRecipeDetail } = useQuery(["post", postId], fetchPostById);

  if(isLogin == false){
    return (
      <>
        <PleaseLogin/>
      </>
    )
  }
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
        {isPending === true && recipeId == null && (
          <PendingRecipeDetail postId={postId} />
        )}

        {post && <div className="recipeDetail">
          <div className="recipeDetail__introduction">
            <div>
              <h1 style={{ fontSize: "40px" }}>{post.recipeName}</h1>
              <h5 style={{ fontWeight: "300", fontSize: "20px" }}>{post.userName}</h5>
            </div>
            <div className="recipeDetail__rating">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Rating
                  name="ratingPoint"
                  defaultValue={post.averageScore}
                  precision={0.1}
                  readOnly
                />
                <p style={{ marginLeft: "10px", textAlign: "center" }}>( {post.averageScore} )</p>
              </div>
              <div className="showTag" style={{ marginTop: "10px" }}>
                {<ChipList tags={post.tagDTOList} />}
              </div>
            </div>
            <div className="recipeDetail__statistic">
              <Statistics props={post.calories} name="Calories" />
              <span className="line"></span>
              <Statistics props={post.duration} name="Minutes" />
              <span className="line"></span>
              {post.ingredientList && <Statistics props={post.ingredientList.split("|").length} name="Ingredients" />}
            </div>
            <Introduction props={post} isMyRecipe={isMyRecipe} recipeId={recipeId} refetchRecipeDetail={refetchRecipeDetail} />
          </div>

          <div className="recipeDetail__image">
            <img src={post.image} alt="" />
          </div>

          <div className="recipeDetail__description">
            <Description props={post} />
          </div>

          <div className="recipeDetail__ingredient">
            <Ingredients props={post.ingredientList} />
          </div>

          <div className="recipeDetail__instruction">
            <Instruction props={post.instructions ? post.instructions : post.instruction } />
          </div>

          {isPending === false && isMyRecipe == false &&
            <div className="recipeDetail__rating">
              <RatingArea isPostSuccess refetchRecipeDetail={refetchRecipeDetail}/>
            </div>
          }
          {isMyRecipe == true && isPending == false && <div className="myRecipeDetail">
            <MyRecipeDetail recipeId={post.recipeId} />
          </div>}

        </div>}
      </div>
      {isPending === false && isMyRecipe == false && <div className="recommendRecipe">
        <RecommendeRcipe tags={post.tagDTOList}/>
      </div>}
    </div>
  );
};

function Statistics({ props, name }) {
  return (
    <div className="statistics">
      <p>{props}</p>
      <p>{name}</p>
    </div>
  );
}

function Introduction({ props, isMyRecipe, recipeId, refetchRecipeDetail }) {
  const { keycloak } = useKeycloak();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
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
    return response.status;
  };



  const { mutate: addToCollection } = useMutation(handleAddToCollection,
    {
      onSuccess: () => {
        refetchRecipeDetail()
      }
    }
  );


  const likePost = async () => {
    const response = await LikeApi.likePost({
      postId: props.postId,
    }, keycloak.token);
    return response.status;
  };

  const { mutate: like } = useMutation(likePost, {
    onSuccess: () => {
      refetchRecipeDetail();
    },
  });

  const unlikePost = async () => {
    const response = await LikeApi.unlikePost({
      postId: props.postId,
    }, keycloak.token);
    return response.status;
  }

  const { mutate: unlike  } = useMutation(unlikePost, {
    onSuccess: () => {
      refetchRecipeDetail();
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

  const shareUrl = window.location.href;



  return (
    <>
      {props && (
        <div className="introduction">
          {recipeId == null && <div className="userFeature">
            <Tooltip title="Add to collection" placement="top">
              <Button
                aria-label="addToCollection"
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                startIcon={<PlaylistAddIcon fontSize="large" />}
                sx={{ color: "black" }}
              >
                Add to collection
              </Button>
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

            {/* <Button variant="outlined" startIcon={<DeleteIcon />}>
              Delete
            </Button> */}
            {
              props.liked ? (
            <Tooltip title={props.liked ? "Liked" : "Add to favorite"} placement="top">
              <Button aria-label="addToFavorite"
                onClick={
                  () => { unlike() } 
                }
                startIcon={ <FavoriteIcon fontSize="large" color="error" /> }
                sx={{ color: "black" }}
              >
                Like
              </Button>
            </Tooltip>) : (
              <Tooltip title={props.liked ? "Liked" : "Add to favorite"} placement="top">
              <Button aria-label="addToFavorite"
                onClick={
                    () => { like() }
                }
                startIcon={<FavoriteBorderIcon fontSize="large" />}
                sx={{ color: "black" }}
              >
                Like
              </Button>
            </Tooltip>)

} 
            <Tooltip title="Facebook" placement="top">
              <FacebookShareButton url={shareUrl} quote={props.recipeName}>
                <FacebookIcon size={30} round={true} />
              </FacebookShareButton>
            </Tooltip>

            <Tooltip title="Twitter" placement="top">
              <TwitterShareButton url={shareUrl} quote={props.recipeName}>
                <TwitterIcon size={30} round={true} />
              </TwitterShareButton> 

            </Tooltip>

            <Tooltip title="Messenger" placement="top">
              <FacebookMessengerShareButton url={shareUrl} appId="521270401588372">
                <FacebookMessengerIcon size={30} round={true} />
              </FacebookMessengerShareButton>

            </Tooltip>


            {/* <Tooltip title="Share recipe" placement="top">
              <IconButton aria-label="shareRecipe">
                <ShareIcon fontSize="large" />
              </IconButton>
            </Tooltip> */}

            {isMyRecipe == true && <Tooltip title="Delete Recipe" placement="top">
              <Button aria-label="delete" color="error"
                onClick={() => { setOpenDeleteDialog(true) }}
                startIcon={<DeleteIcon fontSize="large" />}
              >
                Delete
              </Button>
            </Tooltip>}

            {isMyRecipe == true && <Tooltip title="Edit Recipe" placement="top">
              <Button aria-label="delete" color="primary"
                onClick={() => { setOpenEditDialog(true) }}
                startIcon={<EditIcon fontSize="large" />}
              >
                Edit
              </Button>
            </Tooltip>}
          </div>
          }
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
            }}
          />

          <Dialog header="Edit Recipe" visible={openEditDialog} style={{ width: '90vw' }} onHide={() => setOpenEditDialog(false)}>
            <AddRecipeForm post={props} setOpenEditDialog={setOpenEditDialog} refetchRecipeDetail={refetchRecipeDetail} />
          </Dialog>
        </div>
      )}

    </>
  );
}


function Ingredients({ props }) {
  let listOfIngredients = [];
  if (props != null) {
    listOfIngredients = props.split('|');
  }
  return (
    <div className="ingredients">
      <h1>Ingredients</h1>

      <ul style={{ listStyleType: "none" }}>
        {listOfIngredients.map((ingredient, index) => (
          <li key={index} style={{ padding: "5px" }}>
            
          <span style={{
            display: "inline-flex",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "25px",
            marginRight: "5px",
            backgroundColor: "#f5f5f5",
            border: "1px solid black",
          }}>{index + 1} </span> {ingredient} </li>
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

function Instruction({ props }) {
  let instruction = props;

  return (
    <div className="instruction">
      <h1>Instruction</h1>
      <p>{instruction}</p>
    </div>
  );
}

export default RecipeDetail;
