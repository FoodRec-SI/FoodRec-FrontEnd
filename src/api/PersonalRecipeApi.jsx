import axios from "axios";

export const PersonalRecipeApi = {
    getPersonalRecipe,
}


//api/member/recipe?pageNumber=0&pageSize=6
function getPersonalRecipe(token) {
    return instance.get(`/api/member/recipe`, {
        headers: {
            Authorization: bearerAuth(token),
        },
        params: {
            pageNumber: 1,
            pageSize: 6
        }
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

