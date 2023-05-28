import RecipeCart from "../../components/recippecart/RecipeCart";

const Discover = () => {
  let recipeList = {
    image: "src/assets/tagliatelle-pasta-with-tomatoes-chicken-removebg-preview.png",
    recipeName: "Bánh mì",
    description: "Bánh mì Việt Namc qwe qweqweqweqweqweqweqweqweqweq qwetqwrf qwetger wetwrgegh twertgw ",
    cookingTime: "1.5 hours",
    ratingPoint: "5",
  }
  return ( 
    <>
      <h1>Discover</h1>
      ---------------------------------
      <RecipeCart 
      image={recipeList.image} 
      recipeName={recipeList.recipeName} 
      description={recipeList.description} 
      cookingTime={recipeList.cookingTime} 
      ratingPoint={recipeList.ratingPoint}>
        </RecipeCart>
    </>
   );
}
 
export default Discover;