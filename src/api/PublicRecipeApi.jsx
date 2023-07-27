import axios from 'axios';

// -- Axios

export const PublicRecipeApi = {
    checkIsPublic,
    publicRecipe,
}

//http://localhost:8080/api/member/post

function publicRecipe(token, recipeId) {
    return instance.post(`/api/member/post`, recipeId, {
        headers: {
            Authorization: bearerAuth(token),
            "Content-Type":  "application/json",
        },
    });
}



//http://localhost:8080/api/member/post/recipe/REC000047
function checkIsPublic(token, recipeId) {
    return instance.get(`/api/member/post/recipe/${recipeId}`, {
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

// -- Helper functions

function bearerAuth(token) {
    return `Bearer ${token}`;
}

