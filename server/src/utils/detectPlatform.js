const supportedPlatforms = [
  {
    name: "YouTube",
    hosts: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  },
  {
    name: "Instagram",
    hosts: ["instagram.com", "www.instagram.com"],
  },
  {
    name: "TikTok",
    hosts: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"],
  },
  {
    name: "Facebook",
    hosts: ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch"],
  },
];

function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return null;
  }

  if (!/^https?:\/\//i.test(trimmedUrl)) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
}

function detectPlatform(inputUrl) {
  try {
    const normalizedUrl = normalizeUrl(inputUrl);

    if (!normalizedUrl) {
      return {
        isValidUrl: false,
        normalizedUrl: null,
        platform: null,
      };
    }

    const parsedUrl = new URL(normalizedUrl);
    const host = parsedUrl.hostname.toLowerCase();

    const matchedPlatform = supportedPlatforms.find((platformItem) =>
      platformItem.hosts.some(
        (allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`)
      )
    );

    return {
      isValidUrl: true,
      normalizedUrl,
      platform: matchedPlatform ? matchedPlatform.name : null,
    };
  } catch (error) {
    return {
      isValidUrl: false,
      normalizedUrl: null,
      platform: null,
    };
  }
}

module.exports = detectPlatform;