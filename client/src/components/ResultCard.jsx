import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Play } from "lucide-react";
import { useState } from "react";
import { downloadVideoFormat } from "../utils/api";
import FormatOption from "./FormatOption";

function saveBlobAsFile(blob, fileName) {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName || "clipfetch-download";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export default function ResultCard({ isDark, video, onDownloadStatusChange }) {
  const [activeTab, setActiveTab] = useState("video");
  const [downloadingFormatId, setDownloadingFormatId] = useState(null);
  const [isDownloadLocked, setIsDownloadLocked] = useState(false);

  if (!video) return null;

  const formats =
    activeTab === "video"
      ? video.formats.filter((item) => item.type === "video")
      : video.formats.filter((item) => item.type === "audio");

  const shellClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/85 shadow-[0_28px_80px_rgba(15,23,42,0.08)]";

  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";

  const updateToast = (payload) => {
    if (typeof onDownloadStatusChange === "function") {
      onDownloadStatusChange(payload);
    }
  };

  const handleDownload = async (option) => {
    if (isDownloadLocked) {
      return;
    }

    const fileLabel =
      option.type === "audio"
        ? `${option.quality} MP3 · ${video.title}`
        : `${option.quality} ${option.format} · ${video.title}`;

    setIsDownloadLocked(true);
    setDownloadingFormatId(option.id);

    updateToast({
      visible: true,
      status: "downloading",
      type: option.type,
      fileLabel,
      message: "",
    });

    try {
      const result = await downloadVideoFormat({
        url: video.originalUrl,
        formatId: option.formatId || option.id,
        type: option.type,
        title: video.title,
        audioBitrate: option.audioBitrate,
      });

      saveBlobAsFile(result.blob, result.fileName);

      updateToast({
        visible: true,
        status: "success",
        type: option.type,
        fileLabel,
        message: "Download started. Check your browser downloads.",
      });

      setTimeout(() => {
        updateToast({
          visible: false,
          status: "idle",
          type: "video",
          fileLabel: "",
          message: "",
        });
      }, 4200);
    } catch (error) {
      updateToast({
        visible: true,
        status: "error",
        type: option.type,
        fileLabel,
        message: error.message || "Download failed. Please try again.",
      });
    } finally {
      setDownloadingFormatId(null);
      setIsDownloadLocked(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`premium-card mt-8 rounded-[32px] border p-4 backdrop-blur-xl md:p-6 ${shellClass}`}
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="shine-card relative overflow-hidden rounded-[26px]">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-[260px] w-full object-cover md:h-full"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <button className="premium-button absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xl">
            <Play size={26} className="ml-1 fill-white text-white" />
          </button>

          <span className="absolute bottom-4 right-4 rounded-xl bg-black/70 px-3 py-1.5 text-sm font-semibold text-white">
            {video.duration}
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-500/12 px-3 py-1.5 text-sm font-semibold text-red-500">
              {video.platform}
            </span>

            {video.isMockData && (
              <span className="rounded-full bg-amber-500/12 px-3 py-1.5 text-sm font-semibold text-amber-500">
                Mock data
              </span>
            )}

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                isDark
                  ? "bg-white/6 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Clock3 size={14} />
              {video.duration}
            </span>
          </div>

          <h2
            className={`mt-4 text-2xl font-black leading-tight md:text-3xl ${titleClass}`}
          >
            {video.title}
          </h2>

          <p className={`mt-2 text-sm leading-6 ${textClass}`}>
            Choose a video quality or convert the audio to MP3. Higher MP3
            bitrate creates a larger file and depends on source quality.
          </p>

          <div
            className={`mt-5 inline-flex rounded-2xl p-1 ${
              isDark
                ? "bg-black/25 ring-1 ring-white/10"
                : "bg-slate-100 ring-1 ring-slate-200"
            }`}
          >
            <button
              onClick={() => setActiveTab("video")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "video"
                  ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Video
            </button>

            <button
              onClick={() => setActiveTab("audio")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "audio"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Audio
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {formats.map((option, index) => (
                  <FormatOption
                    key={option.id}
                    isDark={isDark}
                    option={option}
                    index={index}
                    onDownload={handleDownload}
                    isDownloading={downloadingFormatId === option.id}
                    isDownloadLocked={
                      isDownloadLocked && downloadingFormatId !== option.id
                    }
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}