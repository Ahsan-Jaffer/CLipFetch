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
  try {
    const response = await api.post("/api/analyze", { url });
    return response.data;
  } catch (error) {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      message =
        error.response.data?.message ||
        "The server could not process this request.";
    } else if (error.request) {
      message =
        "Unable to connect to the server. Please make sure the backend is running.";
    } else if (error.message) {
      message = error.message;
    }

    throw new Error(message, {
      cause: error,
    });
  }
}

export default api;