import { bearerAuth } from "../utills/Helper"
import axios from "axios"

export const TagApi = {
  getTags,
  getPostByTag,
  
}

function getTags(token) {
  return instance.get(`/api/public/tag`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostByTag(tagId,token){
  return instance.get(`/api/public/tag/${tagId}`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getTagsByRecipe(recipeId,token){
  return instance.get(`/api/public/tag/${recipeId}`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

// -- Axios

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
