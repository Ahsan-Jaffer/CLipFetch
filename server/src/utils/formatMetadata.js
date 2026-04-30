function formatDuration(totalSeconds) {
  if (!totalSeconds || Number.isNaN(Number(totalSeconds))) {
    return "Unknown";
  }

  const secondsNumber = Math.floor(Number(totalSeconds));

  const hours = Math.floor(secondsNumber / 3600);
  const minutes = Math.floor((secondsNumber % 3600) / 60);
  const seconds = secondsNumber % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatFileSize(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) {
    return "Unknown";
  }

  const size = Number(bytes);
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let value = size;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function getBestThumbnail(rawMetadata) {
  if (rawMetadata.thumbnail) {
    return rawMetadata.thumbnail;
  }

  if (Array.isArray(rawMetadata.thumbnails) && rawMetadata.thumbnails.length) {
    const sortedThumbnails = [...rawMetadata.thumbnails].sort((a, b) => {
      const areaA = (a.width || 0) * (a.height || 0);
      const areaB = (b.width || 0) * (b.height || 0);
      return areaB - areaA;
    });

    return sortedThumbnails[0]?.url || "";
  }

  return "";
}

function getLabelByHeight(height) {
  if (!height) {
    return "Video";
  }

  if (height >= 1080) {
    return "FHD";
  }

  if (height >= 720) {
    return "HD";
  }

  return "SD";
}

function getVideoFormats(rawFormats = []) {
  const allowedHeights = [2160, 1440, 1080, 720, 480, 360];

  const candidates = rawFormats
    .filter((format) => {
      const height = Number(format.height || 0);
      const extension = String(format.ext || "").toLowerCase();

      return (
        height > 0 &&
        allowedHeights.includes(height) &&
        ["mp4", "webm", "mkv"].includes(extension)
      );
    })
    .sort((a, b) => {
      const heightDiff = Number(b.height || 0) - Number(a.height || 0);

      if (heightDiff !== 0) {
        return heightDiff;
      }

      return Number(b.tbr || 0) - Number(a.tbr || 0);
    });

  const uniqueByHeight = new Map();

  for (const format of candidates) {
    const height = Number(format.height);

    if (!uniqueByHeight.has(height)) {
      uniqueByHeight.set(height, format);
    }
  }

  return Array.from(uniqueByHeight.values())
    .slice(0, 4)
    .map((format, index) => {
      const height = Number(format.height || 0);
      const extension = String(format.ext || "mp4").toUpperCase();
      const size = format.filesize || format.filesize_approx;

      return {
        id: String(format.format_id || `video-${height}-${index}`),
        quality: height ? `${height}p` : "Video",
        format: extension,
        label: getLabelByHeight(height),
        size: formatFileSize(size),
        type: "video",
        formatId: String(format.format_id || ""),
        hasAudio: Boolean(format.acodec && format.acodec !== "none"),
        hasVideo: Boolean(format.vcodec && format.vcodec !== "none"),
      };
    });
}

function getAudioFormat(rawFormats = []) {
  const audioCandidates = rawFormats
    .filter((format) => {
      const hasAudio = format.acodec && format.acodec !== "none";
      const hasNoVideo = !format.vcodec || format.vcodec === "none";
      return hasAudio && hasNoVideo;
    })
    .sort((a, b) => Number(b.abr || b.tbr || 0) - Number(a.abr || a.tbr || 0));

  const bestAudio = audioCandidates[0];

  return {
    id: bestAudio?.format_id ? String(bestAudio.format_id) : "bestaudio",
    quality: "MP3",
    format: "Audio",
    label: bestAudio?.abr ? `${Math.round(bestAudio.abr)}kbps` : "Audio",
    size: formatFileSize(bestAudio?.filesize || bestAudio?.filesize_approx),
    type: "audio",
    formatId: bestAudio?.format_id ? String(bestAudio.format_id) : "bestaudio",
    hasAudio: true,
    hasVideo: false,
  };
}

function normalizeMetadata(rawMetadata, platform, originalUrl) {
  const rawFormats = Array.isArray(rawMetadata.formats)
    ? rawMetadata.formats
    : [];

  let formats = getVideoFormats(rawFormats);

  if (!formats.length) {
    formats = [
      {
        id: "best",
        quality: "Best",
        format: "Video",
        label: "Best",
        size: "Unknown",
        type: "video",
        formatId: "best",
        hasAudio: true,
        hasVideo: true,
      },
    ];
  }

  formats.push(getAudioFormat(rawFormats));

  return {
    originalUrl,
    title: rawMetadata.title || `${platform} Video`,
    platform,
    duration: formatDuration(rawMetadata.duration),
    thumbnail: getBestThumbnail(rawMetadata),
    uploader: rawMetadata.uploader || rawMetadata.channel || "Unknown",
    webpageUrl: rawMetadata.webpage_url || originalUrl,
    formats,
    isMockData: false,
  };
}

module.exports = {
  normalizeMetadata,
};