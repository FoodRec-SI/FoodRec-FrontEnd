import "./LikedRecipesList.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useRef, useEffect } from "react";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useKeycloak } from "@react-keycloak/web";
import { useMutation } from "react-query";
import { CollectionApi } from "../../api/CollectionApi";
import { LikeApi } from "../../api/LikeApi";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const LikedRecipe = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/recipeDetail/' + props.postId);
  };


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

  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();

  const handleDeletePost = async () => {
    const collectionId = props.collectionId;
    const postId = props.postId;
    const response = await CollectionApi.deletePostFromCollection(
      { collectionId, postId },
      keycloak.token
    );
    if (response.status === 200) {
      return response.status;
    }
  };

  const { mutate: deletePostInCollection, status } = useMutation(
    handleDeletePost,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("collection");
      },
    }
  );

  if (status === "error") {
    console.log("error");
  }

  const unlikePost = async () => {
    const response = await LikeApi.unlikePost(
      {
        postId: props.postId,
      },
      keycloak.token
    );
    return response.status;
  };

  const { mutate: unlike } = useMutation(unlikePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("likedRecipes");
    },
  });


  
  return (
    <div className="liked-container" >
      <div className="liked-container-click" onClick={handleClick}>
      <div className="index-container">
        <div className="index">{props.index}</div>
      </div>
      <div className="recipe-container">
        <div className="liked-recipe-thumbnail">
          <img src={props.image} alt="" />
        </div>
        <div className="liked-recipe-detail">
          <div className="liked-recipe-name">{props.name}</div>
          <div className="small-detail">
            <div className="liked-recipe-author">{props.author}</div>
            <div className="separator">&#183;</div>
            <div className="liked-recipe-time">{props.cookingTime} minutes</div>
          </div>
        </div>
        </div>
      </div>
      <div className="action-menu">
        <button
          className="menu-button"
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MoreVertIcon />
        </button>
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
                width: "200px",
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
                    <MenuItem
                      onClick={() => {
                        if (props.collectionId) {
                          deletePostInCollection();
                        } else {
                          unlike();
                        }
                      }}
                    >
                      <ListItemIcon>
                        <DeleteForeverOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      Remove
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <ShareOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      Share
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

const LikedRecipeList = (props) => {
  return (
    <div className="liked-recipe-list-container">
      {props.recipes.map((recipe, index) => (
        <LikedRecipe
          key={index}
          index={index + 1}
          collectionId={props.id}
          postId={recipe.postId}
          name={recipe.recipeName}
          author={recipe.userName}
          cookingTime={recipe.duration}
          image={recipe.image}
        />
      ))}
    </div>
  );
};

export default LikedRecipeList;
