import { motion } from "framer-motion";
import { Play } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ isDark, onToggleTheme }) {
  const linkClass = isDark
    ? "text-slate-300 hover:text-white"
    : "text-slate-600 hover:text-slate-900";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${
        isDark
          ? "border-white/10 bg-[#060816]/65"
          : "border-slate-200 bg-white/70"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]">
            <Play size={18} className="fill-white text-white" />
          </span>

          <span
            className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Clip<span className="text-cyan-400">Fetch</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className={`nav-link-premium text-sm font-medium transition ${linkClass}`}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className={`nav-link-premium text-sm font-medium transition ${linkClass}`}
          >
            How it works
          </a>
          <a
            href="#result-section"
            className={`text-sm font-medium transition ${linkClass}`}
          >
            Preview
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          <button className="premium-button hidden rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(79,70,229,0.35)] sm:inline-flex">
            Get Started
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
