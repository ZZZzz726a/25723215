import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { GlazeId } from "../../types";
import { FIGMA_GLAZE_ASSETS } from "../../constants/figmaGlazeAssets";
import { useExperience } from "../../context/ExperienceContext";

/** 择釉列表选中圆标：浅青绿实心圆 + 粗黑勾（对齐用户稿 / Figma 71-521 语义） */
function GlazeRadioSelectedIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="10" r="10" fill="rgb(178,205,186)" />
      <path
        d="M5 10.25 L8.75 14 L15 6.5"
        stroke="#0a0a0a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GLAZES: {
  id: GlazeId;
  title: string;
  body: string;
}[] = [
  {
    id: "jade",
    title: "温润如玉釉",
    body: "粉青釉质，如冰类玉\n其色泽内敛且温润，触感如凝脂般丝滑，展现宋瓷极简之美",
  },
  {
    id: "crackle",
    title: "冰裂纹釉",
    body: "层层叠叠，交错如冰\n由于胎釉膨胀系数差异，在冷却中形成的天然裂纹，错落有致",
  },
  {
    id: "flow",
    title: "流釉",
    body: "釉色垂流，浑然天成\n釉水在高温窑火中自然流淌，形成如高山流水般的动态纹理",
  },
];

export function StepGlaze() {
  const { selections, setGlaze, goNext } = useExperience();
  const reduceMotion = useReducedMotion();
  const selected = selections.glaze ?? "jade";

  useEffect(() => {
    if (!selections.glaze) setGlaze("jade");
  }, [selections.glaze, setGlaze]);

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[rgb(18,20,20)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_52%_48%_at_50%_44%,rgba(120,188,168,0.09),transparent_64%)]"
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
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-9 sm:py-6 md:px-12 md:py-7 xl:px-18 2xl:px-20"
      >
        <div className="mt-2 max-w-[672px] shrink-0 text-left sm:mt-3">
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-[-0.02em] text-[#e2e2e2] sm:text-5xl md:text-6xl md:leading-[1.1]">
            择釉
          </h2>
          <p className="mt-5 max-w-[602px] font-sans text-base leading-relaxed text-[#c8c5c2] sm:mt-6 sm:text-lg">
            釉面决定作品的表面气质与纹理方向
            <br />
            每一道釉色，皆是跨越千年的审美凝练
          </p>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 sm:mt-7 sm:pb-5 lg:mt-8 lg:pb-6">
          <div className="mx-auto mt-2.5 grid min-h-0 w-[95%] max-w-full flex-1 grid-cols-1 items-start gap-[calc(2.5rem+6px)] md:grid-cols-3 md:gap-[calc(3.5rem+6px)] lg:gap-[calc(5rem+6px)]">
            {GLAZES.map((g, i) => {
              const isSel = selected === g.id;
              /** 选中提亮、未选中压暗；温润底图偏亮，单独压低避免过曝「发光感」 */
              const visualFilter = isSel
                ? g.id === "jade"
                  ? "brightness-[1.12] saturate-[1.05] contrast-[1.02]"
                  : "brightness-[1.82] saturate-[1.16] contrast-[1.06]"
                : "brightness-[0.82] saturate-[0.94]";
              const matteClass = isSel ? "bg-[rgb(18,20,20)]/0" : "bg-[rgb(18,20,20)]/34";
              const selShadow =
                g.id === "jade"
                  ? "border-[rgba(178,205,186,0.86)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1),0_0_22px_rgba(178,205,186,0.045)]"
                  : "border-[rgba(178,205,186,0.86)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1),0_0_40px_rgba(178,205,186,0.08)]";
              return (
                <motion.button
                  key={g.id}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => setGlaze(g.id)}
                  aria-pressed={isSel}
                  className={`group relative flex min-h-0 flex-col overflow-hidden rounded-sm border-2 bg-[#1a1c1c] text-left transition-colors ${
                    isSel ? selShadow : "border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 z-0 transition-colors duration-300 ease-out ${matteClass}`}
                    aria-hidden
                  />
                  <div className="relative z-[1] flex min-h-0 flex-col">
                    <div className="relative aspect-[33/25] w-full min-w-0 shrink-0 overflow-hidden">
                      <img
                        src={FIGMA_GLAZE_ASSETS[g.id]}
                        alt={g.title}
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-fill object-center transition-[filter] duration-300 ease-out ${visualFilter}`}
                      />
                    </div>
                    <div className="flex shrink-0 flex-col px-3 pt-4.5 pb-5 sm:px-3.5 sm:pt-5 sm:pb-5 md:px-4 md:pt-5.5 md:pb-6">
                      <div className="flex items-center gap-2 md:gap-2.5">
                        {isSel ? (
                          <GlazeRadioSelectedIcon className="shrink-0" />
                        ) : (
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-600 text-transparent"
                            aria-hidden
                          />
                        )}
                        <h3 className="ml-1.5 font-serif text-lg leading-snug text-[#e2e2e2] sm:text-xl md:text-2xl">
                          {g.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 whitespace-pre-line text-[13.5px] leading-relaxed text-[#a1a1aa]/80 sm:mt-3 sm:leading-relaxed md:mt-3.5 md:leading-[1.65]">
                        {g.body}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex shrink-0 -translate-y-[26px] justify-center pt-0.5 md:pt-1">
          <motion.button
            type="button"
            onClick={goNext}
            whileHover={
              reduceMotion
                ? { scale: 1 }
                : {
                    scale: 1.02,
                    boxShadow:
                      "inset 0 0 0 2px rgba(209,217,212,0.1), 0 0 16px rgba(178,205,186,0.2)",
                  }
            }
            whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            className="relative flex h-[66px] w-[min(584px,calc(100vw-1rem))] max-w-[520px] items-center justify-center overflow-hidden border-2 border-[rgba(178,205,186,0.86)] bg-[rgba(255,255,255,0.002)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(193,218,200,0.95)] sm:w-[min(584px,calc(100vw-1.5rem))]"
          >
            <span className="w-full text-center font-sans text-base font-normal tracking-[0.4em] text-[#e2e2e2]">
              确认釉面
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
