import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ARCHIVE_PROVENANCE, CanvasTheme } from '../data/artworkCopy';

interface SourceArchiveModalProps {
  open: boolean;
  onClose: () => void;
  theme: CanvasTheme;
}

export const SourceArchiveModal: React.FC<SourceArchiveModalProps> = ({
  open,
  onClose,
  theme,
}) => {
  const isInk = theme === 'ink';

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl rounded-2xl border overflow-hidden ${
              isInk
                ? 'bg-[#191715] border-white/15 text-[#EAE4DA]'
                : 'bg-[#FAF8F4] border-[#DED8CC] text-[#1C1917]'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                isInk ? 'border-white/10' : 'border-[#E6E0D5]'
              }`}
            >
              <div>
                <h2 id="archive-modal-title" className="text-base font-semibold">
                  原图溯源 · 片段档案
                </h2>
                <p className={`text-xs mt-0.5 ${isInk ? 'text-[#9A9287]' : 'text-[#70685F]'}`}>
                  {ARCHIVE_PROVENANCE.author} · {ARCHIVE_PROVENANCE.timestamp}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭原图溯源窗口"
                className={`p-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                  isInk
                    ? 'text-[#B5ADA2] hover:text-white hover:bg-white/10 focus-visible:ring-white/50'
                    : 'text-[#6E665C] hover:text-[#1C1917] hover:bg-black/5 focus-visible:ring-[#1C1917]/40'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div
                className={`rounded-xl border overflow-hidden ${
                  isInk ? 'border-white/10 bg-black/40' : 'border-[#E2DDD3] bg-[#F1ECE2]'
                }`}
              >
                <img
                  src={ARCHIVE_PROVENANCE.imagePath}
                  alt="原始文案截图：孔智亦发布「能遇见就是缘，哪怕就匆匆一眼」"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[360px] object-contain mx-auto"
                />
              </div>

              <dl
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t ${
                  isInk ? 'border-white/10' : 'border-[#E6E0D5]'
                }`}
              >
                <div>
                  <dt className={`text-xs ${isInk ? 'text-[#9A9287]' : 'text-[#787066]'}`}>
                    摘录正文
                  </dt>
                  <dd className="mt-1 font-medium">{ARCHIVE_PROVENANCE.copyFull}</dd>
                </div>
                <div>
                  <dt className={`text-xs ${isInk ? 'text-[#9A9287]' : 'text-[#787066]'}`}>
                    画面印记
                  </dt>
                  <dd className="mt-1">
                    {ARCHIVE_PROVENANCE.admirer} 赞了 · 四叶草信笺
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
