import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const LikeApi = {
  getLikes,

};

function getLikes(pageParam, pageSize, token) {
  return instance.get(`/api/member/likes`, {
    params: { pageNumber: pageParam, pageSize },
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