import { bearerAuth } from "../utills/Helper"
import axios from "axios"

export const TagApi = {
  getTags,
  getPostByTag,
  getTagsByRecipe
}

function getTags(token) {
  return instance.get(`/api/public/tag`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostByTag(tagId){
  return instance.get(`/api/public/posts/tag/${tagId}`);
}

function getTagsByRecipe(recipeId,token){
  return instance.get(`/api/public/tag/${recipeId}`,{
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