import axios from "axios";

export const RatingApi = {
    updateRating,
    getRating,
}

//http://localhost:8080/api/member/rating
function updateRating(data, token) {
    return instance.post(`/api/member/rating`, data, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

function getRating(token) {
    return instance.get(`/api/rating/get`, {
        headers: {
            Authorization: bearerAuth(token),
            'Content-Type': 'application/json'
        },
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

