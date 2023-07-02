import "./PlayListHeader.css";
import { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useMutation } from "react-query";
import { CollectionApi } from "../../api/CollectionApi";
import { useQueryClient } from "react-query";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const PlayListHeader = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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
  const navigate = useNavigate();

  const handleDeleteCollection = async () => {
    const collectionId = props.id;
    const response = await CollectionApi.deleteCollection(
      { collectionId },
      keycloak.token
    );
    return response.status;
  };

  const { mutate: deleteCollection } = useMutation(handleDeleteCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries("collections");
      navigate("/collection");
    },
  });

  const subtitle = props.recipes
    ? `${props.recipes.postDTOS && props.recipes.postDTOS.totalElements} recipes`
    : `${props.likerecipes && props.likerecipes.length} recipes`;

  console.log(props);

  return (
    <div className="playlist-header">
      <div className="playlist-wrapper">
        <div className="playlist-not-scroll">
          <div className="playlist-header-image">
            
                {props.recipes && props.recipes.image ? (
                  <img src={props.recipes.image} alt="Recipe" />
                ) : props.likerecipes && props.likerecipes.length ? (
                  <img src={props.likerecipes[0].image} alt="Liked Recipe" />
                ) : (
                  <img src="/src/assets/healthyFood.jpg" alt="Healthy Food" />
                )
              }
             
          </div>
          <div className="playlist-header-title">
            {props.recipes ?
            <div className="playlist-title">
              {props.recipes.collectionName}
              <input />
              </div> 
            : "Liked Recipe"}
          </div>
          <div className="playlist-detail">
            <div className="playlist-sub-detail">
              <div className="playlist-owner">User...</div>
              <div className="playlist-header-subtitle">
                {/* {props.recipes ? props.recipes.postDTOS.totalElements + " recipes" : props.likerecipes.length + " recipes"} */}
                {subtitle}
              </div>
            </div>
            <div>
              <button
                className={`playlist-menu-button ${
                  props.likerecipes ? "hidden" : ""
                }`}
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
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
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
                          <MenuItem onClick={deleteCollection}>
                            <ListItemIcon>
                              <DeleteForeverOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            Delete Collection
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
            <div className="playlist-description">
              {props.recipes ? "hahaha" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayListHeader;
