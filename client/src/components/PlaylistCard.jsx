import { motion } from "framer-motion";
import {
  Clock3,
  Download,
  ListVideo,
  Play,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PlaylistCard({
  isDark,
  playlist,
  onSelectVideo,
  isProcessing,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return playlist.items || [];
    }

    return (playlist.items || []).filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [playlist.items, searchTerm]);

  const shellClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/85 shadow-[0_28px_80px_rgba(15,23,42,0.08)]";

  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-white/10 bg-black/20 text-white placeholder:text-slate-500"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`premium-card mt-8 rounded-[32px] border p-4 backdrop-blur-xl md:p-6 ${shellClass}`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/12 px-3 py-1.5 text-sm font-semibold text-violet-500">
            <ListVideo size={16} />
            Playlist
          </div>

          <h2
            className={`mt-4 text-2xl font-black leading-tight md:text-3xl ${titleClass}`}
          >
            {playlist.playlistTitle}
          </h2>

          <p className={`mt-2 text-sm leading-6 ${textClass}`}>
            {playlist.videoCount} videos found. Choose any video and download it
            one by one.
          </p>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            isDark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"
          }`}
        >
          {filteredItems.length} shown
        </div>
      </div>

      <div className={`mt-6 flex items-center gap-3 rounded-2xl border px-4 py-3 ${inputClass}`}>
        <Search size={18} className={isDark ? "text-slate-500" : "text-slate-400"} />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search playlist videos..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filteredItems.length === 0 ? (
          <div
            className={`rounded-2xl border p-5 text-center text-sm ${
              isDark
                ? "border-white/10 bg-black/15 text-slate-400"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            No videos found for this search.
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <PlaylistItem
              key={`${item.id}-${item.index}`}
              isDark={isDark}
              item={item}
              index={index}
              onSelectVideo={onSelectVideo}
              isProcessing={isProcessing}
            />
          ))
        )}
      </div>
    </motion.section>
  );
}

function PlaylistItem({ isDark, item, index, onSelectVideo, isProcessing }) {
  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";
  const rowClass = isDark
    ? "border-white/10 bg-white/5 hover:bg-white/7"
    : "border-slate-200 bg-slate-50/80 hover:bg-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.5), duration: 0.28 }}
      className={`premium-card shine-card flex flex-col gap-4 rounded-2xl border p-3 transition md:flex-row md:items-center md:justify-between ${rowClass}`}
    >
      <div className="flex min-w-0 gap-4">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl bg-slate-900">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-white">
              <Play size={28} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <span className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white">
            #{item.index}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className={`line-clamp-2 text-sm font-black md:text-base ${titleClass}`}>
            {item.title}
          </h3>

          <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs ${textClass}`}>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {item.duration}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {item.uploader}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelectVideo(item)}
        disabled={isProcessing}
        className="premium-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download size={16} />
        Prepare Download
      </button>
    </motion.div>
  );
}