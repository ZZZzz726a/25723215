import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect } from "react";
import { Header } from "./components/Header";
import { StepFire } from "./components/steps/StepFire";
import { StepGlaze } from "./components/steps/StepGlaze";
import { StepHome } from "./components/steps/StepHome";
import { StepKiln } from "./components/steps/StepKiln";
import { StepMechanism } from "./components/steps/StepMechanism";
import { StepMood } from "./components/steps/StepMood";
import { StepResult } from "./components/steps/StepResult";
import { StepReveal } from "./components/steps/StepReveal";
import { ExperienceProvider, useExperience } from "./context/ExperienceContext";

function ExperienceShell() {
  const { screen } = useExperience();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [screen]);

  return (
    <div
      className={`flex min-h-[100dvh] w-full min-w-0 flex-1 flex-col ${screen === "home" || screen === "mechanism" || screen === "mood" || screen === "fire" || screen === "glaze" || screen === "kiln" || screen === "reveal" || screen === "result" ? "bg-[rgb(18,20,20)]" : "bg-kiln-bg bg-radial-spot"}`}
    >
      <Header screen={screen} />
      <AnimatePresence mode="wait">
        <motion.main
          key={screen}
          role="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
        >
          {screen === "home" && <StepHome />}
          {screen === "mechanism" && <StepMechanism />}
          {screen === "mood" && <StepMood />}
          {screen === "fire" && <StepFire />}
          {screen === "glaze" && <StepGlaze />}
          {screen === "kiln" && <StepKiln />}
          {screen === "reveal" && <StepReveal />}
          {screen === "result" && <StepResult />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ExperienceProvider>
      <ExperienceShell />
    </ExperienceProvider>
  );
}
