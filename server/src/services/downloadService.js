const path = require("path");
const { execFile } = require("child_process");
const AppError = require("../utils/AppError");
const {
  ensureDirectoryExists,
  sanitizeFilename,
  getDownloadsDirectory,
  findNewestFile,
} = require("../utils/fileUtils");

const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
const DOWNLOAD_TIMEOUT_MS = Number(process.env.DOWNLOAD_TIMEOUT_MS || 180000);

function runYtDlpDownload(args) {
  return new Promise((resolve, reject) => {
    execFile(
      YTDLP_PATH,
      args,
      {
        timeout: DOWNLOAD_TIMEOUT_MS,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 30,
      },
      (error, stdout, stderr) => {
        if (error) {
          const errorMessage =
            stderr || error.message || "yt-dlp download failed.";

          if (error.killed || error.signal === "SIGTERM") {
            return reject(
              new AppError(
                "Download timed out. Please try a shorter video or lower quality.",
                408
              )
            );
          }

          if (error.code === "ENOENT") {
            return reject(
              new AppError(
                "yt-dlp is not installed or not available in PATH.",
                500
              )
            );
          }

          return reject(
            new AppError(
              "Could not download this file. It may be private, restricted, removed, or unsupported.",
              400,
              {
                ytDlpMessage: errorMessage.slice(0, 700),
              }
            )
          );
        }

        resolve(stdout);
      }
    );
  });
}

function createOutputTemplate(title, extensionHint = "%(ext)s") {
  const downloadsDirectory = getDownloadsDirectory();
  ensureDirectoryExists(downloadsDirectory);

  const safeTitle = sanitizeFilename(title || "clipfetch-download");
  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return {
    downloadsDirectory,
    outputTemplate: path.join(
      downloadsDirectory,
      `${safeTitle}-${uniqueId}.${extensionHint}`
    ),
  };
}

async function downloadVideoFile({ url, formatId, title }) {
  const { downloadsDirectory, outputTemplate } = createOutputTemplate(
    title || "clipfetch-video",
    "%(ext)s"
  );

  const selectedFormat = formatId && formatId !== "best" ? formatId : "best";

  const formatSelector =
    selectedFormat === "best"
      ? "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
      : `${selectedFormat}+bestaudio/best`;

  const beforeDownloadTime = Date.now();

  const args = [
    "--no-playlist",
    "--no-warnings",
    "--merge-output-format",
    "mp4",
    "-f",
    formatSelector,
    "-o",
    outputTemplate,
    url,
  ];

  await runYtDlpDownload(args);

  const downloadedFile = findNewestFile(downloadsDirectory);

  if (!downloadedFile || downloadedFile.modifiedAt < beforeDownloadTime - 1000) {
    throw new AppError("Download completed but file could not be found.", 500);
  }

  return {
    filePath: downloadedFile.filePath,
    fileName: downloadedFile.fileName,
  };
}

async function downloadAudioFile({ url, title, audioBitrate }) {
  const bitrate = Number(audioBitrate || 320);

  const allowedBitrates = [320, 256, 192, 128];

  if (!allowedBitrates.includes(bitrate)) {
    throw new AppError("Invalid audio quality selected.", 400);
  }

  const { downloadsDirectory, outputTemplate } = createOutputTemplate(
    `${title || "clipfetch-audio"}-${bitrate}kbps`,
    "%(ext)s"
  );

  const beforeDownloadTime = Date.now();

  const args = [
    "--no-playlist",
    "--no-warnings",
    "-f",
    "bestaudio/best",
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--postprocessor-args",
    `ffmpeg:-b:a ${bitrate}k`,
    "-o",
    outputTemplate,
    url,
  ];

  await runYtDlpDownload(args);

  const downloadedFile = findNewestFile(downloadsDirectory);

  if (!downloadedFile || downloadedFile.modifiedAt < beforeDownloadTime - 1000) {
    throw new AppError("Audio conversion completed but file could not be found.", 500);
  }

  return {
    filePath: downloadedFile.filePath,
    fileName: downloadedFile.fileName,
  };
}

module.exports = {
  downloadVideoFile,
  downloadAudioFile,
};