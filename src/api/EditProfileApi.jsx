import axios from "axios";

export const EditProfileApi = {
    updateProfile,
    updateProfileTag
}


// //http://localhost:8080/api/member/account/update
function updateProfile(data, token) {

    return instance.put(`/api/member/account/update`,data, {
        headers: {
            Authorization: bearerAuth(token),
            'Content-Type':'multipart/form-data'
        },
    });
}

function updateProfileTag(data, token) {
        return instance.post(`/api/member/account/tags?${data}`,'"', {
        headers: {
            Authorization: bearerAuth(token),
        },
        // params: {
        //     tagIds: data
        // }
    });
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
function bearerAuth(token) {
    return `Bearer ${token}`;
}