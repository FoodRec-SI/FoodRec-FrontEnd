import { bearerAuth } from "../utills/Helper";
import axios from 'axios';

export const CollectionApi = {
  getCollection,
}

function getCollection(token) {
  return instance.get(`/api/member/collections`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});


