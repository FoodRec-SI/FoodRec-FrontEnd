import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";

const SearchPage = () => {
  const { keycloak } = useKeycloak();
  const [recipeName, setRecipeName] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const recipeName = e.target.recipeName.value;
    setRecipeName(recipeName);
  };

  const fetchRecipes = async ({ pageParam, pageSize }) => {
    const response = await PostApi.getPosts(pageParam, pageSize);
    // console.log(response.data);
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status: postStatus,
  } = useInfiniteQuery(
    "posts",
    ({ pageParam = 0, pageSize = 8 }) => fetchRecipes({ pageParam, pageSize }),
    {
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.totalElements / 5;
        const nextPage = lastPage.number + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    }
  );

  console.log(data);

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
  // useEffect(() => {
  //   PostApi.getPostsByName(recipeName, keycloak.token).then((response) => {
  //     setRecipes(response.data.content);
  //   });
  // }, [recipeName]);

  const fetchSearchRecipes = async () => {
    const response = await PostApi.getPostsByName(recipeName, keycloak.token);
    return response.data.content;
  };

  const { status: searchStatus, data: recipes } = useQuery(
    ["recipes", recipeName],
    fetchSearchRecipes,
    {
      enabled: Boolean(recipeName),
    }
  );

  if (searchStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (searchStatus === "error") {
    return <div>No Recipes Found</div>;
  }

  if (postStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (postStatus === "error") {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="search-page">
      <div className="search-bar-container">
        <div className="search-bar">
          <span id="search-icon" className="pi pi-search"></span>
          <form className="search-bar-form" onSubmit={handleSearch}>
            <input
              className="in-search-bar"
              type="text"
              placeholder="  What are you craving today ?"
              name="recipeName"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="search-content">
        <div className="ant-menu">
          <div className="ant-menu-title">Filter</div>
          <div className="ant-menu-item">
            <div className="ant-menu-item-filter">Sort by Rating</div>
            <div className="ant-menu-item-filter">Sort by Upload Date</div>
          </div>
        </div>
        <div className="search-content-recipe">
          <div className="search-content-recipe-title">Popular Recipes</div>
          <RecipeCardList
            props={
              !recipes
                ? data && data.pages.flatMap((page) => page.content)
                : recipes
            }
            pending=""
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
