const fs = require("fs");
const path = require("path");
const {
  ensureDirectoryExists,
  getDownloadsDirectory,
  deleteFileSafe,
} = require("../utils/fileUtils");

const tempFileMaxAgeMinutes = Number(
  process.env.TEMP_FILE_MAX_AGE_MINUTES || 30
);

const cleanupIntervalMinutes = Number(
  process.env.CLEANUP_INTERVAL_MINUTES || 10
);

function cleanupOldDownloadFiles() {
  const downloadsDirectory = getDownloadsDirectory();
  ensureDirectoryExists(downloadsDirectory);

  const now = Date.now();
  const maxAgeMs = tempFileMaxAgeMinutes * 60 * 1000;

  let deletedCount = 0;

  try {
    const files = fs.readdirSync(downloadsDirectory);

    for (const fileName of files) {
      const filePath = path.join(downloadsDirectory, fileName);
      const stats = fs.statSync(filePath);

      if (!stats.isFile()) {
        continue;
      }

      const fileAgeMs = now - stats.mtimeMs;

      if (fileAgeMs > maxAgeMs) {
        deleteFileSafe(filePath);
        deletedCount += 1;
      }
    }

    if (deletedCount > 0) {
      console.log(
        `Cleanup completed: deleted ${deletedCount} old temp file(s).`
      );
    }
  } catch (error) {
    console.error("Cleanup service error:", error.message);
  }
}

function startCleanupService() {
  const downloadsDirectory = getDownloadsDirectory();
  ensureDirectoryExists(downloadsDirectory);

  cleanupOldDownloadFiles();

  const intervalMs = cleanupIntervalMinutes * 60 * 1000;

  setInterval(() => {
    cleanupOldDownloadFiles();
  }, intervalMs);

  console.log(
    `Cleanup service running. Removing files older than ${tempFileMaxAgeMinutes} minutes every ${cleanupIntervalMinutes} minutes.`
  );
}

module.exports = {
  cleanupOldDownloadFiles,
  startCleanupService,
};