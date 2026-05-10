import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats/");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users/");
  return response.data;
};

export const getAdminTrips = async () => {
  const response = await api.get("/admin/trips/");
  return response.data;
};