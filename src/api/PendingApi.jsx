import axios from "axios";

export const PendingApi = {
    getPendingRecipes,
    getPendingRecipeDetail,
    getUpdatedPendingRecipes,

};

const postStatus = {
    APPROVED: "APPROVED",
    REJECTED: "DELETED",
    PENDING: "PENDING_APPROVAL"
}

function getUpdatedPendingRecipes(token, page, size) {
    return instance.get(`api/moderator/posts`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    }
    );
}


    //http://localhost:8080/api/moderator/post/POS000028

    function getPendingRecipeDetail(postId, token) {
        return instance.get(`/api/moderator/post/${postId}`, {
            headers: {
                Authorization: bearerAuth(token),
            },
        });
    }



    function getPendingRecipes(token) {
        return instance.get(`api/moderator/posts`, {
            headers: {
                Authorization: bearerAuth(token),
            },
            params: {
                postStatuses: postStatus.PENDING
            }
        });
    }

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
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

