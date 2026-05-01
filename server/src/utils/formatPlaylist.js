function formatDurationFromSeconds(totalSeconds) {
  if (!totalSeconds || Number.isNaN(Number(totalSeconds))) {
    return "Unknown";
  }

  const secondsNumber = Math.floor(Number(totalSeconds));
  const hours = Math.floor(secondsNumber / 3600);
  const minutes = Math.floor((secondsNumber % 3600) / 60);
  const seconds = secondsNumber % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getThumbnailFromEntry(entry) {
  if (entry.thumbnail) {
    return entry.thumbnail;
  }

  if (Array.isArray(entry.thumbnails) && entry.thumbnails.length) {
    const sortedThumbnails = [...entry.thumbnails].sort((a, b) => {
      const areaA = (a.width || 0) * (a.height || 0);
      const areaB = (b.width || 0) * (b.height || 0);
      return areaB - areaA;
    });

    return sortedThumbnails[0]?.url || "";
  }

  if (entry.id) {
    return `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`;
  }

  return "";
}

function getVideoUrlFromEntry(entry) {
  if (entry.webpage_url) {
    return entry.webpage_url;
  }

  if (entry.url && String(entry.url).startsWith("http")) {
    return entry.url;
  }

  if (entry.id) {
    return `https://www.youtube.com/watch?v=${entry.id}`;
  }

  if (entry.url) {
    return `https://www.youtube.com/watch?v=${entry.url}`;
  }

  return "";
}

function normalizePlaylistMetadata(rawPlaylist, originalUrl) {
  const entries = Array.isArray(rawPlaylist.entries) ? rawPlaylist.entries : [];

  const items = entries
    .filter(Boolean)
    .map((entry, index) => {
      const duration =
        entry.duration_string ||
        entry.duration ||
        entry.duration_seconds ||
        null;

      return {
        id: String(entry.id || entry.url || `playlist-item-${index + 1}`),
        index: index + 1,
        title: entry.title || `Video ${index + 1}`,
        url: getVideoUrlFromEntry(entry),
        duration:
          typeof duration === "string"
            ? duration
            : formatDurationFromSeconds(duration),
        thumbnail: getThumbnailFromEntry(entry),
        uploader: entry.uploader || entry.channel || "Unknown",
      };
    })
    .filter((item) => item.url);

  return {
    playlistTitle: rawPlaylist.title || "Untitled Playlist",
    originalUrl,
    videoCount: items.length,
    items,
    isPlaylist: true,
  };
}

function isLikelyPlaylistUrl(inputUrl) {
  try {
    const parsedUrl = new URL(inputUrl);
    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    const isYouTube =
      host.includes("youtube.com") || host.includes("youtu.be");

    if (!isYouTube) {
      return false;
    }

    if (pathname.includes("/playlist")) {
      return true;
    }

    if (pathname.includes("/show/")) {
      return true;
    }

    if (parsedUrl.searchParams.has("list")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

module.exports = {
  isLikelyPlaylistUrl,
  normalizePlaylistMetadata,
};