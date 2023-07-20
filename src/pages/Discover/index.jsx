import { useState, useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import SkeletonCardList from "../../components/Skeleton/SkeletonCardList";
import Banner from "../../components/Banner/Banner";
import { PostApi } from "../../api/PostApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useInfiniteQuery } from "react-query";

import Nothing from "../../components/Nothing/Nothing";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

import Carousel from 'react-multi-carousel';


const Arrows = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        backgroundColor: "black",
        borderRadius: "50%",
        padding: "0",
        margin: "0",
        border: "none",
      }}
      onClick={onClick}
    >

    </div>
  );
};

const Discover = () => {

  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;
  const [tagId, setTagId] = useState("");

  const fetchRecipes = async ({ pageParam, pageSize }) => {
    const response = await PostApi.getPosts(pageParam, pageSize);
    console.log(response.data);
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
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

  // useEffect(() => {
  //   const onScroll = (event) => {
  //     let fetching = false;
  //     const { scrollTop, clientHeight, scrollHeight } =
  //       event.target.scrollingElement;

  //     if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
  //       fetching = true;
  //       if (hasNextPage) {
  //         fetchNextPage();
  //       }
  //       // console.log("fetching");
  //       fetching = false;
  //     }
  //   };

  //   document.addEventListener("scroll", onScroll);
  //   return () => {
  //     document.removeEventListener("scroll", onScroll);
  //   };
  // }, [hasNextPage, fetchNextPage]);

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
    return (
      <>
        {isLogin ? <LoginBanner onItemClick={handleItemSelection} /> : <Banner />}
        <Nothing />
      </>
    )
  }
  return (
    <>
      {isLogin ? <LoginBanner onItemClick={handleItemSelection} /> : <Banner />}


    </>
  );
};

export default Discover;
