import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FIGMA_MECHANISM_ASSETS } from "../../constants/figmaMechanismAssets";
import { useExperience } from "../../context/ExperienceContext";
import { PorcelainGlbDecoration } from "../PorcelainGlbDecoration";

const CARDS = [
  {
    corner: FIGMA_MECHANISM_ASSETS.cardCorner26_109,
    han: FIGMA_MECHANISM_ASSETS.cardFireHan,
    label: "TEMPERATURE",
    body: [
      "火候的细微起伏，影响釉色的深浅、",
      "明暗与层次。窑温的万分之一变迁，",
      "皆在釉面上凝固成独一无二的纹理",
    ],
  },
  {
    corner: FIGMA_MECHANISM_ASSETS.cardCorner26_110,
    han: FIGMA_MECHANISM_ASSETS.cardTimeHan,
    label: "DURATION",
    body: [
      "漫长等待不是空白，而是青瓷生成的",
      "一部分。在封闭的窑炉内，釉料经历",
      "数千分钟的物理转化，终得如玉质感",
    ],
  },
  {
    corner: FIGMA_MECHANISM_ASSETS.cardCorner26_111,
    han: FIGMA_MECHANISM_ASSETS.cardChanceHan,
    label: "CHANCE",
    body: [
      "窑中偶然与不可预测，使每一次开窑",
      "都无法完全复现。那抹动人心魄的流",
      "釉，是天地气运在器物上的瞬间留痕",
    ],
  },
];

/** 识窑页「龙泉青瓷」旁釉色条：粉青 / 梅子青 / 天青 / 豆青 / 灰青（色值参考物料示意）；可选 tileSrc 用实拍釉块图替换渐变 */
const LONGQUAN_GLAZE_SWATCHES: ReadonlyArray<{
  id: string;
  label: string;
  dot: string;
  swatch: string;
  tileSrc?: string;
}> = [
  {
    id: "fenqing",
    label: "粉青",
    dot: "#a8caba",
    swatch:
      "linear-gradient(165deg, #f4faf7 0%, #e2f0ea 32%, #c8e0d4 58%, #a8cab8 88%, #92b8a6 100%)",
    tileSrc: "/glaze-fenqing-tile.png",
  },
  {
    id: "meiziqing",
    label: "梅子青",
    dot: "#4f9a6e",
    swatch:
      "linear-gradient(165deg, #c5ebd4 0%, #7cc598 36%, #52a070 68%, #3d855d 92%, #2f6b4b 100%)",
    tileSrc: "/glaze-meiziqing-tile.png",
  },
  {
    id: "tianqing",
    label: "天青",
    dot: "#8aa8bc",
    swatch:
      "linear-gradient(165deg, #e4edf3 0%, #c5d6e2 34%, #9eb9cc 62%, #7fa0b5 90%, #6a8fa3 100%)",
    tileSrc: "/glaze-tianqing-tile.png",
  },
  {
    id: "douqing",
    label: "豆青",
    dot: "#8fa882",
    swatch:
      "linear-gradient(165deg, #e2ead8 0%, #c5d2b4 38%, #a8bc94 70%, #8fa882 92%, #768b6c 100%)",
    tileSrc: "/glaze-douqing-tile.png",
  },
  {
    id: "huiqing",
    label: "灰青",
    dot: "#8d9d96",
    swatch:
      "linear-gradient(165deg, #dce3df 0%, #bfcbc4 40%, #9faea6 72%, #7f9088 100%)",
    tileSrc: "/glaze-huiqing-tile.png",
  },
];

/**
 * 三卡右上角 Figma：径向 mask 柔化晕染；专用裁剪层截断超出边框部分（避免 motion 子元素溢出）。
 * top 与大字中线：article py-8 lg:py-9 + pt-2 + han 半高。
 */
const MECHANISM_CARD_CORNER = {
  frame:
    "size-[234px] sm:size-[300px] md:size-[360px] lg:size-[390px] xl:size-[420px]",
  position:
    "right-[-6px] top-[44px] sm:top-[46px] md:top-[60px] lg:top-[68px] origin-top-right translate-x-[38%] sm:translate-x-[39%] md:translate-x-[41%] -translate-y-1/2",
} as const;

/** 圆心偏右上；外侧透明呈圆弧消散。不改图标颜色，仅 alpha mask */
const MECHANISM_CARD_CORNER_MASK: CSSProperties = {
  maskImage:
    "radial-gradient(circle at 91% 30%, #000 36%, #000 46%, rgba(0,0,0,0.62) 58%, rgba(0,0,0,0.18) 69%, transparent 78%)",
  WebkitMaskImage:
    "radial-gradient(circle at 91% 30%, #000 36%, #000 46%, rgba(0,0,0,0.62) 58%, rgba(0,0,0,0.18) 69%, transparent 78%)",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

export function StepMechanism() {
  const { goNext } = useExperience();
  const a = FIGMA_MECHANISM_ASSETS;
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-visible overflow-y-auto bg-[rgb(18,20,20)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={a.decoRightTall}
          alt=""
          className="absolute right-[-10%] top-[18%] hidden h-[min(52vh,420px)] w-auto opacity-[0.72] xl:right-[-4%] xl:block"
          draggable={false}
        />
        <img
          src={a.decoBottomLeft}
          alt=""
          className="pointer-events-none absolute bottom-0 left-[-14%] hidden h-[min(28vh,280px)] w-auto opacity-[0.72] lg:left-[-6%] lg:block"
          draggable={false}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-[1920px] overflow-visible px-5 pb-14 pt-8 sm:px-9 sm:pt-10 md:px-12 md:pb-16 md:pt-12 xl:px-18 2xl:px-20"
      >
        <div className="relative mb-6 min-h-[min(50vh,420px)] md:mb-8 md:min-h-[min(53vh,500px)] lg:mb-9 lg:min-h-[min(56vh,535px)]">
          <PorcelainGlbDecoration />
          <p className="font-display text-[10px] font-normal uppercase tracking-[0.35em] text-[#eb6a1b] md:text-[11px] md:tracking-[0.4em]">
            Porcelain
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-[0.08em] text-[#e2e2e2] sm:mt-4 sm:text-5xl md:text-[3.25rem] lg:text-6xl lg:leading-[1.1]">
            龙泉青瓷
          </h2>
          <div className="mt-5 flex w-full flex-col items-start gap-6 font-sans text-sm leading-relaxed text-[#c2c8c2] md:mt-6 md:gap-7 md:text-base md:leading-relaxed lg:gap-8">
            <p className="min-w-0 max-w-2xl leading-[1.9] md:leading-[2.1]">
              龙泉青瓷以温润青釉见长，它的青，并不是单一色值
              <br />
              <span className="whitespace-nowrap">而是在胎土、釉料、火候与窑内气氛的共同作用中形成，粉青、梅子青、天青、豆青、灰青等色相变化</span>
              <br />
              使青瓷在不同光线与角度下呈现出含蓄而丰富的层次
            </p>
            <div
              className="grid w-full max-w-2xl shrink-0 grid-cols-5 gap-2 self-start sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4"
              role="group"
              aria-label="龙泉青瓷釉色：粉青、梅子青、天青、豆青、灰青"
            >
              {LONGQUAN_GLAZE_SWATCHES.map((g, i) => (
                <motion.button
                  key={g.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.04 * i,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  {...(reduceMotion
                    ? {}
                    : {
                        whileHover: {
                          y: -6,
                          transition: { type: "spring", stiffness: 420, damping: 28 },
                        },
                        whileTap: { scale: 0.997 },
                      })}
                  className={`group relative flex min-w-0 cursor-pointer flex-col gap-2 overflow-clip rounded-md border-2 border-white/[0.05] bg-[linear-gradient(52.4deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)] px-0.5 py-2 text-left shadow-none sm:gap-2.5 sm:rounded-lg sm:px-1 sm:py-2.5 md:gap-3 md:px-1 md:py-3 lg:py-3.5 [contain:paint] ${reduceMotion ? "" : "transition-[border-color,box-shadow] duration-300 ease-out hover:border-white/[0.11] hover:shadow-[0_20px_56px_-20px_rgba(0,0,0,0.62)]"}`}
                >
                  {g.tileSrc ? (
                    <img
                      src={g.tileSrc}
                      alt=""
                      className="mx-auto aspect-[11/23] w-[78%] shrink-0 rounded-[3px] object-cover object-center sm:w-[76%] sm:rounded-md md:w-[74%]"
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="mx-auto aspect-[11/23] w-[78%] shrink-0 rounded-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-5px_10px_rgba(0,0,0,0.18)] sm:w-[76%] sm:rounded-md md:w-[74%]"
                      style={{ background: g.swatch }}
                    />
                  )}
                  <div className="ml-4 flex min-w-0 items-center gap-1 sm:gap-1.5">
                    <span
                      className="size-1 shrink-0 rounded-full ring-1 ring-black/15 sm:size-1.5"
                      style={{ backgroundColor: g.dot }}
                      aria-hidden
                    />
                    <span
                      className={`truncate font-serif text-[10px] leading-tight tracking-wide text-[#b8bfb8] sm:text-[11px] md:text-xs ${reduceMotion ? "" : "transition-colors duration-300 group-hover:text-[#d8ded8]"}`}
                    >
                      {g.label}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="font-display text-[10px] font-normal uppercase tracking-[0.35em] text-[#eb6a1b] md:text-[11px] md:tracking-[0.4em]">
            MECHANISM
          </p>
          <h2 className="mt-[15px] font-serif text-4xl font-normal leading-tight tracking-[0.08em] text-[#e2e2e2] sm:mt-[19px] sm:text-5xl md:text-[3.25rem] lg:text-6xl lg:leading-[1.1]">
            窑变三要素
          </h2>
          <div className="mt-6 max-w-2xl space-y-1.5 font-sans text-sm leading-relaxed text-[#c2c8c2] md:mt-8 md:text-base md:leading-relaxed">
            <p>龙泉青瓷的窑变，是土与火在极致约束下的意外绽放</p>
            <p>在这方寸之间，自然法则以火、时、机为笔，勾勒出传世之色</p>
          </div>
        </div>

        <div className="relative mx-auto mt-6 w-full md:mt-9 lg:mt-10">
          <div className="grid gap-3.5 md:grid-cols-3 md:gap-4 lg:gap-5">
            {CARDS.map((c, i) => (
              <motion.article
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                {...(reduceMotion
                  ? {}
                  : {
                      whileHover: {
                        y: -6,
                        transition: { type: "spring", stiffness: 420, damping: 28 },
                      },
                      whileTap: { scale: 0.997 },
                    })}
                className={`group relative isolate min-h-[292px] cursor-default overflow-clip border-2 border-white/[0.05] bg-[linear-gradient(52.4deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_100%)] px-5 py-8 shadow-none sm:px-6 md:min-h-[312px] lg:min-h-[320px] lg:px-8 lg:py-9 [contain:paint] ${reduceMotion ? "" : "transition-[border-color,box-shadow] duration-300 ease-out hover:border-white/[0.11] hover:shadow-[0_20px_56px_-20px_rgba(0,0,0,0.62)]"}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-[2] overflow-clip [clip-path:inset(0)]"
                  aria-hidden
                >
                  <div
                    className={`pointer-events-none absolute ${MECHANISM_CARD_CORNER.frame} ${MECHANISM_CARD_CORNER.position} ${reduceMotion ? "" : "transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]"}`}
                    style={MECHANISM_CARD_CORNER_MASK}
                  >
                    <img
                      src={c.corner}
                      alt=""
                      draggable={false}
                      className="pointer-events-none h-full w-full object-contain object-right-top"
                    />
                  </div>
                </div>
                <div className="relative z-[1] flex flex-col items-start pt-2">
                  <img
                    src={c.han}
                    alt=""
                    className={`h-16 w-auto origin-left object-contain object-left sm:h-[4.25rem] md:h-24 lg:h-[6.5rem] ${reduceMotion ? "" : "transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"}`}
                    draggable={false}
                  />
                  <div className="mt-5 flex flex-wrap items-center justify-start gap-2.5 sm:mt-6 sm:gap-3 md:mt-7">
                    <span
                      className={`h-px w-10 shrink-0 bg-[#424843] sm:w-14 ${reduceMotion ? "" : "transition-all duration-300 ease-out group-hover:w-12 group-hover:bg-[#5d665d] sm:group-hover:w-16"}`}
                      aria-hidden
                    />
                    <span
                      className={`font-display text-xs font-normal uppercase tracking-[0.12em] text-[#8c928c] sm:text-sm md:text-[15px] md:tracking-[0.14em] ${reduceMotion ? "" : "transition-colors duration-300 group-hover:text-[#aeb5ae]"}`}
                    >
                      {c.label}
                    </span>
                  </div>
                  <div
                    className={`mt-4 w-full max-w-none text-left font-sans text-[13px] leading-[1.62] text-[#c2c8c2] sm:mt-5 sm:text-sm sm:leading-[1.68] md:mt-6 md:text-[15px] md:leading-[1.72] ${reduceMotion ? "" : "transition-colors duration-300 group-hover:text-[#cfd4cf]"}`}
                  >
                    {c.body.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Figma 21-12 */}
        <motion.figure
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className={`group/banner relative mt-9 cursor-default overflow-hidden border-2 border-[rgba(209,217,212,0.1)] bg-[rgba(255,255,255,0.002)] shadow-[inset_0_0_40px_2px_rgba(209,217,212,0.05)] md:mt-10 ${reduceMotion ? "" : "transition-[border-color,box-shadow] duration-500 ease-out hover:border-[rgba(209,217,212,0.16)] hover:shadow-[inset_0_0_52px_4px_rgba(209,217,212,0.09)]"}`}
        >
          <div
            className={`relative min-h-[220px] bg-cover bg-center bg-no-repeat sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px] xl:min-h-[440px] ${reduceMotion ? "" : "transition-[transform,filter] duration-700 ease-out will-change-transform group-hover/banner:scale-[1.03] group-hover/banner:brightness-[1.05]"}`}
            style={{ backgroundImage: `url('${a.porcelainBannerBg}')` }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(18,20,20)_0%,rgba(18,20,20,0)_50%,rgba(18,20,20,0)_100%)] opacity-90" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgb(18,20,20)] via-[rgb(18,20,20)]/40 to-transparent" />
            <figcaption className="relative flex min-h-[220px] flex-col justify-end px-6 py-7 text-left sm:min-h-[280px] sm:px-8 sm:py-9 md:min-h-[340px] md:px-10 md:py-10 lg:min-h-[400px] lg:px-11 lg:pb-11 xl:min-h-[440px]">
              <div className="flex max-w-2xl flex-col gap-5 sm:max-w-3xl sm:gap-6 md:gap-7">
                <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
                  <span className="h-px w-14 shrink-0 bg-[#b2cdba] sm:w-16 md:w-20" aria-hidden />
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[#b2cdba] sm:text-sm md:text-base md:tracking-[0.22em]">
                    Porcelain Textures
                  </p>
                </div>
                <div className="space-y-1 font-sans text-sm leading-[1.52] text-[#e2e2e2]/80 sm:text-base sm:leading-[1.55] md:text-lg md:leading-snug lg:text-xl">
                  <p>“入窑一色，出窑万彩”——这种极致的釉色变化正是通过对</p>
                  <p>“火、时、机”的精妙掌控而产生的</p>
                </div>
              </div>
            </figcaption>
          </div>
        </motion.figure>

        {/* 与首页「开始开窑」同尺寸、同色、同交互 */}
        <div className="mt-9 flex justify-center md:mt-10">
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
            className="relative flex h-[66px] w-[min(496px,100%)] max-w-full items-center justify-center overflow-hidden border-2 border-[rgba(178,205,186,0.86)] bg-[rgba(255,255,255,0.002)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(193,218,200,0.95)]"
          >
            <span className="w-full text-center font-sans text-base font-normal tracking-[0.4em] text-[#e2e2e2]">
              继续
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
