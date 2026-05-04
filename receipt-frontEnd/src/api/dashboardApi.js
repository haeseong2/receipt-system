import api from "./commonApi";

export const getDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};