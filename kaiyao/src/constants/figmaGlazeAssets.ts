/**
 * 择釉页 — 三卡位图（Figma 导出 PNG，`aspect-[33/25]` + `object-cover` 裁切）
 *
 * - 温润：[Figma 71-564](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=71-564)
 * - 冰裂：[Figma 71-562](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=71-562)
 * - 流釉：[Figma 71-560](https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=71-560)
 *
 * 重新导出：`npm run fetch:glaze-images`（需环境变量 `FIGMA_ACCESS_TOKEN`）
 */
import type { GlazeId } from "../types";

export const FIGMA_GLAZE_ASSETS: Record<GlazeId, string> = {
  jade: "/glazes/jade.png",
  crackle: "/glazes/crackle.png",
  flow: "/glazes/flow.png",
};
