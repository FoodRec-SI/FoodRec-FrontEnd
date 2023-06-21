import { Rating, IconButton } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";

import "./RecipeDetail.css";
import { useParams, useLocation } from "react-router-dom";
import PendingRecipeDetail from "../PendingRecipeDetail/PendingRecipeDetail";
import ChipList from "../ChipList/ChipList";
import RatingArea from "../RatingArea/RatingArea";

import { PostApi } from "../../api/PostApi";
import { useQuery } from "react-query";
import { useKeycloak } from "@react-keycloak/web";

const RecipeDetail = () => {
  let imageFood = "/src/assets/healthyFood.jpg";

  const { keycloak } = useKeycloak();
  const { postId } = useParams();

  const fetchPostById = async () => {
    const response = await PostApi.getPostById(postId, keycloak.token);
    if (response.status === 200) {
      return response.data;
    }
  };

  const { data: post, status } = useQuery(["post", postId], fetchPostById);

  if (status === "success") {
    console.log(post);
  }

  if (status === "error") {
    console.log("error");
  }

  console.log(post);

  const location = useLocation();
  const pending = location.state;

  // const dialogRef = useRef(null);

  // const navigate = useNavigate();

  // const [recipe, setRecipe] = useState({ pending: fasle });

  const isPending = pending === "pending" ? true : false;

  return (
    <>
      <div className="recipeDetailContainer">
        {isPending === true && (
          // <DialogPending ref={dialogRef} navigate={navigate} />
          <PendingRecipeDetail />
        )}
        <div className="recipeDetail">
          <img src={imageFood} alt="" />
          <Introduction ratingPoint={5} props={post} />
          <Ingredients />
          <Description />
          <Instruction />
          <div className="recipeDetail__rating">
            <RatingArea />
          </div>
        </div>
      </div>
    </>
  );
};

function Introduction({ props, ratingPoint }) {
  return (
    <>
      {props && (
        <div className="introduction">
          <h1>{props.recipeName}</h1>
          <p>Author</p>
          {ratingPoint && (
            <Rating
              name="ratingPoint"
              defaultValue={ratingPoint}
              precision={0.1}
              readOnly
            />
          )}
          <div className="showTag">
            <ChipList />
          </div>
          <div className="userFeature">
            {/* button x 3*/}
            <Tooltip title="Add to collection" placement="top">
              <IconButton aria-label="addToCollection">
                <PlaylistAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add to favorite" placement="top">
              <IconButton aria-label="addToFavorite">
                <FavoriteBorderIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share recipe" placement="top">
              <IconButton aria-label="shareRecipe">
                <ShareIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="recipeStatistic">
            <Statistic amount={9} nameOfStatisic="ingredients" />
            <Statistic amount={30} nameOfStatisic="minutes" />
            <Statistic amount={250} nameOfStatisic="calories" />
          </div>
        </div>
      )}
    </>
  );
}

function Statistic({ amount, nameOfStatisic }) {
  return (
    <div className="statistic">
      <div className="amount">
        <h2>{amount}</h2>
      </div>
      <p>{nameOfStatisic}</p>
    </div>
  );
}

function Ingredients() {
  let listOfIngredients = [
    "1/2 cup butter, softened",
    "1½ cup Basmati rice",

    "100 grams bell peppers (cut in long strips)",

    "150 grams cabbage (finely chopped)",

    "50 grams French beans (finely chopped)",

    "6 tbsp. salad oil",

    "1/2 tsp. aginomotto",

    "1/2 tbsp. chili sauce",

    "1-tbsp. white vinegar",

    "3 tbsp. Sugar",

    "salt",
  ];

  return (
    <div className="ingredients">
      <h1>Ingredients</h1>
      <ul>
        {listOfIngredients.map((ingredient, index) => (
          <li key={ingredient}> {ingredient} </li>
        ))}
      </ul>
    </div>
  );
}

function Description() {
  let description =
    "Ive rented a car in Las Vegas and have reserved a hotel in Twentynine Palms which is just north of Joshua Tree. Well drive from Las Vegas through Mojave National Preserve and possibly do a short hike on our way down. Then spend all day on Monday at Joshua Tree. We can decide the next morning if we want to do more in Joshua Tree or Mojave before we head back.";

  return (
    <div className="description">
      <h1>Description</h1>
      <p>{description}</p>
    </div>
  );
}

function Instruction() {
  let instruction =
    "Wash and soak rice in cold water. After 2 hour boiled water, add salt and rice. Cook the rice. Spread the rice in a plate.Put all chopped vegetables in a cold water for 2 hours. In a pot, heat oil and add squeezed beans, and aginomotto. Cover with a lid and cook for 10 minutes on a low heat. Mix squeezed beans and bell pepper. Stir for 10 minutes. Add salt and mix.Take 3 tbsp. oil in a frying pan. Heat the oil and add sugar. Don 1/2t stir the sugar. Heat until the oil turns brown.Mix rice, vinegar, chili sauce, Soya sauce. Mix all vegetables, and spread chopped spring.Serve with spring in an oval plate.It can be served with curry, chutney or soy sauce.";

  return (
    <div className="instruction">
      <h1>Instruction</h1>
      <p>{instruction}</p>
    </div>
  );
}

export default RecipeDetail;
