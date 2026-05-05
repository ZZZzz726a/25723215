export type MoodId = "jing" | "wang" | "huo" | "lie" | "lian" | "liu";

export type FireLevel = "low" | "mid" | "high";

export type GlazeId = "jade" | "crackle" | "flow";

export type Screen =
  | "home"
  | "mechanism"
  | "mood"
  | "fire"
  | "glaze"
  | "kiln"
  | "reveal"
  | "result";

export interface MoodOption {
  id: MoodId;
  labelZh: string;
  labelEn: string;
}

export interface ExperienceSelections {
  mood: MoodId | null;
  fire: FireLevel | null;
  /** 控火页最终摄氏度（5°C 步进），与 `fire` 档位可独立记忆滑杆细调 */
  fireTempC: number | null;
  glaze: GlazeId | null;
}
