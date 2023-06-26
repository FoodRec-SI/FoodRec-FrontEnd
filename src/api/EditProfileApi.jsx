import axios from "axios";

export const EditProfileApi = {
    updateProfile,
}

const baseURL = import.meta.env.VITE_API_URL;

// //http://localhost:8080/api/member/account/update
function updateProfile(data, token) {

    return instance.put(`/api/member/account/update`,data, {
        headers: {
            Authorization: bearerAuth(token),
            'Content-Type':'multipart/form-data'
        },
    });
}

// function updateProfile(data, token) {
//     const formData = new FormData();
//     formData.append("description", data.description);
//     if (data.profileImage) {
//       formData.append("profileImage", data.profileImage);
//     }
//     if (data.backgroundImage) {
//       formData.append("backgroundImage", data.backgroundImage);
//     }
  
//     return axios.put(`${baseURL}/api/member/account/update`, formData, {
//       headers: {
//         Authorization: bearerAuth(token),
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   }

// -- Axios 

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.response.use(response => {
    return response;
}
    , function (error) {
        if (error.response.status === 404) {
            return { status: error.response.status };
        }
        return Promise.reject(error.response);
    }

);

function bearerAuth(token) {
    return `Bearer ${token}`;
}