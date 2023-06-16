import axios from "axios";

export const PendingApi = {
    getPendingRecipes
};

const postStatus = {
    APPROVED: "APPROVED",
    REJECTED: "DELETED",
    PENDING: "PENDING_APPROVAL"
}


function getPendingRecipes(token) {
    return instance.get(`/moderator/posts`, {
        headers: {
            Authorization: bearerAuth(token),
        },
        params: {
            postStatuses: postStatus.PENDING
        }
    });
}

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
}
);

function bearerAuth(token) {
    return `Bearer ${token}`;
}

