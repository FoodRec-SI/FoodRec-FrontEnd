import { Routes, Route } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { isModerator, isMember } from "../utills/Helper";


import Discover from "./Discover";
import Meal from "./Meal";
import Liked from "./Liked";
import Collection from "./Collection";
import CollectionDetail from "./CollectionDetail";
import PendingRecipe from "./PendingRecipe";
import RecipeDetail from "../components/RecipeDetail/RecipeDetail";


function AppRoutes() {
  const { keycloak } = useKeycloak();
  const isLogin = keycloak?.authenticated;
  const Login = () => {
    keycloak.login();
  };


 

  const routes = [
    {
      path: "/",
      element: <Discover />,
      title: "Discover",
    },
    {
      path: "/meal",
      element: isLogin && isMember(keycloak) ? <Meal /> : <Login />,
      title: "Meal",
    },
    {
      path: "/liked",
      element: isLogin ? <Liked /> : <Login />,
      title: "Liked",
    },
    {
      path: "/collection",
      element: isLogin ? <Collection /> : <Login />,
      title: "Collection",
    },
    {
      path: "/collection/:id",
      element: isLogin ? <CollectionDetail /> : <Login />,
      title: "Collection Detail",
    },
    {
      path: "*",
      element: <h1>Not Found</h1>,
      title: "Not Found",
    },
    {
      path: "/pendingRecipe",
      element: isModerator(keycloak) ? <PendingRecipe /> : <Login />,
      title: "Pending Recipe",
    },
    {
      path: "/recipeDetail/:recipeID",
      element: <RecipeDetail/>,
      title: "Recipe Detail",
    },
    {
      path: "/PendingRecipeDetail/:recipeID",
      element: isModerator(keycloak) ? <RecipeDetail/> : <Login />,
      title: "Recipe Detail",
    },
  ];

  return (
    <Routes>
      {routes.map(({ element, path, title: title }) => {
        return <Route key={title} element={element} path={`/${path}`} />;
      })}
    </Routes>
  );
}

export default AppRoutes;
