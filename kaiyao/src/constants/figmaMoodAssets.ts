/**
 * 心境选择页 — 六卡位图（Figma 38-xxx 单卡导出，亮度一致）
 * 全页框架仍见 node 2-500：https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=2-500
 */
const B = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images";

export const FIGMA_MOOD_ASSETS = {
  /** 全页底图 */
  backgroundFull: `${B}/1647cc43-1c6c-4606-b0c1-eaa098eb4682`,
  /** 静 — node 38-171 */
  cardJing: `${B}/6de91c99-2d24-489a-a272-37adf42e9eea`,
  /** 望 — node 38-180 */
  cardWang: `${B}/9b75a3a9-c0a4-4eb6-9b5c-fc5cfcac837b`,
  /** 流 — node 38-134 */
  cardLiu: `${B}/46a2dca3-fba1-4f65-b466-22defea1c383`,
  /** 惑 — node 38-149 */
  cardHuo: `${B}/9b4b6838-d5a3-4be5-ac31-fd9621e9352d`,
  /** 烈 — node 38-156 */
  cardLie: `${B}/8530b7a5-1f8d-4cc2-835f-e2573894a91e`,
  /** 敛 — node 38-164 */
  cardLian: `${B}/f924aba1-a073-49ec-a642-c5c86c732187`,
} as const;
