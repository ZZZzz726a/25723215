import type { FireLevel, GlazeId, MoodId } from "../types";
import { fireToTemp } from "./fireTemperature";

export interface GeneratedArtwork {
  title: string;
  serial: string;
  /** 器型（保留作导出/扩展，与参数卡无绑定） */
  vesselType: string;
  moodParam: string;
  fireParam: string;
  glazeParam: string;
  /** 生成参数四宫格：与前面步骤选择对应 */
  attrFireStrength: string;
  attrCoolingSpeed: string;
  attrFiringAtmosphere: string;
  attrGlazeThickness: string;
  keywords: { zh: string; en: string }[];
  rationale: {
    mood: string;
    fire: string;
    glaze: string;
  };
  /** 作品铭牌下两段介绍 */
  introParagraphs: readonly [string, string];
  /** 成器左图；`null` 时用默认实拍 `/result-vase-lq-01.png` + 滤镜 */
  vaseImageSrc: string | null;
}

const MOOD_LABEL: Record<MoodId, string> = {
  jing: "静｜平静如水",
  wang: "望｜暮色将明",
  huo: "惑｜雾中寻青",
  lie: "烈｜火光正盛",
  lian: "敛｜收锋藏韵",
  liu: "流｜釉色流转",
};

const FIRE_LABEL: Record<FireLevel, string> = {
  low: "微火",
  mid: "中火",
  high: "武火",
};

const GLAZE_LABEL: Record<GlazeId, string> = {
  jade: "温润如玉釉",
  crackle: "冰裂纹釉",
  flow: "流釉",
};

/** 冷却速度｜由心境决定 */
const COOLING_SPEED_BY_MOOD: Record<MoodId, string> = {
  jing: "自然降温",
  wang: "缓慢降温",
  huo: "缓慢降温",
  lie: "控温急冷",
  lian: "长时缓冷",
  liu: "分段降温",
};

/** 烧成气氛｜由釉面决定 */
const FIRING_ATMOSPHERE_BY_GLAZE: Record<GlazeId, string> = {
  jade: "温和还原",
  crackle: "缓冷还原",
  flow: "强还原",
};

/** 釉层厚度｜釉面 + 火候（与控火页 5°C 步进一致） */
const GLAZE_THICKNESS_MM: Record<GlazeId, Record<FireLevel, string>> = {
  jade: { low: "0.72mm", mid: "0.78mm", high: "0.82mm" },
  crackle: { low: "0.80mm", mid: "0.85mm", high: "0.90mm" },
  flow: { low: "0.95mm", mid: "1.08mm", high: "1.20mm" },
};

const TEMP_MIN = 0;
const TEMP_MAX = 1200;
const TEMP_STEP = 5;

function clampDisplayTempC(c: number): number {
  const stepped = Math.round((c - TEMP_MIN) / TEMP_STEP) * TEMP_STEP + TEMP_MIN;
  return Math.min(TEMP_MAX, Math.max(TEMP_MIN, stepped));
}

function resolveDisplayTempC(fire: FireLevel, fireTempC: number | null): number {
  if (fireTempC != null && Number.isFinite(fireTempC)) {
    return clampDisplayTempC(fireTempC);
  }
  return fireToTemp(fire);
}

function fireStrengthDisplay(fire: FireLevel, fireTempC: number | null): string {
  const t = resolveDisplayTempC(fire, fireTempC);
  return `${FIRE_LABEL[fire]}｜${t}°C`;
}

const DEFAULT_INTRO = [
  "此器承宋韵之神髓，釉色润如美玉，青翠欲滴",
  "弦纹疏密有致，尽显古拙大方之气",
] as const;

const STILL_WATER_MEIPING_IMAGE = "/result-jing-low-jade.png";
const STILL_SNOW_MEIPING_IMAGE = "/result-jing-low-crackle.png";
const STILL_FLOW_MEIPING_IMAGE = "/result-jing-low-flow.png";
const CHENGXIN_MEIPING_IMAGE = "/result-jing-mid-jade.png";
const CHENG_LIE_MEIPING_IMAGE = "/result-jing-mid-crackle.png";
const WATER_TRACE_MEIPING_IMAGE = "/result-jing-mid-flow.png";
const SHENLAN_MEIPING_IMAGE = "/result-jing-high-jade.png";
const JIWEN_MEIPING_IMAGE = "/result-jing-high-crackle.png";
const LANYING_MEIPING_IMAGE = "/result-jing-high-flow.png";
const MUQING_CHANGJING_IMAGE = "/result-wang-low-jade.png";
const MUWEN_CHANGJING_IMAGE = "/result-wang-low-crackle.png";
const MULIU_CHANGJING_IMAGE = "/result-wang-low-flow.png";
const SHUQING_CHANGJING_IMAGE = "/result-wang-mid-jade.png";
const SHULIU_CHANGJING_IMAGE = "/result-wang-mid-flow.png";
const SHUWEN_CHANGJING_IMAGE = "/result-shuwen-changjing.png";
const YUANQING_CHANGJING_IMAGE = "/result-wang-high-jade.png";
const YUANWEN_CHANGJING_IMAGE = "/result-wang-high-crackle.png";
const YUANLIU_CHANGJING_IMAGE = "/result-wang-high-flow.png";
const WUQING_DANPING_IMAGE = "/result-huo-low-jade.png";
const MISTY_VEIN_DANPING_IMAGE = "/result-huo-low-crackle.png";
const MISTY_FLOW_DANPING_IMAGE = "/result-huo-low-flow.png";
const XUNQING_DANPING_IMAGE = "/result-huo-mid-jade.png";
const MILIU_DANPING_IMAGE = "/result-huo-mid-flow.png";
const YINWEN_DANPING_IMAGE = "/result-yinwen-danping.png";
const YOUQING_DANPING_IMAGE = "/result-huo-high-jade.png";
const YOULIE_DANPING_IMAGE = "/result-huo-high-crackle.png";
const XUANLIU_DANPING_IMAGE = "/result-huo-high-flow.png";
const WEIYAN_PANKOU_IMAGE = "/result-lie-low-jade.png";
const FLAME_VEIN_DISH_IMAGE = "/result-lie-low-crackle.png";
const WEIYAN_LIU_PING_IMAGE = "/result-lie-low-flow.png";
const MINGYAN_YU_PING_IMAGE = "/result-lie-mid-jade.png";
const CHIGUANG_LIE_PING_IMAGE = "/result-lie-mid-crackle.png";
const YANLIU_DISH_IMAGE = "/result-lie-mid-flow.png";
const CHIQING_YU_PING_IMAGE = "/result-lie-high-jade.png";
const CHILIE_DISHMOUTH_IMAGE = "/result-lie-high-crackle.png";
const BLAZING_FLOW_VASE_IMAGE = "/result-lie-high-flow.png";
const RESTRAINED_GUANER_IMAGE = "/result-lian-low-jade.png";
const CANGWEN_YUHUCHUN_IMAGE = "/result-lian-low-crackle.png";
const ZANGLIU_YUHUCHUN_IMAGE = "/result-lian-low-flow.png";
const HANQING_YUHUCHUN_IMAGE = "/result-lian-mid-jade.png";
const HANLIE_YUHUCHUN_IMAGE = "/result-lian-mid-crackle.png";
const HANLIU_YUHUCHUN_IMAGE = "/result-lian-mid-flow.png";
const CHENQING_YUHUCHUN_IMAGE = "/result-lian-high-jade.png";
const CHENLIE_YUHUCHUN_IMAGE = "/result-lian-high-crackle.png";
const CHENLIU_YUHUCHUN_IMAGE = "/result-lian-high-flow.png";
const JUANQING_PANKOU_IMAGE = "/result-liu-low-jade.png";
const JUANWEN_PANKOU_IMAGE = "/result-liu-low-crackle.png";
const JUANLIU_PANKOU_IMAGE = "/result-liu-low-flow.png";
const YANGQING_PANKOU_IMAGE = "/result-liu-mid-jade.png";
const YANGWEN_PANKOU_IMAGE = "/result-liu-mid-crackle.png";
const YANGLIU_PANKOU_IMAGE = "/result-liu-mid-flow.png";
const LANQING_PANKOU_IMAGE = "/result-liu-high-jade.png";
const LANWEN_PANKOU_IMAGE = "/result-liu-high-crackle.png";
const FLOWING_HUE_DISH_IMAGE = "/result-liu-high-flow.png";

/** 静 + 微火 + 温润如玉釉：静澜梅瓶成器页专用素材与文案 */
function isStillWaterMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "low" && glaze === "jade";
}

/** 静 + 微火 + 冰裂纹釉：静雪梅瓶成器页专用素材与文案 */
function isStillSnowMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "low" && glaze === "crackle";
}

/** 静 + 微火 + 流釉：静流梅瓶成器页专用素材与文案 */
function isStillFlowMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "low" && glaze === "flow";
}

/** 静 + 中火 + 温润如玉釉：澄心梅瓶成器页专用素材与文案 */
function isChengxinMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "mid" && glaze === "jade";
}

/** 静 + 中火 + 冰裂纹釉：澄裂梅瓶成器页专用素材与文案 */
function isChengLieMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "mid" && glaze === "crackle";
}

/** 静 + 中火 + 流釉：水痕梅瓶成器页专用素材与文案 */
function isWaterTraceMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "mid" && glaze === "flow";
}

/** 静 + 武火 + 温润如玉釉：深澜梅瓶成器页专用素材与文案 */
function isShenlanMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "high" && glaze === "jade";
}

/** 静 + 武火 + 冰裂纹釉：霁纹梅瓶成器页专用素材与文案 */
function isJiwenMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "high" && glaze === "crackle";
}

/** 静 + 武火 + 流釉：澜影梅瓶成器页专用素材与文案 */
function isLanyingMeipingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "jing" && fire === "high" && glaze === "flow";
}

/** 望 + 微火 + 温润如玉釉：暮青长颈瓶成器页专用素材与文案 */
function isMuqingChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "low" && glaze === "jade";
}

/** 望 + 微火 + 冰裂纹釉：暮纹长颈瓶成器页专用素材与文案 */
function isMuwenChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "low" && glaze === "crackle";
}

/** 望 + 微火 + 流釉：暮流长颈瓶成器页专用素材与文案 */
function isMuliuChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "low" && glaze === "flow";
}

/** 望 + 中火 + 温润如玉釉：曙青长颈瓶成器页专用素材与文案 */
function isShuqingChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "mid" && glaze === "jade";
}

/** 望 + 中火 + 流釉：曙流长颈瓶成器页专用素材与文案 */
function isShuliuChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "mid" && glaze === "flow";
}

/** 望 + 中火 + 冰裂纹釉：曙纹长颈瓶成器页专用素材与文案 */
function isShuwenChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "mid" && glaze === "crackle";
}

/** 望 + 武火 + 温润如玉釉：远青长颈瓶成器页专用素材与文案 */
function isYuanqingChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "high" && glaze === "jade";
}

/** 望 + 武火 + 冰裂纹釉：远纹长颈瓶成器页专用素材与文案 */
function isYuanwenChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "high" && glaze === "crackle";
}

/** 望 + 武火 + 流釉：远流长颈瓶成器页专用素材与文案 */
function isYuanliuChangjingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "wang" && fire === "high" && glaze === "flow";
}

/** 惑 + 微火 + 温润如玉釉：雾青胆瓶成器页专用素材与文案 */
function isWuqingDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "low" && glaze === "jade";
}

/** 惑 + 微火 + 冰裂纹釉：雾纹胆瓶成器页专用素材与文案 */
function isMistyVeinDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "low" && glaze === "crackle";
}

/** 惑 + 微火 + 流釉：雾流胆瓶成器页专用素材与文案 */
function isMistyFlowDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "low" && glaze === "flow";
}

/** 惑 + 中火 + 温润如玉釉：寻青胆瓶成器页专用素材与文案 */
function isXunqingDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "mid" && glaze === "jade";
}

/** 惑 + 中火 + 流釉：迷流胆瓶成器页专用素材与文案 */
function isMiliuDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "mid" && glaze === "flow";
}

/** 惑 + 中火 + 冰裂纹釉：隐纹胆瓶成器页专用素材与文案 */
function isYinwenDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "mid" && glaze === "crackle";
}

/** 惑 + 武火 + 温润如玉釉：幽青胆瓶成器页专用素材与文案 */
function isYouqingDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "high" && glaze === "jade";
}

/** 惑 + 武火 + 冰裂纹釉：幽裂胆瓶成器页专用素材与文案 */
function isYoulieDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "high" && glaze === "crackle";
}

/** 惑 + 武火 + 流釉：玄流胆瓶成器页专用素材与文案 */
function isXuanliuDanpingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "huo" && fire === "high" && glaze === "flow";
}

/** 烈 + 微火 + 温润如玉釉：微焰盘口瓶成器页专用素材与文案 */
function isWeiyanPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "low" && glaze === "jade";
}

/** 烈 + 微火 + 冰裂纹釉：焰纹盘口瓶成器页专用素材与文案 */
function isFlameVeinDishmouthPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "low" && glaze === "crackle";
}

/** 烈 + 微火 + 流釉：微焰流瓶成器页专用素材与文案 */
function isWeiyanLiupingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "low" && glaze === "flow";
}

/** 烈 + 中火 + 温润如玉釉：明焰玉瓶成器页专用素材与文案 */
function isMingyanYupingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "mid" && glaze === "jade";
}

/** 烈 + 中火 + 冰裂纹釉：赤光裂瓶成器页专用素材与文案 */
function isChiguangLiepingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "mid" && glaze === "crackle";
}

/** 烈 + 中火 + 流釉：焰流盘口瓶成器页专用素材与文案 */
function isYanliuDishmouthPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "mid" && glaze === "flow";
}

/** 烈 + 武火 + 温润如玉釉：炽青玉瓶成器页专用素材与文案 */
function isChiqingYupingPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "high" && glaze === "jade";
}

/** 烈 + 武火 + 冰裂纹釉：炽裂盘口瓶成器页专用素材与文案 */
function isChilieDishmouthPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "high" && glaze === "crackle";
}

/** 烈 + 武火 + 流釉：炽流盘口瓶成器页专用素材与文案 */
function isBlazingFlowPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lie" && fire === "high" && glaze === "flow";
}

/** 敛 + 微火 + 冰裂纹釉：藏纹玉壶春瓶成器页专用素材与文案 */
function isCangwenYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "low" && glaze === "crackle";
}

/** 敛 + 微火 + 温润如玉釉：藏韵贯耳瓶成器页专用素材与文案 */
function isRestrainedGuanerPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "low" && glaze === "jade";
}

/** 敛 + 微火 + 流釉：藏流玉壶春瓶成器页专用素材与文案 */
function isZangliuYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "low" && glaze === "flow";
}

/** 敛 + 中火 + 温润如玉釉：含青玉壶春瓶成器页专用素材与文案 */
function isHanqingYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "mid" && glaze === "jade";
}

/** 敛 + 中火 + 冰裂纹釉：含裂玉壶春瓶成器页专用素材与文案 */
function isHanlieYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "mid" && glaze === "crackle";
}

/** 敛 + 中火 + 流釉：含流玉壶春瓶成器页专用素材与文案 */
function isHanliuYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "mid" && glaze === "flow";
}

/** 敛 + 武火 + 温润如玉釉：沉青玉壶春瓶成器页专用素材与文案 */
function isChenqingYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "high" && glaze === "jade";
}

/** 敛 + 武火 + 冰裂纹釉：沉裂玉壶春瓶成器页专用素材与文案 */
function isChenlieYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "high" && glaze === "crackle";
}

/** 敛 + 武火 + 流釉：沉流玉壶春瓶成器页专用素材与文案 */
function isChenliuYuhuchunPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "lian" && fire === "high" && glaze === "flow";
}

/** 流 + 微火 + 温润如玉釉：涓青盘口瓶成器页专用素材与文案 */
function isJuanqingPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "low" && glaze === "jade";
}

/** 流 + 微火 + 冰裂纹釉：涓纹盘口瓶成器页专用素材与文案 */
function isJuanwenPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "low" && glaze === "crackle";
}

/** 流 + 微火 + 流釉：涓流盘口瓶成器页专用素材与文案 */
function isJuanliuPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "low" && glaze === "flow";
}

/** 流 + 中火 + 温润如玉釉：漾青盘口瓶成器页专用素材与文案 */
function isYangqingPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "mid" && glaze === "jade";
}

/** 流 + 中火 + 冰裂纹釉：漾纹盘口瓶成器页专用素材与文案 */
function isYangwenPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "mid" && glaze === "crackle";
}

/** 流 + 中火 + 流釉：漾流盘口瓶成器页专用素材与文案 */
function isYangliuPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "mid" && glaze === "flow";
}

/** 流 + 武火 + 温润如玉釉：澜青盘口瓶成器页专用素材与文案 */
function isLanqingPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "high" && glaze === "jade";
}

/** 流 + 武火 + 冰裂纹釉：澜纹盘口瓶成器页专用素材与文案 */
function isLanwenPankouPreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "high" && glaze === "crackle";
}

/** 流 + 武火 + 流釉：流青盘口瓶成器页专用素材与文案 */
function isFlowingHuePreset(mood: MoodId, fire: FireLevel, glaze: GlazeId): boolean {
  return mood === "liu" && fire === "high" && glaze === "flow";
}

/** 成器页与开窑页共用：有专用成片则返回其 URL，否则 `null`（默认实拍 + 滤镜） */
export function resolveVaseImageSrc(
  mood: MoodId,
  fire: FireLevel,
  glaze: GlazeId
): string | null {
  if (isStillWaterMeipingPreset(mood, fire, glaze)) return STILL_WATER_MEIPING_IMAGE;
  if (isStillSnowMeipingPreset(mood, fire, glaze)) return STILL_SNOW_MEIPING_IMAGE;
  if (isStillFlowMeipingPreset(mood, fire, glaze)) return STILL_FLOW_MEIPING_IMAGE;
  if (isChengxinMeipingPreset(mood, fire, glaze)) return CHENGXIN_MEIPING_IMAGE;
  if (isChengLieMeipingPreset(mood, fire, glaze)) return CHENG_LIE_MEIPING_IMAGE;
  if (isWaterTraceMeipingPreset(mood, fire, glaze)) return WATER_TRACE_MEIPING_IMAGE;
  if (isShenlanMeipingPreset(mood, fire, glaze)) return SHENLAN_MEIPING_IMAGE;
  if (isJiwenMeipingPreset(mood, fire, glaze)) return JIWEN_MEIPING_IMAGE;
  if (isLanyingMeipingPreset(mood, fire, glaze)) return LANYING_MEIPING_IMAGE;
  if (isMuqingChangjingPreset(mood, fire, glaze)) return MUQING_CHANGJING_IMAGE;
  if (isMuwenChangjingPreset(mood, fire, glaze)) return MUWEN_CHANGJING_IMAGE;
  if (isMuliuChangjingPreset(mood, fire, glaze)) return MULIU_CHANGJING_IMAGE;
  if (isShuqingChangjingPreset(mood, fire, glaze)) return SHUQING_CHANGJING_IMAGE;
  if (isShuliuChangjingPreset(mood, fire, glaze)) return SHULIU_CHANGJING_IMAGE;
  if (isShuwenChangjingPreset(mood, fire, glaze)) return SHUWEN_CHANGJING_IMAGE;
  if (isYuanqingChangjingPreset(mood, fire, glaze)) return YUANQING_CHANGJING_IMAGE;
  if (isYuanwenChangjingPreset(mood, fire, glaze)) return YUANWEN_CHANGJING_IMAGE;
  if (isYuanliuChangjingPreset(mood, fire, glaze)) return YUANLIU_CHANGJING_IMAGE;
  if (isWuqingDanpingPreset(mood, fire, glaze)) return WUQING_DANPING_IMAGE;
  if (isMistyVeinDanpingPreset(mood, fire, glaze)) return MISTY_VEIN_DANPING_IMAGE;
  if (isMistyFlowDanpingPreset(mood, fire, glaze)) return MISTY_FLOW_DANPING_IMAGE;
  if (isXunqingDanpingPreset(mood, fire, glaze)) return XUNQING_DANPING_IMAGE;
  if (isMiliuDanpingPreset(mood, fire, glaze)) return MILIU_DANPING_IMAGE;
  if (isYinwenDanpingPreset(mood, fire, glaze)) return YINWEN_DANPING_IMAGE;
  if (isYouqingDanpingPreset(mood, fire, glaze)) return YOUQING_DANPING_IMAGE;
  if (isYoulieDanpingPreset(mood, fire, glaze)) return YOULIE_DANPING_IMAGE;
  if (isXuanliuDanpingPreset(mood, fire, glaze)) return XUANLIU_DANPING_IMAGE;
  if (isWeiyanPankouPreset(mood, fire, glaze)) return WEIYAN_PANKOU_IMAGE;
  if (isFlameVeinDishmouthPreset(mood, fire, glaze)) return FLAME_VEIN_DISH_IMAGE;
  if (isWeiyanLiupingPreset(mood, fire, glaze)) return WEIYAN_LIU_PING_IMAGE;
  if (isMingyanYupingPreset(mood, fire, glaze)) return MINGYAN_YU_PING_IMAGE;
  if (isChiguangLiepingPreset(mood, fire, glaze)) return CHIGUANG_LIE_PING_IMAGE;
  if (isYanliuDishmouthPreset(mood, fire, glaze)) return YANLIU_DISH_IMAGE;
  if (isChiqingYupingPreset(mood, fire, glaze)) return CHIQING_YU_PING_IMAGE;
  if (isChilieDishmouthPreset(mood, fire, glaze)) return CHILIE_DISHMOUTH_IMAGE;
  if (isBlazingFlowPreset(mood, fire, glaze)) return BLAZING_FLOW_VASE_IMAGE;
  if (isCangwenYuhuchunPreset(mood, fire, glaze)) return CANGWEN_YUHUCHUN_IMAGE;
  if (isRestrainedGuanerPreset(mood, fire, glaze)) return RESTRAINED_GUANER_IMAGE;
  if (isZangliuYuhuchunPreset(mood, fire, glaze)) return ZANGLIU_YUHUCHUN_IMAGE;
  if (isHanqingYuhuchunPreset(mood, fire, glaze)) return HANQING_YUHUCHUN_IMAGE;
  if (isHanlieYuhuchunPreset(mood, fire, glaze)) return HANLIE_YUHUCHUN_IMAGE;
  if (isHanliuYuhuchunPreset(mood, fire, glaze)) return HANLIU_YUHUCHUN_IMAGE;
  if (isChenqingYuhuchunPreset(mood, fire, glaze)) return CHENQING_YUHUCHUN_IMAGE;
  if (isChenlieYuhuchunPreset(mood, fire, glaze)) return CHENLIE_YUHUCHUN_IMAGE;
  if (isChenliuYuhuchunPreset(mood, fire, glaze)) return CHENLIU_YUHUCHUN_IMAGE;
  if (isJuanqingPankouPreset(mood, fire, glaze)) return JUANQING_PANKOU_IMAGE;
  if (isJuanwenPankouPreset(mood, fire, glaze)) return JUANWEN_PANKOU_IMAGE;
  if (isJuanliuPankouPreset(mood, fire, glaze)) return JUANLIU_PANKOU_IMAGE;
  if (isYangqingPankouPreset(mood, fire, glaze)) return YANGQING_PANKOU_IMAGE;
  if (isYangwenPankouPreset(mood, fire, glaze)) return YANGWEN_PANKOU_IMAGE;
  if (isYangliuPankouPreset(mood, fire, glaze)) return YANGLIU_PANKOU_IMAGE;
  if (isLanqingPankouPreset(mood, fire, glaze)) return LANQING_PANKOU_IMAGE;
  if (isLanwenPankouPreset(mood, fire, glaze)) return LANWEN_PANKOU_IMAGE;
  if (isFlowingHuePreset(mood, fire, glaze)) return FLOWING_HUE_DISH_IMAGE;
  return null;
}

function hashSelections(m: MoodId, f: FireLevel, g: GlazeId): string {
  const s = `${m}-${f}-${g}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
}

function pickTitle(m: MoodId, g: GlazeId): string {
  const titles: Record<MoodId, Partial<Record<GlazeId, string>>> = {
    jing: {
      jade: "粉青隐韵长颈瓶",
      crackle: "静雪冰裂梅瓶",
      flow: "凝碧垂纹胆瓶",
    },
    wang: {
      jade: "暮色浸弦纹长颈瓶",
      crackle: "霞裂青瓷弦纹尊",
      flow: "暮霞流釉盘口壶",
    },
    huo: {
      jade: "雾霭粉青罐",
      crackle: "雾裂青瓷盏",
      flow: "雾痕垂釉筒瓶",
    },
    lie: {
      jade: "炽青釉弦纹炉",
      crackle: "烈火碎瓷纹罐",
      flow: "炽流盘口瓶",
    },
    lian: {
      jade: "暗翠收敛梅瓶",
      crackle: "藏纹玉壶春瓶",
      flow: "藏流玉壶春瓶",
    },
    liu: {
      jade: "涓青盘口瓶",
      crackle: "涓纹盘口瓶",
      flow: "涓流盘口瓶",
    },
  };
  return titles[m][g] ?? "龙泉青瓷数字器物";
}

function vesselFor(m: MoodId, f: FireLevel): string {
  const shapes = [
    "弦纹长颈瓶",
    "梅瓶",
    "胆瓶",
    "撇口瓶",
    "筒瓶",
    "炉式尊",
    "洗",
    "盏",
  ];
  const idx = (m.charCodeAt(0) + (f === "high" ? 3 : f === "mid" ? 1 : 0)) % shapes.length;
  return shapes[idx];
}

function keywordsFor(m: MoodId, f: FireLevel, g: GlazeId): { zh: string; en: string }[] {
  const base: { zh: string; en: string }[] = [];

  const moodKw: Record<MoodId, { zh: string; en: string }> = {
    jing: { zh: "静谧薄釉", en: "Quiet glaze" },
    wang: { zh: "暮色晕青", en: "Twilight celadon" },
    huo: { zh: "雾青含蓄", en: "Misty reserve" },
    lie: { zh: "炽色深沉", en: "Deep fire tone" },
    lian: { zh: "敛光如玉", en: "Restrained jade" },
    liu: { zh: "釉意流转", en: "Flowing glaze" },
  };

  const fireKw: Record<FireLevel, { zh: string; en: string }> = {
    low: { zh: "慢冷温润", en: "Slow cool" },
    mid: { zh: "梅子青倾向", en: "Plum-green bias" },
    high: { zh: "窑变偶然", en: "Kiln chance" },
  };

  const glazeKw: Record<GlazeId, { zh: string; en: string }> = {
    jade: { zh: "玉质感", en: "Jade body" },
    crackle: { zh: "碎瓷纹", en: "Crackle" },
    flow: { zh: "梨皮垂痕", en: "Pear-skin drip" },
  };

  base.push(moodKw[m], fireKw[f], glazeKw[g]);
  base.push({ zh: "龙泉意象", en: "Longquan aura" });
  return base.slice(0, 4);
}

export function generateArtwork(
  mood: MoodId,
  fire: FireLevel,
  glaze: GlazeId,
  fireTempC: number | null = null
): GeneratedArtwork {
  const serial = `LQ-${new Date().getFullYear()}-${hashSelections(mood, fire, glaze)}`;
  const title = pickTitle(mood, glaze);
  const vesselType = vesselFor(mood, fire);

  const attrFireStrength = fireStrengthDisplay(fire, fireTempC);
  const attrCoolingSpeed = COOLING_SPEED_BY_MOOD[mood];
  const attrFiringAtmosphere = FIRING_ATMOSPHERE_BY_GLAZE[glaze];
  const attrGlazeThickness = GLAZE_THICKNESS_MM[glaze][fire];

  const moodParam = MOOD_LABEL[mood];
  const fireParam = attrFireStrength;
  const glazeParam = `${GLAZE_LABEL[glaze]}｜釉厚 ${attrGlazeThickness}｜${attrFiringAtmosphere}`;

  const rationale = {
    mood:
      mood === "jing"
        ? "心境偏静，釉层散射更柔和，明暗过渡拉长，作品命名偏向含蓄与留白。"
        : mood === "wang"
          ? "暮色意象拉高冷暖对比，釉面高光更克制，命名引入天际与层次的隐喻。"
          : mood === "huo"
            ? "雾气般的迷惘感使中间调增多，纹理边界柔化，器物气质趋于内敛神秘。"
            : mood === "lie"
              ? "炽烈心境强化饱和趋势与局部反差，偶然肌理更易被视觉抓取。"
              : mood === "lian"
                ? "收敛的心境压低表面喧哗，釉色趋于均匀细腻，强调触感与静谧。"
                : "流动的心境鼓励釉料在重力与张力之间寻找弧线，命名更具动感与韵律。",

    fire:
      fire === "low"
        ? "微火延长了晶体生成窗口，铁离子发色偏浅，釉面更显温润通透。"
        : fire === "mid"
          ? "中火在深浅之间取得平衡，梅子青倾向更明显，层次丰富却不浮夸。"
          : "武火推高窑温峰值，釉层流动性增强，深色倾向与偶然肌理同步放大。",

    glaze:
      glaze === "jade"
        ? "温润如玉釉强调粉青质感与细腻触感，表面少纷争，适合呈现极简宋韵。"
        : glaze === "crackle"
          ? "冰裂纹釉依赖冷却阶段的应力释放，裂纹密度与火候共同决定视觉节奏。"
          : "流釉在高温阶段更容易形成垂痕与釉瀑，器型轮廓被动态纹理重新书写。",
  };

  if (isStillWaterMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "静澜梅瓶",
      serial: `LQ-${year}-01`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "梅子青", en: "Plum Green" },
        { zh: "玉润", en: "Jade-like" },
        { zh: "微火", en: "Low Fire" },
      ],
      rationale: {
        mood: "“静”的心境使作品整体趋向平稳、柔和与内敛，因此冷却过程采用自然降温，釉色过渡更加舒缓，形成如静水般澄明的安定感。",
        fire: "微火对应较低的火候强度，使胎釉反应更为温和，釉层光泽不过分强烈，保留了细腻、含蓄、柔润的表面质感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度控制在0.72mm，使釉色清雅均匀，呈现玉质般的莹润感。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，器形圆融沉稳，釉色清润柔和",
        "梅瓶短颈丰肩，线条含蓄内收，如静水微澜，呈现龙泉青瓷温润内敛的气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isStillSnowMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "静雪梅瓶",
      serial: `LQ-${year}-07`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品整体趋向平稳、柔和与内敛，因此冷却过程采用自然降温，使釉色过渡更舒缓，形成如静水般澄明的安定感。",
        fire: "微火对应较低的火候强度，使胎釉反应更为温和，釉面不过分强烈，保留了清浅、细腻、含蓄的表面质感。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使开片纹理较为细密、轻盈，如雪痕浮于青釉之中，最终形成「静雪梅瓶」的清冷气韵。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶短颈丰肩，器形沉稳而含蓄",
        "冰裂纹理在清润釉色中自然展开，如静水之上落雪成痕，呈现温和、澄明而略带清冷的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isStillFlowMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "静流梅瓶",
      serial: `LQ-${year}-08`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使器物整体保持克制与安定，因此冷却过程采用自然降温，使流动痕迹不显急促，而呈现平缓、连续的视觉节奏。",
        fire: "微火对应较低的火候强度，使釉料熔融程度相对温和，流釉效果被控制在较轻的范围内，形成细腻而不张扬的流动痕迹。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使釉色在器身表面产生轻微下行与沉积，最终生成「静流梅瓶」的含蓄动势。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶器形安定，釉色在器身表面缓缓流转",
        "流釉痕迹并不张扬，而是在青色中形成细微下行的层次，如静水深处暗流徐行，呈现静中含动的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChengxinMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "澄心梅瓶",
      serial: `LQ-${year}-09`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品整体趋向澄明、安定与柔和，因此冷却过程采用自然降温，使釉色在平缓变化中保持清润统一。",
        fire: "中火对应适中的火候强度，使胎釉反应较为稳定，青色比微火更饱满，器表明暗层次更清晰，但整体仍保持平和克制。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面呈现柔和、匀净、近似玉质的光泽，最终形成「澄心梅瓶」的清雅气质。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶轮廓圆融沉稳，釉色清润而明净",
        "中火使青色更趋饱满，温润如玉釉在器表形成柔和光泽，如心境澄明时的一泓青水，安静而通透",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChengLieMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "澄裂梅瓶",
      serial: `LQ-${year}-10`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使器物整体保持稳定、平和与清润，因此冷却过程采用自然降温，使冰裂纹理在宁静基调中自然浮现。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，为开片纹理的形成提供均衡基础，同时保留青瓷釉面的柔和光泽。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使裂纹细密而清晰，既不破坏整体澄净感，又增加了「澄裂梅瓶」的肌理层次。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶器形端正，釉色澄净而带有细密裂纹",
        "冰裂纹理在青釉中自然舒展，如澄澈水面下若隐若现的纹路，使器物在安静之中呈现细腻的时间层次",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isWaterTraceMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "水痕梅瓶",
      serial: `LQ-${year}-11`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品整体仍保持安定与克制，因此冷却过程采用自然降温，使流釉变化呈现平缓延展，而非强烈外放。",
        fire: "中火对应适中的火候强度，使釉层具有一定熔融与流动能力，能够形成可见的水痕状变化，同时保持器物整体的清雅气质。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使青色在器身表面产生自然下行与沉积，最终形成「水痕梅瓶」的柔和流动感。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶器身沉稳，釉色沿器壁形成柔和流痕",
        "青绿在器表缓慢下行，如水痕凝于瓷面，在平静基调中呈现出微妙的动势与层层晕染的釉色变化",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isShenlanMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "深澜梅瓶",
      serial: `LQ-${year}-12`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品即使在较强火候下仍保持平和收束，因此冷却过程采用自然降温，使高火带来的深色变化被稳定地沉淀下来。",
        fire: "武火对应较高的火候强度，使釉色明显加深，器身明暗关系更强，整体呈现更沉稳、凝练的青瓷质感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深色釉面不失柔和光泽，最终形成「深澜梅瓶」的沉静气质。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶器形稳重，釉色较前者更深",
        "武火使青色沉入更厚重的层次，温润釉面在深色中仍保留柔和光泽，如深水无声，呈现凝练而内敛的青瓷气度",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isJiwenMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "霁纹梅瓶",
      serial: `LQ-${year}-13`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品整体保持收束与秩序感，因此冷却过程采用自然降温，使开片纹理在沉静釉色中有序生成。",
        fire: "武火对应较高的火候强度，使青色更为深沉，釉面反光更集中，也让冰裂纹理与釉色之间形成更清晰的对比。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹更加分明而不凌乱，最终生成「霁纹梅瓶」的清冷层次。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶器形端凝，釉色深而清润",
        "冰裂纹理在武火烧成后的青釉中显得更为分明，如雨后初霁时水面映出的细纹，既有静气，也有高温淬炼后的清冷锋芒",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isLanyingMeipingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "澜影梅瓶",
      serial: `LQ-${year}-14`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "平静如水", en: "Still Water" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“静”的心境使作品即使具有明显流釉变化，也仍保留平和、收束的整体基调，因此冷却过程采用自然降温，使厚釉流动呈现稳定而深沉的状态。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，增强釉层流动性与色彩沉积，使器表形成更深的青绿色层次。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，使器物表面形成明显垂流与暗部沉积，最终生成「澜影梅瓶」的深水般窑变效果。",
      },
      introParagraphs: [
        "此器取「平静如水」之意，梅瓶轮廓沉稳，釉色在深青与翠色之间流动",
        "厚釉沿器壁缓缓垂落，形成如深水暗影般的层次变化，在宁静基调中显出更强的窑变张力与釉面生命感",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMuqingChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "暮青长颈瓶",
      serial: `LQ-${year}-02`,
      vesselType: "长颈瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“望”的心境强调等待、远望与将明未明的过渡感，因此冷却过程采用缓慢降温，使釉色在渐进变化中缓缓沉淀，形成柔和而清透的层次。",
        fire: "微火对应较低的火候强度，使胎釉反应较为温和，青色保持清浅，不产生过强的深色沉积，呈现暮色初透时的安静感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.72mm，使釉面轻薄、匀净而柔润，最终形成「暮青长颈瓶」的清雅光泽与含蓄青意。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈修直，器身线条清雅而向上",
        "微火使釉色保持浅淡，温润如玉釉在器表形成柔和光泽，如暮色未尽时隐约透出的青意，呈现安静、含蓄而带有期待感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMuwenChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "暮纹长颈瓶",
      serial: `LQ-${year}-15`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“望”的心境强调等待、远眺与将明未明的过渡感，因此冷却过程采用缓慢降温，使釉色在渐进变化中形成柔和、含蓄的层次。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，器表明暗变化较为克制，呈现暮色初透前的安静与轻盈。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使开片纹理细密而轻薄，如暮色中逐渐显现的微光裂痕，最终形成「暮纹长颈瓶」的清冷质感。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈上收，器身修直而含蓄",
        "冰裂纹理在浅青釉色中细密展开，如天光未明时云雾间隐约浮现的纹路，呈现清冷、含蓄而带有期待感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMuliuChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "暮流长颈瓶",
      serial: `LQ-${year}-16`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“望”的心境带有向远处延展的情绪，因此冷却过程采用缓慢降温，使釉色变化呈现逐步展开的状态，形成由暗向明的过渡感。",
        fire: "微火对应较低的火候强度，使釉料流动较为温和，流痕不强烈，更多表现为浅淡、柔缓的釉色下行。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使器表形成轻微垂流与柔和沉积，最终生成「暮流长颈瓶」的微光流动效果。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈挺拔，器身承接微弱流动的釉色",
        "浅青釉层沿器壁缓缓下行，如暮色中尚未散尽的雾气垂落于山间，含蓄而不张扬，呈现等待之中的流动感",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isShuqingChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "曙青长颈瓶",
      serial: `LQ-${year}-17`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“望”的心境强调从等待走向明亮的过程，因此冷却过程采用缓慢降温，使釉色在稳定变化中逐渐显出清润与通透。",
        fire: "中火对应适中的火候强度，使胎釉反应较为均衡，青色比微火更饱满，器身光泽更明确，呈现将明时刻的舒展感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面保持匀净、柔润和近似玉质的光泽，最终形成「曙青长颈瓶」的清朗气质。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈修雅，器身青色清润而渐趋明朗",
        "中火使釉色较微火更为饱满，温润釉面在光下显出柔和的青绿，如晨光将起时天色渐明，呈现清透、舒展的青瓷之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isShuliuChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "曙流长颈瓶",
      serial: `LQ-${year}-19`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“望”的心境强调向前、等待与逐渐明朗，因此冷却过程采用缓慢降温，使釉面变化不突兀，而呈现柔和延展的节奏。",
        fire: "中火对应适中的火候强度，使釉层具备一定流动能力，能够形成可见的釉色下行与明暗过渡，同时保持器形的清雅气质。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使青色在器壁上形成自然垂流与层次沉积，最终生成「曙流长颈瓶」的渐明流光感。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈上扬，器身釉色在青绿之间缓慢流动",
        "厚釉在中火作用下形成柔和下行的痕迹，如晨光穿过薄雾时留下的流动光带，使器物在含蓄中显出逐渐展开的生命感",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isShuwenChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "曙纹长颈瓶",
      serial: `LQ-${year}-18`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“望”的心境具有渐明、渐近的时间感，因此冷却过程采用缓慢降温，使器表纹理在平稳变化中逐步显现，形成细腻的层次。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，青色更加清润，也为冰裂纹理的生成提供较均衡的基础。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使裂纹清晰而不杂乱，如曙光中显出的细线，最终形成「曙纹长颈瓶」的清透开片效果。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈挺秀，器身釉色清润而带有细密纹理",
        "冰裂纹在中火烧成后的青釉中自然铺展，如晨曦照入雾气后显出的纹路，既有等待的静意，也有光线渐开的层次",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYuanqingChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "远青长颈瓶",
      serial: `LQ-${year}-20`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“望”的心境带有远眺与期待，因此冷却过程采用缓慢降温，使高火后的釉色沉淀得更稳定，形成深远而不躁动的视觉气质。",
        fire: "武火对应较高的火候强度，使青色明显加深，器身明暗关系增强，呈现更凝练、更沉稳的烧成效果。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深色釉面仍保持柔润、匀净和玉质光泽，最终形成「远青长颈瓶」的沉静明朗感。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈向上，器形带有远望般的修长感",
        "武火使青色沉入更深的层次，温润釉面仍保留柔和光泽，如远山在晨光前逐渐显形，呈现深远、沉静而明净的青瓷气度",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYuanwenChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "远纹长颈瓶",
      serial: `LQ-${year}-21`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“望”的心境使作品具有远眺与渐明的时间层次，因此冷却过程采用缓慢降温，使纹理在稳定变化中逐渐清晰，形成由隐到显的视觉过程。",
        fire: "武火对应较高的火候强度，使青色更深，釉面明暗对比更强，也让冰裂纹理与釉色之间形成更明显的层次关系。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹较为清晰、深浅有别，最终生成「远纹长颈瓶」的深青开片效果。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈修直，器身青色深而带有清晰纹理",
        "武火使釉色更显沉稳，冰裂纹在深青釉面中层层浮现，如远山轮廓在晨雾中逐渐清晰，呈现含蓄而有张力的开片之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYuanliuChangjingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "远流长颈瓶",
      serial: `LQ-${year}-22`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "暮色将明", en: "Twilight Prospect" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“望”的心境强调远方、等待与逐渐展开，因此冷却过程采用缓慢降温，使厚釉流动在稳定过程中沉淀，形成由暗向明、由近向远的视觉层次。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，增强釉色沉积与流动能力，使器表形成更深的青绿色带和更明显的流动轨迹。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，使釉层产生明显垂流、晕染与深色沉积，最终生成「远流长颈瓶」的深远流光感。",
      },
      introParagraphs: [
        "此器取「暮色将明」之意，长颈挺拔，器身承接深青釉色的自然流动",
        "厚釉在武火中充分熔融，青绿沿器壁沉降而下，如远处天光将明时云气流转，呈现深沉、延展而富有方向感的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isWuqingDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "雾青胆瓶",
      serial: `LQ-${year}-03`,
      vesselType: "胆瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境带有不确定、寻找与雾中辨色的感受，因此冷却过程采用间歇降温，使釉色在停顿与变化之间形成若隐若现的层次。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，器表反应较为温和，整体更接近雾气包裹下的淡青质感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.72mm，使釉面呈现轻薄、柔润而含蓄的玉质光泽，最终形成「雾青胆瓶」的朦胧青意与幽微质感。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶小口长颈，器腹圆润而收束",
        "浅青釉色在器身表面若隐若现，温润如玉釉带出柔和而朦胧的光感，如雾气深处浮现的一抹青色，呈现幽微、含蓄而带有探索感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMistyVeinDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "雾纹胆瓶",
      serial: `LQ-${year}-23`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境带有不确定、寻找与雾中辨色的感受，因此冷却过程采用间歇降温，使釉色在停顿与变化之间形成朦胧层次，呈现若隐若现的视觉效果。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，器表反应较为温和，弱化强烈明暗，使整体更接近雾气包裹下的淡青质感。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使裂纹轻薄而细密，如雾中逐渐显现的纹路，最终形成「雾纹胆瓶」的幽微开片效果。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶小口长颈，器腹圆润而内收",
        "浅青釉色在雾感中若隐若现，细密冰裂纹如雾中水痕缓缓浮出，呈现朦胧、幽微而带有探索感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMistyFlowDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "雾流胆瓶",
      serial: `LQ-${year}-24`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境强调雾中寻找与方向未明，因此冷却过程采用间歇降温，使釉面变化具有停顿、迟疑与渐显的节奏，形成朦胧流动感。",
        fire: "微火对应较低的火候强度，使釉料流动较为温和，流痕不至于过度外放，而是在浅青釉色中形成细微下行的层次。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使釉色在器腹表面产生轻柔垂流与灰青沉积，最终生成「雾流胆瓶」的迷离流釉效果。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶器形含蓄，釉色沿圆腹轻微流动",
        "浅青与灰青在器身表面交叠，流釉痕迹似雾气凝结后缓缓下行，使器物呈现迷离而不张扬的窑变状态",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isXunqingDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "寻青胆瓶",
      serial: `LQ-${year}-25`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境并非完全混沌，而是在不确定中寻找清晰，因此冷却过程采用间歇降温，使釉色在遮蔽与显现之间形成微妙过渡。",
        fire: "中火对应适中的火候强度，使青色较微火更为饱满，器表光泽更明确，在雾感基调中透出较清晰的青瓷色泽。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面保持柔和、匀净与玉质般的光泽，最终形成「寻青胆瓶」的澄明感。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶长颈圆腹，器形静中有张力",
        "中火使青色逐渐显出清润层次，温润如玉釉在雾感中透出柔光，如在迷雾深处寻得一抹青意，含蓄而明净",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMiliuDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "迷流胆瓶",
      serial: `LQ-${year}-27`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境强调方向未定与雾中辨认，因此冷却过程采用间歇降温，使流釉痕迹呈现连续与断续并存的状态，增强迷离感。",
        fire: "中火对应适中的火候强度，使釉层具备一定熔融与流动能力，能够形成可见的釉色下行，同时保持整体不失清雅。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使青绿釉色在器身表面产生层层沉积与柔和流痕，最终形成「迷流胆瓶」的雾中流动感。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶器身承接青绿釉色的缓慢流转",
        "流釉在器腹表面形成若断若续的下行痕迹，如雾中水气凝结又散开，呈现迷离、层叠而富有变化的窑变效果",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYinwenDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "隐纹胆瓶",
      serial: `LQ-${year}-26`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境使作品带有遮蔽、犹疑与逐步显现的特征，因此冷却过程采用间歇降温，使裂纹和釉色层次不一次性展开，而是在表面形成隐约变化。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，既能保留青瓷的清润光泽，也能让开片纹理具备一定清晰度。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使纹理在釉面中呈现隐约、细密而有秩序的状态，最终生成「隐纹胆瓶」的雾感开片效果。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶轮廓圆融，釉面纹理藏于青色之下",
        "冰裂纹在中火烧成后的釉层中若隐若现，如雾气遮掩下逐渐浮现的路径，使器物带有含蓄、幽深的纹理层次",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYouqingDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "幽青胆瓶",
      serial: `LQ-${year}-28`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境使作品具有幽深、遮蔽与寻找的感受，因此冷却过程采用间歇降温，使釉色在暗部中形成若隐若现的变化。",
        fire: "武火对应较高的火候强度，使青色明显加深，器身明暗关系增强，整体呈现更沉稳、更神秘的青瓷气质。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深青釉面仍保留柔和玉质光泽，最终形成「幽青胆瓶」的深雾质感。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶器形凝练，釉色深而内敛",
        "武火使青色沉入更幽深的层次，温润釉面在暗部中透出微光，如雾色深处隐约可见的青影，呈现沉静而神秘的气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYoulieDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "幽裂胆瓶",
      serial: `LQ-${year}-29`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境使作品强调隐现与不确定，因此冷却过程采用间歇降温，使开片纹理在不同阶段逐步生成，形成层层显现的视觉效果。",
        fire: "武火对应较高的火候强度，使釉色更为深沉，增强裂纹与釉色之间的明暗对比，使器物具有更强的视觉张力。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹更清晰、更有深度，最终生成「幽裂胆瓶」的深青开片效果。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶形制端凝，深青釉面中裂纹层层浮现",
        "冰裂纹在武火之后更加清晰，却仍被幽暗釉色包裹，如雾中隐现的碎光，呈现冷静、深沉而略带神秘感的开片效果",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isXuanliuDanpingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "玄流胆瓶",
      serial: `LQ-${year}-30`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "间歇降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "雾中寻青", en: "Seeking Celadon in Mist" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“惑”的心境强调雾中探寻与暗处流动，因此冷却过程采用间歇降温，使厚釉在不同阶段形成层层沉积，增强迷离和不确定的视觉感受。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，增强釉层流动性与深色沉积，使器身出现更明显的青绿垂流和暗部层次。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，使釉色产生明显垂坠、晕染与深浅交错的变化，最终形成「玄流胆瓶」的幽深流釉效果。",
      },
      introParagraphs: [
        "此器取「雾中寻青」之意，胆瓶长颈沉静，器腹承接深青釉色的流动",
        "厚釉在武火中充分熔融，青绿与暗翠沿器身缓缓垂落，如雾中暗流穿行，呈现幽深、迷离而富有窑变张力的视觉效果",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isWeiyanPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "微焰盘口瓶",
      serial: `LQ-${year}-04`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调火光、热度与瞬间生成，因此冷却过程采用快速降温，使釉色在火候变化较强的阶段被迅速定格，形成更明确的视觉状态。",
        fire: "微火对应较低的火候强度，使釉色仍保持清浅，不产生过度深沉的色彩变化，而是在轻微火候作用下呈现明亮、清润的青瓷面貌。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.72mm，使釉面保持轻薄、柔润和玉质般的光泽，最终形成「微焰盘口瓶」的清亮釉色与克制火光感。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，盘口微张，器身承接火候初起时的温度变化",
        "微火使青色保持清亮，温润如玉釉在火光映照下呈现柔和反光，如微焰照亮青瓷表面，呈现明净、轻盈而带有火候感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isFlameVeinDishmouthPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "焰纹盘口瓶",
      serial: `LQ-${year}-31`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调火光、强度与瞬间爆发，因此冷却过程采用快速降温，使釉色在较短时间内定型，形成更直接、更有张力的表面状态。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，火焰感不表现为深色沉积，而更多体现为轻微的明暗变化与细腻纹理。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使裂纹细密而轻薄，如火光之后留下的微细纹路，最终形成「焰纹盘口瓶」的清亮开片效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，盘口微张，器身承接火焰余温后的纹理变化",
        "微火使釉色保持清浅，冰裂纹在釉面中细密展开，如火光退去后残留的微痕，呈现克制、明亮而带有灼痕感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isWeiyanLiupingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "微焰流瓶",
      serial: `LQ-${year}-32`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境使作品具有更明显的火焰指向，因此冷却过程采用快速降温，使流釉痕迹在较短时间内被固定，形成瞬间凝结的动态感。",
        fire: "微火对应较低的火候强度，使釉料流动较为轻微，避免形成过度垂流，整体仍保持清浅、细腻和克制的表面状态。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使釉色产生柔和下行与轻微沉积，最终生成「微焰流瓶」的含蓄流釉效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，器形上收下稳，釉色在浅青之间轻微流动",
        "微火使整体色泽仍然清淡，流釉痕迹沿器壁缓缓下行，如火光初起时被釉面捕捉的微弱流动，呈现轻盈而含蓄的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isMingyanYupingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "明焰玉瓶",
      serial: `LQ-${year}-33`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调明亮、热度与能量，因此冷却过程采用快速降温，使青釉在火光感最强的阶段被定格，呈现更鲜明的视觉状态。",
        fire: "中火对应适中的火候强度，使胎釉反应较为稳定，青色比微火更饱满，器表光泽更明确，形成火光照映后的清亮感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面保持柔润、匀净和玉质光泽，最终形成「明焰玉瓶」的明净质感。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，器形挺拔，釉色清润而带有火光照映后的明亮感",
        "中火使青色更加饱满，温润如玉釉在器表形成柔和反光，如火焰映照下的青玉，呈现明净、温热而不张扬的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChiguangLiepingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "赤光裂瓶",
      serial: `LQ-${year}-34`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境使作品具有更强的视觉张力，因此冷却过程采用快速降温，使纹理在较短时间内形成清晰的边界感，增强开片的节奏。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，既能保留青瓷的清润光泽，也能让冰裂纹理更加明确。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使裂纹清晰而有层次，如火光照亮的细密裂痕，最终生成「赤光裂瓶」的纹理效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，器身沉稳，釉面裂纹在青色中清晰浮现",
        "中火使釉层成熟而不失清润，冰裂纹如火光映照后的细线，在器表交错展开，呈现火候作用下的节奏感与纹理张力",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYanliuDishmouthPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "焰流盘口瓶",
      serial: `LQ-${year}-35`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调火势正盛时的流动与爆发，因此冷却过程采用快速降温，使釉色流动在较强动态中被固定，形成凝固的火焰感。",
        fire: "中火对应适中的火候强度，使釉料具备一定流动能力，能够形成明显但仍受控制的釉色下行与明暗变化。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使器表出现较清晰的流动痕迹与青绿色沉积，最终形成「焰流盘口瓶」的动态窑变效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，盘口开张，器身承接青绿釉色的流动变化",
        "中火使釉层形成稳定熔融，流釉沿器壁自然下行，如火光牵引出的青色流痕，呈现热度、动势与青瓷釉面的生成张力",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChiqingYupingPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "炽青玉瓶",
      serial: `LQ-${year}-36`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境使作品具有强烈的火候感与能量感，因此冷却过程采用快速降温，使高火烧成后的色泽被迅速定格，呈现更强的凝练感。",
        fire: "武火对应较高的火候强度，使青色明显加深，器身明暗关系增强，整体更具厚重感与火候淬炼后的力量。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深青釉面仍保留柔润、匀净和玉质光泽，最终形成「炽青玉瓶」的深亮质感。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，器形凝练，釉色在武火作用下显得更深更亮",
        "温润如玉釉保留柔和光泽，深青之中透出火候淬炼后的明度，如炽热火光照入青玉内部，呈现沉稳而有力量的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChilieDishmouthPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "炽裂盘口瓶",
      serial: `LQ-${year}-37`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调火光最盛时的力量与张力，因此冷却过程采用快速降温，使开片纹理更具清晰边界，形成更强的视觉冲击。",
        fire: "武火对应较高的火候强度，使青色更加深沉，釉面反光更集中，也使裂纹与底色之间的对比更为明显。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹清晰、分明且具有冷峻感，最终生成「炽裂盘口瓶」的高火开片效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，盘口舒展，器身釉色深沉，裂纹清晰有力",
        "武火使青色更显厚重，冰裂纹在深青釉面上形成鲜明层次，如火光急冷后留下的裂痕，呈现强烈、冷峻而富有张力的开片之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isBlazingFlowPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "炽流盘口瓶",
      serial: `LQ-${year}-38`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "快速降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "火光正盛", en: "Flame in Full Light" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“烈”的心境强调火光、速度与强烈生成感，因此冷却过程采用快速降温，使厚釉流动在高温状态下迅速凝固，形成强烈的动态定格效果。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，增强釉层流动性与深色沉积，使器表出现更明显的垂流轨迹和高火生成痕迹。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，使釉色产生明显垂坠、晕染与深浅交错的变化，最终形成「炽流盘口瓶」的高火流釉效果。",
      },
      introParagraphs: [
        "此器取「火光正盛」之意，盘口开阔，器身承接高火下强烈流动的釉色",
        "厚釉在武火中充分熔融，青绿与深翠沿器壁垂落，如火势牵引出的流动轨迹，呈现炽热、深沉而富有冲击力的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isCangwenYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "藏纹玉壶春瓶",
      serial: `LQ-${year}-39`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境强调收束、内藏与含蓄，因此冷却过程采用保温降温，使釉色在较稳定的温度变化中缓慢沉淀，形成内敛而不外放的视觉气质。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，纹理变化较为轻柔，整体呈现安静、克制的表面状态。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使裂纹细密而不张扬，如藏于青釉深处的细线，最终形成「藏纹玉壶春瓶」的含蓄开片效果。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶颈部修长，腹部圆润而内敛",
        "浅青釉色覆于器身，冰裂纹理细密隐现，如锋芒收束后留下的暗纹，呈现含蓄、克制而富有余韵的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isRestrainedGuanerPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "藏韵贯耳瓶",
      serial: `LQ-${year}-05`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained" },
        { zh: "玉润", en: "Jade-like" },
        { zh: "微火", en: "Low Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境强调收束、含蓄与内在韵味，因此冷却过程采用长时缓冷，使釉色沉淀得更稳定，整体气质趋于端正、克制与安静。",
        fire: "微火对应较低的火候强度，使胎釉反应相对温和，避免过强的流动感与突变感，形成细腻、稳定、均匀的釉面状态。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度控制在0.72mm，使器物呈现青灰、莹润、柔和的光泽，更突出龙泉青瓷的含蓄气质。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，贯耳对称而立，器形端正克制",
        "釉色青灰内敛，光泽温润柔和，不以强烈变化取胜，而以含蓄线条与静穆气息见长",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isZangliuYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "藏流玉壶春瓶",
      serial: `LQ-${year}-40`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境使作品的变化趋向内收，因此冷却过程采用保温降温，使釉色流动被缓慢控制，形成含蓄而持续的下行痕迹。",
        fire: "微火对应较低的火候强度，使釉料流动较为温和，避免形成强烈垂坠，更多表现为轻微的釉色沉积与细腻的流动感。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使釉色在器身表面产生柔和下行与浅层晕染，最终生成「藏流玉壶春瓶」的内敛流釉效果。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶器形柔和，釉色在器壁间缓慢下行",
        "流釉并不剧烈，而是在浅青之中形成若有若无的垂痕，如情绪收敛后的余波，呈现静中含动、藏而不露的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isHanqingYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "含青玉壶春瓶",
      serial: `LQ-${year}-41`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境强调收束后的平衡与沉静，因此冷却过程采用保温降温，使釉色在稳定状态中缓慢凝定，呈现内含而不张扬的光泽。",
        fire: "中火对应适中的火候强度，使胎釉反应较为均衡，青色比微火更饱满，器表明暗层次更加稳定。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面呈现柔润、匀净和玉质般的光泽，最终形成「含青玉壶春瓶」的温润内敛感。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶线条圆融，釉色温润而内含光泽",
        "中火使青色更趋稳定，温润如玉釉在器表形成柔和光感，如锋芒收起后的清润之气，呈现沉静、含蓄而不失明净的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isHanlieYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "含裂玉壶春瓶",
      serial: `LQ-${year}-42`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境使作品整体趋向收束和克制，因此冷却过程采用保温降温，使裂纹在较平稳的变化中生成，避免过度破碎和外放。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，既能保持青瓷釉面的清润，也能让开片纹理具有适度清晰度。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使纹理细密而有秩序，最终生成「含裂玉壶春瓶」的隐约开片层次。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶器形端雅，釉面纹理藏于青色之中",
        "冰裂纹在中火烧成后的釉层里细密铺展，既有开片的清晰度，又保持整体的收敛气息，如暗藏于器表之下的时间痕迹",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isHanliuYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "含流玉壶春瓶",
      serial: `LQ-${year}-43`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境使流动不表现为外放的冲击，而是转化为内部层次，因此冷却过程采用保温降温，使釉色在缓慢沉淀中形成含蓄动势。",
        fire: "中火对应适中的火候强度，使釉层具备一定熔融和流动能力，能够形成可见的下行痕迹，同时保持整体温和稳定。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使青绿釉色在器身表面产生层层沉积与柔和流痕，最终形成「含流玉壶春瓶」的内敛流动感。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶圆腹承釉，流动痕迹收于器身之内",
        "青绿釉色沿器壁缓慢下行，形成沉静而有层次的流痕，如藏于深处的韵律，呈现含蓄、温和而富有生成感的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChenqingYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "沉青玉壶春瓶",
      serial: `LQ-${year}-44`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境强调强度之后的收束，因此冷却过程采用保温降温，使高火带来的深色变化被稳定沉淀，形成厚重而内敛的视觉气质。",
        fire: "武火对应较高的火候强度，使青色明显加深，器身明暗关系更强，整体呈现更沉稳、更凝练的烧成效果。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深青釉面仍保持柔润、匀净和玉质光泽，最终形成「沉青玉壶春瓶」的凝练感。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶器形稳重，釉色在武火作用下更显深沉",
        "温润如玉釉在深青之中保留柔和光泽，如锋芒尽收后的沉静余韵，呈现含蓄、厚重而内在明亮的青瓷气度",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChenlieYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "沉裂玉壶春瓶",
      serial: `LQ-${year}-45`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境使作品具有强度内收后的沉静感，因此冷却过程采用保温降温，使开片纹理在稳定状态中逐渐形成，呈现有秩序的收束感。",
        fire: "武火对应较高的火候强度，使釉色更为深沉，增强裂纹与底色之间的层次关系，使器物整体更具厚度。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹更加清晰而不凌乱，最终生成「沉裂玉壶春瓶」的深青开片效果。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶器身沉稳，深青釉面中裂纹清晰而内敛",
        "武火使釉色更显厚重，冰裂纹在暗青之中层层浮现，如锋芒藏入器表后的细密痕迹，呈现深沉、冷静而富有张力的开片效果",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isChenliuYuhuchunPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "沉流玉壶春瓶",
      serial: `LQ-${year}-46`,
      vesselType: "玉壶春瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "保温降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "收锋藏韵", en: "Restrained Resonance" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“敛”的心境使强烈变化转向内部沉积，因此冷却过程采用保温降温，使厚釉流动在缓慢过程中被收束，形成深沉而不外散的动态感。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，增强釉层流动性与深色沉积，使器表形成更明显的青绿色层次和垂流痕迹。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，使釉色产生明显垂坠、晕染与深浅交错的变化，最终形成「沉流玉壶春瓶」的内敛流釉效果。",
      },
      introParagraphs: [
        "此器取「收锋藏韵」之意，玉壶春瓶器身圆融，厚釉在深青之中缓慢流转",
        "武火使釉料充分熔融，青绿与暗翠沿器壁沉降而下，如被收束的力量凝于器表，呈现深沉、内敛而富有生命感的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isJuanqingPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "涓青盘口瓶",
      serial: `LQ-${year}-47`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调连续、变化与动态生成，因此冷却过程采用分段降温，使釉色在不同阶段逐渐形成层次，呈现轻柔、缓慢的流动感。",
        fire: "微火对应较低的火候强度，使釉色保持清浅，器表变化较为细腻，整体呈现温和、克制的青瓷质感。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.72mm，使釉面保持轻薄、柔润和玉质般的光泽，最终形成「涓青盘口瓶」的清浅流光感。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口微张，器身承接轻柔而缓慢的青色变化",
        "浅青釉色在器表温和铺展，如细流初生，柔润而不外放，呈现清浅、安静而带有流动感的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isJuanwenPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "涓纹盘口瓶",
      serial: `LQ-${year}-48`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调釉色在时间中的连续变化，因此冷却过程采用分段降温，使纹理在不同温度阶段逐渐显现，形成自然的层次感。",
        fire: "微火对应较低的火候强度，使釉色保持浅淡，裂纹与釉色之间的对比不强，整体呈现柔和、细密的表面状态。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.80mm，使开片纹理轻薄而自然，最终形成「涓纹盘口瓶」的细流纹理效果。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口舒展，器身表面浮现细密纹理",
        "冰裂纹在浅青釉中轻轻展开，如水流凝止后留下的细线，既有流动之后的痕迹，也保留了微火生成的清淡与含蓄",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isJuanliuPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "涓流盘口瓶",
      serial: `LQ-${year}-49`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "微火", en: "Low Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调连续下行与渐变生成，因此冷却过程采用分段降温，使釉色在不同阶段形成轻重有别的流动层次。",
        fire: "微火对应较低的火候强度，使釉料流动较为轻微，流痕不强烈，更多表现为浅青釉面中的细微垂落与柔和过渡。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为0.95mm，使器表形成轻柔的垂流痕迹，最终生成「涓流盘口瓶」的清浅流釉效果。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口开张，浅青釉色沿器壁缓缓下行",
        "微火使流釉痕迹较为轻柔，釉层如细水贴着器身慢慢垂落，呈现含蓄、温和而富有动态的青瓷之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYangqingPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "漾青盘口瓶",
      serial: `LQ-${year}-50`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“流”的心境使釉色变化具有连续的节奏，因此冷却过程采用分段降温，使青色在不同阶段逐渐沉淀，形成柔和的明暗层次。",
        fire: "中火对应适中的火候强度，使釉色比微火更饱满，器表光泽更明确，呈现更稳定、更清润的青瓷效果。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.78mm，使釉面保持匀净、柔润和玉质般的光泽，最终形成「漾青盘口瓶」的温润波光感。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口端雅，器身青色清润而有层次",
        "中火使釉色更为饱满，温润如玉釉在光线下显出柔和波动，如水面微漾，呈现清透、稳定而富有韵律的青瓷气质",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYangwenPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "漾纹盘口瓶",
      serial: `LQ-${year}-51`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调层次递进与动态生成，因此冷却过程采用分段降温，使开片纹理在不同阶段逐渐清晰，形成有节奏的表面变化。",
        fire: "中火对应适中的火候强度，使釉层成熟度较为稳定，青色清润而有厚度，也让裂纹能够形成较清晰的视觉层次。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.85mm，使裂纹细密而自然，最终生成「漾纹盘口瓶」的水纹开片效果。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口开阔，器身纹理在青色中层层铺展",
        "冰裂纹随釉色变化自然显现，如水面微波凝成细线，既有开片的秩序感，也有流转过程中的轻微波动",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isYangliuPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "漾流盘口瓶",
      serial: `LQ-${year}-52`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "中火", en: "Moderate Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调连续变化与动态延展，因此冷却过程采用分段降温，使釉层在不同阶段形成下行、停顿与沉积的变化。",
        fire: "中火对应适中的火候强度，使釉料具备较稳定的流动能力，能够形成可见的釉色下行与柔和的明暗过渡。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度为1.08mm，使青绿釉色在器壁上形成层层沉积与自然垂流，最终生成「漾流盘口瓶」的流动质感。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口舒展，器身承接青绿釉色的自然下行",
        "中火使釉层产生稳定流动，青色在器壁间形成深浅交错的垂痕，如水波被火候定格，呈现柔和而清晰的流釉之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isLanqingPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "澜青盘口瓶",
      serial: `LQ-${year}-53`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "温润如玉", en: "Jade-like Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "温和还原", en: "Gentle Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调变化中的沉淀与延展，因此冷却过程采用分段降温，使高火后的深青色在不同阶段稳定下来，形成深浅递进的层次。",
        fire: "武火对应较高的火候强度，使青色明显加深，器身明暗关系更强，呈现更沉稳、更饱满的烧成效果。",
        glaze:
          "温润如玉釉对应温和还原的烧成气氛，釉层厚度为0.82mm，使深青釉面仍保持柔润、匀净和玉质光泽，最终形成「澜青盘口瓶」的深水青色感。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口沉稳，器身青色在武火作用下更显深厚",
        "温润如玉釉在深青之中保留柔和光泽，如深水微澜，内敛而有力量，呈现沉静、饱满而富有深度的青瓷气度",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isLanwenPankouPreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "澜纹盘口瓶",
      serial: `LQ-${year}-54`,
      vesselType: "盘口瓶",
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed: "分段降温",
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "冰裂纹釉", en: "Crackle Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "缓冷还原", en: "Slow Reduction" },
      ],
      rationale: {
        mood: "“流”的心境使作品具有连续变化后的沉积感，因此冷却过程采用分段降温，使开片纹理在不同温度阶段逐渐形成，呈现层层推进的视觉效果。",
        fire: "武火对应较高的火候强度，使釉色更加深沉，增强裂纹与青釉底色之间的层次关系，使器物整体更具厚度与深度。",
        glaze:
          "冰裂纹釉对应缓冷还原的烧成气氛，釉层厚度为0.90mm，使裂纹清晰而有秩序，最终生成「澜纹盘口瓶」的深青开片效果。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口开张，深青釉面中纹理清晰浮现",
        "武火使釉色更为沉厚，冰裂纹在深青之中层层交错，如深水暗流留下的细密痕迹，呈现沉静、冷润而富有层次的开片效果",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  if (isFlowingHuePreset(mood, fire, glaze)) {
    const year = new Date().getFullYear();
    return {
      title: "流青盘口瓶",
      serial: `LQ-${year}-06`,
      vesselType,
      moodParam,
      fireParam,
      glazeParam,
      attrFireStrength,
      attrCoolingSpeed,
      attrFiringAtmosphere,
      attrGlazeThickness,
      keywords: [
        { zh: "釉色流转", en: "Flowing Hue" },
        { zh: "流釉", en: "Flowing Glaze" },
        { zh: "武火", en: "High Fire" },
        { zh: "强还原", en: "Strong Reduction" },
      ],
      rationale: {
        mood: "“流”的心境强调连续、变化与动态生成，因此冷却过程采用分段降温，使釉色在不同阶段形成层次变化，呈现流动、延展与晕染感。",
        fire: "武火对应较高的火候强度，使釉料充分熔融，提高釉层流动性，使器物表面出现更清晰的流动轨迹和深浅交错的青绿色带。",
        glaze:
          "流釉对应强还原的烧成气氛，釉层厚度达到1.20mm，形成较强的垂坠纹理与沉静深色，使釉面既有高温生成的偶然性，也有青瓷釉色流转的生命感。",
      },
      introParagraphs: [
        "此器取「釉色流转」之意，盘口开张，器身承接流动的釉色变化",
        "釉层沿器壁自然下行，青绿与深翠交叠，如水痕凝固于火候之后，呈现动态生成的窑变之美",
      ] as const,
      vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze)!,
    };
  }

  return {
    title,
    serial,
    vesselType,
    moodParam,
    fireParam,
    glazeParam,
    attrFireStrength,
    attrCoolingSpeed,
    attrFiringAtmosphere,
    attrGlazeThickness,
    keywords: keywordsFor(mood, fire, glaze),
    rationale,
    introParagraphs: DEFAULT_INTRO,
    vaseImageSrc: resolveVaseImageSrc(mood, fire, glaze),
  };
}
