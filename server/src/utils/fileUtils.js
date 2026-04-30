const fs = require("fs");
const path = require("path");

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function sanitizeFilename(filename) {
  return String(filename || "clipfetch-download")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function getDownloadsDirectory() {
  const configuredDirectory = process.env.DOWNLOAD_DIR || "downloads";
  return path.resolve(process.cwd(), configuredDirectory);
}

function deleteFileSafe(filePath) {
  if (!filePath) return;

  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error("Failed to delete temp file:", error.message);
    }
  });
}

function findNewestFile(directoryPath) {
  const files = fs
    .readdirSync(directoryPath)
    .map((fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const stats = fs.statSync(filePath);

      return {
        fileName,
        filePath,
        createdAt: stats.birthtimeMs,
        modifiedAt: stats.mtimeMs,
      };
    })
    .filter((item) => fs.statSync(item.filePath).isFile())
    .sort((a, b) => b.modifiedAt - a.modifiedAt);

  return files[0] || null;
}

module.exports = {
  ensureDirectoryExists,
  sanitizeFilename,
  getDownloadsDirectory,
  deleteFileSafe,
  findNewestFile,
};