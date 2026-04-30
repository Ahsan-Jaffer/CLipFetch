import { motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";

export default function UrlInput({ isDark, url, setUrl, onAnalyze, error }) {
  const shellClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]";

  const inputWrapClass = isDark
    ? "bg-black/20 border-white/8"
    : "bg-slate-50 border-slate-200";

  const inputTextClass = isDark
    ? "text-white placeholder:text-slate-500"
    : "text-slate-900 placeholder:text-slate-400";

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`premium-input rounded-[28px] border p-2 backdrop-blur-xl ${shellClass}`}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className={`flex flex-1 items-center gap-3 rounded-[22px] border px-4 py-3 ${inputWrapClass}`}>
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                isDark ? "bg-white/8 text-slate-300" : "bg-white text-slate-500 shadow-sm"
              }`}
            >
              <Link2 size={18} />
            </span>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onAnalyze();
              }}
              placeholder="Paste video link here..."
              className={`w-full bg-transparent text-sm outline-none sm:text-[15px] ${inputTextClass}`}
            />
          </div>

          <button
            onClick={onAnalyze}
            className="premium-button group inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(79,70,229,0.35)]"
          >
            Analyze
            <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm font-medium text-rose-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}