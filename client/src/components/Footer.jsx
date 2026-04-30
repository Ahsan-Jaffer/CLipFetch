import { Play } from "lucide-react";

export default function Footer({ isDark }) {
  return (
    <footer
      className={`border-t px-5 py-7 md:px-8 ${
        isDark ? "border-white/10" : "border-slate-200"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white">
            <Play size={16} className="fill-white text-white" />
          </span>

          <span className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
            Clip<span className="text-cyan-400">Fetch</span>
          </span>
        </div>

        <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
          © 2025 ClipFetch. All rights reserved.
        </p>

        <div className={`flex items-center gap-5 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <a href="#" className="transition hover:text-blue-500">
            Terms
          </a>
          <a href="#" className="transition hover:text-blue-500">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}