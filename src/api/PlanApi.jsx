import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const PlanApi = {
  getPlan,
  createPlan,
  getPlanDetail,
  deletePlan,
  createMeal,
  updatePlan,
  generateIngredientList,
};

function getPlan(startDate, EndDate, token) {
  return instance.post(
    `/api/member/plan/list`,
    {
      startDate: startDate,
      endDate: EndDate,
    },
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

function createPlan(data, token) {
  return instance.post(
    `/api/member/plan`,
    {
      planName: data.planName,
      planDescription: data.planDescription,
      planDate: data.day,
    }
    ,
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

function getPlanDetail(planId, token) {
  return instance.get(`/api/member/plan/${planId}`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function deletePlan(planId, token) {
  return instance.delete("/api/member/plan", {
    data: { planId }, 
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}

function createMeal(data, token) {
  return instance.post(
    `/api/member/meal`,
    {
      mealName: data.mealName,
      maxCalories: data.maxCalories,
      tagIds: data.tagIds,
    },
    {
      headers: {
        Authorization: bearerAuth(token),
      },
    }
  );
}

function updatePlan (data, token) {
  return instance.put(
    `/api/member/plan`,
    
       data
    ,
    {
      headers: {
        Authorization: bearerAuth(token),
        "Content-Type": "application/json",
      },
    }
  );
}

function generateIngredientList(planId, token) {
  return instance.get(`/api/member/plan/ingredient/${planId}`, {
    headers: {
      Authorization: bearerAuth(token),
    },
  });
}



const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
