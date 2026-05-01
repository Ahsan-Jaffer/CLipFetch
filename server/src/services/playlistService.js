const { execFile } = require("child_process");
const AppError = require("../utils/AppError");

const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
const PLAYLIST_TIMEOUT_MS = Number(process.env.PLAYLIST_TIMEOUT_MS || 120000);

function runYtDlpPlaylist(args) {
  return new Promise((resolve, reject) => {
    execFile(
      YTDLP_PATH,
      args,
      {
        timeout: PLAYLIST_TIMEOUT_MS,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 50,
      },
      (error, stdout, stderr) => {
        if (error) {
          const errorMessage =
            stderr || error.message || "yt-dlp playlist analysis failed.";

          if (error.killed || error.signal === "SIGTERM") {
            return reject(
              new AppError(
                "Playlist analysis timed out. This playlist may be too large or slow to process right now.",
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
              "Could not analyze this playlist. It may be private, restricted, removed, or unsupported.",
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

async function getPlaylistMetadata(url) {
  const args = [
    "--flat-playlist",
    "--dump-single-json",
    "--no-warnings",
    "--ignore-errors",
    url,
  ];

  const output = await runYtDlpPlaylist(args);

  try {
    const cleanOutput = output.trim();

    if (!cleanOutput) {
      throw new Error("Empty playlist response.");
    }

    return JSON.parse(cleanOutput);
  } catch (error) {
    throw new AppError(
      "Could not read playlist metadata. Please try again with another playlist.",
      500,
      {
        parseError: error.message,
      }
    );
  }
}

module.exports = {
  getPlaylistMetadata,
};