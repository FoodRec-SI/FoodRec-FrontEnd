import { useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import Banner from "../../components/Banner/Banner";
import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useInfiniteQuery } from "react-query";

const Discover = () => {
  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;

  const fetchRecipes = async ({ pageParam, pageSize }) => {
    const response = await PostApi.getPosts(pageParam, pageSize);
    // console.log(response.data);
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
    "recipes",
    ({ pageParam = 0, pageSize = 6 }) => fetchRecipes({ pageParam, pageSize }),
    {
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.totalElements / 5;
        const nextPage = lastPage.number + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    }
  );

  useEffect(() => {
    const onScroll = (event) => {
      let fetching = false;
      const { scrollTop, clientHeight, scrollHeight } =
        event.target.scrollingElement;

      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        if (hasNextPage) {
          fetchNextPage();
        }
        // console.log("fetching");
        fetching = false;
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [hasNextPage, fetchNextPage]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error fetching recipes</div>;
  }

  // const recipes = data?.pages.flatMap((page) => page);

  // console.log(data);
  // console.log(recipes);

  return (
    <>
      {isLogin ? <LoginBanner /> : <Banner />}
      <div style={{ width: "90%", margin: "0 auto" }}>
        <RecipeCardList
          props={data.pages.flatMap((page) => page.content)}
          pending={""}
        />
      </div>
      {/* {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </button>
      )} */}
    </>
  );
};

export default Discover;
