import { motion } from "framer-motion";
import { useMemo } from "react";
import { ResultVasePreview } from "../ResultVasePreview";
import { useExperience } from "../../context/ExperienceContext";
import { generateArtwork, resolveVaseImageSrc } from "../../lib/generateArtwork";
import type { FireLevel, GlazeId, MoodId } from "../../types";

/** 成器页版式：展示文案去掉中文句号 */
function noPeriod(s: string): string {
  return s.replace(/。/g, "");
}

/** 成器页 — 外边距与 `StepMechanism` / `StepMood` 主容器一致；页内不设大标题（步骤顶栏已标示「成器」） */
export function StepResult() {
  const { selections, goHome } = useExperience();
  const mood = (selections.mood ?? "wang") as MoodId;
  const fire = (selections.fire ?? "mid") as FireLevel;
  const glaze = (selections.glaze ?? "jade") as GlazeId;

  const artwork = useMemo(() => {
    return generateArtwork(mood, fire, glaze, selections.fireTempC);
  }, [mood, fire, glaze, selections.fireTempC]);

  const saveWork = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            ...artwork,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json;charset=utf-8" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${artwork.serial}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shareWork = async () => {
    const text = `${artwork.title}｜${artwork.serial}\n${artwork.moodParam}\n${artwork.fireParam}\n${artwork.glazeParam}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "开窑 · 龙泉青瓷", text });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        alert("作品信息已复制到剪贴板");
      } else {
        alert(text);
      }
    } catch {
      alert(text);
    }
  };

  const cardClass =
    "rounded-sm border border-white/[0.06] bg-[linear-gradient(52.4deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_100%)] p-4 sm:p-5";
  const attrLabelClass = "mt-[0.5px] text-[11.5px] tracking-[0.2em] text-[#8c928c]";
  const attrValueClass = "mt-2 font-serif text-[16.5px] text-[#e2e2e2]";
  /** 生成依据块标题：衬线、浅色，字号较卡内正文 +1.5px */
  const rationaleBlockTitleClass = "mb-1.5 text-left font-serif text-[18px] font-normal text-[#e2e2e2]";
  const rationaleBodyClass = "mt-px";
  const rationaleColumnClass = "min-w-0 flex-1 text-left -mt-[3px]";
  /** 成器页底部三按钮：横向内边距（随 1.1× 视觉缩放调整） */
  const resultActionPadX = "px-[74px]";
  const resultActionPy = "py-[13.2px]";
  const resultActionText = "text-[15.84px]";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[rgb(18,20,20)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_68%_58%_at_22%_44%,rgba(178,205,186,0.1),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_88%_38%,rgba(112,161,159,0.06),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[rgb(18,20,20)]/35" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-[1920px] px-2 pb-14 pt-[46px] sm:px-3 sm:pt-[50px] md:px-4 md:pb-16 md:pt-[54px] xl:px-5 2xl:px-7"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          <motion.div
            className="min-w-0 lg:col-span-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
          >
            <ResultVasePreview
              mood={mood}
              fire={fire}
              glaze={glaze}
              imageSrc={resolveVaseImageSrc(mood, fire, glaze)}
            />
            <div className="mt-[30px] flex flex-wrap justify-center gap-8 sm:mt-[38px]">
              <button
                type="button"
                onClick={saveWork}
                className={`rounded-sm bg-[rgba(178,205,186,0.85)] font-medium text-zinc-950 transition hover:bg-[rgba(178,205,186,0.95)] ${resultActionPadX} ${resultActionPy} ${resultActionText}`}
              >
                保存作品
              </button>
              <button
                type="button"
                onClick={shareWork}
                className={`rounded-sm border border-[rgba(178,205,186,0.86)] text-[#e2e2e2] transition hover:border-[rgba(178,205,186,0.98)] hover:bg-[rgba(178,205,186,0.08)] ${resultActionPadX} ${resultActionPy} ${resultActionText}`}
              >
                分享作品
              </button>
              <button
                type="button"
                onClick={goHome}
                className={`rounded-sm border border-[rgba(232,168,124,0.45)] text-[#e2e2e2] transition hover:border-[rgba(251,146,60,0.55)] hover:bg-orange-500/10 ${resultActionPadX} ${resultActionPy} ${resultActionText}`}
              >
                重新开窑
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 space-y-6 sm:space-y-8 lg:col-span-7 lg:pl-4"
          >
            <header>
              <div className="flex items-center gap-4">
                <span className="h-px w-12 shrink-0 bg-[#b2cdba]" aria-hidden />
                <p className="font-serif text-[15.5px] font-normal leading-tight tracking-[0.06em] text-[#b2cdba] md:text-[16.5px]">
                  作品铭牌
                </p>
              </div>
              <h3 className="mt-3 font-serif text-[31.5px] font-normal leading-tight tracking-[0.06em] text-[#e2e2e2] md:text-[33.5px] md:leading-snug">
                {noPeriod(artwork.title)}
              </h3>
              <p className="mt-[12px] max-w-2xl font-sans text-[13.5px] leading-relaxed text-[#c2c8c2] md:text-[15.5px]">
                {noPeriod(artwork.introParagraphs[0])}
                <br />
                {noPeriod(artwork.introParagraphs[1])}
              </p>
            </header>

            <section>
              <p className="font-sans text-[15px] font-normal leading-relaxed tracking-[0.14em] text-[#b2cdba] md:text-[16px] md:tracking-[0.18em]">
                窑变关键词 / KILN GLOSSARY
              </p>
              <div className="mt-4 flex flex-wrap gap-4 sm:gap-5">
                {artwork.keywords.map((k) => (
                  <span
                    key={k.zh}
                    className="rounded-sm border border-[rgba(178,205,186,0.22)] bg-[rgba(178,205,186,0.04)] px-[14.4px] py-[9.6px] text-[14.34px] tracking-[0.04em] text-[#c2c8c2]"
                  >
                    {noPeriod(k.zh)}{" "}
                    <span className="text-[#8c928c]">{noPeriod(k.en)}</span>
                  </span>
                ))}
              </div>
            </section>

            <section>
              <p className="font-sans text-[15px] font-normal leading-relaxed tracking-[0.14em] text-[#b2cdba] md:text-[16px] md:tracking-[0.18em]">
                生成参数 / ATTRIBUTES
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                <div className={cardClass}>
                  <p className={attrLabelClass}>火候强度</p>
                  <p className={attrValueClass}>{noPeriod(artwork.attrFireStrength)}</p>
                </div>
                <div className={cardClass}>
                  <p className={attrLabelClass}>冷却速度</p>
                  <p className={attrValueClass}>{noPeriod(artwork.attrCoolingSpeed)}</p>
                </div>
                <div className={cardClass}>
                  <p className={attrLabelClass}>烧成气氛</p>
                  <p className={attrValueClass}>{noPeriod(artwork.attrFiringAtmosphere)}</p>
                </div>
                <div className={cardClass}>
                  <p className={attrLabelClass}>釉层厚度</p>
                  <p className={attrValueClass}>{noPeriod(artwork.attrGlazeThickness)}</p>
                </div>
              </div>
            </section>

            <section>
              <p className="font-sans text-[15px] font-normal leading-relaxed tracking-[0.14em] text-[#b2cdba] md:text-[16px] md:tracking-[0.18em]">
                生成依据 / LOGIC
              </p>
              <ul className="mt-5 space-y-5 font-sans text-sm leading-relaxed text-[#c2c8c2] md:text-[15px] md:leading-relaxed">
                <li className="flex items-start gap-[18px]">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#5fe0a8] shadow-[0_0_4px_1px_rgba(95,224,168,0.55),0_0_9px_2px_rgba(95,224,168,0.14)]"
                    aria-hidden
                  />
                  <div className={rationaleColumnClass}>
                    <p className={rationaleBlockTitleClass}>心境影响</p>
                    <p className={rationaleBodyClass}>{noPeriod(artwork.rationale.mood)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-[18px]">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff9a56] shadow-[0_0_4px_1px_rgba(255,154,86,0.52),0_0_9px_2px_rgba(255,154,86,0.13)]"
                    aria-hidden
                  />
                  <div className={rationaleColumnClass}>
                    <p className={rationaleBlockTitleClass}>火候影响</p>
                    <p className={rationaleBodyClass}>{noPeriod(artwork.rationale.fire)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-[18px]">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#9bc4a8] shadow-[0_0_4px_1px_rgba(155,196,168,0.48),0_0_8px_2px_rgba(155,196,168,0.12)]"
                    aria-hidden
                  />
                  <div className={rationaleColumnClass}>
                    <p className={rationaleBlockTitleClass}>釉面影响</p>
                    <p className={rationaleBodyClass}>{noPeriod(artwork.rationale.glaze)}</p>
                  </div>
                </li>
              </ul>
            </section>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
