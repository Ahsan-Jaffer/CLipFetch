const detectPlatform = require("../utils/detectPlatform");

const mockFormats = [
  {
    id: 1,
    quality: "1080p",
    format: "MP4",
    label: "HD",
    size: "81.2 MB",
    type: "video",
  },
  {
    id: 2,
    quality: "720p",
    format: "MP4",
    label: "HD",
    size: "45.7 MB",
    type: "video",
  },
  {
    id: 3,
    quality: "480p",
    format: "MP4",
    label: "SD",
    size: "23.6 MB",
    type: "video",
  },
  {
    id: 4,
    quality: "MP3",
    format: "Audio",
    label: "Audio",
    size: "9.8 MB",
    type: "audio",
  },
];

const mockThumbnails = {
  YouTube:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  Instagram:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  TikTok:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  Facebook:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
};

async function analyzeUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a video URL.",
      });
    }

    const { isValidUrl, normalizedUrl, platform } = detectPlatform(url);

    if (!isValidUrl) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Please enter a valid video link.",
      });
    }

    if (!platform) {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported platform. Please use YouTube, Facebook, Instagram, or TikTok.",
        supportedPlatforms: ["YouTube", "Facebook", "Instagram", "TikTok"],
      });
    }

    const videoData = {
      originalUrl: normalizedUrl,
      title: `${platform} Sample Video Preview`,
      platform,
      duration: "03:42",
      thumbnail: mockThumbnails[platform],
      formats: mockFormats,
      isMockData: true,
    };

    return res.status(200).json({
      success: true,
      message: "Video link analyzed successfully.",
      data: videoData,
    });
  } catch (error) {
    console.error("Analyze URL Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze the video URL. Please try again later.",
    });
  }
}

module.exports = {
  analyzeUrl,
};