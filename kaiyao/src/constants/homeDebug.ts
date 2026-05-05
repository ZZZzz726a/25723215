/**
 * 首页「光晕 / 晕染」二分排查 —— 仅开发时用。
 *
 * 用法：`HOME_HALO_DEBUG_ENABLED = true`，再逐项改下面布尔；刷新页面看右侧变化。
 * 上线前务必保持 `ENABLED === false`。
 */
export const HOME_HALO_DEBUG_ENABLED = false;

export const HOME_HALO_DEBUG = {
  /** StepHome：全屏 background 图 invisible（仍占位，底下只剩纯色 bg） */
  hideBackgroundImage: true,
  /** StepHome：两层 radial 青雾关掉 */
  hideRadialOverlays: true,
  /** HomeShowcase：磨砂外框去掉 backdrop-blur-md */
  disableFrostedBlur: true,
  /** HomeShowcase：展柜外壳青圈 box-shadow 关掉 */
  disableVitrineGlowShadow: true,
  /** HomeShowcase：温度卡 shadow-lg + backdrop-blur-xl 关掉 */
  disableTempCardBlurAndShadow: true,
  /** HomeShowcase：展柜内景图改为纯色块（辨是否 vitrineInner 自带光） */
  hideVitrineInnerPng: false,
} as const;

if (import.meta.env.DEV && HOME_HALO_DEBUG_ENABLED) {
  console.info("[HOME_HALO_DEBUG] 已开启 → src/constants/homeDebug.ts");
}
