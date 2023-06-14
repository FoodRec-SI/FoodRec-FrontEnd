import axios from "axios";

export const PostApi = {
  getPostsByName,
};

function getPostsByName(recipeName, token) {
  return instance.get(`/api/member/post/search`,  {
    params: { recipeName },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

// -- Axios

const instance = axios.create({
  baseURL: import.meta.env.VITE_POST_API_URL,
});

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});

// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`;
}
