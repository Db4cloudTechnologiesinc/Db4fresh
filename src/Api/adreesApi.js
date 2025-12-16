import API from "./apiClient";

export const addAddress = (data) =>
  API.post("/address", data);

export const getAddresses = () =>
  API.get("/address");

export const deleteAddress = (id) =>
  API.delete(`/address/${id}`);
