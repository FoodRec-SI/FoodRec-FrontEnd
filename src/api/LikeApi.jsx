import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const LikeApi = {
  getLikes,
  likePost,
  unlikePost,
};

function getLikes(pageParam, pageSize, token) {
  return instance.get(`/api/member/like`, {
    params: { pageNumber: pageParam, pageSize },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function likePost(data, token) {
  return instance.post(
    `/api/member/like`,
    {
      postId: data.postId,
    },
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

function unlikePost(data, token) {
  return instance.delete(`/api/member/like`, {
    data: {
      postId: data.postId,
    },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

// -- Axios

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 404) {
      return { status: error.response.status };
    }
    return Promise.reject(error.response);
  }
);
