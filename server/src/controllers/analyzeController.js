const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const detectPlatform = require("../utils/detectPlatform");
const { normalizeMetadata } = require("../utils/formatMetadata");
const { getVideoMetadata } = require("../services/metadataService");

const maxVideoDurationSeconds = Number(
  process.env.MAX_VIDEO_DURATION_SECONDS || 7200
);

const mockFormats = [
  {
    id: 1,
    quality: "1080p",
    format: "MP4",
    label: "HD",
    size: "81.2 MB",
    type: "video",
    formatId: "mock-1080",
  },
  {
    id: 2,
    quality: "720p",
    format: "MP4",
    label: "HD",
    size: "45.7 MB",
    type: "video",
    formatId: "mock-720",
  },
  {
    id: 3,
    quality: "480p",
    format: "MP4",
    label: "SD",
    size: "23.6 MB",
    type: "video",
    formatId: "mock-480",
  },
  {
    id: "mp3-320",
    quality: "320kbps",
    format: "MP3",
    label: "Best Quality",
    size: "Depends on duration",
    type: "audio",
    formatId: "bestaudio",
    audioBitrate: 320,
  },
  {
    id: "mp3-256",
    quality: "256kbps",
    format: "MP3",
    label: "High Quality",
    size: "Depends on duration",
    type: "audio",
    formatId: "bestaudio",
    audioBitrate: 256,
  },
  {
    id: "mp3-192",
    quality: "192kbps",
    format: "MP3",
    label: "Balanced",
    size: "Depends on duration",
    type: "audio",
    formatId: "bestaudio",
    audioBitrate: 192,
  },
  {
    id: "mp3-128",
    quality: "128kbps",
    format: "MP3",
    label: "Smaller File",
    size: "Depends on duration",
    type: "audio",
    formatId: "bestaudio",
    audioBitrate: 128,
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

function getMockVideoData(platform, normalizedUrl) {
  return {
    originalUrl: normalizedUrl,
    title: `${platform} Sample Video Preview`,
    platform,
    duration: "03:42",
    thumbnail: mockThumbnails[platform],
    formats: mockFormats,
    isMockData: true,
  };
}

function validateVideoDuration(rawMetadata) {
  const duration = Number(rawMetadata?.duration || 0);

  if (!duration || Number.isNaN(duration)) {
    return;
  }

  if (duration > maxVideoDurationSeconds) {
    throw new AppError(
      "This video is too long. Please use a video under 2 hours.",
      400,
      {
        maxDurationSeconds: maxVideoDurationSeconds,
        videoDurationSeconds: Math.floor(duration),
      }
    );
  }
}

const analyzeUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string" || !url.trim()) {
    throw new AppError("Please provide a video URL.", 400);
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
      400,
      {
        supportedPlatforms: ["YouTube", "Facebook", "Instagram", "TikTok"],
      }
    );
  }

  const useMockMetadata = process.env.USE_MOCK_METADATA === "true";

  let videoData;

  if (useMockMetadata) {
    videoData = getMockVideoData(platform, normalizedUrl);
  } else {
    const rawMetadata = await getVideoMetadata(normalizedUrl);

    validateVideoDuration(rawMetadata);

    videoData = normalizeMetadata(rawMetadata, platform, normalizedUrl);
  }

  return res.status(200).json({
    success: true,
    message: "Video link analyzed successfully.",
    data: videoData,
  });
});

module.exports = {
  analyzeUrl,
};