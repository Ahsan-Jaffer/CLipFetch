import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function analyzeVideoUrl(url) {

    
  const response = await api.post("/api/analyze", { url });
  return response.data;
}

export default api;