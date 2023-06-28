import axios from "axios";

export const EditProfileApi = {
    updateProfile,
    updateProfileTag
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