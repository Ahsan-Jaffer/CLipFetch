import { motion } from "framer-motion";
import { Download, Link2, Search } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Paste link",
    description: "Insert a public video URL.",
    icon: Link2,
  },
  {
    id: "02",
    title: "Analyze",
    description: "Preview available formats.",
    icon: Search,
  },
  {
    id: "03",
    title: "Download",
    description: "Save video or audio instantly.",
    icon: Download,
  },
];

export default function ProcessSteps({ isDark }) {
  const cardClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]";

  const titleClass = isDark ? "text-white" : "text-slate-900";
  const textClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <section id="how-it-works" className="relative z-10 px-5 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 text-center"
        >
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${textClass}`}>
            Simple workflow
          </p>
          <h2 className={`mt-2 text-2xl font-black ${titleClass}`}>
            Clean, fast and easy to use
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`premium-card shine-card rounded-[26px] border p-5 backdrop-blur-xl ${cardClass}`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 text-white shadow-[0_10px_30px_rgba(59,130,246,0.25)]">
                    <Icon size={18} />
                  </span>

                  <span className={`text-xs font-bold ${textClass}`}>{step.id}</span>
                </div>

                <h3 className={`mt-4 text-lg font-bold ${titleClass}`}>{step.title}</h3>
                <p className={`mt-2 text-sm leading-6 ${textClass}`}>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}