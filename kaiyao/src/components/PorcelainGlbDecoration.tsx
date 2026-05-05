import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import {
  AdditiveBlending,
  AmbientLight,
  Box3,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Plane,
  PointsMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { Group, Material, Mesh as ThreeMesh } from "three";

type ClippableMaterial = Material & {
  clipping: boolean;
  clippingPlanes: Plane[];
};
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

const MODEL_URL = "/models/d0b8c199e1e20b4af4120990a6365f01.glb";

/** 与 StepperNav「识窑」高亮一致 */
const ACCENT_HEX = "#b2cdba";
const PARTICLE_COLOR = new Color(ACCENT_HEX);

const MODEL_BASE_SCALE = 3.82;
const BREATH_AMPLITUDE = 0.018;

const PARTICLE_COUNT = 16_000;
const PARTICLE_POINT_SIZE = 0.076;

/** 过场时长（秒）：固定时长 + smoothstep，避免一帧跳变卡顿 */
const BLEND_TRANSITION_SEC = 1;

/** 悬停多久后切到实心（不变） */
const SOLID_ENTER_DELAY_MS = 1000;
/** 鼠标离开多久后才开始从实心变回粒子 */
const PARTICLE_LEAVE_DELAY_MS = 3000;

const easeInOut = [0.22, 1, 0.36, 1] as const;

/** 与识窑页 `StepMechanism` 主底 `rgb(18,20,20)` 衔接：整块柔边入页，避免方框裁剪感 */
const DECO_EDGE_MASK =
  "radial-gradient(ellipse 108% 112% at 76% 34%, #000 0%, #000 20%, rgba(0,0,0,0.52) 46%, rgba(0,0,0,0.16) 74%, rgba(0,0,0,0.04) 88%, transparent 100%)";

/** 主粒子：略小亮核 + 较快收边，放大后仍像一颗颗点 */
function createSoftDotTexture(): CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2d context unavailable");
  }
  const cx = s / 2;
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, s * 0.34);
  g.addColorStop(0, "rgba(255, 255, 253, 0.98)");
  g.addColorStop(0.1, "rgba(232, 248, 238, 0.9)");
  g.addColorStop(0.26, "rgba(205, 232, 214, 0.78)");
  g.addColorStop(0.46, "rgba(185, 215, 195, 0.52)");
  g.addColorStop(0.68, "rgba(168, 200, 182, 0.22)");
  g.addColorStop(1, "rgba(140, 180, 160, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function buildSamplingMesh(root: Object3D): Mesh | null {
  root.updateMatrixWorld(true);
  let winner: Mesh | undefined;
  let maxV = 0;
  root.traverse((obj) => {
    const m = obj as Mesh;
    if (!m.isMesh || !m.geometry) return;
    const pos = m.geometry.getAttribute("position");
    const c = pos ? pos.count : 0;
    if (c > maxV) {
      maxV = c;
      winner = m;
    }
  });
  if (winner === undefined) return null;
  const srcGeom = winner.geometry;
  const geom = srcGeom.clone();
  geom.applyMatrix4(winner.matrixWorld);
  return new Mesh(geom, new MeshBasicMaterial({ visible: false }));
}

function sampleSurfaceToBufferGeometry(surfaceMesh: Mesh, count: number): BufferGeometry {
  const sampler = new MeshSurfaceSampler(surfaceMesh).build();
  const positions = new Float32Array(count * 3);
  const v = new Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.computeBoundingSphere();
  return geo;
}

function collectSolidMaterials(root: Object3D, clipPlane: Plane): Material[] {
  const mats: Material[] = [];
  root.traverse((obj) => {
    const mesh = obj as ThreeMesh;
    if (!mesh.isMesh || !mesh.material) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of list) {
      mat.transparent = true;
      mat.opacity = 0;
      mat.depthWrite = false;
      const cm = mat as ClippableMaterial;
      cm.clipping = true;
      cm.clippingPlanes = [clipPlane];
      mats.push(mat);
    }
  });
  return mats;
}

function PorcelainModelScene({
  solidMode,
  reduceMotion,
  hovered,
}: {
  solidMode: boolean;
  reduceMotion: boolean;
  hovered: boolean;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const sampleRoot = useMemo(() => scene.clone(true), [scene]);
  const solidRoot = useMemo(() => scene.clone(true), [scene]);

  const particleGeometry = useMemo(() => {
    const surfaceMesh = buildSamplingMesh(sampleRoot);
    if (!surfaceMesh) return null;
    const mainGeo = sampleSurfaceToBufferGeometry(surfaceMesh, PARTICLE_COUNT);
    surfaceMesh.geometry.dispose();
    if (Array.isArray(surfaceMesh.material)) {
      surfaceMesh.material.forEach((m) => m.dispose());
    } else {
      surfaceMesh.material.dispose();
    }
    return mainGeo;
  }, [sampleRoot]);

  useEffect(() => {
    return () => {
      particleGeometry?.dispose();
    };
  }, [particleGeometry]);

  const dotMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createSoftDotTexture();
  }, []);

  useEffect(() => {
    return () => {
      dotMap?.dispose();
    };
  }, [dotMap]);

  /** 实心：裁掉 y > cut（切割线从下往上移，实心自下显露） */
  const planeSolidRef = useRef(new Plane(new Vector3(0, -1, 0), 0));
  /** 粒子：裁掉 y < cut（自下被「擦掉」） */
  const planeParticleRef = useRef(new Plane(new Vector3(0, 1, 0), 0));

  const solidMatsRef = useRef<Material[]>([]);
  useLayoutEffect(() => {
    solidMatsRef.current = collectSolidMaterials(solidRoot, planeSolidRef.current);
    return () => {
      solidMatsRef.current = [];
    };
  }, [solidRoot]);

  const modelRootRef = useRef<Group>(null);
  const wipeWrapRef = useRef<Group>(null);
  const boundsBox = useMemo(() => new Box3(), []);
  const matRef = useRef<PointsMaterial>(null);
  const revealRef = useRef(0);
  const solidBlendRef = useRef(0);
  const prevSolidModeRef = useRef(solidMode);
  const blendTransFromRef = useRef(0);
  const blendTransT0Ref = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const m = matRef.current as ClippableMaterial | null;
      if (m) {
        m.clipping = true;
        m.clippingPlanes = [planeParticleRef.current];
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [particleGeometry, dotMap]);

  const ambRef = useRef<AmbientLight>(null);
  const hemRef = useRef<HemisphereLight>(null);
  const dirKeyRef = useRef<DirectionalLight>(null);
  const dirFillRef = useRef<DirectionalLight>(null);
  const dirFrontRef = useRef<DirectionalLight>(null);

  useFrame((state) => {
    const g = modelRootRef.current;
    const mat = matRef.current;
    if (!g) return;

    const dt = Math.min(state.clock.getDelta(), 0.05);
    const target = solidMode ? 1 : 0;
    if (reduceMotion) {
      prevSolidModeRef.current = solidMode;
      solidBlendRef.current = target;
    } else {
      if (solidMode !== prevSolidModeRef.current) {
        blendTransFromRef.current = solidBlendRef.current;
        blendTransT0Ref.current = state.clock.elapsedTime;
        prevSolidModeRef.current = solidMode;
      }
      const u = Math.min(
        1,
        (state.clock.elapsedTime - blendTransT0Ref.current) / BLEND_TRANSITION_SEC,
      );
      const sm = u * u * (3 - 2 * u);
      solidBlendRef.current =
        blendTransFromRef.current + (target - blendTransFromRef.current) * sm;
    }
    const blend = solidBlendRef.current;
    const particleWeight = 1 - blend;

    const wipeWrap = wipeWrapRef.current;
    if (wipeWrap) {
      wipeWrap.updateMatrixWorld(true);
      boundsBox.setFromObject(wipeWrap);
      if (!boundsBox.isEmpty()) {
        const ymin = boundsBox.min.y;
        const ymax = boundsBox.max.y;
        const h = Math.max(ymax - ymin, 1e-4);
        const cut = ymin + h * blend;
        const ps = planeSolidRef.current;
        const pp = planeParticleRef.current;
        ps.normal.set(0, -1, 0);
        ps.constant = cut;
        pp.normal.set(0, 1, 0);
        pp.constant = -cut;
      }
    }

    if (!reduceMotion) {
      revealRef.current = Math.min(1, revealRef.current + dt * 0.78);
    } else {
      revealRef.current = 1;
    }
    const tReveal = revealRef.current;
    const easeOut = 1 - (1 - tReveal) ** 2.35;
    const revealMul = 0.84 + 0.16 * easeOut;

    let s = MODEL_BASE_SCALE * revealMul;
    if (!reduceMotion && hovered) {
      const t = state.clock.elapsedTime;
      s *= 1 + BREATH_AMPLITUDE * Math.sin(t * 2.5);
    }
    g.scale.setScalar(s);

    if (mat && particleGeometry) {
      const baseOp = 0.42 + 0.48 * easeOut;
      mat.opacity = Math.min(1, baseOp * particleWeight);
      let size = PARTICLE_POINT_SIZE * (0.82 + 0.18 * easeOut);
      if (!reduceMotion && hovered) {
        size *= 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2.5);
      }
      mat.size = size * (0.94 + 0.06 * particleWeight);
    }

    for (const m of solidMatsRef.current) {
      m.opacity = blend;
      m.depthWrite = blend > 0.92;
    }

    const amb = ambRef.current;
    const hem = hemRef.current;
    const dk = dirKeyRef.current;
    const df = dirFillRef.current;
    const dfr = dirFrontRef.current;
    if (amb) amb.intensity = 0.35 + 0.47 * blend;
    if (hem) hem.intensity = 0.42 * blend;
    if (dk) dk.intensity = 1.28 * blend;
    if (df) df.intensity = 0.52 * blend;
    if (dfr) dfr.intensity = 0.35 * blend;
  });

  if (!particleGeometry || !dotMap) return null;

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.35} />
      <hemisphereLight
        ref={hemRef}
        color="#e4edf2"
        groundColor="#3a3634"
        intensity={0}
      />
      <directionalLight
        ref={dirKeyRef}
        position={[5, 9, 5]}
        intensity={0}
        color="#fffaf5"
      />
      <directionalLight
        ref={dirFillRef}
        position={[-4, 4, -2]}
        intensity={0}
        color="#d8e6f0"
      />
      <directionalLight
        ref={dirFrontRef}
        position={[0, 1.5, 7]}
        intensity={0}
        color="#f5f8fc"
      />

      <group ref={modelRootRef} position={[0, 0.09, 0]}>
        <Center>
          <group ref={wipeWrapRef}>
            <points frustumCulled={false} geometry={particleGeometry}>
              <pointsMaterial
                ref={matRef}
                map={dotMap}
                color={PARTICLE_COLOR}
                transparent
                depthTest
                depthWrite={false}
                alphaTest={0.04}
                blending={AdditiveBlending}
                size={PARTICLE_POINT_SIZE}
                sizeAttenuation
                opacity={0.45}
                vertexColors={false}
              />
            </points>
            <primitive object={solidRoot} />
          </group>
        </Center>
      </group>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        zoomSpeed={0.85}
        rotateSpeed={0.65}
        minDistance={1.35}
        maxDistance={7}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.58}
        autoRotate={!reduceMotion && !hovered}
        autoRotateSpeed={1.15}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);

/**
 * 识窑区块：悬停 1s → 实心；离开 2.5s 后才开始回粒子；中间为极短自下而上擦除过场。
 */
export function PorcelainGlbDecoration() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [solidMode, setSolidMode] = useState(false);
  const solidEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solidLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSolidEnterTimer = useCallback(() => {
    if (solidEnterTimerRef.current !== null) {
      window.clearTimeout(solidEnterTimerRef.current);
      solidEnterTimerRef.current = null;
    }
  }, []);

  const clearSolidLeaveTimer = useCallback(() => {
    if (solidLeaveTimerRef.current !== null) {
      window.clearTimeout(solidLeaveTimerRef.current);
      solidLeaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearSolidEnterTimer();
      clearSolidLeaveTimer();
    };
  }, [clearSolidEnterTimer, clearSolidLeaveTimer]);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
    clearSolidLeaveTimer();
    clearSolidEnterTimer();
    solidEnterTimerRef.current = window.setTimeout(() => {
      solidEnterTimerRef.current = null;
      setSolidMode(true);
    }, SOLID_ENTER_DELAY_MS);
  }, [clearSolidEnterTimer, clearSolidLeaveTimer]);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
    clearSolidEnterTimer();
    clearSolidLeaveTimer();
    solidLeaveTimerRef.current = window.setTimeout(() => {
      solidLeaveTimerRef.current = null;
      setSolidMode(false);
    }, PARTICLE_LEAVE_DELAY_MS);
  }, [clearSolidEnterTimer, clearSolidLeaveTimer]);

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -2.6 }
      }
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.48, ease: easeInOut }
          : { duration: 0.88, ease: easeInOut }
      }
      className="pointer-events-auto absolute right-0 top-[-40px] z-[12] h-[min(68vh,760px)] w-[min(98vw,660px)] origin-top-right -translate-x-1 overflow-visible will-change-transform selection:bg-transparent sm:h-[min(70vh,800px)] sm:w-[min(90vw,720px)] sm:-translate-x-2 md:h-[min(74vh,860px)] md:w-[min(78vw,780px)] md:-translate-x-4 lg:h-[min(76vh,900px)] lg:w-[min(68vw,840px)] lg:-translate-x-6 xl:-translate-x-8 [&:active]:cursor-grabbing"
      aria-hidden
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] z-0"
        style={{
          WebkitMaskImage: DECO_EDGE_MASK,
          maskImage: DECO_EDGE_MASK,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          background: `
            radial-gradient(ellipse 95% 88% at 74% 36%, rgba(24, 30, 27, 0.42) 0%, rgba(19, 22, 21, 0.1) 52%, transparent 72%),
            radial-gradient(ellipse 72% 62% at 80% 30%, rgba(178, 205, 186, 0.035) 0%, transparent 54%),
            radial-gradient(ellipse 140% 72% at 52% 100%, rgba(20, 24, 23, 0.14) 0%, transparent 58%)
          `,
        }}
      />
      <Canvas
        className="relative z-[1] h-full w-full cursor-grab touch-none"
        dpr={[1.25, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0.14, 0.1, 6.32], fov: 58, near: 0.05, far: 120 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.localClippingEnabled = true;
        }}
      >
        <Suspense fallback={null}>
          <PorcelainModelScene
            solidMode={solidMode}
            reduceMotion={!!reduceMotion}
            hovered={hovered}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
