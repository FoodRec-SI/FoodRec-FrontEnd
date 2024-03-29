import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const PostApi = {
  getPostsByName,
  getPosts,
  getPostById,
  createRecipe,
  getTopPost,
  getPostsByTags,
};

//http://localhost:8080/api/member/recipe
function createRecipe(data, token) {
  return instance.post(`/api/member/recipe`, data, {
    headers: {
      Authorization: bearerAuth(token),
      'Content-Type':'multipart/form-data'
    },
  });
}

function getPosts(pageNumber,pageSize,sortPost,sortType){
  return instance.get(`/api/public/posts`, {
    params: { pageNumber , pageSize , sortPost , sortType },
  
  });
}

function getPostById(postId) {
  return instance.get(`/api/public/post/${postId}`, {
    headers: {

    },
  });
}

function getPostsByName(data) {
  return instance.get(`/api/public/posts/search`,  {
    params: { ...data, sortPost: "AVERAGE_SCORE" , sortType: "ACCENDING" },
  });

}

function getTopPost(token) {
  return instance.get(`/api/public/posts/average-score`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostsByTags(tagIds, pageNumber, pageSize, token) {
  return instance.get(`/api/public/posts/tag/tagIds`, {
    params: { tagIds , pageNumber, pageSize },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}


// -- Axios

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response && error.response.status === 400) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);




