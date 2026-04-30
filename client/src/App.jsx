import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProcessingCard from "./components/ProcessingCard";
import ProcessSteps from "./components/ProcessSteps";
import ResultCard from "./components/ResultCard";
import { analyzeVideoUrl } from "./utils/api";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("clipfetch-theme") || "dark";
  });

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("clipfetch-theme", theme);
    document.body.style.backgroundColor = isDark ? "#060816" : "#f5f7fb";
  }, [theme, isDark]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleAnalyze = async () => {
    try {
      if (!url.trim()) {
        setError("Please paste a video link first.");
        return;
      }

      setError("");
      setHasResult(false);
      setVideoData(null);
      setIsProcessing(true);

      const result = await analyzeVideoUrl(url);

      if (!result?.success || !result?.data) {
        throw new Error(result?.message || "Could not analyze this video link.");
      }

      setVideoData(result.data);
      setHasResult(true);

      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (error) {
      setHasResult(false);
      setVideoData(null);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pageClasses = useMemo(() => {
    return isDark ? "bg-[#060816] text-white" : "bg-[#f5f7fb] text-slate-900";
  }, [isDark]);

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${pageClasses}`}
    >
      <BackgroundFx isDark={isDark} />

      <div className="relative z-10">
        <Navbar isDark={isDark} onToggleTheme={handleToggleTheme} />

        <Hero
          isDark={isDark}
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          error={error}
        />

        <ProcessSteps isDark={isDark} />

        <section id="result-section" className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-5xl">
            <AnimatePresence mode="wait">
              {isProcessing && (
                <ProcessingCard key="processing" isDark={isDark} />
              )}

              {!isProcessing && hasResult && (
                <ResultCard
                  key="result"
                  isDark={isDark}
                  video={videoData}
                />
              )}
            </AnimatePresence>

            {!isProcessing && !hasResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className={`mt-8 rounded-[28px] border p-6 text-center backdrop-blur-xl ${
                  isDark
                    ? "border-white/10 bg-white/5 text-slate-400"
                    : "border-slate-200 bg-white/75 text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
                }`}
              >
                Paste a link above to preview available download formats.
              </motion.div>
            )}
          </div>
        </section>

        <Footer isDark={isDark} />
      </div>
    </main>
  );
}

function BackgroundFx({ isDark }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className={isDark ? "aurora-bg" : "aurora-bg-light"} />

      <div
        className={`absolute inset-0 ${
          isDark ? "bg-[#060816]/82" : "bg-[#f5f7fb]/78"
        }`}
      />

      <div
        className={`moving-grid absolute inset-0 ${
          isDark
            ? "bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)]"
        } bg-[size:72px_72px]`}
      />

      <div
        className={`float-blob-slow absolute left-[7%] top-[18%] h-44 w-44 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/18" : "bg-blue-300/35"
        }`}
      />

      <div
        className={`float-blob-medium absolute right-[9%] top-[15%] h-56 w-56 rounded-full blur-3xl ${
          isDark ? "bg-violet-500/18" : "bg-violet-300/35"
        }`}
      />

      <div
        className={`float-blob-slow absolute bottom-[8%] right-[14%] h-72 w-72 rounded-full blur-3xl ${
          isDark ? "bg-blue-500/12" : "bg-sky-300/35"
        }`}
      />

      <div
        className={`rotate-ring absolute left-[6%] top-[45%] h-40 w-40 rounded-full border ${
          isDark ? "border-white/8" : "border-slate-300/60"
        }`}
      />

      <div
        className={`absolute -right-20 bottom-20 h-80 w-80 rounded-full border ${
          isDark ? "border-violet-400/10" : "border-violet-300/40"
        }`}
      />
    </div>
  );
}