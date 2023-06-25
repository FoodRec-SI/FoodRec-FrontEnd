import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";

import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useInfiniteQuery } from "react-query";

const Discover = () => {
  const { keycloak } = useKeycloak();

  const fetchRecipes = async ({ pageParam = 0
  , pageSize = 30
  }) => {
    const response = await PostApi.getPosts(pageParam, pageSize);
    return response.data.content;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("recipes", fetchRecipes, {
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const recipes = data?.pages.flatMap((page) => page);
  console.log(recipes)

  return (
    <>
      <LoginBanner />
      <RecipeCardList props={recipes} pending={''} />
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </button>
      )}
    </>
  );
};

export default Discover;