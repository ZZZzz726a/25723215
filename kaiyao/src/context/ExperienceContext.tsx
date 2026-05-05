import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExperienceSelections, FireLevel, GlazeId, MoodId, Screen } from "../types";

/**
 * 开发时 `true`：在 `npm run dev` 下打开站点会直达成器页，无需逐步点击。
 * 生产构建（`vite build`）始终从首页起，不受此项影响。
 * 成片与预设已齐，日常开发请保持 `false`，与正式体验一致。
 */
const DEV_START_AT_RESULT = false;

const STEP_ORDER: Screen[] = [
  "home",
  "mechanism",
  "mood",
  "fire",
  "glaze",
  "kiln",
  "reveal",
  "result",
];

interface ExperienceContextValue {
  screen: Screen;
  selections: ExperienceSelections;
  setMood: (m: MoodId) => void;
  setFire: (f: FireLevel) => void;
  setFireTempC: (c: number) => void;
  setGlaze: (g: GlazeId) => void;
  goNext: () => void;
  goBack: () => void;
  goHome: () => void;
  stepperIndex: number;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function screenToStepper(screen: Screen): number {
  switch (screen) {
    case "home":
    case "mechanism":
      return 0;
    case "mood":
      return 1;
    case "fire":
      return 2;
    case "glaze":
      return 3;
    case "kiln":
      return 4;
    case "reveal":
      return 5;
    case "result":
      return 6;
    default:
      return 0;
  }
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>(() =>
    import.meta.env.DEV && DEV_START_AT_RESULT ? "result" : "home"
  );
  const [selections, setSelections] = useState<ExperienceSelections>({
    mood: null,
    fire: null,
    fireTempC: null,
    glaze: null,
  });

  const goNext = useCallback(() => {
    setScreen((s) => {
      const i = STEP_ORDER.indexOf(s);
      return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
    });
  }, []);

  const goBack = useCallback(() => {
    setScreen((s) => {
      const i = STEP_ORDER.indexOf(s);
      return STEP_ORDER[Math.max(i - 1, 0)];
    });
  }, []);

  const goHome = useCallback(() => {
    setScreen("home");
    setSelections({ mood: null, fire: null, fireTempC: null, glaze: null });
  }, []);

  const setMood = useCallback((m: MoodId) => {
    setSelections((prev) => ({ ...prev, mood: m }));
  }, []);

  const setFire = useCallback((f: FireLevel) => {
    setSelections((prev) => ({ ...prev, fire: f }));
  }, []);

  const setFireTempC = useCallback((c: number) => {
    setSelections((prev) => ({ ...prev, fireTempC: c }));
  }, []);

  const setGlaze = useCallback((g: GlazeId) => {
    setSelections((prev) => ({ ...prev, glaze: g }));
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      screen,
      selections,
      setMood,
      setFire,
      setFireTempC,
      setGlaze,
      goNext,
      goBack,
      goHome,
      stepperIndex: screenToStepper(screen),
    }),
    [screen, selections, setMood, setFire, setFireTempC, setGlaze, goNext, goBack, goHome]
  );

  return (
    <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within ExperienceProvider");
  return ctx;
}
