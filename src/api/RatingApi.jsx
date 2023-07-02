import axios from "axios";

export const RatingApi = {
    updateRating,
    getRating,
    getPersonalRating,
    getPercnetageRating
}

//http://localhost:8080/api/member/rating
function updateRating(data, token) {
    return instance.post(`/api/member/rating`, data, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

//http://localhost:8080/api/member/rating/POS000030

function getRating(token, podtId) {
    return instance.get(`/api/member/rating/${podtId}`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}


//http://localhost:8080/api/member/rating/user/post/POS000030
function getPersonalRating(token, podtId) {
    return instance.get(`/api/member/rating/user/post/${podtId}`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

//http://localhost:8080/api/member/rating/percentage/POS000030
function getPercnetageRating(token, podtId) {
    return instance.get(`/api/member/rating/percentage/${podtId}`, {
        headers: {
            Authorization: bearerAuth(token),
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

