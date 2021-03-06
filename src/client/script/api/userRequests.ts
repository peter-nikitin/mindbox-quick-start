import axios from "axios";

import { AuthRequestBody, RegistrationRequest } from "src/declarations";

export const loginUser = (user: AuthRequestBody) => {
  return axios.post("/api/user/auth", user, {
    headers: { "content-type": "application/json" },
  });
};
export const checkToken = () => {
  return axios.get("/api/user/checkToken", {
    headers: { "content-type": "application/json" },
  });
};
export const createUser = (user: RegistrationRequest) => {
  return axios.post("/api/user/reg", user, {
    headers: { "content-type": "application/json" },
  });
};


