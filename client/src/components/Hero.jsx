import { motion } from "framer-motion";
import { Music2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import UrlInput from "./UrlInput";

const platformBadges = ["YouTube", "Instagram", "TikTok", "Facebook"];

export default function Hero({
  isDark,
  url,
  setUrl,
  onAnalyze,
  error,
  isProcessing,
}) {
  const subText = isDark ? "text-slate-300" : "text-slate-600";
  const softText = isDark ? "text-slate-400" : "text-slate-500";
  const badgeClass = isDark
    ? "border-white/10 bg-white/5 text-slate-200"
    : "border-slate-200 bg-white/80 text-slate-700 shadow-sm";

  return (
    <section className="relative z-10 px-5 pt-16 md:px-8 md:pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-xl sm:text-sm ${badgeClass}`}
        >
          <Sparkles size={15} className="text-cyan-400" />
          Fast, clean & secure video downloads
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className={`mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Download videos{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">
            in seconds
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${subText}`}
        >
          A modern downloader UI for public video links. Paste a URL, preview
          available formats, and download in the simplest possible flow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.45 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {platformBadges.map((item) => (
            <span
              key={item}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl ${badgeClass}`}
            >
              {item}
            </span>
          ))}
        </motion.div>

        <UrlInput
          isDark={isDark}
          url={url}
          setUrl={setUrl}
          onAnalyze={onAnalyze}
          error={error}
          isProcessing={isProcessing}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-3"
        >
          <TrustChip isDark={isDark} icon={<Zap size={15} />} text="Fast" />
          <TrustChip
            isDark={isDark}
            icon={<ShieldCheck size={15} />}
            text="No signup"
          />
          <TrustChip
            isDark={isDark}
            icon={<Music2 size={15} />}
            text="MP4 / MP3"
          />
        </motion.div>

        <p className={`mt-4 text-sm ${softText}`}>
          Only for public or permitted content
        </p>
      </div>
    </section>
  );
}

function TrustChip({ isDark, icon, text }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium ${
        isDark
          ? "border-white/10 bg-white/5 text-slate-200"
          : "border-slate-200 bg-white/85 text-slate-700 shadow-sm"
      }`}
    >
      <span className="text-cyan-400">{icon}</span>
      {text}
    </span>
  );
}
