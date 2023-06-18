import axios from "axios";

export const ApproveRejectApi = {
  updateStatusPost,
};

const postStatus = {
  APPROVED: "APPROVED",
  REJECTED: "DELETED",
}

function updateStatusPost(postId, token, status) {
  let tempStatus = postStatus.APPROVED;
  if (status === "reject") {
    tempStatus = postStatus.REJECTED;
  }
  return instance.put(`/moderator/post`, {
    postStatus
  }, {
    headers: {
      Authorization: bearerAuth(token),
    },
    params: {
      postId: postId,
      postStatus: tempStatus,
    }
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