import axios from "axios";
import { bearerAuth } from "../utills/Helper";

export const PlanApi = {
  getPlan,
  createPlan,
  getPlanDetail,
  deletePlan,
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
      planDate: data.planDate,
    },
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


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
