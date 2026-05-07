import { motion, useReducedMotion } from "framer-motion";
import { HomeShowcase } from "../HomeShowcase";
import { useExperience } from "../../context/ExperienceContext";
import { FIGMA_HOME_ASSETS } from "../../constants/figmaHomeAssets";
import { HOME_HALO_DEBUG, HOME_HALO_DEBUG_ENABLED } from "../../constants/homeDebug";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StepHome() {
  const { goNext } = useExperience();
  const reduceMotion = useReducedMotion();
  const { background, ctaArrow, ctaUnderline } = FIGMA_HOME_ASSETS;
  const dbg = HOME_HALO_DEBUG_ENABLED;
  const HD = HOME_HALO_DEBUG;

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-visible bg-[rgb(18,20,20)]">
      {/* 全屏底图：左侧文案、右侧展柜区背后都是它；局部偏绿/偏亮常在图里 */}
      <img
        src={background}
        alt=""
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${dbg && HD.hideBackgroundImage ? "opacity-0" : "opacity-100"}`}
        draggable={false}
      />
      {!(dbg && HD.hideRadialOverlays) && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_68%_58%_at_22%_44%,rgba(178,205,186,0.14),transparent_58%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_12%_52%,rgba(112,161,159,0.08),transparent_55%)]"
            aria-hidden
          />
        </>
      )}

      <div className="relative z-10 flex flex-1 flex-col justify-center py-8 sm:py-10">
        <div className="mx-auto flex w-full max-w-[1920px] flex-col-reverse items-center gap-12 px-5 sm:px-9 md:px-12 xl:flex-row xl:items-center xl:justify-between xl:gap-6 xl:px-18 2xl:px-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[561px] shrink-0 xl:self-center"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <span className="h-px w-12 shrink-0 bg-[#b2cdba]" aria-hidden />
              <span className="font-display text-xs font-semibold uppercase leading-3 tracking-[0.3em] text-[#b2cdba]">
                CRAFTING TRADITION
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-8 font-serif text-[clamp(3rem,8vw,4rem)] font-normal leading-[64px] tracking-[0.08em] text-[#e2e2e2]"
            >
              开窑
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[448px] font-sans text-2xl font-normal leading-[33.6px] tracking-[0.025em] text-[#bacabf]"
            >
              龙泉青瓷，火焰之间的千年诗意
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 max-w-[606px] space-y-1">
              <p className="font-sans text-lg font-normal leading-[28.8px] text-[#c2c8c2]">
                火候、时间与偶然在窑火中相互作用，使每一次开窑都无法被完全复现
              </p>
              <p className="font-sans text-lg font-normal leading-[28.8px] text-[#c2c8c2]">
                请将此刻心境投入其中，开启一次只属于你的数字开窑
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-14 flex flex-col items-start">
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
                className="relative flex h-[66px] w-[min(336px,100%)] items-center justify-center overflow-hidden border-2 border-[rgba(178,205,186,0.86)] bg-[rgba(255,255,255,0.002)] shadow-[inset_0_0_0_2px_rgba(209,217,212,0.1)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(193,218,200,0.95)]"
              >
                <span className="font-sans text-base font-normal tracking-[0.4em] text-[#e2e2e2]">
                  开始开窑
                </span>
                <img
                  src={ctaArrow}
                  alt=""
                  className="pointer-events-none absolute right-12 top-1/2 h-[8.17px] w-[11.67px] -translate-y-1/2"
                  draggable={false}
                />
                <span
                  className="pointer-events-none absolute bottom-0 left-px right-0 h-px bg-[rgba(178,205,186,0.05)]"
                  aria-hidden
                />
              </motion.button>
              <img
                src={ctaUnderline}
                alt=""
                className="mt-3 h-[9px] w-[min(356px,100%)] max-w-full object-contain opacity-90"
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* 删整块右侧栏 = 去掉 HomeShowcase（展柜图、磨砂 blur、shadow 等）， */}
          {/* 所以「晕染没了」——通常不是因为注释本身，而是整列 DOM 没了。 */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full min-w-0 flex-1 items-center justify-center xl:justify-end xl:self-center"
          >
            <HomeShowcase />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
