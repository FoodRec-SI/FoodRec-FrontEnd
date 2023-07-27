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

 

    const fetchRecipes = async ({ pageParam, pageSize, sortPost, sortType }) => {
      const response = await PostApi.getPosts(pageParam, pageSize, sortPost, sortType);
  
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

          <Banner />

          <div style={{ width: "90%", margin: "0 auto" }}>
            <SkeletonCardList />
          </div>
        </>
      );
    }

    if (status === "error") {
      return <div>Error fetching recipes</div>;
    }

  

    const handleItemSelection = (item) => {
      setTagId(item.tagId);
    };

    const { data: profileData, isLoading: loadingProfile, refetch } = useQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
        return data.data;
      },
    });

    const { data: posts, isLoading: loadingPosts, isSuccess } = useQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        if (profileData.tagsCollection == null) {
          const data = await PostApi.getPosts(0, 16, "CREATED_TIME", "ACCENDING");
          
          return data.data.content;
        }
        else {
          const tempTagArray = profileData.tagsCollection.map((tag) => tag.tagId);
          const tagIdsString = tempTagArray.join(',');
          const data = await PostApi.getPostsByTags(tagIdsString, 0, 16, keycloak.token);
          return data.data.content;
        }
      },
      enabled: profileData!=null,

    });

    if (loadingPosts) {
      <>

        {isLogin ? <LoginBanner onItemClick={handleItemSelection} /> : <Banner />}

        <div style={{ width: "90%", margin: "0 auto" }}>
          <SkeletonCardList />
        </div>
      </>
    }


    

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



    return (
      <>{ isLogin ? (
        posts && <div>
          <LoginBanner onItemClick={handleItemSelection} />
          <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
            <RecipeCardList
              props={postsbyTag ? postsbyTag : posts}
              pending={""}
            />
          </div>
        </div> ) : (
          <>
        <Banner />
        <div style={{ width: "100%", margin: "0 auto", maxWidth: "1200px" }}>
          <RecipeCardList
            props={data.pages.flatMap((page) => page.content)}
            pending={""}
          />
        </div>
      </>
        )}</>
    )
  }


export default Discover;
