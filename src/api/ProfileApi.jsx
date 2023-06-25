import axios from "axios";

export const ProfileApi = {
    getProfile,
    updateProfile,
}

function getProfile(token, userId) {
    return instance.get(`/api/member/account/${userId}`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

function updateProfile(token, profile) {
    return instance.put(`/api/member/profile`, profile, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

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

// -- Helper functions

function bearerAuth(token) {
    return `Bearer ${token}`;
}