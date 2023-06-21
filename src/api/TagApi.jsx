import { bearerAuth } from "../utills/Helper"
import axios from "axios"

export const TagApi = {
  getTags,
}

function getTags(token) {
  return instance.get(`/api/public/tag`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

// -- Axios

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
