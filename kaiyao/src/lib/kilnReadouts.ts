import type { FireLevel, GlazeId, MoodId } from "../types";
import { fireToTemp } from "./fireTemperature";

/** 心境 → 入窑页「时间」展示（窑时） */
const MOOD_KILN_HOURS: Record<MoodId, string> = {
  jing: "60H",
  wang: "48H",
  huo: "54H",
  lie: "36H",
  lian: "72H",
  liu: "42H",
};

/** 釉面 → 入窑页「烧成气氛」 */
const GLAZE_ATMOSPHERE: Record<GlazeId, string> = {
  jade: "温和还原",
  crackle: "缓冷还原",
  flow: "强还原",
};

export function kilnTemperatureLabel(fire: FireLevel, fireTempC: number | null): string {
  const t = fireTempC ?? fireToTemp(fire);
  return `${t}°C`;
}

export function kilnDurationLabel(mood: MoodId): string {
  return MOOD_KILN_HOURS[mood];
}

export function kilnAtmosphereLabel(glaze: GlazeId): string {
  return GLAZE_ATMOSPHERE[glaze];
}
