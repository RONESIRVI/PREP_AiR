import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DownloadCloud, X, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface UpdateInfo {
  version: string;
  body: string;
  url: string;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: UpdateInfo | null;
  onUpdateNow: () => void;
  progress: number | null; // null means not started, 100 means done
}

export function UpdateModal({
  isOpen,
  onClose,
  updateInfo,
  onUpdateNow,
  progress,
}: UpdateModalProps) {
  if (!updateInfo) return null;

  const isDownloading = progress !== null && progress < 100;
  const isCompleted = progress === 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={isDownloading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative shrink-0">
              {!isDownloading && !isCompleted && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h2 className="font-bold text-xl leading-tight">What's New</h2>
                  <p className="text-indigo-100 text-sm font-medium">Version {updateInfo.version}</p>
                </div>
              </div>
            </div>

            {/* Markdown Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="prose prose-sm prose-indigo max-w-none 
                prose-headings:font-bold prose-headings:text-slate-800 
                prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-md 
                prose-li:text-slate-600 prose-p:text-slate-600"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {updateInfo.body || "Performance improvements and bug fixes."}
                </ReactMarkdown>
              </div>
            </div>

            {/* Footer / Action Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              {progress === null ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={onUpdateNow}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <DownloadCloud className="w-6 h-6" />
                    UPDATE NOW
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-semibold text-sm transition"
                  >
                    MAYBE LATER
                  </button>
                </div>
              ) : isDownloading ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-indigo-700">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading Update...
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.2 }}
                    />
                  </div>
                  <p className="text-center text-xs text-slate-400 font-medium animate-pulse">
                    Please don't close the app
                  </p>
                </div>
              ) : (
                <div className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-6 h-6" />
                  Installing... Restarting App
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
