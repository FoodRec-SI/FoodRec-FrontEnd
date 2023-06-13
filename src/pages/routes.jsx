

import  Discover from "./Discover";
import  Meal from "./Meal";
import  Liked from "./Liked";
import  Collection from "./Collection";
import CollectionDetail from "./CollectionDetail";
import PendingRecipe from "./PendingRecipe";
import RecipeDetail from "../components/RecipeDetail/RecipeDetail";
import ImportForm from "../components/ImportForm/ImportForm";



export default  [
  {
    path: "/",
    element: <Discover />,
    title: "Discover",
    
  },
  {
    path: "/meal",
    element: <Meal />,
    title: "Meal",
  },
  {
    path: "/liked",
    element: <Liked  />,
    title: "Liked",
  },
  {
    path: "/collection",
    element: <Collection  />,
    title: "Collection",
    
  },
  {
    path: "/collection/:id",
    element: <CollectionDetail  />,
    title: "Collection Detail",
  }, 
  {
    path: "/pendingRecipe",
    element: <PendingRecipe/>,
    title: "Pending Recipe",
  } ,
  {
    path: "/recipeDetail/:recipeID",
    element: <RecipeDetail/>,
    title: "Recipe Detail",
  },
  {
    path: "/PendingRecipeDetail/:recipeID",
    element: <RecipeDetail/>,
    title: "Recipe Detail",
  },
  {
    path: "/AddRecipe",
    element: <ImportForm/>,
    title: "Add Recipe",
  },
  {
    path: "*",
    element: <h1>Not Found</h1>,
    title: "Not Found",
  },


];

