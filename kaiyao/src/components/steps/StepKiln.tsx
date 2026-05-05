import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FireLevel, GlazeId, MoodId } from "../../types";
import { useExperience } from "../../context/ExperienceContext";
import {
  kilnAtmosphereLabel,
  kilnDurationLabel,
  kilnTemperatureLabel,
} from "../../lib/kilnReadouts";

const HOLD_MS = 2000;

/** 入窑页 — 布局与入境页统一；全屏底图 `public/kiln-step-bg.png`（[Figma 79-580](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=79-580)，2× PNG）；[Figma 2-753](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=2-753)；长按图标 [79-566](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=79-566)；圆内底纹 [79-570](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=79-570) */
export function StepKiln() {
  const { goNext, selections } = useExperience();
  const kilnFooter = useMemo(() => {
    const mood = (selections.mood ?? "wang") as MoodId;
    const fire = (selections.fire ?? "mid") as FireLevel;
    const glaze = (selections.glaze ?? "jade") as GlazeId;
    return {
      temp: kilnTemperatureLabel(fire, selections.fireTempC),
      duration: kilnDurationLabel(mood),
      atmosphere: kilnAtmosphereLabel(glaze),
    };
  }, [selections.fire, selections.fireTempC, selections.glaze, selections.mood]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const holdStart = useRef<number | null>(null);
  const raf = useRef<number>(0);

  const clearAnim = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    holdStart.current = null;
    setProgress(0);
  }, []);

  const complete = useCallback(() => {
    setDone(true);
    setProgress(1);
    window.setTimeout(goNext, 650);
  }, [goNext]);

  useEffect(() => () => clearAnim(), [clearAnim]);

  const tick = useCallback(() => {
    if (holdStart.current == null) return;
    const elapsed = performance.now() - holdStart.current;
    const p = Math.min(1, elapsed / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      complete();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, [complete]);

  const onPressStart = () => {
    if (done) return;
    holdStart.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const onPressEnd = () => {
    if (done) return;
    clearAnim();
  };

  const c = 2 * Math.PI * 46;
  const offset = c * (1 - progress);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-[rgb(18,20,20)]">
      <img
        src="/kiln-step-bg.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.72] contrast-[1.08]"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-[rgb(12,12,12)]/58" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_98%_92%_at_50%_44%,rgba(0,0,0,0)_32%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.5)_100%)]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col px-2 pb-14 pt-8 sm:px-3 sm:pt-10 md:px-4 md:pb-16 md:pt-12 xl:px-5 2xl:px-7"
      >
        <div className="text-center">
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-[0.08em] text-[#e2e2e2] sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            入窑
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-sans text-sm leading-relaxed text-[#c2c8c2] sm:mt-5 sm:text-base md:text-lg">
            长按完成入窑，直至开窑见釉
          </p>
        </div>

        <div className="mt-10 flex min-h-0 flex-1 flex-col items-center justify-center">
          <motion.div
            className="relative flex h-52 w-52 items-center justify-center md:h-60 md:w-60"
            animate={{
              y: -20,
              scale: done ? [1, 1.04, 1] : 1,
              filter:
                progress > 0
                  ? `drop-shadow(0 0 ${38 + progress * 52}px rgba(251,146,60,${0.32 + progress * 0.22})) drop-shadow(0 0 ${14 + progress * 22}px rgba(251,146,60,${0.18 + progress * 0.12}))`
                  : "drop-shadow(0 0 24px rgba(251,146,60,0.24))",
            }}
            transition={{ duration: done ? 0.45 : 0.35 }}
          >
            <svg className="pointer-events-none absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(251,146,60,0.85)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
              />
            </svg>

            <button
              type="button"
              disabled={done}
              onPointerDown={onPressStart}
              onPointerUp={onPressEnd}
              onPointerLeave={onPressEnd}
              onPointerCancel={onPressEnd}
              className="relative flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-full border border-orange-500/25 bg-zinc-950/25 text-center outline-none ring-offset-2 ring-offset-[rgb(18,20,20)] focus-visible:ring-2 focus-visible:ring-[rgba(178,205,186,0.45)] disabled:opacity-90"
            >
              <img
                src="/kiln-hold-deco.svg"
                alt=""
                width={226}
                height={226}
                draggable={false}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] rounded-full bg-gradient-to-b from-zinc-950/70 to-black/82"
                aria-hidden
              />

              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="/kiln-hold-icon.svg"
                  alt=""
                  width={21}
                  height={25}
                  draggable={false}
                  className="h-7 w-auto object-contain opacity-95"
                />
                <span className="mt-3.5 font-serif text-[17px] leading-snug tracking-[0.16em] text-zinc-100 sm:text-[1.125rem]">
                  长按入窑
                </span>
                <span className="mt-2.5 text-[10px] uppercase tracking-[0.32em] text-zinc-600">
                  hold {HOLD_MS / 1000}s
                </span>
              </div>

              {/* 圆内呼吸：渐变在半径中段收干净，避免顶到 overflow-hidden 圆边发黑 */}
              <motion.span
                className="pointer-events-none absolute inset-0 z-[2] rounded-full"
                style={{
                  transformOrigin: "50% 38%",
                  background:
                    "radial-gradient(ellipse 118% 112% at 50% 38%, rgba(251,146,60,0.38), rgba(251,146,60,0.11) 48%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.1 + progress * 0.15],
                  opacity: [0.3, 0.5 + progress * 0.18],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                aria-hidden
              />

              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute z-[2] h-1 w-1 rounded-full bg-orange-400/70"
                  style={{
                    left: `${30 + (i * 7) % 40}%`,
                    top: `${55 + (i * 11) % 30}%`,
                  }}
                  animate={{
                    y: [0, -6 - progress * 10],
                    opacity: [0.2, 0.85, 0.2],
                    scale: [1, 1.2 + progress * 0.5],
                  }}
                  transition={{
                    duration: 1.6 + (i % 4) * 0.2,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                />
              ))}
            </button>
          </motion.div>
        </div>

        <div className="mx-auto mt-auto grid w-full max-w-2xl -translate-y-5 grid-cols-3 gap-6 border-t border-white/[0.06] pt-8 text-center sm:gap-8 sm:pt-10">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-[#c2c8c2]/50 sm:text-[11px] sm:tracking-[0.34em]">
              温度
            </p>
            <p className="mt-2 font-sans text-sm tracking-[0.08em] text-[#c2c8c2] sm:text-base sm:tracking-[0.1em]">
              {kilnFooter.temp}
            </p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-[#c2c8c2]/50 sm:text-[11px] sm:tracking-[0.34em]">
              时间
            </p>
            <p className="mt-2 font-sans text-sm tracking-[0.08em] text-[#c2c8c2] sm:text-base sm:tracking-[0.1em]">
              {kilnFooter.duration}
            </p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-[#c2c8c2]/50 sm:text-[11px] sm:tracking-[0.34em]">
              烧成气氛
            </p>
            <p className="mt-2 font-sans text-sm tracking-[0.06em] text-[#c2c8c2] sm:text-base sm:tracking-[0.08em]">
              {kilnFooter.atmosphere}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
