import axios from "axios";

export const ApproveRejectApi = {
  updateStatusPost,
};

function updateStatusPost(data, token) {
  return instance.put(
    `/api/moderator/post`,
    {
      'postId': data.postId,
      'status': data.isApprove,
    },
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_POST_API_URL,
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
// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`;
}