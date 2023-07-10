import "./AddRecipeForm.css";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import { MultiSelect } from "primereact/multiselect";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { classNames } from "primereact/utils";

const AddRecipeForm = () => {
  // const [recipeName, setRecipeName] = useState("");
  // const [recipeCalories, setRecipeCalories] = useState("");
  // const [recipeDuration, setRecipeDuration] = useState("");

  // const [recipeDescription, setRecipeDescription] = useState("");
  // const [recipeImage, setRecipeImage] = useState(null);
  // const [recipeIngredients, setRecipeIngredients] = useState([]);
  // const [recipeInstructions, setRecipeInstructions] = useState("");
  // const [recipeTags, setRecipeTags] = useState([]);

  const formik = useFormik({
    initialValues: {
      recipeName: "",
      recipeCalories: "",
      recipeDuration: "",
      recipeDescription: "",
      recipeImage: null,
      recipeIngredients: [],
      recipeInstructions: "",
      recipeTags: [],
    },
    validationSchema: Yup.object({
      recipeName: Yup.string().required("Required"),
      recipeCalories: Yup.number().required("Required"),
      recipeDuration: Yup.number().required("Required"),
      recipeDescription: Yup.string().required("Required"),
      recipeImage: Yup.mixed().required("Required"),
      recipeIngredients: Yup.array().required("Required"),
      recipeInstructions: Yup.string().required("Required"),
      recipeTags: Yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const tags = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Appetizer",
    "Snack",
    "Dessert",
    "Baking",
    "Grilling",
    "Roasting",
    "Slow Cooker",
  ];

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  return (
    <div>
      <form className="add-recipe-form" onSubmit={formik.handleSubmit}>
        <div className="form-header">
          <h2 className="">Recipe Detail</h2>
          <div className="form-button">
          <Button
            type=""
            label="Cancel"
            icon="pi pi-times"
            iconPos="right"
            className="p-button-raised p-button-rounded"
            outlined
          />
          <Button
            type="submit"
            label="Submit"
            icon="pi pi-check"
            iconPos="right"
            className="p-button-raised p-button-rounded ml-4"
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
            <InputText
              id="recipe-calories"
              type="text"
              name="recipeCalories"
              value={formik.values.recipeCalories}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("recipeCalories"),
              })}
            />
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
            <InputText
              id="recipe-duration"
              type="text"
              name="recipeDuration"
              value={formik.values.recipeDuration}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("recipeDuration"),
              })}
            />
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
          <label
            htmlFor="recipe-image"
            className={classNames({
              "p-error": isFormFieldValid("recipeImage"),
            })}
          >
            Image
          </label>
          <div className="import-form__Detail__RecipeImage__upload__preview">
            <h2>Upload Your Image</h2>
            <p>
              Uploading a picture to illustrate your recipe SVG, JPG, PNG ,...
              resolustion 1920x1080px
            </p>
            <div className="import-form__Detail__RecipeImage__upload__preview__dragArea">
              {/* <p>Drag and drop your image here</p> */}

              {!formik.values.recipeImage && <ImageIcon fontSize="large" />}
              {!formik.values.recipeImage && <span> Drag and Drop</span>}
              {!formik.values.recipeImage && <span> or</span>}

              {!formik.values.recipeImage && (
                <Button  link>Browes</Button>
              )}
              {!formik.values.recipeImage && <input type="file" hidden />}

              {formik.values.recipeImage && (
                <img src={formik.values.recipeImage} alt="" />
              )}
            </div>
            {formik.values.recipeImage && (
              <div className="import-form__Detail__RecipeImage__upload__preview__dragArea__clearImg">
                <IconButton
                  aria-label="delete"
                  size="large"
                  color="error"
                  onClick={(formik.values.recipeImage = null)}
                >
                  <CancelIcon />
                </IconButton>
              </div>
            )}
          </div>
          {getFormErrorMessage("recipeImage")}
        </div>
        <div className="flex flex-column gap-2 mb-3">
          <label
            htmlFor="recipe-tags"
            className={classNames({
              "p-error": isFormFieldValid("recipeTags"),
            })}
          >
            Tags
          </label>
          <MultiSelect
            id="recipe-tags"
            name="recipeTags"
            value={formik.values.recipeTags}
            options={tags}
            display="chip"
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeTags"),
            })}
          />
          {getFormErrorMessage("recipeTags")}
        </div>

        <div className="flex flex-column gap-2 mb-3">
          <label htmlFor="recipe-ingredients">Ingredients</label>
          <InputTextarea
            id="recipe-ingredients"
            type="text"
            name="recipeIngredients"
            value={formik.values.recipeIngredients}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isFormFieldValid("recipeIngredients"),
            })}
            autoResize
          />
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
