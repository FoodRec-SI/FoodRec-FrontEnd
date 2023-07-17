import { useState, useEffect } from "react";
import LoginBanner from "../../components/LoginBanner/LoginBanner";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import SkeletonCardList from "../../components/Skeleton/SkeletonCardList";
import Banner from "../../components/Banner/Banner";
import { PostApi } from "../../api/PostApi";
import { TagApi } from "../../api/TagApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useInfiniteQuery } from "react-query";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Slider from "react-slick";


const Arrows = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",

      }}
      onClick={onClick}
    >
      
    </div>
  );
};

const Discover = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <Arrows />,
    prevArrow: <Arrows />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const { keycloak } = useKeycloak();
  const isLogin = keycloak.authenticated;
  const [tagId, setTagId] = useState("");

  const fetchRecipes = async ({ pageParam, pageSize }) => {
    const response = await PostApi.getPosts(pageParam, pageSize);
    // console.log(response.data);
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
      <div style={{ width: "90%", margin: "0 auto" , }}>
        {/* <RecipeCardList
          props={posts && posts.content ? posts.content : data.pages.flatMap((page) => page.content)}
          pending={""}
        /> */}
        <Slider {...settings}
        >
          {posts && posts.content
            ? posts.content.map((post) => (
                <RecipeCard key={post.postId} props={post} />
              ))
            : data.pages
                .flatMap((page) => page.content)
                .map((post) => <RecipeCard key={post.postId} props={post} />)}
        </Slider>
       
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
