import axios from "axios";

export const ApproveRejectApi = {
    approvePost,
    rejectPost
};

const postStatus = {
    APPROVED: "APPROVED",
    REJECTED: "DELETED",
}

function updateStatusPost(postId, postStatus, token) {
    return instance.put(`/moderator/post/${postId}/status`, {
        postStatus
    }, {
        headers: {
            Authorization: bearerAuth(token),
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