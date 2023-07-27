import { Routes, Route, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { isModerator } from "../utills/Helper";


import Discover from "./Discover";
import Meal from "./Meal";
import Liked from "./Liked";
import Collection from "./Collection";
import CollectionDetail from "./CollectionDetail";
import PendingRecipe from "./PendingRecipe";
import RecipeDetail from "../components/RecipeDetail/RecipeDetail";
import SearchPage from "./SearchPage";
import ImportForm from "../components/ImportForm/ImportForm";
import AddRecipeForm from "../components/AddRecipeForm/AddRecipeForm";
import Profile from "../components/profile/Profile";
import PlanDetail from "./PlanDetail/PlanDetail";
import HistoryTable from "../components/HistoryTable/HistoryTable";
import TopTier from "./TopTier";


function AppRoutes() {
  const { keycloak } = useKeycloak();
  const isLogin = keycloak?.authenticated;
  const navigate = useNavigate();
  const Login = () => {
    navigate('/')
    setTimeout(() => {
    keycloak.login();
  }, 1000 * 0.5);
  };

  const routes = [
    {
      path: "/",
      element: <Discover />,
      title: "Discover",
    },
    {
      path: "/top-list",
      element: <TopTier />,
      title: "Top List",
    },
    {
      path: "/meal",
      element: isLogin  ? <Meal /> : <Login />,
      title: "Meal",
    },
    {
      path: "/meal/:mealId",
      element: isLogin  ? <PlanDetail /> : <Login />,
      title: "Plan Detail",
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
      path: "/recipeDetail/:postId",
      element: <RecipeDetail/>,
      title: "Recipe Detail",
    },
    {
      path: "/myRecipeDetail/:recipeId",
      element: isLogin ? <RecipeDetail/> : <Login />,
      title: "Recipe Detail",
    },
    {
      path: "/search/:searchName",
      element: isLogin ? <SearchPage /> : <Login />,
      title: "SearchPage",
    },
    {
      path: "/search",
      element: isLogin ? <SearchPage /> : <Login />,
      title: "SearchPage",
    },
    {
      path: "*",
      element: <h1>Not Found</h1>,
      title: "Not Found",
    },
    {
      path: "/addRecipe",
      element: isLogin ? <AddRecipeForm/> : <Login />,
      title: "Add Recipe",
    },
    {
      path: "/importRecipe",
      element: isLogin ? <ImportForm/> : <Login />,
      title: "Import Recipe",
    },
    {
      path: "/profile",
      element: isLogin ? <Profile /> : <Login />,
      title: "Profile",
    },
  ];

  const moderatorRoutes = [
    {
      path: "/PendingRecipe",
      element: isLogin ? <PendingRecipe /> : <Login />,
      title: "Pending Recipe",
    },
    {
      path: "/",
      element: null,
      title: "",
    },
    {
      path: "/PendingRecipeDetail/:postId",
      element: isLogin ? <RecipeDetail/> : <Login />,
      title: "Recipe Detail",
    },
    {
      path: "/History",
      element: isLogin ? <HistoryTable/> : <Login />,
      title: "History",
    },
  ];

  if (isModerator(keycloak)) {
    routes.splice(0, routes.length, ...moderatorRoutes);
  }

  return (
    <Routes>
      {routes.map(({ element, path, title: title }) => {
        return <Route key={title} element={element} path={`/${path}`} />;
      })}
    </Routes>
  );
}


export default AppRoutes;
