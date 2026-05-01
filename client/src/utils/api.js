import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function analyzeVideoUrl(url) {
  try {
    const response = await api.post(
      "/api/analyze",
      { url },
      {
        timeout: 130000,
      }
    );

    return response.data;
  } catch (error) {
    let message = "Something went wrong. Please try again.";

    if (error.code === "ECONNABORTED") {
      message =
        "Analysis is taking too long. This playlist may be large or slow to process.";
    } else if (error.response) {
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

export async function downloadVideoFormat({
  url,
  formatId,
  type,
  title,
  audioBitrate,
}) {
  try {
    const response = await api.post(
      "/api/download",
      {
        url,
        formatId,
        type,
        title,
        audioBitrate,
      },
      {
        responseType: "blob",
        timeout: 240000,
      }
    );

    const contentDisposition = response.headers["content-disposition"];
    let fileName =
      type === "audio" ? "clipfetch-audio.mp3" : "clipfetch-video.mp4";

    if (contentDisposition) {
      const fileNameMatch =
        contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
        contentDisposition.match(/filename="?([^"]+)"?/i);

      if (fileNameMatch?.[1]) {
        fileName = decodeURIComponent(fileNameMatch[1]);
      }
    }

    return {
      blob: response.data,
      fileName,
    };
  } catch (error) {
    let message = "Download failed. Please try again.";

    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();

      try {
        const parsed = JSON.parse(text);
        message = parsed.message || message;
      } catch {
        message = text || message;
      }
    } else if (error.response) {
      message = error.response.data?.message || message;
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