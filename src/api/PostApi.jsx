import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const PostApi = {
  getPostsByName,
  getPosts,
  getPostById,
};

function getPosts(pageParam,token){
  return instance.get(`/api/public/posts`, {
    params: { pageNumber : pageParam },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostById(postId, token) {
  return instance.get(`/api/member/${postId}`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostsByName(recipeName, token) {
  return instance.get(`/api/public/posts/search`,  {
    params: { recipeName },
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
  if (error.response.status === 404 ) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});




