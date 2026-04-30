const { execFile } = require("child_process");
const AppError = require("../utils/AppError");

const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
const YTDLP_TIMEOUT_MS = Number(process.env.YTDLP_TIMEOUT_MS || 20000);

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      YTDLP_PATH,
      args,
      {
        timeout: YTDLP_TIMEOUT_MS,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 15,
      },
      (error, stdout, stderr) => {
        if (error) {
          const errorMessage = stderr || error.message || "yt-dlp failed.";

          if (error.killed || error.signal === "SIGTERM") {
            return reject(
              new AppError(
                "Video analysis timed out. Please try a shorter or simpler link.",
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
              "Could not analyze this video. It may be private, restricted, removed, or unsupported.",
              400,
              {
                ytDlpMessage: errorMessage.slice(0, 500),
              }
            )
          );
        }

        return resolve(stdout);
      }
    );

    child.stdin?.end();
  });
}

async function getVideoMetadata(url) {
  const args = [
    "--dump-json",
    "--no-playlist",
    "--skip-download",
    "--no-warnings",
    url,
  ];

  const output = await runYtDlp(args);

  try {
    const cleanOutput = output.trim();

    if (!cleanOutput) {
      throw new Error("Empty metadata response.");
    }

    const firstJsonLine = cleanOutput
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("{") && line.endsWith("}"));

    if (!firstJsonLine) {
      throw new Error("No valid JSON metadata found.");
    }

    return JSON.parse(firstJsonLine);
  } catch (error) {
    throw new AppError(
      "Could not read video metadata. Please try again with another link.",
      500,
      {
        parseError: error.message,
      }
    );
  }
}

module.exports = {
  getVideoMetadata,
};