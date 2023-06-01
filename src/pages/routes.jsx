

import  Discover from "./Discover";
import  Meal from "./Meal";
import  Liked from "./Liked";
import  Collection from "./Collection";




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
    path: "*",
    element: <Discover />,
    title: "Discover",
  }
  
];

