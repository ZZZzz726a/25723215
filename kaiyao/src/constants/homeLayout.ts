/** 右侧展柜：磨砂边距按设计为 5 */
const frostedPad = 5;
/**
 * 展品区目标宽度（像素）。勿再用 width:100% 撑满父级，否则会一直被栏宽卡住，改多大数字都不变。
 */
const innerMax = 350;

/** 温度卡压在展柜上的重叠像素 — 与 HomeShowcase 里 sm:left calc 一致 */
export const TEMP_CARD_OVERLAP_PX = 72;

export const HOME_SHOWCASE = {
  innerMax,
  frostedPad,
  tempOverlapPx: TEMP_CARD_OVERLAP_PX,
} as const;
