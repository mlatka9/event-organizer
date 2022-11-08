import axios from "axios";

console.log("SERVER_BASE_URL", process.env.NEXT_PUBLIC_SERVER_BASE_URL)

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/`,
});

export default api;
