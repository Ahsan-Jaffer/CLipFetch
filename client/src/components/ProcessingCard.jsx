import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const steps = [
  "Checking link",
  "Fetching video info",
  "Preparing formats",
];

export default function ProcessingCard({ isDark }) {
  const shellClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)]";

  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`mt-8 rounded-[30px] border p-6 backdrop-blur-xl ${shellClass}`}
    >
      <div className="flex items-center gap-3">
        <Loader2 size={20} className="animate-spin text-cyan-400" />
        <h3 className={`text-lg font-bold ${titleClass}`}>Analyzing your link...</h3>
      </div>

      <div className="mt-5 space-y-3">
        {steps.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.22, duration: 0.35 }}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              isDark
                ? "border-white/10 bg-black/15"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {index < 2 ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <Loader2 size={18} className="animate-spin text-blue-500" />
            )}
            <span className={`text-sm font-medium ${titleClass}`}>{item}</span>
          </motion.div>
        ))}
      </div>

      <div className={`mt-5 h-2 overflow-hidden rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
        <motion.div
          initial={{ width: "12%" }}
          animate={{ width: "85%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-600"
        />
      </div>

      <p className={`mt-3 text-sm ${textClass}`}>This is a preview flow. Backend download connection comes next.</p>
    </motion.div>
  );
}