/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Columns2, Rows2, Sun, Moon } from 'lucide-react';
import {
  FONT_PRESETS,
  FontPresetId,
  LayoutOrientation,
  CanvasTheme,
  GlyphItem,
  PHRASE_ONE,
  PHRASE_TWO,
} from './data/artworkCopy';
import { soundEngine } from './utils/soundEngine';
import { TypographicStage } from './components/TypographicStage';
import { SourceArchiveModal } from './components/SourceArchiveModal';

const ALL_GLYPHS: GlyphItem[] = [...PHRASE_ONE, ...PHRASE_TWO];

export default function App() {
  const [fontId, setFontId] = useState<FontPresetId>('cursive');
  const [orientation, setOrientation] = useState<LayoutOrientation>('horizontal');
  const [theme, setTheme] = useState<CanvasTheme>('paper');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [entranceKey, setEntranceKey] = useState<number>(1);
  const [activeGlyph, setActiveGlyph] = useState<GlyphItem | null>(null);
  const [resonanceCount, setResonanceCount] = useState<number>(1); // 槐之冬. 赞了 (1)
  const [isStamped, setIsStamped] = useState<boolean>(false);
  const [archiveOpen, setArchiveOpen] = useState<boolean>(false);
  const [isReciting, setIsReciting] = useState<boolean>(false);

  const reciteTimersRef = useRef<number[]>([]);

  const currentFont = FONT_PRESETS.find((f) => f.id === fontId) ?? FONT_PRESETS[0];
  const isInk = theme === 'ink';

  // Clear scheduled recitation timers
  const clearReciteTimers = useCallback(() => {
    reciteTimersRef.current.forEach((id) => window.clearTimeout(id));
    reciteTimersRef.current = [];
    setIsReciting(false);
  }, []);

  // Unlock Web Audio context smoothly on first user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      soundEngine.unlock();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      clearReciteTimers();
    };
  }, [clearReciteTimers]);

  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
    if (next) {
      soundEngine.unlock();
      soundEngine.playStyleSwitch();
    } else {
      clearReciteTimers();
    }
  }, [soundEnabled, clearReciteTimers]);

  const handleReplayEntrance = useCallback(() => {
    clearReciteTimers();
    setActiveGlyph(null);
    setEntranceKey((k) => k + 1);
    if (soundEnabled) {
      soundEngine.unlock();
      soundEngine.playEntranceSequence();
    }
  }, [clearReciteTimers, soundEnabled]);

  const handleReciteMelody = useCallback(() => {
    if (isReciting) {
      clearReciteTimers();
      return;
    }
    clearReciteTimers();
    setIsReciting(true);
    soundEngine.unlock();

    ALL_GLYPHS.forEach((glyph, idx) => {
      const delay = idx * 240;
      const timer = window.setTimeout(() => {
        setActiveGlyph(glyph);
        if (soundEngine.isEnabled()) {
          soundEngine.playGlyphNote(glyph.noteIndex, ALL_GLYPHS.length);
        }
        if (idx === ALL_GLYPHS.length - 1) {
          const endTimer = window.setTimeout(() => {
            setIsReciting(false);
          }, 900);
          reciteTimersRef.current.push(endTimer);
        }
      }, delay);
      reciteTimersRef.current.push(timer);
    });
  }, [isReciting, clearReciteTimers]);

  const handleSelectFont = useCallback(
    (nextId: FontPresetId) => {
      if (nextId === fontId) return;
      clearReciteTimers();
      setFontId(nextId);
      soundEngine.playStyleSwitch();
    },
    [fontId, clearReciteTimers]
  );

  const handleToggleOrientation = useCallback(() => {
    clearReciteTimers();
    setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
    soundEngine.playStyleSwitch();
  }, [clearReciteTimers]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'paper' ? 'ink' : 'paper'));
    soundEngine.playStyleSwitch();
  }, []);

  const handleStampSeal = useCallback(() => {
    setIsStamped((prev) => {
      const next = !prev;
      setResonanceCount((c) => (next ? c + 1 : Math.max(1, c - 1)));
      return next;
    });
  }, []);

  const handleSelectGlyph = useCallback(
    (glyph: GlyphItem) => {
      clearReciteTimers();
      setActiveGlyph(glyph);
    },
    [clearReciteTimers]
  );

  return (
    <div
      className={`min-h-screen w-full flex flex-col paper-grain transition-colors duration-500 ${
        isInk ? 'bg-[#121110] text-[#F2ECE1]' : 'bg-[#F7F4EE] text-[#1C1917]'
      }`}
    >
      {/* Top Bar (Strict 3-Zone Contract) */}
      <header
        className={`w-full border-b transition-colors duration-500 ${
          isInk ? 'border-white/10' : 'border-[#E2DDD3]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleReplayEntrance();
            }}
            className="text-lg sm:text-xl font-semibold tracking-wide whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
          >
            匆匆一眼
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="展览互动导航"
            className={`hidden sm:flex items-center gap-6 text-sm font-medium ${
              isInk ? 'text-[#B5ADA2]' : 'text-[#5E574F]'
            }`}
          >
            <button
              type="button"
              onClick={handleReciteMelody}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline ${
                isReciting
                  ? isInk
                    ? 'text-[#E3B89E]'
                    : 'text-[#8C3B2B]'
                  : isInk
                    ? 'hover:text-[#F6F2EA]'
                    : 'hover:text-[#1C1917]'
              }`}
            >
              {isReciting ? '停止吟诵' : '全句朗韵'}
            </button>
            <button
              type="button"
              onClick={handleReplayEntrance}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline ${
                isInk ? 'hover:text-[#F6F2EA]' : 'hover:text-[#1C1917]'
              }`}
            >
              重现出场
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playStyleSwitch();
                setArchiveOpen(true);
              }}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline ${
                isInk ? 'hover:text-[#F6F2EA]' : 'hover:text-[#1C1917]'
              }`}
            >
              原图溯源
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleSound}
              aria-pressed={soundEnabled}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                soundEnabled
                  ? isInk
                    ? 'bg-[#EAE4DA] text-[#141210] hover:bg-white focus-visible:ring-[#EAE4DA]'
                    : 'bg-[#1C1917] text-[#FAF8F4] hover:bg-[#332E2A] focus-visible:ring-[#1C1917]'
                  : isInk
                    ? 'border border-white/20 text-[#B5ADA2] hover:text-white focus-visible:ring-white/40'
                    : 'border border-[#D4CEC2] text-[#5E574F] hover:text-[#1C1917] focus-visible:ring-[#1C1917]/40'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{soundEnabled ? '声景已启' : '静音模式'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Artistic Typography Exhibition Stage */}
      <main id="top" className="flex-1 flex flex-col justify-between max-w-7xl w-full mx-auto">
        <TypographicStage
          fontPreset={currentFont}
          orientation={orientation}
          theme={theme}
          entranceKey={entranceKey}
          activeGlyph={activeGlyph}
          onSelectGlyph={handleSelectGlyph}
          resonanceCount={resonanceCount}
          isStamped={isStamped}
          onStampSeal={handleStampSeal}
        />

        {/* Exhibition Stage Controls Bar */}
        <section
          aria-label="字体与版式控制栏"
          className="w-full px-4 sm:px-8 pb-6 sm:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4"
        >
          {/* Font Family Segmented Selector */}
          <div
            role="tablist"
            aria-label="艺术字体切换"
            className={`flex flex-wrap items-center justify-center gap-1 p-1 rounded-xl border transition-colors ${
              isInk
                ? 'bg-[#1A1816] border-white/10'
                : 'bg-[#EFECE4] border-[#E0DAD0]'
            }`}
          >
            {FONT_PRESETS.map((preset) => {
              const selected = preset.id === fontId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => handleSelectFont(preset.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                    selected
                      ? isInk
                        ? 'bg-[#2C2824] text-[#F6F2EA] shadow-sm focus-visible:ring-[#E3B89E]'
                        : 'bg-[#FFFFFF] text-[#1C1917] shadow-sm focus-visible:ring-[#8C3B2B]'
                      : isInk
                        ? 'text-[#9E968B] hover:text-[#EAE4DA] focus-visible:ring-white/30'
                        : 'text-[#6B6359] hover:text-[#1C1917] focus-visible:ring-[#1C1917]/30'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Stage Utility Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Mobile-accessible Recite button */}
            <button
              type="button"
              onClick={handleReciteMelody}
              className={`sm:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isInk
                  ? 'border-white/15 bg-[#1A1816] text-[#EAE4DA]'
                  : 'border-[#DDD7CB] bg-[#FCFBF8] text-[#2B2622]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isReciting ? '停止吟诵' : '全句朗韵'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleOrientation}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                isInk
                  ? 'border-white/15 bg-[#1A1816] text-[#D6CFC3] hover:text-white hover:border-white/25 focus-visible:ring-white/40'
                  : 'border-[#DDD7CB] bg-[#FCFBF8] text-[#4A433B] hover:text-[#1C1917] hover:border-[#C7BFB1] focus-visible:ring-[#1C1917]/30'
              }`}
            >
              {orientation === 'horizontal' ? (
                <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Rows2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{orientation === 'horizontal' ? '切换竖轴' : '切换横卷'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                isInk
                  ? 'border-white/15 bg-[#1A1816] text-[#D6CFC3] hover:text-white hover:border-white/25 focus-visible:ring-white/40'
                  : 'border-[#DDD7CB] bg-[#FCFBF8] text-[#4A433B] hover:text-[#1C1917] hover:border-[#C7BFB1] focus-visible:ring-[#1C1917]/30'
              }`}
            >
              {isInk ? (
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{isInk ? '宣纸 · 昼' : '夜阑 · 墨'}</span>
            </button>

            <button
              type="button"
              onClick={handleReplayEntrance}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                isInk
                  ? 'border-white/15 bg-[#1A1816] text-[#D6CFC3] hover:text-white hover:border-white/25 focus-visible:ring-white/40'
                  : 'border-[#DDD7CB] bg-[#FCFBF8] text-[#4A433B] hover:text-[#1C1917] hover:border-[#C7BFB1] focus-visible:ring-[#1C1917]/30'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>重现出场</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playStyleSwitch();
                setArchiveOpen(true);
              }}
              className={`sm:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isInk
                  ? 'border-white/15 bg-[#1A1816] text-[#D6CFC3]'
                  : 'border-[#DDD7CB] bg-[#FCFBF8] text-[#4A433B]'
              }`}
            >
              <span>原图溯源</span>
            </button>
          </div>
        </section>
      </main>

      {/* Source Screenshot Provenance Modal */}
      <SourceArchiveModal
        open={archiveOpen}
        onClose={() => {
          soundEngine.playStyleSwitch();
          setArchiveOpen(false);
        }}
        theme={theme}
      />
    </div>
  );
}
