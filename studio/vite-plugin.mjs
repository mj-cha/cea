/* studio v1.0 — 공통 파일. 사이트별로 고치지 않고, 바꾸면 고수템·CEA 둘 다 같이 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMergedConfig } from "./sitemap.mjs";

const STUDIO_DIR = path.dirname(fileURLToPath(import.meta.url));
const STATIC_FILES = new Map([
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/studio.css", ["studio.css", "text/css; charset=utf-8"]],
  ["/studio.js", ["studio.js", "text/javascript; charset=utf-8"]],
  ["/panel.js", ["panel.js", "text/javascript; charset=utf-8"]],
  ["/picker.js", ["picker.js", "text/javascript; charset=utf-8"]],
]);

const QUEUE_HEAD = `# 스튜디오 수정 지시 수신함 (STUDIO-QUEUE)
> \`/__studio\`의 [고치기]가 한 줄씩 쌓는 곳이에요. 손으로 쓰지 않아요.
> Claude(CTO)가 묶어서 \`docs/SCREEN-QUEUE.md\` 항목으로 옮기고 \`[x]\`로 바꿔요. 18KB를 넘으면 처리된 줄은 \`docs/archive/STUDIO-QUEUE-DONE.md\`로.

## 받은 것
`;

function cleanField(v, maxLen) {
  return String(v == null ? "" : v)
    .replace(/[\r\n]+/g, " ")
    .replace(/`/g, "'")
    .trim()
    .slice(0, maxLen);
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(obj));
}

function createHandler(root) {
  const queueFile = path.join(root, "docs", "STUDIO-QUEUE.md");

  return (req, res) => {
    const rawUrl = req.url || "";
    const qPos = rawUrl.indexOf("?");
    const pathname = qPos >= 0 ? rawUrl.slice(0, qPos) : rawUrl;

    if (pathname === "") {
      res.writeHead(301, { Location: "/__studio/", "Cache-Control": "no-store" });
      res.end();
      return;
    }

    if (req.method === "GET" && pathname === "/api/config") {
      try {
        const data = loadMergedConfig(root);
        sendJson(res, 200, data);
      } catch (e) {
        sendJson(res, 500, { error: e && e.message ? e.message : "설정을 읽지 못했어요" });
      }
      return;
    }

    if (req.method === "POST" && pathname === "/api/queue") {
      const origin = req.headers.origin;
      if (origin) {
        let originHost = "";
        try {
          originHost = new URL(origin).host;
        } catch {
          originHost = "__invalid__";
        }
        if (originHost !== req.headers.host) {
          sendJson(res, 403, { error: "다른 출처 요청은 허용되지 않아요." });
          return;
        }
      }

      const ct = String(req.headers["content-type"] || "").toLowerCase();
      if (!ct.includes("application/json")) {
        sendJson(res, 400, { error: "JSON 형식만 받을 수 있어요." });
        return;
      }

      const chunks = [];
      let total = 0;
      let tooBig = false;

      req.on("data", (c) => {
        total += c.length;
        if (total > 4096) {
          tooBig = true;
          return;
        }
        chunks.push(c);
      });

      req.on("end", () => {
        if (tooBig) {
          sendJson(res, 413, { error: "요청 크기가 4KB를 넘었어요." });
          return;
        }
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        } catch {
          sendJson(res, 400, { error: "잘못된 JSON 본문이에요." });
          return;
        }

        const text = cleanField(body && body.text, 500);
        if (!text) {
          sendJson(res, 400, { error: "수정 지시 내용이 비어 있어요." });
          return;
        }

        const route = cleanField(body && body.route, 200) || "#home";
        const title = cleanField(body && body.title, 80) || route;
        const vp = body && body.viewport === "m" ? "모바일" : "데스크톱";
        const theme = cleanField(body && body.theme, 60) || "기본";
        const blk = body && body.block && typeof body.block === "object" ? body.block : null;
        const blkLabel = blk ? cleanField(blk.label, 60) : "";
        const blkSel = blk ? cleanField(blk.selector, 200) : "";
        const blkText = blkLabel
          ? (blkSel ? `${blkLabel} (\`${blkSel}\`)` : blkLabel)
          : "화면 전체";

        const now = new Date();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mi = String(now.getMinutes()).padStart(2, "0");
        const dayPrefix = `S-${mm}${dd}-`;

        fs.mkdirSync(path.dirname(queueFile), { recursive: true });
        if (!fs.existsSync(queueFile)) {
          fs.writeFileSync(queueFile, QUEUE_HEAD, "utf8");
        }
        const existing = fs.readFileSync(queueFile, "utf8");
        const todayCount = existing.split(/\r?\n/).filter((l) => l.includes(dayPrefix)).length;
        const id = dayPrefix + String(todayCount + 1).padStart(2, "0");
        const line = `- [ ] ${id} · \`${route}\` ${title} · ${vp} · 테마 ${theme} · 블록: ${blkText} · 지시: ${text} · ${hh}:${mi}\n`;

        fs.appendFileSync(queueFile, line, "utf8");
        const bytes = fs.statSync(queueFile).size;
        const warn = bytes > 18 * 1024
          ? "STUDIO-QUEUE.md가 18KB를 넘었어요. 처리된 줄을 docs/archive/로 옮겨 주세요."
          : null;
        sendJson(res, 200, { id, bytes, warn });
      });
      return;
    }

    if (req.method === "GET") {
      const key = pathname === "/" ? "/index.html" : pathname;
      const entry = STATIC_FILES.get(key);
      if (entry) {
        const [fname, mime] = entry;
        const fp = path.join(STUDIO_DIR, fname);
        if (fs.existsSync(fp)) {
          res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
          res.end(fs.readFileSync(fp));
          return;
        }
      }
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end("Not Found");
  };
}

export default function studio() {
  const mount = (server) => {
    const root = (server && server.config && server.config.root) || process.cwd();
    server.middlewares.use("/__studio", createHandler(root));
  };
  return { name: "studio", configureServer: mount, configurePreviewServer: mount };
}
