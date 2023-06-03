

import  Discover from "./Discover";
import  Meal from "./Meal";
import  Liked from "./Liked";
import  Collection from "./Collection";
import CollectionDetail from "./CollectionDetail";




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
    path: "*",
    element: <h1>Not Found</h1>,
    title: "Not Found",
  }
];

