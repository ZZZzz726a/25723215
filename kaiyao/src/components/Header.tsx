import { motion } from "framer-motion";
import type { Screen } from "../types";
import { useExperience } from "../context/ExperienceContext";
import { FIGMA_HOME_ASSETS } from "../constants/figmaHomeAssets";

const LABELS = ["识窑", "入境", "控火", "择釉", "入窑", "开窑", "成器"];

function StepperNav({ stepperIndex }: { stepperIndex: number }) {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-1 font-serif text-[15.5px] font-normal leading-tight tracking-[0.11em] sm:gap-x-1.5 md:text-[16.5px]">
      {LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 sm:gap-1.5">
          {i > 0 && <span className="mx-0.5 h-px w-4 bg-zinc-700 sm:w-4" aria-hidden />}
          <span
            className={
              i === stepperIndex
                ? "text-[#b2cdba]"
                : i < stepperIndex
                  ? "text-zinc-500"
                  : "text-zinc-600"
            }
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Header({ screen }: { screen: Screen }) {
  const { stepperIndex, goBack, goHome } = useExperience();
  const showBack = screen !== "home";
  const showStepper = screen !== "home" && screen !== "mechanism" && screen !== "mood" && screen !== "fire";
  /** 与首页同高、同色、同轨宽；识窑 / 入境 / 控火 中间加步骤条 */
  const homeRailHeader =
    screen === "home" ||
    screen === "mechanism" ||
    screen === "mood" ||
    screen === "fire" ||
    screen === "glaze" ||
    screen === "kiln" ||
    screen === "reveal" ||
    screen === "result";

  return (
    <header
      className={
        homeRailHeader
          ? "relative z-30 flex h-20 w-full shrink-0 justify-center border-b border-[rgba(244,244,245,0.1)] bg-[rgba(9,9,11,0.8)] backdrop-blur-[30px]"
          : "relative z-20 flex shrink-0 items-center justify-between px-5 py-5 sm:px-9 md:px-12 xl:px-18 2xl:px-20"
      }
    >
      {homeRailHeader ? (
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-center px-5 sm:px-9 md:px-12 xl:px-18 2xl:px-20">
          <div className="flex min-w-[7rem] shrink-0 items-center sm:min-w-[8.5rem]">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={goHome}
              aria-label="返回首页"
              className="border-0 bg-transparent p-0 text-left font-serif text-xl font-normal leading-7 tracking-[0.125em] text-[#f4f4f5] transition hover:text-white"
            >
              LONGQUAN
            </motion.button>
          </div>

          {screen === "mechanism" ||
          screen === "mood" ||
          screen === "fire" ||
          screen === "glaze" ||
          screen === "kiln" ||
          screen === "reveal" ||
          screen === "result" ? (
            <nav
              className="pointer-events-none flex min-w-0 flex-1 justify-center overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-2"
              aria-label="步骤"
            >
              <StepperNav stepperIndex={stepperIndex} />
            </nav>
          ) : (
            <div className="min-w-0 flex-1" aria-hidden />
          )}

          <div className="flex min-w-[7rem] shrink-0 justify-end sm:min-w-[8.5rem]">
            {screen === "home" ? (
              <button
                type="button"
                className="inline-flex shrink-0 text-[#a1a1aa] transition hover:text-zinc-200"
                aria-label="菜单"
              >
                <img
                  src={FIGMA_HOME_ASSETS.menuIcon}
                  alt=""
                  width={18}
                  height={12}
                  className="block"
                  draggable={false}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex shrink-0 items-center gap-[1ch] font-sans text-sm font-normal leading-[22px] tracking-[0.025em] text-[#a1a1aa] transition hover:text-zinc-200"
              >
                <span aria-hidden>←</span>
                <span>返回上一步</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={goHome}
            aria-label="返回首页"
            className="border-0 bg-transparent p-0 text-left font-serif text-[11px] font-medium uppercase tracking-[0.35em] text-zinc-100 transition hover:text-white md:text-xs"
          >
            LONGQUAN
          </motion.button>

          {showStepper && (
            <nav
              className="pointer-events-none absolute left-1/2 hidden max-w-[min(720px,72vw)] -translate-x-1/2 md:block"
              aria-label="步骤"
            >
              <StepperNav stepperIndex={stepperIndex} />
            </nav>
          )}

          <div className="min-w-[120px] text-right">
            {showBack ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-[1ch] font-sans text-[11px] leading-snug text-zinc-500 transition hover:text-zinc-300 md:text-sm md:leading-[22px]"
              >
                <span aria-hidden>←</span>
                <span>返回上一步</span>
              </button>
            ) : (
              <button
                type="button"
                className="text-zinc-600 transition hover:text-zinc-400"
                aria-label="菜单"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="block h-px w-5 bg-current" />
                  <span className="block h-px w-5 bg-current" />
                  <span className="block h-px w-5 bg-current" />
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </header>
  );
}
