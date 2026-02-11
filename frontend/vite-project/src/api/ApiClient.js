import axios from "axios";

const ApiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export default ApiClient;
