const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const detectPlatform = require("../utils/detectPlatform");
const { deleteFileSafe } = require("../utils/fileUtils");
const {
  downloadVideoFile,
  downloadAudioFile,
} = require("../services/downloadService");

const downloadVideo = asyncHandler(async (req, res) => {
  const { url, formatId, type, title, audioBitrate } = req.body;

  if (!url || typeof url !== "string" || !url.trim()) {
    throw new AppError("Please provide a video URL.", 400);
  }

  const downloadType = type || "video";

  if (!["video", "audio"].includes(downloadType)) {
    throw new AppError("Invalid download type selected.", 400);
  }

  const { isValidUrl, normalizedUrl, platform } = detectPlatform(url);

  if (!isValidUrl) {
    throw new AppError(
      "Invalid URL format. Please enter a valid video link.",
      400
    );
  }

  if (!platform) {
    throw new AppError(
      "Unsupported platform. Please use YouTube, Facebook, Instagram, or TikTok.",
      400
    );
  }

  const downloadedFile =
    downloadType === "audio"
      ? await downloadAudioFile({
          url: normalizedUrl,
          title,
          audioBitrate,
        })
      : await downloadVideoFile({
          url: normalizedUrl,
          formatId,
          title,
        });

  res.download(downloadedFile.filePath, downloadedFile.fileName, (error) => {
    deleteFileSafe(downloadedFile.filePath);

    if (error) {
      console.error("File response error:", error.message);
    }
  });
});

module.exports = {
  downloadVideo,
};