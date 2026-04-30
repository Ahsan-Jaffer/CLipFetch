import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`relative flex h-11 w-20 items-center rounded-full border px-1.5 transition ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
      }`}
    >
      <motion.span
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className="absolute left-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-white"
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.span>

      <span className="flex w-full items-center justify-between px-1 text-xs font-semibold">
        <span className={isDark ? "text-slate-500" : "text-slate-700"}>L</span>
        <span className={isDark ? "text-slate-200" : "text-slate-400"}>D</span>
      </span>
    </button>
  );
}