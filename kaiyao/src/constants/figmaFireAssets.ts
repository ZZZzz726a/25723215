/**
 * 控火页资源
 * 全页背景 40-190：https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=40-190
 * 画框/窑/滑轨等：node 2-663
 */
const B = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images";

export const FIGMA_FIRE_ASSETS = {
  /** 全页背景：径向暖暗调 PNG（`public/fire-step-bg.png`）；设计参考 [Figma 40-190](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=40-190) */
  pageBackground: "/fire-step-bg.png",
  /** 左侧外框底板（Figma 2-663 当前导出） */
  previewPlate: `${B}/8107a4af-f132-4dee-bcde-70f374ca62f5`,
  /** 窑膛主视觉（本地 `public/preview-kiln.png`） */
  previewKiln: "/preview-kiln.png",
  /** 滑块态（武火 / 中火 / 微火）— node 40-355, 40-366, 40-372 */
  thumbHigh: `${B}/14099cd4-af4f-4b97-b501-15c0aaa083d7`,
  thumbMid: `${B}/3e621c4b-6e42-4e7a-9309-6f557437e741`,
  thumbLow: `${B}/fa6e13a1-fc1b-4e5f-abf1-a5136a853ef3`,
} as const;
