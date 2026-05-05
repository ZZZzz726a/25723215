import { FIGMA_HOME_ASSETS } from "../constants/figmaHomeAssets";
import { HOME_HALO_DEBUG, HOME_HALO_DEBUG_ENABLED } from "../constants/homeDebug";
import { HOME_SHOWCASE } from "../constants/homeLayout";

const { innerMax, frostedPad } = HOME_SHOWCASE;

/**
 * 首页展品区：展柜内景 + 温度卡；外层 translate 略左移。
 *
 * 开关：`src/constants/homeDebug.ts` → `HOME_HALO_DEBUG_ENABLED` + 各项布尔。
 *
 * 温度卡：`sm:left-[calc(100%-72px)]` 与 `TEMP_CARD_OVERLAP_PX`（72）对齐。
 */
export function HomeShowcase() {
  const { vitrineInner, temperatureIcon } = FIGMA_HOME_ASSETS;
  const dbg = HOME_HALO_DEBUG_ENABLED;
  const HD = HOME_HALO_DEBUG;

  return (
    <div className="flex w-fit max-w-full flex-col items-center justify-center sm:items-center sm:justify-end xl:-translate-x-[clamp(28px,6.5vw,104px)] 2xl:-translate-x-[clamp(36px,7.5vw,128px)]">
      <div className="relative w-full max-w-[95vw] sm:mt-0 sm:w-auto sm:max-w-none sm:shrink-0">
        <div className="relative mx-auto w-fit sm:mx-0">
          {/* ② 磨砂：blur 会在边缘形成柔和光边（常被当成「晕染」） */}
          <div
            className={`rounded bg-[rgba(24,24,27,0.4)] ${dbg && HD.disableFrostedBlur ? "" : "backdrop-blur-md"}`}
            style={{ padding: frostedPad }}
          >
            <div
              className={`rounded ${dbg && HD.disableVitrineGlowShadow ? "" : "shadow-[0_0_52px_-11px_rgba(178,205,186,0.3)]"}`}
              style={{ background: "rgba(255,255,255,0.002)" }}
            >
              <div className="overflow-hidden rounded-[2px]">
                {/* ① 展柜内景：图里自带的青光去不掉，除非换资源或上面再盖遮罩 */}
                <div
                  className={`mx-auto shrink-0 sm:mx-0 ${dbg && HD.hideVitrineInnerPng ? "bg-zinc-800" : "bg-cover bg-center bg-no-repeat"}`}
                  style={
                    dbg && HD.hideVitrineInnerPng
                      ? {
                          aspectRatio: "362 / 462",
                          width: `${innerMax}px`,
                          maxWidth: `min(95vw, ${innerMax}px)`,
                        }
                      : {
                          backgroundImage: `url('${vitrineInner}')`,
                          aspectRatio: "362 / 462",
                          width: `${innerMax}px`,
                          maxWidth: `min(95vw, ${innerMax}px)`,
                        }
                  }
                >
                  {/* 展柜内顶部暗角渐变（中性灰黑），不是青雾；青色仅在文案 */}
                  <div className="flex h-full w-full flex-col justify-end bg-gradient-to-b from-[rgba(9,9,11,0.8)] from-0% via-transparent via-50% to-transparent to-100%">
                    <div className="mb-4 ml-4 flex flex-col gap-1 sm:mb-5 sm:ml-5">
                      <p className="font-sans text-[10px] font-normal uppercase leading-[15px] tracking-[2px] text-[#b2cdba]">
                        string-pattern decoration
                      </p>
                      <p className="font-sans text-[15px] leading-snug text-[#e2e2e2] sm:text-base">
                        青釉 · 弦纹梅瓶
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 「温度组合部件」— 磨砂浮层卡；left 与 homeLayout.TEMP_CARD_OVERLAP_PX（72）同步 */}
          <div className="relative z-10 mt-8 flex justify-center sm:absolute sm:left-[calc(100%-72px)] sm:top-[clamp(96px,25%,132px)] sm:mt-0 sm:block">
            {/* ②④ blur-xl + shadow-lg：也会让边缘发亮 */}
            <div
              className={`flex w-[180px] flex-col border border-white/10 bg-[rgba(255,255,255,0.06)] px-6 py-6 ${dbg && HD.disableTempCardBlurAndShadow ? "" : "shadow-lg backdrop-blur-xl"}`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={temperatureIcon}
                  alt=""
                  className="h-[10.5px] w-[9.33px]"
                  draggable={false}
                />
                <span className="font-sans text-[10px] leading-[15px] text-[#a1a1aa]">
                  TEMPERATURE
                </span>
              </div>
              <p className="mt-2 font-serif text-xl leading-7 text-[#e2e2e2]">1310°C</p>
              <p className="mt-2 font-sans text-xs leading-[15px] text-[#71717a]">
                还原气氛下形成的致密
                <br />
                釉层
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
