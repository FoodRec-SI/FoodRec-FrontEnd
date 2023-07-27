/* eslint-disable react/no-unescaped-entities */
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import { PostApi } from "../../api/PostApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { handleLogError } from "../../utills/Helper";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";




const SearchPage = ({isAddToPlan,renderMeal,setRenderMeal,mealId}) => {
  const { keycloak } = useKeycloak();
  const { searchName } = useParams();
  const [recipeName, setRecipeName] = useState(searchName);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  let AddToPlan = "";

  if(isAddToPlan != null){
      AddToPlan = isAddToPlan;
  }

  const handleResetSearch = (e) => {
    e.preventDefault();
    setRecipeName("");
    navigate(`/search`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const recipeName = e.target.recipeName.value;
    setRecipeName(recipeName);
    navigate(`/search/${recipeName}`);
  };

  const fetchRecipes = async ({ pageParam, pageSize, sortPost, sortType }) => {
    const response = await PostApi.getPosts(
      pageParam,
      pageSize,
      sortPost,
      sortType
    );
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status: postStatus,
  } = useInfiniteQuery(
    "posts",
    ({
      pageParam = 0,
      pageSize = 8,
      sortPost = "CREATED_TIME",
      sortType = "ACCENDING",
    }) => fetchRecipes({ pageParam, pageSize, sortPost, sortType }),
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

  //search

  const fetchSearchRecipes = async ({
    pageNumber,
    pageSize,
    sortPost,
    sortType,
  }) => {
    try {
      const response = await PostApi.getPostsByName(
        recipeName,
        pageNumber,
        pageSize,
        sortPost,
        sortType,
        keycloak.token
      );
      return response.data.content;
    } catch (error) {
      handleLogError(error);
    }
  };

  const {
    data: recipes,
    isLoading,
    refetch,
  } = useQuery(
    ["recipes", recipeName],

    ({
      pageNumber = 0,
      pageSize = 99,
      sortPost = "CREATED_TIME",
      sortType = "ACCENDING",
    }) => fetchSearchRecipes(pageNumber, pageSize, sortPost, sortType),
    {
      enabled: Boolean(recipeName),
    }
  );

  

  const handleSortChange = (sortPost, sortType) => {
    // Fetch data with the new sorting options
    refetch({ sortPost, sortType });
  };

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
        {/* <div className="ant-menu">
          <div className="ant-menu-title">Filter</div>
        </div> */}
        <div className="search-content-recipe">
          {isLoading ? (
            <Loading />
          ) : !recipes && !recipeName ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="search-content-recipe-title">
                  Popular Recipes
                </div>
                <div className="filter" onClick={() => setVisible(true)}>
                  <div>Filter</div>
                  <i className="pi pi-sliders-v"></i>
                </div>
                <Dialog
                  header="Filter"
                  visible={visible}
                  onHide={() => setVisible(false)}
                  style={{ width: "50vw" }}
                  breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                >
                  <div className="sort-buttons">
                    <button
                      onClick={() =>
                        handleSortChange("CREATED_TIME", "ASCENDING")
                      }
                    >
                      Sort by Created Time (Ascending)
                    </button>
                    <button
                      onClick={() =>
                        handleSortChange("CREATED_TIME", "DESCENDING")
                      }
                    >
                      Sort by Created Time (Descending)
                    </button>
                    <button
                      onClick={() =>
                        handleSortChange("AVERAGE_SCORE", "ASCENDING")
                      }
                    >
                      Sort by Average Score (Ascending)
                    </button>
                    <button
                      onClick={() =>
                        handleSortChange("AVERAGE_SCORE", "DESCENDING")
                      }
                    >
                      Sort by Average Score (Descending)
                    </button>
                  </div>
                </Dialog>
              </div>
              <RecipeCardList
                props={
                  !recipes
                    ? data && data.pages.flatMap((page) => page.content)
                    : recipes
                }
                pending={AddToPlan}
                renderMeal={renderMeal} 
                setRenderMeal={setRenderMeal} 
                mealId={mealId}
              />
            </>
          ) : (
            <div className="search-nothing-content">
              <div className="empty-title">
                We don't find anything matching your search.
              </div>
              <div className="empty-content">
                Try another search or reove your filter
              </div>
              <button className="reset-button" onClick={handleResetSearch}>
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
