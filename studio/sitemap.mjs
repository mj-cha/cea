/* studio v1.0 — 공통 파일. 사이트별로 고치지 않고, 바꾸면 고수템·CEA 둘 다 같이 */
import fs from "node:fs";
import path from "node:path";

const VALID_STATUS = new Set(["있음", "고칠 것", "새로"]);

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

export function loadMergedConfig(root) {
  const cfgPath = path.join(root, "studio", "screens.config.json");
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  } catch (e) {
    const err = new Error("screens.config.json을 읽지 못했어요: " + (e && e.message ? e.message : String(e)));
    err.code = "STUDIO_CFG_ERR";
    throw err;
  }

  const cfgScreens = Array.isArray(cfg.screens) ? cfg.screens : [];
  const byRoute = new Map();
  for (const s of cfgScreens) {
    if (s && s.route) byRoute.set(s.route, s);
  }

  const outScreens = [];
  const seenRoutes = new Set();
  let skipped = 0;

  if (cfg.source && cfg.source.sitemap) {
    const smPath = path.join(root, cfg.source.sitemap);
    let md = fs.existsSync(smPath) ? fs.readFileSync(smPath, "utf8") : "";
    if (cfg.source.stopAt) {
      const cut = md.indexOf(cfg.source.stopAt);
      if (cut >= 0) md = md.slice(0, cut);
    }

    const secMap = cfg.source.sections || {};
    const routeGroups = (cfg.source.routeGroups || []).map((rg) => ({
      re: new RegExp(rg.match),
      group: rg.group,
    }));

    let curGroup = (cfg.groups && cfg.groups[0] && cfg.groups[0].id) || "public";
    let inTable = false;
    let nameIdx = 1;
    let statusIdx = -1;

    const lines = md.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i].trim();
      if (ln.startsWith("### ")) {
        inTable = false;
        const heading = ln.slice(4).trim();
        for (const [prefix, gid] of Object.entries(secMap)) {
          if (heading.startsWith(prefix)) {
            curGroup = gid;
            break;
          }
        }
        continue;
      }

      if (!ln.startsWith("|")) {
        inTable = false;
        continue;
      }

      const cells = splitRow(ln);
      if (!inTable) {
        inTable = true;
        const ni = cells.findIndex((c) => c === "화면");
        const si = cells.findIndex((c) => c === "상태");
        nameIdx = ni >= 0 ? ni : 1;
        statusIdx = si;
        continue;
      }

      if (cells.every((c) => /^:?-+:?$/.test(c))) continue;

      const col0 = cells[0] || "";
      const routeTokens = [...col0.matchAll(/`(#[^`]+)`/g)].map((m) => m[1].trim());
      if (!routeTokens.length) {
        skipped++;
        continue;
      }

      const baseTitle = (cells[nameIdx] || "").replace(/`/g, "").trim();
      const rawStatus = statusIdx >= 0 ? (cells[statusIdx] || "").trim() : "";
      const status = VALID_STATUS.has(rawStatus) ? rawStatus : "";

      for (const rt of routeTokens) {
        let group = curGroup;
        for (const rg of routeGroups) {
          if (rg.re.test(rt)) {
            group = rg.group;
            break;
          }
        }
        const title = routeTokens.length > 1 ? `${baseTitle} (${rt})` : baseTitle;
        const ov = byRoute.get(rt) || {};
        seenRoutes.add(rt);

        const item = {
          route: rt,
          title: ov.title || title || rt,
          group: ov.group || group,
          status: ov.status !== undefined ? ov.status : status,
          required: Boolean(ov.required),
          enabled: ov.enabled !== false,
          desc: ov.desc || "",
          source: "sitemap",
          preview: rt.includes("<") ? (ov.preview || "") : (ov.preview || rt),
        };
        outScreens.push(item);
      }
    }
  }

  for (const ov of cfgScreens) {
    if (!ov || !ov.route || seenRoutes.has(ov.route)) continue;
    const rt = ov.route;
    outScreens.push({
      route: rt,
      title: ov.title || rt,
      group: ov.group || ((cfg.groups && cfg.groups[0] && cfg.groups[0].id) || "public"),
      status: VALID_STATUS.has(ov.status) ? ov.status : "",
      required: Boolean(ov.required),
      enabled: ov.enabled !== false,
      desc: ov.desc || "",
      source: ov.source || "preset",
      preview: rt.includes("<") ? (ov.preview || "") : (ov.preview || rt),
    });
  }

  const visible = outScreens.filter((s) => s.enabled !== false);
  const missingPreview = visible.filter((s) => !s.preview).length;

  return {
    version: cfg.version || 1,
    project: cfg.project || "사이트",
    appPath: cfg.appPath || "/",
    viewports: cfg.viewports || { d: 1440, m: 390 },
    groups: cfg.groups || [],
    themes: cfg.themes || [],
    pricingModel: cfg.pricingModel ?? null,
    features: Array.isArray(cfg.features) ? cfg.features : [],
    screens: outScreens,
    meta: {
      count: visible.length,
      missingPreview,
      skipped,
    },
  };
}
