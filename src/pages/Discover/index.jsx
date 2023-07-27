import { useState, useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import SkeletonCardList from "../../components/Skeleton/SkeletonCardList";
import Banner from "../../components/banner/Banner";
import { PostApi } from "../../api/PostApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useInfiniteQuery } from "react-query";
import { handleLogError } from "../../utills/Helper";
import Loading from "../../components/Loading/Loading";

import { ProfileApi } from "../../api/ProfileApi";



const Discover = () => {

  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;
  const [tagId, setTagId] = useState("");


  const { data: profileData, isLoading: loadingProfile, refetch, isSuccess: successLoadProfile, isError: errorLoadProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
      return data.data;
    },
  });

  let handleFetchPosts = null;


  if (successLoadProfile) {
    if (profileData.tagsCollection == null) {
      handleFetchPosts = async () => {
        const response = await PostApi.getPosts(0, 8, "CREATED_TIME", "ACCENDING");
        console.log(response.data);
        return response.data;
      };
    }
    else {
      const tempTagArray = profileData.tagsCollection.map((tag) => tag.tagId);
      const tagIdsString = tempTagArray.join(',');
      handleFetchPosts = async () => {
        const response = await PostApi.getPostsByTags(tagIdsString, 0, 8, keycloak.token);
        console.log(response.data);
        return response.data;
      };
    }
  }

  if (errorLoadProfile) {
    handleFetchPosts = async ({ pageParam, pageSize, sortPost, sortType }) => {
      const response = await PostApi.getPosts(0, 8, "CREATED_TIME", "ACCENDING");
      console.log(response.data);
      return response.data;
    };
  }

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: handleFetchPosts,
  });


  const fetchPostByTag = async (tagId) => {
    const response = await TagApi.getPostByTag(tagId, keycloak.token);
    return response.data.content;
  };

  const shouldFetchData = Boolean(tagId);

  const { data: postsbyTag } = useQuery(
    ["posts", tagId],
    () => fetchPostByTag(tagId),
    {
      enabled: shouldFetchData,
    }
  );


  const handleItemSelection = (item) => {
    setTagId(item.tagId);
  };

  if (loadingPosts) {
    <>
      {isLogin ? <LoginBanner onItemClick={handleItemSelection} /> : <Banner />}
      <div style={{ width: "90%", margin: "0 auto" }}>
        <SkeletonCardList />
      </div>
    </>
  }

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



  return (

    isLogin == true ?
      (
        <>
          <LoginBanner onItemClick={handleItemSelection} />
          <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
          {posts && <RecipeCardList
            props={ postsbyTag ? postsbyTag : posts.content}
            pending={""}
          />}
        </div>
        </>
      )
      :
      ( 
        <>
          <Banner />
          {posts && <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
          <RecipeCardList
            props={posts.content}
            pending={""}
          />
        </div>}
        </>
      )

  )
};

export default Discover;
