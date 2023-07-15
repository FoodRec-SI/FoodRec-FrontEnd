import axios from "axios";

export const PersonalRecipeApi = {
    getPersonalRecipe,
    getPersonalRecipeByRecipeID,
    deletePersonalRecipe,
}

//http://localhost:8080/api/member/recipe/REC000043

function deletePersonalRecipe(token, recipeId) {
    return instance.delete(`/api/member/recipe/${recipeId}`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}


//http://localhost:8080/api/member/recipe/REC000030

function getPersonalRecipeByRecipeID(token, recipeId) {
    return instance.get(`/api/member/recipe/${recipeId}`, {
        headers: {
            Authorization: bearerAuth(token),
        },
    });
}

//api/member/recipe?pageNumber=0&pageSize=6
function getPersonalRecipe(token,pageParam, pageSize) {
    return instance.get(`/api/member/recipe`, {
        headers: {
            Authorization: bearerAuth(token),
        },
        params: {
            pageNumber: pageParam,
            pageSize: pageSize
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

