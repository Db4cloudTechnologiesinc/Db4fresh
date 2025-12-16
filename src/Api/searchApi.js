import API from "./apiClient";

export const getSuggestions = (query) =>
  API.get(`/search/suggestions?q=${query}`);