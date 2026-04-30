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
        platform: null,
        normalizedUrl: null,
      };
    }

    const parsedUrl = new URL(normalizedUrl);
    const host = parsedUrl.hostname.toLowerCase();

    const matchedPlatform = supportedPlatforms.find((item) =>
      item.hosts.some(
        (allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`)
      )
    );

    return {
      platform: matchedPlatform ? matchedPlatform.name : null,
      normalizedUrl,
    };
  } catch (error) {
    return {
      platform: null,
      normalizedUrl: null,
    };
  }
}

module.exports = detectPlatform;