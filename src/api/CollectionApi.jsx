import { bearerAuth } from "../utills/Helper";
import axios from 'axios';

export const CollectionApi = {
  getCollection,
  createCollection,
  addPostToCollection,
  getPostFromCollection,
  deletePostFromCollection,
  deleteCollection,
}

function deleteCollection(data,token) {
  return instance.delete(`/api/member/collection`,
  {
    data: {
      collectionId: data.collectionId,
    },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function deletePostFromCollection(data,token) {
  return instance.delete(`/api/member/collections/posts`,
  {
    data: {
      postId: data.postId,
      collectionId: data.collectionId,
    },
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getPostFromCollection(collectionId,pageParam,pageSize,token) {
  return instance.get(`/api/member/posts/${collectionId}`,
    {
      params: { pageNumber : pageParam,
                pageSize : pageSize},
      headers: {
        Authorization: bearerAuth(token),
      },
    });
}

function addPostToCollection(data,token) {
  return instance.put(`/api/member/collections/posts`,
  {
    postId: data.postId,
    collectionId: data.collectionId,
  },
  {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function getCollection(pageParam,pageSize,token) {
  return instance.get(`/api/member/collections`,
   {
    params: { pageNumber : pageParam,
              pageSize : pageSize},
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function createCollection(data, token) {
  return instance.post(`/api/member/collection`,
   {
    collectionName: data.collectionName,
    description: data.description,
  }
  ,
  {
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
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});


