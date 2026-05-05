/**
 * Mechanism 页 Figma 资源
 * - 三卡片：node 21-30
 * - 底部 Porcelain 横幅：node 21-12
 * 设计稿：https://www.figma.com/design/p9TtsqjYOaQnMF7XaxtDQW/Untitled?node-id=21-30
 */
const B = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images";

export const FIGMA_MECHANISM_ASSETS = {
  frameReferenceNodes21: `${B}/d0cc75a5-478e-497e-9c19-bba570c34018`,
  frameReferencePorcelain: `${B}/13625860-7414-4a08-b56b-8db1f12f2a94`,

  decoRightTall: `${B}/7201acb4-8e29-4dae-bdd3-a1e5cb7c7983`,
  decoBottomLeft: `${B}/e9bd5e7c-9a6b-40f3-8bed-cbfcca29a92a`,

  /** 21-12 横幅底图 */
  porcelainBannerBg: `${B}/58e2412d-25dc-41dd-bdc2-4ace8e2b1b86`,

  /** 21-30 三卡大字（火 / 时 / 机） */
  cardFireHan: `${B}/fbb38ddc-66d8-486a-b74e-b662aa30c320`,
  cardTimeHan: `${B}/1861c33d-0dd2-401e-8090-9f4c9df5ffeb`,
  cardChanceHan: `${B}/c3507266-7017-4094-b476-b6cfc53a5550`,

  /** 三卡右上角装饰：Figma 26-109 → 26-111（顺序对应 火 / 时 / 机） */
  cardCorner26_109: `${B}/9aec0635-ecf6-452f-8d62-ba351139c9a8`,
  cardCorner26_110: `${B}/385913cb-3bb5-4828-8d7f-aca1a939b9f1`,
  cardCorner26_111: `${B}/54003f55-dc78-48fb-862d-85456ebd86c4`,
} as const;
