import type { FireLevel, GlazeId, MoodId } from "../types";

const DEFAULT_RESULT_PHOTO = "/result-vase-lq-01.png";

export type ResultVasePreviewProps = {
  mood?: MoodId | null;
  fire?: FireLevel | null;
  glaze?: GlazeId | null;
  /** 成器页等：覆盖默认器物图（如静澜梅瓶专用图），不设则 `/result-vase-lq-01.png` */
  imageSrc?: string | null;
  /** 开窑页：器物略拉高占比；与成器页共用同一实拍图与滤镜逻辑 */
  frame?: "default" | "reveal";
};

function photoFilterClass(mood: MoodId, fire: FireLevel): string {
  const moodPart: Record<MoodId, string> = {
    jing: "[hue-rotate:-4deg] saturate-[0.92]",
    wang: "",
    huo: "[hue-rotate:6deg] saturate-[1.05]",
    lie: "brightness-[1.08] contrast-[1.08] saturate-[1.12]",
    lian: "brightness-[0.94] saturate-[0.88]",
    liu: "saturate-[1.18] [hue-rotate:3deg]",
  };
  const firePart: Record<FireLevel, string> = {
    low: "brightness-[0.9] saturate-[0.92]",
    mid: "",
    high: "brightness-[1.1] saturate-[1.14]",
  };
  return [moodPart[mood], firePart[fire]].filter(Boolean).join(" ");
}

/** 成器页 / 开窑页器物：同一实拍图 + 心境/火候滤镜（`public/result-vase-lq-01.png`） */
export function ResultVasePreview({
  mood: moodProp,
  fire: fireProp,
  glaze,
  imageSrc: imageSrcProp,
  frame = "default",
}: ResultVasePreviewProps) {
  void glaze;
  const mood = (moodProp ?? "wang") as MoodId;
  const fire = (fireProp ?? "mid") as FireLevel;

  const isReveal = frame === "reveal";
  const resultVasePhotoSrc =
    imageSrcProp && imageSrcProp.length > 0 ? imageSrcProp : DEFAULT_RESULT_PHOTO;
  const filterClass =
    resultVasePhotoSrc === DEFAULT_RESULT_PHOTO ? photoFilterClass(mood, fire) : "";

  /** 禁止拖动选中（系统/浏览器划选、幽灵拖拽） */
  const noSelectImg =
    "select-none [-webkit-user-drag:none] [user-drag:none] [-webkit-touch-callout:none]";

  /** 成器页：宽:高 = 10:10.2，宽度略收等比缩小；开窑页正方形配合拂尘画布 */
  const frameShellClass = isReveal
    ? "relative aspect-square w-full select-none overflow-hidden rounded-sm border border-zinc-800/90 bg-gradient-to-b from-zinc-950 to-black shadow-inner"
    : "relative mx-auto aspect-[10/10.2] w-[96%] max-w-full select-none overflow-hidden rounded-sm border border-zinc-800/90 bg-transparent";

  const imgBase =
    "opacity-95 drop-shadow-2xl transition-[filter] duration-300 outline-none focus:outline-none";

  const revealImgClass = `h-full w-full max-h-full max-w-full object-contain ${noSelectImg} ${imgBase} ${filterClass}`;
  const defaultImgClass = `max-h-[90%] min-h-0 max-w-[90%] min-w-0 object-contain ${noSelectImg} ${imgBase} ${filterClass}`;

  return (
    <div className={frameShellClass}>
      {isReveal && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.12),transparent_45%)]" />
      )}
      {isReveal ? (
        <div className="flex h-full min-h-0 w-full items-center justify-center p-0">
          <img
            src={resultVasePhotoSrc}
            alt=""
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={revealImgClass}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex min-h-0 items-center justify-center py-4 px-4 sm:py-5 sm:px-5">
          <img
            src={resultVasePhotoSrc}
            alt=""
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={defaultImgClass}
          />
        </div>
      )}
    </div>
  );
}
