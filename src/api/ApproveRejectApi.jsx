import axios from "axios";

export const ApproveRejectApi = {
  updateStatusPost,
};

function updateStatusPost(data, token) {
  console.log(data);
  return instance.put(
    `/api/moderator/post`,
    {
      'postId': data.postId,
      'status': data.status,
    },
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

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
// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`;
}