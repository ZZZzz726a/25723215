/**
 * 从 Figma 导出择釉三卡位图（node 71:564 / 71:562 / 71:560），写入 public/glazes/*.png
 * 需要环境变量 FIGMA_ACCESS_TOKEN（Figma → Settings → Personal access tokens）
 *
 *   set FIGMA_ACCESS_TOKEN=figd_...
 *   node scripts/fetch-figma-glaze-images.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "glazes");

const FILE_KEY = "p9TtsqjYOaQnMF7XaxtDQW";
const NODES = [
  { file: "jade.png", id: "71:564" },
  { file: "crackle.png", id: "71:562" },
  { file: "flow.png", id: "71:560" },
];

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error("Missing FIGMA_ACCESS_TOKEN");
  process.exit(1);
}

const ids = NODES.map((n) => n.id).join(",");
const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=png&scale=2`;
const res = await fetch(url, { headers: { "X-Figma-Token": token } });
const json = await res.json();
if (!res.ok) {
  console.error("Figma API error:", json);
  process.exit(1);
}

const map = json.images ?? {};
await mkdir(outDir, { recursive: true });

for (const { file, id } of NODES) {
  const imgUrl = map[id];
  if (!imgUrl) {
    console.error("No URL for node", id, map);
    process.exit(1);
  }
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) {
    console.error("Download failed", file, imgRes.status);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  await writeFile(join(outDir, file), buf);
  console.log("Wrote", file, buf.length, "bytes");
}
