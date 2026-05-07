import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import type { MoodId } from "../../types";
import { FIGMA_MOOD_ASSETS } from "../../constants/figmaMoodAssets";
import { useExperience } from "../../context/ExperienceContext";

type TileSpec = {
  id: MoodId;
  zh: string;
  en: string;
  image: string;
  /** lg 12 列栅格 */
  colSpan: string;
  minH: string;
  overlayClass: string;
};

const TILES: TileSpec[] = [
  {
    id: "jing",
    zh: "静｜平静如水",
    en: "SERENITY",
    image: FIGMA_MOOD_ASSETS.cardJing,
    colSpan: "lg:col-span-4",
    minH: "min-h-[240px] lg:min-h-[300px]",
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(13,15,15,0.92)_0%,rgba(13,15,15,0.35)_45%,rgba(13,15,15,0)_100%)]",
  },
  {
    id: "wang",
    zh: "望｜暮色将明",
    en: "TWILIGHT PROSPECT",
    image: FIGMA_MOOD_ASSETS.cardWang,
    colSpan: "lg:col-span-8",
    minH: "min-h-[240px] lg:min-h-[300px]",
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(13,15,15,1)_0%,rgba(13,15,15,0.45)_50%,rgba(13,15,15,0)_100%)]",
  },
  {
    id: "huo",
    zh: "惑｜雾中寻青",
    en: "ENIGMA",
    image: FIGMA_MOOD_ASSETS.cardHuo,
    colSpan: "lg:col-span-6",
    minH: "min-h-[220px] lg:min-h-[260px]",
    overlayClass:
      "bg-[linear-gradient(90deg,rgba(13,15,15,0.92)_0%,rgba(13,15,15,0)_100%)]",
  },
  {
    id: "lie",
    zh: "烈｜火光正盛",
    en: "INTENSITY",
    image: FIGMA_MOOD_ASSETS.cardLie,
    colSpan: "lg:col-span-3",
    minH: "min-h-[220px] lg:min-h-[260px]",
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(12,10,9,0.88)_0%,rgba(12,10,9,0.35)_50%,rgba(12,10,9,0)_100%)]",
  },
  {
    id: "lian",
    zh: "敛｜收锋藏韵",
    en: "RESTRAINT",
    image: FIGMA_MOOD_ASSETS.cardLian,
    colSpan: "lg:col-span-3",
    minH: "min-h-[220px] lg:min-h-[260px]",
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(13,15,15,0.9)_0%,rgba(13,15,15,0)_100%)]",
  },
  {
    id: "liu",
    zh: "流｜釉色流转",
    en: "FLUIDITY",
    image: FIGMA_MOOD_ASSETS.cardLiu,
    colSpan: "lg:col-span-12",
    minH: "min-h-[160px] sm:min-h-[180px] lg:min-h-[200px]",
    overlayClass:
      "bg-[linear-gradient(90deg,rgba(13,15,15,0.95)_0%,rgba(13,15,15,0.35)_40%,rgba(13,15,15,0)_72%)]",
  },
];

export function StepMood() {
  const { selections, setMood, goNext } = useExperience();
  const selected = selections.mood;
  const reduceMotion = useReducedMotion();
  const bg = FIGMA_MOOD_ASSETS.backgroundFull;
  const scrollRootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    el.scrollTop = 0;
    el.scrollLeft = 0;
  }, []);

  return (
    <div
      ref={scrollRootRef}
      className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-[rgb(18,20,20)]"
    >
      <img
        src={bg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-[rgb(18,20,20)]/55" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-[1920px] px-5 pb-14 pt-8 sm:px-9 sm:pt-10 md:px-12 md:pb-16 md:pt-12 xl:px-18 2xl:px-20"
      >
        <div className="text-center">
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-[0.08em] text-[#e2e2e2] sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            心境选择
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-sans text-sm leading-relaxed text-[#c2c8c2] sm:mt-5 sm:text-base md:text-lg">
            心境将影响青瓷的色调、明暗与作品命名
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-4">
          {TILES.map((t, i) => {
            const isSel = selected === t.id;
            /** 选中统一提亮；未选中略压暗 */
            const imgFilter = isSel
              ? "brightness-[1.82] saturate-[1.16] contrast-[1.06]"
              : "brightness-[0.82] saturate-[0.94]";
            const matteClass = isSel ? "bg-[rgb(18,20,20)]/0" : "bg-[rgb(18,20,20)]/34";

            return (
              <motion.button
                key={t.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => setMood(t.id)}
                aria-pressed={isSel}
                className={`group relative overflow-hidden rounded-sm border-2 bg-[#1a1c1c] text-left transition-colors ${t.colSpan} ${t.minH} ${
                  isSel
                    ? "border-[rgba(178,205,186,0.86)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1),0_0_48px_rgba(178,205,186,0.1)]"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {t.id === "wang" ? (
                  <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                    <div
                      className={`absolute inset-[-2px] origin-center scale-[1.18] bg-cover bg-center bg-no-repeat transition-[filter,transform] duration-300 ease-out ${imgFilter}`}
                      style={{ backgroundImage: `url('${t.image}')` }}
                    />
                  </div>
                ) : (
                  <div
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-[filter] duration-300 ease-out ${imgFilter}`}
                    style={{ backgroundImage: `url('${t.image}')` }}
                  />
                )}
                <div
                  className={`pointer-events-none absolute inset-0 transition-colors duration-300 ease-out ${matteClass}`}
                  aria-hidden
                />
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out ${t.overlayClass} ${
                    isSel ? "opacity-[0.28]" : "opacity-100"
                  }`}
                  aria-hidden
                />

                <div className="relative flex h-full min-h-[inherit] w-full flex-col justify-end p-4 sm:p-5 md:p-6">
                  <div className="relative z-[1] flex flex-col gap-2">
                    <p className="font-serif text-lg leading-snug text-[#e2e2e2] sm:text-xl md:text-2xl">
                      {t.zh}
                    </p>
                    <p className="font-display text-[10px] font-normal uppercase tracking-[0.28em] text-[#c2c8c2]/60 sm:text-xs md:tracking-[0.32em]">
                      {t.en}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center pt-[6px]">
          <motion.button
            type="button"
            disabled={!selected}
            onClick={goNext}
            whileHover={
              !selected
                ? {}
                : reduceMotion
                  ? { scale: 1 }
                  : {
                      scale: 1.02,
                      boxShadow:
                        "inset 0 0 0 2px rgba(209,217,212,0.1), 0 0 16px rgba(178,205,186,0.2)",
                    }
            }
            whileTap={
              !selected ? {} : reduceMotion ? { scale: 1 } : { scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            className="relative flex h-[66px] w-[min(496px,100%)] max-w-full items-center justify-center overflow-hidden border-2 border-[rgba(178,205,186,0.86)] bg-[rgba(255,255,255,0.002)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1)] transition-[border-color,box-shadow,opacity] duration-300 hover:border-[rgba(193,218,200,0.95)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="w-full text-center font-sans text-base font-normal tracking-[0.4em] text-[#e2e2e2]">
              确认入窑
            </span>
            <span
              className="pointer-events-none absolute bottom-0 left-px right-0 h-px bg-[rgba(178,205,186,0.05)]"
              aria-hidden
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
