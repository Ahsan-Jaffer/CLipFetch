import { motion } from "framer-motion";
import { Download, Film, Loader2, Music2 } from "lucide-react";

export default function FormatOption({
  isDark,
  option,
  index,
  onDownload,
  isDownloading,
  isDownloadLocked,
}) {
  const Icon = option.type === "audio" ? Music2 : Film;

  const rowClass = isDark
    ? "border-white/10 bg-white/5 hover:bg-white/7"
    : "border-slate-200 bg-slate-50/80 hover:bg-white";

  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";

  const isDisabled = isDownloading || isDownloadLocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.32 }}
      className={`premium-card shine-card flex flex-col gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${rowClass}`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            isDark
              ? "bg-black/25 text-cyan-300 ring-1 ring-white/10"
              : "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
          }`}
        >
          <Icon size={18} />
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`text-sm font-bold sm:text-base ${titleClass}`}>
              {option.quality} {option.format}
            </h4>

            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                option.type === "audio"
                  ? "bg-violet-500/12 text-violet-500"
                  : "bg-blue-500/12 text-blue-500"
              }`}
            >
              {option.label}
            </span>
          </div>

          <p className={`mt-1 text-sm ${textClass}`}>{option.size}</p>
        </div>
      </div>

      <button
        onClick={() => onDownload(option)}
        disabled={isDisabled}
        title={isDownloadLocked ? "Another download is already being prepared." : ""}
        className={`premium-button inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] ${
          isDownloadLocked
            ? "cursor-not-allowed bg-slate-500 opacity-60"
            : option.type === "audio"
            ? "bg-gradient-to-r from-violet-500 to-fuchsia-600"
            : "bg-gradient-to-r from-blue-500 to-violet-600"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isDownloading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Preparing
          </>
        ) : (
          <>
            <Download size={16} />
            Download
          </>
        )}
      </button>
    </motion.div>
  );
}