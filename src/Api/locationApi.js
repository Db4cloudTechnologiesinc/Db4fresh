import API from "./apiClient";

export const getAvailableCities = () =>
  API.get("/location/cities");

export const validatePincode = (pincode) =>
  API.get(`/location/validate/${pincode}`);