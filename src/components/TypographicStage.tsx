import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PHRASE_ONE,
  PHRASE_TWO,
  GlyphItem,
  FontPreset,
  LayoutOrientation,
  CanvasTheme,
  ARCHIVE_PROVENANCE,
} from '../data/artworkCopy';
import { soundEngine } from '../utils/soundEngine';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  kind: 'canvas' | 'glyph';
}

interface GlyphBurst {
  id: number;
  glyphId: string;
}

interface TypographicStageProps {
  fontPreset: FontPreset;
  orientation: LayoutOrientation;
  theme: CanvasTheme;
  entranceKey: number;
  activeGlyph: GlyphItem | null;
  onSelectGlyph: (glyph: GlyphItem) => void;
  resonanceCount: number;
  isStamped: boolean;
  onStampSeal: () => void;
}

const CloverLeafIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 11C12 8 9.5 5 7 6.5C4.5 8 7.5 11.5 12 11Z" />
    <path d="M12 11C12 8 14.5 5 17 6.5C19.5 8 16.5 11.5 12 11Z" />
    <path d="M12 11C9 11 5.5 13 7 15.8C8.5 18.5 11.5 15 12 11Z" />
    <path d="M12 11C15 11 18.5 13 17 15.8C15.5 18.5 12.5 15 12 11Z" />
    <path d="M12 11.5C12 15.5 12.6 18.5 14 21" />
  </svg>
);

export const TypographicStage: React.FC<TypographicStageProps> = ({
  fontPreset,
  orientation,
  theme,
  entranceKey,
  activeGlyph,
  onSelectGlyph,
  resonanceCount,
  isStamped,
  onStampSeal,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [canvasRipples, setCanvasRipples] = useState<RippleEffect[]>([]);
  const [glyphBursts, setGlyphBursts] = useState<GlyphBurst[]>([]);
  const [sealAnimKey, setSealAnimKey] = useState(0);

  const isInk = theme === 'ink';

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    soundEngine.playWaterRipple();
    setCanvasRipples((prev) => [...prev.slice(-5), { id, x, y, kind: 'canvas' }]);

    window.setTimeout(() => {
      setCanvasRipples((prev) => prev.filter((item) => item.id !== id));
    }, 1100);
  }, []);

  const handleGlyphClick = useCallback(
    (glyph: GlyphItem, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      soundEngine.playGlyphNote(glyph.noteIndex, 13);
      onSelectGlyph(glyph);

      const id = Date.now() + Math.random();
      setGlyphBursts((prev) => [...prev.slice(-8), { id, glyphId: glyph.id }]);
      window.setTimeout(() => {
        setGlyphBursts((prev) => prev.filter((item) => item.id !== id));
      }, 950);
    },
    [onSelectGlyph]
  );

  const handleSealClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      soundEngine.playSealStamp();
      setSealAnimKey((k) => k + 1);
      onStampSeal();
    },
    [onStampSeal]
  );

  const renderGlyphButton = (glyph: GlyphItem, globalIndex: number) => {
    const isActive = activeGlyph?.id === glyph.id;
    const activeBursts = glyphBursts.filter((b) => b.glyphId === glyph.id);

    const sizeClasses =
      orientation === 'horizontal'
        ? glyph.emphasized
          ? 'text-[clamp(2.6rem,5.4vw,4.75rem)]'
          : 'text-[clamp(2.2rem,4.5vw,3.9rem)]'
        : glyph.emphasized
          ? 'text-[clamp(2.3rem,4.1vw,3.85rem)]'
          : 'text-[clamp(2rem,3.6vw,3.35rem)]';

    const colorClasses = isActive
      ? isInk
        ? 'text-[#E3B89E]'
        : 'text-[#8C3B2B]'
      : glyph.emphasized
        ? isInk
          ? 'text-[#F6F2EA]'
          : 'text-[#181512]'
        : isInk
          ? 'text-[#D6CFC3]'
          : 'text-[#3A352F]';

    return (
      <motion.button
        key={`${entranceKey}-${fontPreset.id}-${orientation}-${glyph.id}`}
        type="button"
        onClick={(e) => handleGlyphClick(glyph, e)}
        aria-label={`点击字形「${glyph.char}」聆听音律并阅读释义`}
        initial={{ opacity: 0, y: 26, scale: 0.9, filter: 'blur(7px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{
          duration: 0.72,
          delay: 0.14 + globalIndex * 0.085,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          y: -4,
          scale: 1.07,
          transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
        }}
        whileTap={{
          scale: 0.93,
          transition: { duration: 0.1 },
        }}
        className={`relative group inline-flex items-center justify-center min-w-[44px] min-h-[48px] px-1.5 sm:px-2.5 py-1 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 rounded-lg transition-colors duration-200 ${
          isInk
            ? 'focus-visible:ring-[#E3B89E] focus-visible:ring-offset-[#121110]'
            : 'focus-visible:ring-[#8C3B2B] focus-visible:ring-offset-[#F7F4EE]'
        }`}
      >
        {/* Subtle hover/active ink halo */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
          } ${
            isInk
              ? 'bg-[radial-gradient(circle,rgba(227,184,158,0.16)_0%,transparent_72%)]'
              : 'bg-[radial-gradient(circle,rgba(140,59,43,0.10)_0%,transparent_72%)]'
          }`}
        />

        {/* Click ripple & floating clover particles */}
        <AnimatePresence>
          {activeBursts.map((burst) => (
            <React.Fragment key={burst.id}>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0.65, scale: 0.45 }}
                animate={{ opacity: 0, scale: 2.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-none absolute inset-0 m-auto w-12 h-12 rounded-full border ${
                  isInk ? 'border-[#E3B89E]/60' : 'border-[#8C3B2B]/45'
                }`}
              />
              {[0, 1, 2].map((particleIdx) => {
                const angle = (particleIdx * 120 - 40) * (Math.PI / 180);
                const dx = Math.cos(angle) * 34;
                const dy = Math.sin(angle) * 34 - 10;
                return (
                  <motion.span
                    key={`${burst.id}-p-${particleIdx}`}
                    aria-hidden="true"
                    initial={{ opacity: 0.9, x: 0, y: 0, scale: 0.5, rotate: 0 }}
                    animate={{
                      opacity: 0,
                      x: dx,
                      y: dy,
                      scale: 1,
                      rotate: particleIdx % 2 === 0 ? 45 : -45,
                    }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className={`pointer-events-none absolute ${
                      isInk ? 'text-[#89A88F]' : 'text-[#3E6B4C]'
                    }`}
                  >
                    <CloverLeafIcon className="w-3.5 h-3.5" />
                  </motion.span>
                );
              })}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* Character Glyph */}
        <span
          className={`relative z-10 leading-none tracking-wider transition-colors duration-200 ${fontPreset.className} ${sizeClasses} ${colorClasses}`}
        >
          {glyph.char}
        </span>

        {/* Subtle underline dot when selected */}
        {isActive && (
          <motion.span
            layoutId="activeGlyphDot"
            aria-hidden="true"
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
              isInk ? 'bg-[#E3B89E]' : 'bg-[#8C3B2B]'
            }`}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div
      ref={stageRef}
      onClick={handleCanvasClick}
      className="relative w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 sm:py-10 overflow-hidden cursor-default"
    >
      {/* Ambient Canvas Water-Ink Ripples */}
      <AnimatePresence>
        {canvasRipples.map((ripple) => (
          <motion.span
            key={ripple.id}
            aria-hidden="true"
            initial={{ opacity: 0.36, scale: 0.15 }}
            animate={{ opacity: 0, scale: 3.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: ripple.x - 40, top: ripple.y - 40 }}
            className={`pointer-events-none absolute w-20 h-20 rounded-full border ${
              isInk ? 'border-[#D6CFC3]/35' : 'border-[#2D5A3C]/25'
            }`}
          />
        ))}
      </AnimatePresence>

      {/* Curatorial Inner Frame with Delicate Corner Marks */}
      <motion.div
        key={`frame-${entranceKey}`}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-5xl rounded-2xl border px-6 sm:px-14 md:px-20 py-12 sm:py-16 md:py-20 transition-colors duration-500 ${
          isInk
            ? 'border-white/10 bg-[#181614]/80 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75)]'
            : 'border-[#E2DDD3] bg-[#FCFBF8]/85 shadow-[0_20px_60px_-25px_rgba(40,32,20,0.12)]'
        }`}
      >
        {/* Subtle Corner Registration Hairlines */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-4 left-4 w-3 h-3 border-t border-l ${
            isInk ? 'border-white/20' : 'border-[#B8B0A2]'
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-4 right-4 w-3 h-3 border-t border-r ${
            isInk ? 'border-white/20' : 'border-[#B8B0A2]'
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-4 left-4 w-3 h-3 border-b border-l ${
            isInk ? 'border-white/20' : 'border-[#B8B0A2]'
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-4 right-4 w-3 h-3 border-b border-r ${
            isInk ? 'border-white/20' : 'border-[#B8B0A2]'
          }`}
        />

        {/* Quiet Top Exhibition Caption */}
        <motion.div
          key={`caption-top-${entranceKey}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center justify-center gap-2.5 text-xs tracking-[0.2em] mb-8 sm:mb-12 ${
            isInk ? 'text-[#9A9287]' : 'text-[#787066]'
          }`}
        >
          <CloverLeafIcon className={`w-3.5 h-3.5 ${isInk ? 'text-[#89A88F]' : 'text-[#3E6B4C]'}`} />
          <span className="font-latin italic tracking-[0.14em] text-[13px]">Lucky Clover</span>
          <span aria-hidden="true">·</span>
          <span>轻触文字可聆听音律与字意</span>
        </motion.div>

        {/* Central Artistic Typography Composition */}
        {orientation === 'horizontal' ? (
          <div className="flex flex-col items-center justify-center gap-5 sm:gap-8">
            {/* Phrase 1: 能遇见就是缘 */}
            <div
              className="flex flex-wrap items-baseline justify-center gap-x-1 sm:gap-x-3 md:gap-x-4"
              role="group"
              aria-label="能遇见就是缘"
            >
              {PHRASE_ONE.map((glyph, idx) => renderGlyphButton(glyph, idx))}
            </div>

            {/* Poetic Breath Divider */}
            <motion.div
              key={`divider-${entranceKey}`}
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-4 w-48 sm:w-64"
              aria-hidden="true"
            >
              <span
                className={`h-px flex-1 ${isInk ? 'bg-white/15' : 'bg-[#D6CFC2]'}`}
              />
              <span
                className={`text-lg ${fontPreset.className} ${
                  isInk ? 'text-[#89A88F]' : 'text-[#3E6B4C]'
                }`}
              >
                ，
              </span>
              <span
                className={`h-px flex-1 ${isInk ? 'bg-white/15' : 'bg-[#D6CFC2]'}`}
              />
            </motion.div>

            {/* Phrase 2: 哪怕就匆匆一眼 */}
            <div
              className="flex flex-wrap items-baseline justify-center gap-x-1 sm:gap-x-3 md:gap-x-4"
              role="group"
              aria-label="哪怕就匆匆一眼"
            >
              {PHRASE_TWO.map((glyph, idx) => renderGlyphButton(glyph, idx + PHRASE_ONE.length))}
            </div>
          </div>
        ) : (
          /* Vertical Traditional Hanging Scroll Layout (Right-to-Left) */
          <div className="flex flex-row-reverse items-start justify-center gap-8 sm:gap-14 md:gap-20 py-2">
            <div
              className="flex flex-col items-center gap-1 sm:gap-2"
              role="group"
              aria-label="能遇见就是缘"
            >
              {PHRASE_ONE.map((glyph, idx) => renderGlyphButton(glyph, idx))}
            </div>

            <div
              className="flex flex-col items-center gap-1 sm:gap-2 mt-8 sm:mt-12"
              role="group"
              aria-label="哪怕就匆匆一眼"
            >
              {PHRASE_TWO.map((glyph, idx) => renderGlyphButton(glyph, idx + PHRASE_ONE.length))}
            </div>
          </div>
        )}

        {/* Interactive Glyph Annotation & Vermilion Seal Row */}
        <motion.div
          key={`footer-stage-${entranceKey}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-10 sm:mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isInk ? 'border-white/10' : 'border-[#E6E0D5]'
          }`}
        >
          {/* Active Glyph Meaning or Default Provenance */}
          <div className="min-h-[44px] flex items-center text-center sm:text-left">
            <AnimatePresence mode="wait">
              {activeGlyph ? (
                <motion.div
                  key={activeGlyph.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-sm"
                >
                  <span
                    className={`font-semibold text-base ${fontPreset.className} ${
                      isInk ? 'text-[#E3B89E]' : 'text-[#8C3B2B]'
                    }`}
                  >
                    {activeGlyph.char}
                  </span>
                  <span
                    className={`font-latin italic text-sm ${
                      isInk ? 'text-[#A89F93]' : 'text-[#7A7167]'
                    }`}
                  >
                    {activeGlyph.pinyin}
                  </span>
                  <span aria-hidden="true" className={isInk ? 'text-white/25' : 'text-[#C8C0B4]'}>
                    ·
                  </span>
                  <span className={isInk ? 'text-[#DDD6CA]' : 'text-[#3D3730]'}>
                    {activeGlyph.poeticNote}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default-provenance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm ${
                    isInk ? 'text-[#9A9287]' : 'text-[#6E665C]'
                  }`}
                >
                  <span>{ARCHIVE_PROVENANCE.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{ARCHIVE_PROVENANCE.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span>{ARCHIVE_PROVENANCE.motifNote}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vermilion Stone Seal & Resonance Interaction */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              key={`seal-${sealAnimKey}`}
              type="button"
              onClick={handleSealClick}
              initial={{ opacity: 0, scale: 1.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.48,
                delay: sealAnimKey === 0 ? 1.45 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              className={`group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                isStamped
                  ? isInk
                    ? 'border-[#C86B5A]/60 bg-[#C86B5A]/15 text-[#E8A598] focus-visible:ring-[#E8A598]'
                    : 'border-[#9B3E2E]/40 bg-[#9B3E2E]/8 text-[#8C3223] focus-visible:ring-[#8C3223]'
                  : isInk
                    ? 'border-white/15 bg-white/5 text-[#D6CFC3] hover:border-[#C86B5A]/50 focus-visible:ring-[#E3B89E]'
                    : 'border-[#DCD5C9] bg-[#F4F0E8] text-[#4A433B] hover:border-[#9B3E2E]/40 focus-visible:ring-[#8C3B2B]'
              }`}
              aria-label="落印留赞，与这句文案结缘"
            >
              {/* Traditional Square Vermilion Seal Graphic */}
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center w-6 h-6 rounded-[4px] border font-brush text-xs leading-none transition-colors ${
                  isStamped
                    ? 'bg-[#9B3E2E] border-[#9B3E2E] text-[#FAF6F0]'
                    : isInk
                      ? 'border-[#C86B5A]/60 text-[#E3B89E]'
                      : 'border-[#9B3E2E]/60 text-[#9B3E2E]'
                }`}
              >
                缘
              </span>
              <span>{isStamped ? '已落印结缘' : '落印赞赏'}</span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span className="tabular-nums">{resonanceCount}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
