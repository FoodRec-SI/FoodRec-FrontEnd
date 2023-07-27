import { useState, useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import SkeletonCardList from "../../components/Skeleton/SkeletonCardList";
import Banner from "../../components/banner/Banner";
import { PostApi } from "../../api/PostApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useInfiniteQuery } from "react-query";

import { ProfileApi } from "../../api/ProfileApi";



const Discover = () => {

  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;
  const [tagId, setTagId] = useState("");

  if (isLogin) {

    const fetchRecipes = async ({ pageParam, pageSize, sortPost, sortType }) => {
      const response = await PostApi.getPosts(pageParam, pageSize, sortPost, sortType);
      // console.log(response.data);
      return response.data;
    };

    const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
      "posts",
      ({ pageParam = 0, pageSize = 8, sortPost = "CREATED_TIME", sortType = "ACCENDING" }) => fetchRecipes({ pageParam, pageSize, sortPost, sortType }),
      {
        getNextPageParam: (lastPage) => {
          const maxPages = lastPage.totalElements / 5;
          const nextPage = lastPage.number + 1;
          return nextPage <= maxPages ? nextPage : undefined;
        },
      }
    );

    const handleItemSelection = (item) => {
      console.log(item);
      setTagId(item.tagId);
    };

    const fetchPostByTag = async (tagId) => {
      const response = await TagApi.getPostByTag(tagId, keycloak.token);
      return response.data;
    };

    const shouldFetchData = Boolean(tagId);

    const { data: posts } = useQuery(
      ["posts", tagId],
      () => fetchPostByTag(tagId),
      {
        enabled: shouldFetchData,
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
      return (
        <>
          {isLogin ? (
            <LoginBanner onItemClick={handleItemSelection} />
          ) : (
            <Banner />
          )}
          <div style={{ width: "90%", margin: "0 auto" }}>
            <SkeletonCardList />
          </div>
        </>
      );
    }

    if (status === "error") {
      return <div>Error fetching recipes</div>;
    }

    return (
      <>
        {isLogin ? <LoginBanner onItemClick={handleItemSelection} /> : <Banner />}
        <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
          <RecipeCardList
            props={posts && posts.content ? posts.content : data.pages.flatMap((page) => page.content)}
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
  } else {
    const { data: profileData, isLoading: loadingProfile, refetch } = useQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
        return data;
      },

    });

    return (
      <>
        <h1>not login</h1>
      </>
    )
  }
};

export default Discover;
