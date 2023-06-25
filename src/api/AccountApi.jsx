import axios from 'axios';
import { bearerAuth } from "../utills/Helper";

export const AccountApi = {
  createAccount,
}

//http://localhost:8080/api/private/account/create

function createAccount(token) {
  return instance.get(`/api/private/account/create`,  {
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
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});


