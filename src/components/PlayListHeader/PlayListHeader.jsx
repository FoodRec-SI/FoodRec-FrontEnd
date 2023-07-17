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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMutation } from "react-query";
import { CollectionApi } from "../../api/CollectionApi";
import { useQueryClient } from "react-query";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";

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
    ? `${
        props.recipes.postDTOS && props.recipes.postDTOS.totalElements
      } recipes`
    : `${props.likerecipes && props.likerecipes.length} recipes`;


  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(
    props.recipes ? props.recipes.collectionName : ""
  );
  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };
  const CHARACTER_LIMIT = 20;

  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState(
    props.recipes && props.recipes.description  ? props.recipes.description  : "No description"
  );


  const handleEditDescription = () => {
    setEditDescription(true);
  };

  const handleCancelDescription = () => {
    setEditDescription(false);
  };

  const DESCRIPTION_LIMIT = 100;

  const updateCollectionName = async () => {
    const collectionId = props.id;
    const collectionName = value;
    const response = await CollectionApi.updateCollection(
      { collectionId, collectionName },
      keycloak.token
    );
    setIsEdit(false);
    return response.status;
  };

  const { mutate: updateCollectionNameField } = useMutation(updateCollectionName, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collection", props.id]);
    },
  });

  const updateDescription = async () => {
    const collectionId = props.id;
    const collectionDescription = description;
    const response = await CollectionApi.updateCollection(
      { collectionId, collectionDescription },
      keycloak.token
    );
    setEditDescription(false);
    return response.status;
  };

  const { mutate: updateDescriptionField } = useMutation(updateDescription, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collection", props.id]);
    },
  });


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
              <img src="public/assets/healthyFood.jpg" alt="Healthy Food" />
            )}
          </div>
          <div className="playlist-header-title">
            {props.recipes ? (
              <div className="playlist-title">
                {!isEdit ? (
                  <div className="playlist-name">
                    {props.recipes.collectionName}
                    <IconButton onClick={handleEdit}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </div>
                ) : (
                  <div>
                    <div className="edit-playlist-name">
                      <TextField
                        sx={{
                          width: "97%",
                          fontFamily: 'YouTube Sans", "Roboto", sans-serif',
                        }}
                        className="edit-playlist-name-input"
                        id="standard-name-with-character-limit"
                        variant="standard"
                        type="text"
                        error={value.length === 0}
                        helperText={
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {value.length === 0 ? "Required" : ""}
                            <span style={{ marginLeft: "auto" }}>
                              {`${value.length}/${CHARACTER_LIMIT}`}
                            </span>
                          </span>
                        }
                        characterlimit={CHARACTER_LIMIT}
                        inputProps={{
                          maxLength: CHARACTER_LIMIT,
                        }}
                        defaultValue={value}
                        // value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </div>
                    <div
                      className="edit-playlist-button"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                      </button>
                      <button className="save-button" onClick={updateCollectionNameField}>
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              "Liked Recipe"
            )}
          </div>
          <div className="playlist-detail">
            <div className="playlist-sub-detail">
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
              {props.recipes ? (
                <div className="playlist-description-text">
                  {editDescription ? (
                    <div>
                    <TextField
                      sx={{
                        width: "97%",
                        fontFamily: 'YouTube Sans", "Roboto", sans-serif',
                      }}
                      className="edit-playlist-description-input"
                      id="standard-name-with-character-limit"
                      variant="standard"
                      type="text"
                      error={ description.length === 0}
                      helperText={
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {description.length === 0  ? "Required" : ""}
                          <span style={{ marginLeft: "auto" }}>
                            {`${description && description.length === null ? description.length = 0 : description.length  }/${DESCRIPTION_LIMIT}`}
                          </span>
                        </span>
                      }
                      characterlimit={DESCRIPTION_LIMIT}
                      inputProps={{
                        maxLength: DESCRIPTION_LIMIT,
                      }}
                      defaultValue={description}
                      // value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <div
                      className="edit-playlist-button"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button className="cancel-button" onClick={handleCancelDescription}>
                        Cancel
                      </button>
                      <button className="save-button" onClick={updateDescriptionField}>
                        Save
                      </button>
                    </div>
                    </div>
                  ) : (
                    <div className="playlist-des">
                      {props.recipes.description || "No description"}
                      <IconButton onClick={handleEditDescription}>
                        <EditOutlinedIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayListHeader;
