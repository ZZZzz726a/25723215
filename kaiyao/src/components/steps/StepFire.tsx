import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FireLevel } from "../../types";
import { FIGMA_FIRE_ASSETS } from "../../constants/figmaFireAssets";
import { useExperience } from "../../context/ExperienceContext";
import { fireToTemp } from "../../lib/fireTemperature";

const LEVELS: { id: FireLevel; zh: string; en: string }[] = [
  { id: "high", zh: "武火", en: "HIGH INTENSITY" },
  { id: "mid", zh: "中火", en: "MODERATE" },
  { id: "low", zh: "微火", en: "LOW EMBERS" },
];

/** 档位文案选中/未选中切换时平滑过渡字号与颜色 */
const levelLabelTransitionClass =
  "transition-[font-size,line-height,letter-spacing,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** 0–300 微火，300–900 中火，900–1200 武火（边界：300 属微火，900 属中火） */
const BAND = { lowMax: 300, midMax: 900 } as const;
const TEMP_MIN = 0;
const TEMP_MAX = 1200;
/** 5°C 一档，0–1200 */
const TEMP_STEP = 5;
/** 无滑块圆点时轨道全长用于映射 */
const THUMB_PX = 0;

function tempToFire(t: number): FireLevel {
  if (t <= BAND.lowMax) return "low";
  if (t <= BAND.midMax) return "mid";
  return "high";
}

function roundTemp(t: number): number {
  const stepped = Math.round((t - TEMP_MIN) / TEMP_STEP) * TEMP_STEP + TEMP_MIN;
  return Math.min(TEMP_MAX, Math.max(TEMP_MIN, stepped));
}

function tempToThumbY(temp: number, trackHeight: number): number {
  const h = Math.max(0, trackHeight - THUMB_PX);
  if (h <= 0) return 0;
  const pct = (TEMP_MAX - temp) / (TEMP_MAX - TEMP_MIN);
  return pct * h;
}

function clientYToTemp(clientY: number, rect: DOMRect): number {
  const pct = (clientY - rect.top) / rect.height;
  const clamped = Math.min(1, Math.max(0, pct));
  return roundTemp(TEMP_MAX - clamped * (TEMP_MAX - TEMP_MIN));
}

/** 当前温度对应「从下往上」热力条高度比例 0–100（底为微火、顶为武火） */
function heatFillPercent(temp: number): number {
  const span = TEMP_MAX - TEMP_MIN;
  if (span <= 0) return 0;
  return ((temp - TEMP_MIN) / span) * 100;
}

/** Figma 2-663 底部「确认火候」橙框 */
const ORANGE_BORDER = "rgba(232,168,124,1)";
const ORANGE_BORDER_HOVER = "rgba(248,196,158,0.98)";
const ORANGE_INSET = "rgba(209,217,212,0.1)";
const ORANGE_BTN_INSET = `inset 0 0 0 2px ${ORANGE_INSET}`;

/** 窑图明暗与通透：微火最暗、武火最亮，略透底 */
function previewKilnLayer(f: FireLevel): { opacity: number; filter: string } {
  if (f === "high") return { opacity: 0.94, filter: "brightness(1.1) saturate(1.06)" };
  if (f === "mid") return { opacity: 0.8, filter: "brightness(0.84) saturate(0.95)" };
  return { opacity: 0.66, filter: "brightness(0.62) saturate(0.88)" };
}

/** 窑图本体：内缘 + 外扩光（加在 img 上，与 object-cover 内容对齐） */
function previewImageBoxShadow(f: FireLevel): string {
  if (f === "high") {
    return [
      "inset 0 0 64px 16px rgba(251,146,60,0.14)",
      "inset 0 0 0 1px rgba(255,182,147,0.2)",
      "0 0 28px 8px rgba(251,146,60,0.38)",
      "0 0 56px 20px rgba(251,146,60,0.26)",
      "0 0 88px 32px rgba(234,88,12,0.16)",
    ].join(", ");
  }
  if (f === "mid") {
    return [
      "inset 0 0 52px 14px rgba(251,146,60,0.09)",
      "inset 0 0 0 1px rgba(255,182,147,0.13)",
      "0 0 22px 6px rgba(251,146,60,0.28)",
      "0 0 48px 18px rgba(251,146,60,0.18)",
      "0 0 72px 28px rgba(234,88,12,0.05)",
    ].join(", ");
  }
  return [
    "inset 0 0 40px 10px rgba(251,146,60,0.05)",
    "inset 0 0 0 1px rgba(255,182,147,0.08)",
    "0 0 18px 6px rgba(251,146,60,0.2)",
    "0 0 40px 14px rgba(251,146,60,0.1)",
    "0 0 56px 22px rgba(234,88,12,0.03)",
  ].join(", ");
}

export function StepFire() {
  const { selections, setFire, setFireTempC, goNext } = useExperience();
  const reduceMotion = useReducedMotion();
  const fire = selections.fire ?? "mid";

  useEffect(() => {
    if (!selections.fire) {
      setFire("mid");
      setFireTempC(fireToTemp("mid"));
    }
  }, [selections.fire, setFire, setFireTempC]);

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackH, setTrackH] = useState(240);
  const trackHRef = useRef(trackH);
  trackHRef.current = trackH;
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const [displayTemp, setDisplayTemp] = useState(
    () => selections.fireTempC ?? fireToTemp(selections.fire ?? "mid")
  );

  const rafRef = useRef(0);
  const pendingTempRef = useRef<number | null>(null);

  const scheduleDisplayTemp = useCallback((t: number) => {
    pendingTempRef.current = t;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const v = pendingTempRef.current;
      pendingTempRef.current = null;
      if (v != null) setDisplayTemp(v);
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackH(el.clientHeight));
    ro.observe(el);
    setTrackH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  /** 仅同步 y ↔ displayTemp；勿用 fireToTemp 覆盖 displayTemp，避免松手被拉回档内默认温度 */
  useEffect(() => {
    if (dragging) return;
    y.set(tempToThumbY(displayTemp, trackH));
  }, [displayTemp, trackH, dragging, y]);

  const commitFromPointer = useCallback(() => {
    const th = trackHRef.current;
    const h = Math.max(0, th - THUMB_PX);
    if (h <= 0) return;
    const t = roundTemp(TEMP_MAX - (y.get() / h) * (TEMP_MAX - TEMP_MIN));
    setDisplayTemp(t);
    setFire(tempToFire(t));
    setFireTempC(t);
    y.set(tempToThumbY(t, th));
  }, [setFire, setFireTempC, y]);

  const bindPointer = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const onMove = (clientY: number) => {
      const rect = el.getBoundingClientRect();
      const th = trackHRef.current;
      const t = clientYToTemp(clientY, rect);
      y.set(tempToThumbY(t, th));
      scheduleDisplayTemp(t);
    };

    const handleMove = (e: PointerEvent) => onMove(e.clientY);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      commitFromPointer();
      setDragging(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [commitFromPointer, scheduleDisplayTemp, y]);

  const glowLevel = tempToFire(displayTemp);
  const displayZh = LEVELS.find((l) => l.id === glowLevel)!.zh;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[rgb(18,20,20)]">
      <img
        src={FIGMA_FIRE_ASSETS.pageBackground}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(235,106,27,0.08),transparent_65%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[rgb(18,20,20)]/12" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(40vh,320px)] bg-[linear-gradient(180deg,rgb(18,20,20)_0%,rgba(18,20,20,0)_100%)]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col px-2 py-5 sm:px-3 sm:py-6 md:px-4 md:py-7 xl:px-5 2xl:px-7"
      >
        <div className="mt-2 max-w-[672px] shrink-0 text-left sm:mt-3">
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-[-0.02em] text-[#e2e2e2] sm:text-5xl md:text-6xl md:leading-[1.1]">
            控火
          </h2>
          <p className="mt-5 max-w-[602px] font-sans text-base leading-relaxed text-[#c8c5c2] sm:mt-6 sm:text-lg">
            火候越盛，釉色越深，纹理与偶然性越强
            <br />
            在龙泉窑的漫长岁月中，火与土的共舞决定了这一抹青翠的灵魂
          </p>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col items-stretch gap-6 overflow-visible pb-4 sm:mt-7 sm:gap-7 sm:pb-5 lg:mt-8 lg:flex-row-reverse lg:items-start lg:justify-between lg:gap-8 lg:pb-6 xl:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 flex w-full min-w-0 flex-1 flex-col justify-center lg:order-1 lg:mr-[80px] lg:max-w-[min(100%,502px)] lg:-translate-x-[48px] lg:-translate-y-[10px] lg:self-start"
          >
            <div className="flex flex-row items-end justify-center gap-8 sm:gap-12 lg:translate-y-3 lg:justify-start lg:-translate-x-[172px]">
              <div className="flex shrink-0 flex-col items-center -translate-x-8 lg:-translate-x-10">
                <div
                  ref={trackRef}
                  role="slider"
                  aria-valuenow={displayTemp}
                  aria-valuetext={`${displayTemp} 摄氏度`}
                  aria-valuemin={TEMP_MIN}
                  aria-valuemax={TEMP_MAX}
                  aria-orientation="vertical"
                  className="relative h-[min(360px,38vh)] w-[30px] shrink-0 cursor-pointer overflow-hidden rounded-[18px] shadow-[0_0_20px_rgba(227,100,20,0.2)] sm:h-[min(400px,42vh)] sm:w-[38px] sm:rounded-[24px] lg:h-[min(420px,48vh)]"
                  onPointerDown={(e) => {
                    const el = e.currentTarget;
                    el.setPointerCapture(e.pointerId);
                    setDragging(true);
                    const rect = el.getBoundingClientRect();
                    const th = trackHRef.current;
                    const t = clientYToTemp(e.clientY, rect);
                    y.set(tempToThumbY(t, th));
                    scheduleDisplayTemp(t);
                    bindPointer();
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,#14161a_0%,#1e2229_40%,#262018_100%)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[inherit] shadow-[inset_0_0_12px_rgba(255,220,180,0.22)] transition-[height] duration-150 ease-out"
                    style={{ height: `${heatFillPercent(displayTemp)}%` }}
                    aria-hidden
                  >
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0"
                      style={{
                        height: Math.max(trackH, 1),
                        backgroundImage: "url(/fire-slider-gradient.png)",
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-y-[10%] left-[18%] w-[24%] rounded-full bg-gradient-to-b from-white/18 to-transparent opacity-70"
                    aria-hidden
                  />
                </div>
              </div>

              <div
                className="flex min-h-[min(320px,38vh)] flex-1 flex-col justify-between py-2 sm:min-h-[min(360px,42vh)] lg:min-h-[min(380px,48vh)]"
                role="radiogroup"
                aria-label="火候档位"
              >
                {LEVELS.map((l) => {
                  const active = fire === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        const t = fireToTemp(l.id);
                        setDisplayTemp(t);
                        setFire(l.id);
                        setFireTempC(t);
                        y.set(tempToThumbY(t, trackHRef.current));
                      }}
                      className={
                        l.id === "high"
                          ? "text-left transition -mt-5 self-start -translate-y-[12px]"
                          : l.id === "low"
                            ? "text-left transition translate-y-[8px]"
                            : "text-left transition"
                      }
                    >
                      <span
                        className={`font-serif ${levelLabelTransitionClass} ${active ? "tracking-normal text-4xl leading-none text-[#ffb693] sm:text-5xl md:text-[72px] md:leading-[1.02]" : "tracking-tight text-lg leading-snug text-zinc-500 sm:text-xl hover:text-zinc-400"}`}
                      >
                        {l.zh}
                      </span>
                      <span
                        className={`mt-1 block font-sans uppercase tracking-[0.08em] sm:tracking-[0.1em] ${levelLabelTransitionClass} ${active ? "text-[20px] leading-normal text-[#ffb693] sm:text-[22px]" : "text-[14px] leading-snug text-zinc-600 sm:text-[15px]"}`}
                      >
                        {l.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 flex w-full max-w-[520px] shrink-0 justify-center overflow-visible sm:max-w-[min(100vw-2rem,520px)] lg:order-2 lg:-translate-y-5 lg:justify-start"
          >
            <div className="relative aspect-square w-full max-w-[520px] origin-top-left translate-x-[193px] translate-y-[16px] scale-[0.98] will-change-transform sm:scale-[1.02] lg:scale-[1.06]">
              <div
                className="absolute inset-[1%] bg-cover bg-center bg-no-repeat sm:inset-[1.25%]"
                style={{ backgroundImage: `url('${FIGMA_FIRE_ASSETS.previewPlate}')` }}
              />
              <div className="absolute inset-[10%] flex items-center justify-center">
                <div className="relative h-full w-full overflow-visible">
                  <div
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl ring-1 ring-inset ring-[rgba(231,229,228,0.12)] sm:rounded-2xl"
                    aria-hidden
                  >
                    <div
                      className="absolute inset-0 origin-center scale-[1.06] bg-[linear-gradient(0deg,rgba(18,20,20,0)_0%,rgba(18,20,20,0.81)_29%,rgba(18,20,20,1)_50%,rgba(18,20,20,0.84)_71%,rgba(18,20,20,0)_100%)] opacity-25"
                      aria-hidden
                    />
                  </div>
                  <motion.img
                    src={FIGMA_FIRE_ASSETS.previewKiln}
                    alt=""
                    layout={false}
                    draggable={false}
                    initial={false}
                    className="pointer-events-none absolute inset-0 z-[1] h-full w-full rounded-xl object-cover object-[center_54%] sm:rounded-2xl"
                    animate={{
                      boxShadow: previewImageBoxShadow(glowLevel),
                      ...previewKilnLayer(glowLevel),
                    }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
                    <p className="font-sans text-xs tracking-[0.14em] text-[#ffb693] sm:text-sm sm:tracking-[0.18em]">
                      当前状态
                    </p>
                    <p className="mt-2 font-serif text-2xl tracking-[0.03em] text-[#f5f5f4] sm:text-3xl md:text-4xl">
                      {displayZh}｜{displayTemp}°C
                    </p>
                    <div className="mt-4 h-px w-28 bg-[rgba(255,182,147,0.4)] sm:w-32" aria-hidden />
                    <p className="mt-3 font-display text-[10px] font-normal uppercase tracking-[0.2em] text-[#a8a29e] sm:text-xs sm:tracking-[0.24em]">
                      ritual in progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </motion.div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[min(35vh,280px)] origin-bottom scale-y-[-1] bg-[linear-gradient(0deg,rgba(18,20,20,0)_0%,rgb(18,20,20)_100%)] opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-3 z-30 translate-x-[44px] -translate-y-[116px] sm:bottom-5 sm:right-4 sm:-translate-y-[106px] md:right-10 md:-translate-y-[104px] lg:right-[clamp(3rem,8vw+15rem,28rem)] xl:right-[clamp(3.5rem,7vw+17rem,30rem)]"
      >
        <div className="flex w-[min(640px,calc(100vw-1rem))] max-w-[520px] flex-col items-stretch gap-2 sm:w-[min(640px,calc(100vw-1.5rem))]">
          <div
            className="h-px w-full shrink-0 -translate-y-[28px] rounded-full bg-[rgba(232,168,124,0.12)]"
            aria-hidden
          />
          <motion.button
            type="button"
            onClick={() => {
              setFireTempC(displayTemp);
              goNext();
            }}
            whileHover={
              reduceMotion
                ? { scale: 1 }
                : {
                    scale: 1.02,
                    borderColor: ORANGE_BORDER_HOVER,
                    boxShadow: `${ORANGE_BTN_INSET}, 0 0 16px rgba(232,168,124,0.28)`,
                  }
            }
            whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            className="relative flex h-[66px] w-full items-center justify-center overflow-hidden border-2 bg-[rgba(255,255,255,0.002)] transition-[border-color,box-shadow] duration-300"
            style={{
              borderColor: ORANGE_BORDER,
              boxShadow: ORANGE_BTN_INSET,
            }}
          >
            <span className="w-full text-center font-sans text-base font-normal tracking-[0.4em] text-[#e2e2e2]">
              确认火候
            </span>
            <span
              className="pointer-events-none absolute bottom-0 left-px right-0 h-px bg-[rgba(232,168,124,0.12)]"
              aria-hidden
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
