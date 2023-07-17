import "./AddRecipeForm.css";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import { MultiSelect } from "primereact/multiselect";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";

import * as Yup from "yup";
import { classNames } from "primereact/utils";

import Loading from "../Loading/Loading";
import { TagApi } from "../../api/TagApi";
import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from "react-router-dom";

const AddRecipeForm = () => {
  const [previewImg, setPreviewImg] = useState(null);
  const [fileImage, setFileImage] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isTagError, setIsTagError] = useState(null);
  const [tag, setTag] = useState([]);

  const [ingredients, setIngredients] = useState([]);

  const { keycloak } = useKeycloak();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      recipeName: "",
      recipeCalories: "",
      recipeDuration: "",
      recipeDescription: "",
      recipeIngredients: ingredients,
      recipeInstructions: "",
    },
    validationSchema: Yup.object({
      recipeName: Yup.string().required("Required"),
      recipeCalories: Yup.number().positive("Please enter a positive number").required("Required").typeError("Please enter a positive number"),
      recipeDuration: Yup.number().positive("Please enter a positive number").required("Required").typeError("Please enter a positive number"),
      recipeDescription: Yup.string().required("Required"),
      recipeIngredients: Yup.array().required("Required"),
      recipeInstructions: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (fileImage == null) {
        setIsError("Required");
        return;
      }
      if (tag.length === 0) {
        setIsTagError("Required");
        return;
      }
      
      createRecipe();
    },
  });



  const { data: recipeTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const data = await TagApi.getTags(keycloak.token);
      return data;
    },
  });

  const tagNames = recipeTags?.data?.map((tag) => tag.tagName);



  const getMatchingTagIds = (tagName, tagObjects) => {
    const matchingTagIds = [];
    for (let i = 0; i < tagObjects.length; i++) {
      const tagObject = tagObjects[i];
      if (tagName.includes(tagObject.tagName)) {
        matchingTagIds.push(tagObject.tagId);
      }
    }
    return matchingTagIds;
  }

  const handleCreateRecipe = async () => {
    const data = new FormData();
    data.append("recipeName", formik.values.recipeName);
    data.append("description", formik.values.recipeDescription);
    data.append("calories", formik.values.recipeCalories);
    data.append("duration", formik.values.recipeDuration);
    data.append("instructions", formik.values.recipeInstructions);
    data.append("ingredientList", formik.values.recipeIngredients.join(","));
    data.append("tagsIdSet", getMatchingTagIds(tag, recipeTags.data));
    data.append("image", fileImage);
    try {
      const response = await PostApi.createRecipe(data, keycloak.token);
      if (response.status === 200) {
        console.log(response);
        navigate(`/myRecipeDetail/${response.data}`);

      }
    } catch (error) {

    }
  }

  const { mutate: createRecipe, isLoading: creatingNewRecipe } = useMutation(handleCreateRecipe,)

  if(creatingNewRecipe){
    return <Loading/>
  }


  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  const handleBrowseOnClick = () => {
    document.querySelector('input[type="file"]').click();
  }

  const handleInputFileChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    handleDropImage(file);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    handleDropImage(file);
  };

  const handleDropImage = (file) => {

    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (validExtensions.includes(file.type)) {
      let fileReader = new FileReader();
      fileReader.onloadend = () => {
        let fileURL = fileReader.result;
        setPreviewImg(fileURL);
      };
      setIsError(null);
      setFileImage(file);
      fileReader.readAsDataURL(file);
    } else {
      setIsError("Invalid file type");
    }
  }


  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };


  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
    formik.setFieldValue('recipeIngredients', updatedIngredients);
  };


  return (
    <div>
      <form className="add-recipe-form" onSubmit={formik.handleSubmit}>
        <div className="form-header">
          <h2 className="">Recipe Detail</h2>
          <div className="form-button">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              iconPos="right"
              className="p-button-raised p-button-rounded m-2"
              outlined
              onClick={() => { navigate("/profile") }}
            />
            <Button
              type="submit"
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              className="p-button-raised p-button-rounded m-2"
            />
          </div>
        </div>
        <div className="flex flex-column gap-2 mb-3">
          <label
            htmlFor="recipe-name"
            className={classNames({
              "p-error": isFormFieldValid("recipeName"),
            })}
          >
            Recipe Name
          </label>
          <InputText
            type="text"
            id="recipe-name"
            aria-describedby="recipe-name-help"
            name="recipeName"
            value={formik.values.recipeName}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeName"),
            })}
          />
          {getFormErrorMessage("recipeName")}
        </div>
        <div className="flex justify-between gap-4 mb-3">
          <div className="flex flex-column gap-2">
            <label
              htmlFor="recipe-calories"
              className={classNames({
                "p-error": isFormFieldValid("recipeCalories"),
              })}
            >
              Calories
            </label>
            <span className="p-input-icon-right">
              <i style={{ fontStyle: "normal", textAlign: "center" }}> kcal</i>
              <InputText
                type="text"
                name="recipeCalories"
                value={formik.values.recipeCalories}
                onChange={formik.handleChange}
                size={16}
                className={classNames({
                  "p-invalid": isFormFieldValid("recipeCalories")
                  ,
                })}
              />
            </span>

            {getFormErrorMessage("recipeCalories")}
          </div>
          <div className="flex flex-column gap-2 ">
            <label
              htmlFor="recipe-duration"
              className={classNames({
                "p-error": isFormFieldValid("recipeDuration"),
              })}
            >
              Duration
            </label>
            <span className="p-input-icon-right">
              <i style={{ fontStyle: "normal", textAlign: "center" }}> min</i>
              <InputText
                id="recipe-duration"
                type="text"
                name="recipeDuration"
                value={formik.values.recipeDuration}
                onChange={formik.handleChange}
                size={15}
                className={classNames({
                  "p-invalid": isFormFieldValid("recipeDuration"),
                })}
              />
            </span>
            {getFormErrorMessage("recipeDuration")}
          </div>
        </div>
        <div className="flex flex-column gap-2 mb-3">
          <label
            htmlFor="recipe-description"
            className={classNames({
              "p-error": isFormFieldValid("recipeDescription"),
            })}
          >
            Description
          </label>
          <InputText
            id="recipe-description"
            type="text"
            name="recipeDescription"
            value={formik.values.recipeDescription}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeDescription"),
            })}
          />
          {getFormErrorMessage("recipeDescription")}
        </div>
        <div className="flex flex-column gap-2 mb-3">
          <p style={isError !== null ? { color: "red" } : {}}>Image</p>
          <div className="import-form__Detail__RecipeImage__upload__preview" >
            <h2>Upload Your Image</h2>
            <p style={{ padding: "10px", textAlign: "center", color: "rgb(45, 45, 45)" }}>
              Uploading a picture to illustrate your recipe SVG, JPG, PNG ,...
              resolustion 1920x1080 px
            </p>
            <div className="import-form__Detail__RecipeImage__upload__preview__dragArea" onDragOver={handleDragOver} onDrop={handleDrop}>

              {!previewImg && <ImageIcon fontSize="large" />}
              {!previewImg && <span> Drag and Drop</span>}
              {!previewImg && <span> or</span>}

              {!previewImg && (
                <Button type="button" onClick={handleBrowseOnClick
                }>Browes</Button>
              )}
              <input className="inputFile" hidden type="file" onChange={handleInputFileChange} />
              {previewImg && <img src={previewImg} alt="" />}
            </div>
            {previewImg && (
              <div className="import-form__Detail__RecipeImage__upload__preview__dragArea__clearImg">
                <Button icon="pi pi-times" rounded outlined severity="danger" aria-label="Cancel"
                  onClick={() => { setPreviewImg(null), setFileImage(null), setIsError(null) }} />
              </div>
            )}
          </div>
          {isError && <p style={{ fontSize: "small", color: "red" }}>{isError}</p>}
        </div>
        <div className="flex flex-column gap-2 mb-3">
          <p style={isTagError !== null ? { color: "red" } : {}}>Tag</p>
          <MultiSelect
            id="recipe-tags"
            name="recipeTags"
            value={tag}
            options={tagNames}
            display="chip"
            onChange={(e) => { setTag(e.value), setIsTagError(null) }}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeTags"),
            })}
          />
          {isTagError && <p style={{ fontSize: "small", color: "red" }}>{isTagError}</p>}
        </div>




        <div className="flex flex-column gap-2 mb-3">
          <label htmlFor="recipe-ingredients">Ingredients</label>
          <div style={{alignSelf: "center", width:"70%"}}>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item" style={{ padding: "10px 0px", boxSizing:"border-box", display:"flex",justifyContent:"space-between"}}>
                <InputText
                  className={classNames({
                    "p-invalid": isFormFieldValid("recipeIngredients"),
                  })}
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  style={{ width: "82%" }}
                  placeholder="Ingredient"
                  required
                />
                <Button
                  icon="pi pi-trash"
                  type="button"
                  className="p-button-danger ml-2"
                  style={{ width: "15%" }}
                  onClick={() => {
                    const updatedIngredients = [...ingredients];
                    updatedIngredients.splice(index, 1);
                    setIngredients(updatedIngredients);
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              label="Add Ingredient"
              icon="pi pi-plus"
              onClick={addIngredient}
              style={{ width: "100%" }}
            />
          </div>
          {getFormErrorMessage("recipeIngredients")}
        </div>
        <div className="flex flex-column gap-2">
          <label htmlFor="recipe-instructions">Instructions</label>
          <InputTextarea
            id="recipe-instructions"
            type="text"
            name="recipeInstructions"
            value={formik.values.recipeInstructions}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeInstructions"),
            })}
            autoResize
          />
          {getFormErrorMessage("recipeInstructions")}
        </div>
      </form>
    </div>
  );
};


export default AddRecipeForm;
