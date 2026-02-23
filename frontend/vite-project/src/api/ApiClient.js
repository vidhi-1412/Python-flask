import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

export default ApiClient;
