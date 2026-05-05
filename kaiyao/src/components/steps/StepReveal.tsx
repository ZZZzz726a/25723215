import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResultVasePreview } from "../ResultVasePreview";
import { FIGMA_MECHANISM_ASSETS } from "../../constants/figmaMechanismAssets";
import { useExperience } from "../../context/ExperienceContext";
import { resolveVaseImageSrc } from "../../lib/generateArtwork";
import type { FireLevel, GlazeId, MoodId } from "../../types";

/** 达到擦除阈值后，无遮罩展示器物约 1.5s 再进入下一页 */
const REVEAL_HOLD_MS = 1500;

function estimateClearedFraction(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const samples = 420;
  let cleared = 0;
  const data = ctx.getImageData(0, 0, w, h).data;
  const m = 0.14;
  for (let i = 0; i < samples; i++) {
    const x = Math.floor((m + Math.random() * (1 - 2 * m)) * w);
    const y = Math.floor((m + Math.random() * (1 - 2 * m)) * h);
    const a = data[(y * w + x) * 4 + 3];
    if (a < 55) cleared++;
  }
  return cleared / samples;
}

function clientToCanvas(clientX: number, clientY: number, cover: HTMLCanvasElement) {
  const rect = cover.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * cover.width,
    y: ((clientY - rect.top) / rect.height) * cover.height,
  };
}

/** 深色幕布（对齐页面 rgb(18,20,20)），上下缘加重以融进背景；可 destination-out 擦除 */
function fillVeil(cctx: CanvasRenderingContext2D, w: number, h: number) {
  cctx.setTransform(1, 0, 0, 1, 0, 0);
  cctx.globalCompositeOperation = "source-over";

  const base = cctx.createLinearGradient(0, 0, w, h * 1.06);
  base.addColorStop(0, "rgba(8,10,20,0.995)");
  base.addColorStop(0.48, "rgba(4,6,14,0.992)");
  base.addColorStop(1, "rgba(6,8,18,0.995)");
  cctx.fillStyle = base;
  cctx.fillRect(0, 0, w, h);

  const topBand = cctx.createLinearGradient(0, 0, 0, h * 0.46);
  topBand.addColorStop(0, "rgba(18,20,20,0.99)");
  topBand.addColorStop(0.28, "rgba(18,20,20,0.72)");
  topBand.addColorStop(0.55, "rgba(18,20,20,0.32)");
  topBand.addColorStop(0.82, "rgba(18,20,20,0.06)");
  topBand.addColorStop(1, "rgba(18,20,20,0)");
  cctx.fillStyle = topBand;
  cctx.fillRect(0, 0, w, h * 0.46);

  const botBand = cctx.createLinearGradient(0, h, 0, h * 0.48);
  botBand.addColorStop(0, "rgba(18,20,20,0.98)");
  botBand.addColorStop(0.32, "rgba(18,20,20,0.68)");
  botBand.addColorStop(0.62, "rgba(18,20,20,0.28)");
  botBand.addColorStop(0.88, "rgba(18,20,20,0.05)");
  botBand.addColorStop(1, "rgba(18,20,20,0)");
  cctx.fillStyle = botBand;
  cctx.fillRect(0, h * 0.52, w, h * 0.48);

  const rg = cctx.createRadialGradient(w * 0.5, h * 0.44, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.82);
  rg.addColorStop(0, "rgba(0,0,0,0)");
  rg.addColorStop(0.38, "rgba(0,0,0,0.34)");
  rg.addColorStop(0.72, "rgba(0,0,0,0.52)");
  rg.addColorStop(1, "rgba(0,0,0,0.68)");
  cctx.fillStyle = rg;
  cctx.fillRect(0, 0, w, h);

  /** 整块遮罩外缘渐变晕染（中心实、向边缘柔化至透明） */
  const cx = w * 0.5;
  const cy = h * 0.5;
  const r0 = Math.min(w, h) * 0.26;
  const r1 = Math.hypot(w, h) * 0.56;
  const edge = cctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  edge.addColorStop(0, "rgba(255,255,255,1)");
  edge.addColorStop(0.58, "rgba(255,255,255,0.95)");
  edge.addColorStop(0.8, "rgba(255,255,255,0.48)");
  edge.addColorStop(0.93, "rgba(255,255,255,0.14)");
  edge.addColorStop(1, "rgba(255,255,255,0)");
  cctx.globalCompositeOperation = "destination-in";
  cctx.fillStyle = edge;
  cctx.fillRect(0, 0, w, h);
  cctx.globalCompositeOperation = "source-over";
}

function paintDotAt(
  cctx: CanvasRenderingContext2D,
  cover: HTMLCanvasElement,
  x: number,
  y: number,
  holdMs: number
) {
  const strength = Math.min(1, holdMs / 1200) ** 0.68;
  const dim = Math.min(cover.width, cover.height);
  const r = dim * (0.0573 + 0.052 * strength);

  cctx.globalCompositeOperation = "destination-out";
  const g = cctx.createRadialGradient(x, y, 0, x, y, r);
  const a0 = Math.min(0.995, 0.78 * strength + 0.34);
  const a1 = 0.52 * strength + 0.22;
  const a2 = 0.28 * strength + 0.1;
  g.addColorStop(0, `rgba(255,255,255,${a0})`);
  g.addColorStop(0.1, `rgba(255,255,255,${Math.min(0.98, a0 * 0.97)})`);
  g.addColorStop(0.28, `rgba(255,255,255,${a1})`);
  g.addColorStop(0.48, `rgba(255,255,255,${a2})`);
  g.addColorStop(0.72, "rgba(255,255,255,0.07)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  cctx.fillStyle = g;
  cctx.beginPath();
  cctx.arc(x, y, r, 0, Math.PI * 2);
  cctx.fill();
  /** 同半径再叠一层，加深擦除感（不改变 r） */
  cctx.fill();
  cctx.globalCompositeOperation = "source-over";
}

/** 沿路径插值多点，避免快速拖动时「断笔」 */
function paintSegmentCanvas(
  cctx: CanvasRenderingContext2D,
  cover: HTMLCanvasElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  holdMs: number
) {
  const dim = Math.min(cover.width, cover.height);
  const step = Math.max(dim * 0.024, 8);
  const dist = Math.hypot(x1 - x0, y1 - y0);
  if (dist < 0.75) {
    paintDotAt(cctx, cover, x0, y0, holdMs);
    return;
  }
  const n = Math.ceil(dist / step);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    paintDotAt(cctx, cover, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, holdMs);
  }
}

function MechanismBackdrop() {
  const a = FIGMA_MECHANISM_ASSETS;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img
        src={a.decoRightTall}
        alt=""
        className="absolute right-[-10%] top-[18%] hidden h-[min(52vh,420px)] w-auto opacity-[0.72] xl:right-[-4%] xl:block"
        draggable={false}
      />
      <img
        src={a.decoBottomLeft}
        alt=""
        className="pointer-events-none absolute bottom-0 left-[-14%] hidden h-[min(28vh,280px)] w-auto opacity-[0.72] lg:left-[-6%] lg:block"
        draggable={false}
      />
    </div>
  );
}

export function StepReveal() {
  const { goNext, selections } = useExperience();
  const mood = (selections.mood ?? "wang") as MoodId;
  const fire = (selections.fire ?? "mid") as FireLevel;
  const glaze = (selections.glaze ?? "jade") as GlazeId;
  const wrapRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLCanvasElement>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [fullyRevealed, setFullyRevealed] = useState(false);

  const drawing = useRef(false);
  const scheduled = useRef(0);
  const advanced = useRef(false);
  const holdStartRef = useRef(0);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastClientRef = useRef({ x: 0, y: 0 });
  const lastDrawCanvasRef = useRef({ x: 0, y: 0 });
  const rafTorchRef = useRef(0);
  const goNextTimerRef = useRef(0);

  const stopTorchLoop = useCallback(() => {
    if (rafTorchRef.current) {
      cancelAnimationFrame(rafTorchRef.current);
      rafTorchRef.current = 0;
    }
  }, []);

  const scheduleClearCheck = useCallback(
    (cctx: CanvasRenderingContext2D, cover: HTMLCanvasElement) => {
      if (scheduled.current) return;
      scheduled.current = window.setTimeout(() => {
        scheduled.current = 0;
        const cleared = estimateClearedFraction(cctx, cover.width, cover.height);
        if (cleared > 0.9 && !advanced.current) {
          advanced.current = true;
          drawing.current = false;
          stopTorchLoop();
          setFullyRevealed(true);
          if (goNextTimerRef.current) window.clearTimeout(goNextTimerRef.current);
          goNextTimerRef.current = window.setTimeout(() => {
            goNextTimerRef.current = 0;
            goNext();
          }, REVEAL_HOLD_MS);
        }
      }, 200);
    },
    [goNext, stopTorchLoop]
  );

  useEffect(() => {
    advanced.current = false;
    setFullyRevealed(false);
    if (goNextTimerRef.current) {
      window.clearTimeout(goNextTimerRef.current);
      goNextTimerRef.current = 0;
    }
  }, []);

  useEffect(
    () => () => {
      if (rafTorchRef.current) cancelAnimationFrame(rafTorchRef.current);
      if (goNextTimerRef.current) window.clearTimeout(goNextTimerRef.current);
    },
    []
  );

  const layoutCanvas = useCallback(() => {
    const wrap = wrapRef.current;
    const cover = coverRef.current;
    if (!wrap || !cover) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth: cw, clientHeight: ch } = wrap;
    const w = Math.floor(cw * dpr);
    const h = Math.floor(ch * dpr);
    cover.width = w;
    cover.height = h;
    cover.style.width = `${cw}px`;
    cover.style.height = `${ch}px`;

    const cctx = cover.getContext("2d");
    if (!cctx) return;
    if (fullyRevealed) {
      cctx.clearRect(0, 0, w, h);
      return;
    }
    fillVeil(cctx, w, h);
  }, [fullyRevealed]);

  useEffect(() => {
    layoutCanvas();
    const ro = new ResizeObserver(() => layoutCanvas());
    if (wrapRef.current) ro.observe(wrapRef.current);
    const onResize = () => layoutCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [layoutCanvas]);

  const startTorchLoop = useCallback(() => {
    stopTorchLoop();
    const tick = () => {
      if (!drawing.current || advanced.current) return;
      const cover = coverRef.current;
      if (!cover) return;
      const cctx = cover.getContext("2d");
      if (!cctx) return;

      const end = clientToCanvas(lastClientRef.current.x, lastClientRef.current.y, cover);
      const start = lastDrawCanvasRef.current;
      const holdMs = performance.now() - holdStartRef.current;
      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      if (dist > 1.5) {
        paintSegmentCanvas(cctx, cover, start.x, start.y, end.x, end.y, holdMs);
        lastDrawCanvasRef.current = end;
      } else {
        paintDotAt(cctx, cover, start.x, start.y, holdMs);
      }
      scheduleClearCheck(cctx, cover);
      rafTorchRef.current = requestAnimationFrame(tick);
    };
    rafTorchRef.current = requestAnimationFrame(tick);
  }, [scheduleClearCheck, stopTorchLoop]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (fullyRevealed) return;
    const cover = coverRef.current;
    if (!cover) return;
    drawing.current = true;
    holdStartRef.current = performance.now();
    downPosRef.current = { x: e.clientX, y: e.clientY };
    lastClientRef.current = { x: e.clientX, y: e.clientY };
    const c = clientToCanvas(e.clientX, e.clientY, cover);
    lastDrawCanvasRef.current = c;
    e.currentTarget.setPointerCapture(e.pointerId);
    startTorchLoop();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing.current) return;
    lastClientRef.current = { x: e.clientX, y: e.clientY };
    const d = downPosRef.current;
    if (d && !hasDragged) {
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (dx * dx + dy * dy > 36) setHasDragged(true);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    drawing.current = false;
    downPosRef.current = null;
    stopTorchLoop();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[rgb(18,20,20)]">
      <MechanismBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col px-2 pb-14 pt-8 sm:px-3 sm:pt-10 md:px-4 md:pb-16 md:pt-12 xl:px-5 2xl:px-7"
      >
        <div className="shrink-0 text-center">
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-[0.08em] text-[#e2e2e2] sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            开窑
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-sans text-sm leading-relaxed text-[#c2c8c2] sm:mt-5 sm:text-base md:text-lg">
            按住并拖动，拂去窑尘
          </p>
        </div>

        <div className="relative z-10 mt-8 flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-4 sm:mt-10 sm:px-10">
          {/* 白边在遮罩外一圈：外层 padding 露底，canvas 盖不到 */}
          <div className="w-full max-w-[min(92vw,520px)] shrink-0 rounded-md bg-[linear-gradient(160deg,rgba(255,255,255,0.38),rgba(255,255,255,0.14)_45%,rgba(255,255,255,0.22))] p-[2.5px] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:p-[3px]">
            <div
              ref={wrapRef}
              className={`relative aspect-square w-full touch-none select-none overflow-hidden rounded-[5px] bg-[rgb(18,20,20)] ${
                fullyRevealed ? "pointer-events-none cursor-default" : "cursor-crosshair"
              }`}
              style={{ touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="pointer-events-none relative h-full w-full brightness-[1.18] contrast-[1.1] saturate-[1.14]">
                <ResultVasePreview
                  mood={mood}
                  fire={fire}
                  glaze={glaze}
                  imageSrc={resolveVaseImageSrc(mood, fire, glaze)}
                  frame="reveal"
                />
              </div>
              <canvas
                ref={coverRef}
                className={`pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-500 ease-out ${
                  fullyRevealed ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 min-h-[1.5rem] text-center sm:mt-10">
          <AnimatePresence>
            {hasDragged && (
              <motion.p
                initial={{ opacity: 0, y: 8, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.35 } }}
                transition={{
                  duration: 2.45,
                  ease: [0.08, 0.82, 0.2, 1],
                }}
                className="font-sans text-sm tracking-[0.12em] text-[#8fb8ae] sm:text-base sm:tracking-[0.16em]"
              >
                青色正在显现……
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
