import type { FireLevel } from "../types";

/** 与控火页档位默认落点一致（`StepFire` 中 `TEMP_SNAP`） */
export function fireToTemp(f: FireLevel): number {
  return f === "low" ? 150 : f === "mid" ? 600 : 1050;
}
