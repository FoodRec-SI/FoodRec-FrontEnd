

import  Discover from "./Discover";
import  Meal from "./Meal";
import  Liked from "./Liked";
import  Collection from "./Collection";




export default  [
  {
    path: "/",
    element: <Discover name="Discover Recipe"/>,
    title: "Discover",
    
  },
  {
    path: "/meal",
    element: <Meal name="Meal Planner"/>,
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
  
];

