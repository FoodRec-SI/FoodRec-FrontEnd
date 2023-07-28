import { useState, useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import SkeletonCardList from "../../components/Skeleton/SkeletonCardList";
import Banner from "../../components/banner/Banner";
import { PostApi } from "../../api/PostApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { handleLogError } from "../../utills/Helper";

import { ProfileApi } from "../../api/ProfileApi";



const Discover = () => {

  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;
  const [tagId, setTagId] = useState("");


  const { data: profileData, isSuccess: successLoadProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
      return data.data;
    },
  });



  const handleFetchPosts = async () => {
    try {
      const response = await PostApi.getPosts(0, 8, "CREATED_TIME", "ACCENDING");
      return response.data;
    } catch (error) {
      handleLogError(error)
    }
  };


  const handleFetchPostsByTag = async () => {
    const tempTagArray = profileData.tagsCollection.map((tag) => tag.tagId);
    const tagIdsString = tempTagArray.join(',');
    try {
      const response = await PostApi.getPostsByTags(tagIdsString, 0, 8, keycloak.token);
      return response.data.content;
    } catch (error) {
      handleLogError(error)
    }
  };

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: handleFetchPosts,
  });

  const { data: postsByTagUser, isLoading: loadingPostsByTag } = useQuery({
    queryKey: ["postsByTag"],
    queryFn: handleFetchPostsByTag,
    enabled: successLoadProfile,
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

  return (

    isLogin == true ?
      (
        <>
          <LoginBanner onItemClick={handleItemSelection} />
          <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
            {posts && <RecipeCardList
              props={postsbyTag ? postsbyTag : (postsByTagUser ? postsByTagUser : posts.content)}
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
