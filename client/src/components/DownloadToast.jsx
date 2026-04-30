import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const downloadPhases = [
  {
    title: "Preparing download",
    description: "Checking the selected quality and file format.",
    progress: 22,
  },
  {
    title: "Fetching video stream",
    description: "Downloading the selected video stream from the source.",
    progress: 52,
  },
  {
    title: "Packaging file",
    description: "Preparing the final video file for your browser.",
    progress: 78,
  },
  {
    title: "Starting browser download",
    description: "Almost done. Your browser download will start shortly.",
    progress: 92,
  },
];

export default function DownloadToast({ isDark, downloadStatus, onClose }) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const isVisible = downloadStatus?.visible;
  const status = downloadStatus?.status || "idle";
  const fileLabel = downloadStatus?.fileLabel || "Selected video";

  useEffect(() => {
    if (!isVisible || status !== "downloading") {
      setPhaseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPhaseIndex((current) => {
        if (current >= downloadPhases.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isVisible, status]);

  const activePhase = downloadPhases[phaseIndex];

  const toastContent = useMemo(() => {
    if (status === "success") {
      return {
        icon: <CheckCircle2 size={20} />,
        title: "Download started",
        description: "Check your browser downloads to view the file.",
        progress: 100,
        tone: "success",
      };
    }

    if (status === "error") {
      return {
        icon: <XCircle size={20} />,
        title: "Download failed",
        description:
          downloadStatus?.message ||
          "This video may be restricted or unavailable in this format.",
        progress: 100,
        tone: "error",
      };
    }

    return {
      icon: <Loader2 size={20} className="animate-spin" />,
      title: activePhase.title,
      description: activePhase.description,
      progress: activePhase.progress,
      tone: "loading",
    };
  }, [activePhase, downloadStatus?.message, status]);

  const shellClass = isDark
    ? "border-white/10 bg-slate-950/85 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
    : "border-slate-200 bg-white/90 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.14)]";

  const subTextClass = isDark ? "text-slate-400" : "text-slate-500";

  const iconClass =
    toastContent.tone === "success"
      ? "bg-emerald-500/12 text-emerald-500"
      : toastContent.tone === "error"
      ? "bg-rose-500/12 text-rose-500"
      : "bg-blue-500/12 text-blue-500";

  const progressClass =
    toastContent.tone === "success"
      ? "from-emerald-400 to-emerald-600"
      : toastContent.tone === "error"
      ? "from-rose-400 to-rose-600"
      : "from-cyan-400 via-blue-500 to-violet-600";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -18, x: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, x: 18, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed right-4 top-5 z-50 w-[calc(100%-32px)] max-w-md md:right-6 md:top-6"
        >
          <div
            className={`rounded-[26px] border p-4 backdrop-blur-2xl ${shellClass}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
              >
                {toastContent.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black sm:text-base">
                      {toastContent.title}
                    </h3>
                    <p className={`mt-1 text-xs leading-5 sm:text-sm ${subTextClass}`}>
                      {toastContent.description}
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isDark
                        ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                    aria-label="Close download status"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div
                  className={`mt-3 rounded-2xl px-3 py-2 text-xs font-semibold ${
                    isDark
                      ? "bg-white/5 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {fileLabel}
                </div>

                <div
                  className={`mt-3 h-2 overflow-hidden rounded-full ${
                    isDark ? "bg-white/10" : "bg-slate-200"
                  }`}
                >
                  <motion.div
                    animate={{ width: `${toastContent.progress}%` }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${progressClass}`}
                  />
                </div>

                {status === "downloading" && (
                  <div className={`mt-3 flex items-center gap-2 text-xs ${subTextClass}`}>
                    <Download size={14} />
                    Please keep this tab open until the browser download starts.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}