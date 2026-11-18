/* studio v1.0 — 공통 파일. 사이트별로 고치지 않고, 바꾸면 고수템·CEA 둘 다 같이 */
import { initPanel } from "./panel.js";

const projEl = document.getElementById("st-project");
const siteLink = document.getElementById("st-site-link");
const vpDEl = document.getElementById("st-vp-d");
const vpMEl = document.getElementById("st-vp-m");
const reloadBtn = document.getElementById("st-reload");
const openTabBtn = document.getElementById("st-open-tab");
const filterEl = document.getElementById("st-filter");
const navEl = document.getElementById("st-nav");
const metaEl = document.getElementById("st-meta");
const errorEl = document.getElementById("st-error");
const canvasEl = document.getElementById("st-canvas");
const frameBox = document.getElementById("st-frame-box");
const frameEl = document.getElementById("st-frame");

let cfg = null;
let visibleScreens = [];
let curScreen = null;
let curVp = "d";
let curThemeId = "";
let filterText = "";
let frameLoadedOnce = false;
let panel = null;

function parseStudioHash() {
  const raw = window.location.hash.replace(/^#/, "");
  const p = new URLSearchParams(raw);
  return {
    s: p.get("s") || "",
    v: p.get("v") === "m" ? "m" : "d",
    t: p.get("t") || "",
  };
}

function writeStudioHash() {
  if (!curScreen) return;
  const p = new URLSearchParams();
  p.set("s", curScreen.preview || curScreen.route);
  p.set("v", curVp);
  if (curThemeId) p.set("t", curThemeId);
  const next = "#" + p.toString();
  if (window.location.hash !== next) {
    history.replaceState(null, "", next);
  }
}

function currentTheme() {
  if (!cfg || !cfg.themes || !cfg.themes.length) return null;
  return cfg.themes.find((t) => t.id === curThemeId) || cfg.themes[0];
}

function applyThemeToFrame() {
  const th = currentTheme();
  if (!th) return;
  let doc;
  try {
    doc = frameEl.contentDocument;
  } catch {
    return;
  }
  if (!doc || !doc.documentElement) return;
  const root = doc.documentElement;

  if (th.attrs && typeof th.attrs === "object") {
    for (const [k, v] of Object.entries(th.attrs)) {
      if (v == null || v === "") root.removeAttribute(k);
      else root.setAttribute(k, String(v));
    }
    if ("data-theme" in th.attrs) {
      root.classList.toggle("dark", th.attrs["data-theme"] === "dark");
      const appEl = doc.querySelector(".app");
      if (appEl) appEl.classList.toggle("is-dark", th.attrs["data-theme"] === "dark");
    }
  }

  let styleEl = doc.getElementById("__studio-theme");
  const entries = th.vars ? Object.entries(th.vars) : [];
  if (!entries.length) {
    if (styleEl) styleEl.remove();
    return;
  }
  if (!styleEl && doc.head) {
    styleEl = doc.createElement("style");
    styleEl.id = "__studio-theme";
    doc.head.appendChild(styleEl);
  }
  if (styleEl) {
    const body = entries.map(([k, v]) => `${k}:${v} !important;`).join("");
    styleEl.textContent = `:root, .dark { ${body} }`;
  }
}

function ensurePickerInFrame(andStart) {
  let doc, win;
  try {
    doc = frameEl.contentDocument;
    win = frameEl.contentWindow;
  } catch {
    return;
  }
  if (!doc || !win || !doc.head) return;
  if (win.__studioPicker) {
    if (andStart) win.postMessage({ ns: "studio", type: "pick:start" }, window.location.origin);
    return;
  }
  const existing = doc.getElementById("__studio-picker-script");
  if (existing) return;
  const sc = doc.createElement("script");
  sc.id = "__studio-picker-script";
  sc.src = "/__studio/picker.js";
  sc.onload = () => {
    if (andStart) win.postMessage({ ns: "studio", type: "pick:start" }, window.location.origin);
  };
  doc.head.appendChild(sc);
}

function sendPickStop() {
  try {
    if (frameEl.contentWindow && frameEl.contentWindow.__studioPicker) {
      frameEl.contentWindow.postMessage({ ns: "studio", type: "pick:stop" }, window.location.origin);
    }
  } catch { /* 무시 */ }
}

function layoutFrame() {
  if (!cfg) return;
  const pad = 28;
  const availW = Math.max(320, canvasEl.clientWidth - pad);
  const availH = Math.max(320, canvasEl.clientHeight - pad);
  const dW = (cfg.viewports && cfg.viewports.d) || 1440;
  const mW = (cfg.viewports && cfg.viewports.m) || 390;

  if (curVp === "m") {
    frameBox.style.width = `${mW}px`;
    frameBox.style.height = `${availH}px`;
    frameEl.style.width = `${mW}px`;
    frameEl.style.height = `${availH}px`;
    frameEl.style.transform = "none";
  } else {
    const scale = Math.min(1, availW / dW);
    const boxW = Math.round(dW * scale);
    const innerH = Math.max(600, Math.round(availH / scale));
    frameBox.style.width = `${boxW}px`;
    frameBox.style.height = `${availH}px`;
    frameEl.style.width = `${dW}px`;
    frameEl.style.height = `${innerH}px`;
    frameEl.style.transform = scale < 1 ? `scale(${scale})` : "none";
  }
}

function targetUrl(preview) {
  const base = (cfg && cfg.appPath) || "/";
  if (!preview) return base;
  if (preview.startsWith("#")) return base + preview;
  if (preview.startsWith("/")) return preview;
  return base.replace(/\/?$/, "/") + preview;
}

function navigateFrame(screen, forceReload = false) {
  const preview = screen.preview;
  if (!preview) return;
  const full = targetUrl(preview);
  siteLink.href = full;

  if (!forceReload && frameLoadedOnce && preview.startsWith("#")) {
    try {
      const win = frameEl.contentWindow;
      const basePath = new URL((cfg && cfg.appPath) || "/", window.location.origin).pathname;
      if (win && win.location.pathname === basePath) {
        if (win.location.hash !== preview) {
          win.location.hash = preview;
        }
        const id = preview.slice(1);
        requestAnimationFrame(() => {
          try {
            const el = id ? win.document.getElementById(id) : null;
            if (el) el.scrollIntoView({ block: "start" });
            else if (id === "top") win.scrollTo(0, 0);
          } catch { /* 무시 */ }
          applyThemeToFrame();
        });
        return;
      }
    } catch { /* 전체 로드 폴백 */ }
  }

  frameEl.src = full;
}

function renderNav() {
  navEl.innerHTML = "";
  const q = filterText.trim().toLowerCase();
  const list = q
    ? visibleScreens.filter((s) => (s.title + " " + s.route + " " + (s.preview || "")).toLowerCase().includes(q))
    : visibleScreens;

  for (const grp of cfg.groups || []) {
    const items = list.filter((s) => s.group === grp.id);
    const sec = document.createElement("div");
    sec.className = "st-grp";

    const head = document.createElement("div");
    head.className = "st-grp-head";
    const hn = document.createElement("span");
    hn.textContent = grp.name;
    const hc = document.createElement("span");
    hc.textContent = String(items.length);
    head.append(hn, hc);
    sec.appendChild(head);

    const ul = document.createElement("ul");
    ul.className = "st-list";
    for (const s of items) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "st-item-btn";
      btn.dataset.route = s.preview || s.route;
      if (!s.preview) {
        btn.disabled = true;
      } else if (curScreen && curScreen.route === s.route) {
        btn.setAttribute("aria-current", "page");
      }

      const top = document.createElement("span");
      top.className = "st-item-top";
      const nameWrap = document.createElement("span");
      nameWrap.className = "st-item-name";

      if (s.status === "고칠 것" || s.status === "새로") {
        const dot = document.createElement("i");
        dot.className = "st-dot " + (s.status === "고칠 것" ? "st-dot-fix" : "st-dot-new");
        dot.title = s.status;
        nameWrap.appendChild(dot);
      }

      const titleTxt = document.createElement("span");
      titleTxt.textContent = s.title;
      nameWrap.appendChild(titleTxt);
      top.appendChild(nameWrap);

      if (s.required) {
        const req = document.createElement("span");
        req.className = "st-req";
        req.textContent = "필수";
        top.appendChild(req);
      }

      const sub = document.createElement("span");
      sub.className = "st-item-sub";
      sub.textContent = s.preview ? s.route : `${s.route} · 예시 주소 필요`;

      btn.append(top, sub);
      btn.addEventListener("click", () => {
        if (!s.preview) return;
        curScreen = s;
        panel.clearBlockOnRouteChange();
        writeStudioHash();
        renderNav();
        navigateFrame(s, false);
      });

      li.appendChild(btn);
      ul.appendChild(li);
    }
    sec.appendChild(ul);
    navEl.appendChild(sec);
  }
}

function setViewport(vp) {
  curVp = vp === "m" ? "m" : "d";
  vpDEl.setAttribute("aria-pressed", curVp === "d" ? "true" : "false");
  vpMEl.setAttribute("aria-pressed", curVp === "m" ? "true" : "false");
  layoutFrame();
  writeStudioHash();
}

async function boot() {
  panel = initPanel({
    getState: () => ({
      screen: curScreen || { title: "홈", route: "#home", preview: "#home" },
      viewport: curVp,
      viewports: (cfg && cfg.viewports) || { d: 1440, m: 390 },
      theme: currentTheme(),
    }),
    onPickToggle: (on) => {
      if (on) ensurePickerInFrame(true);
      else sendPickStop();
    },
    onPickDone: () => {
      sendPickStop();
    },
    onThemeSelect: (tid) => {
      curThemeId = tid;
      panel.renderThemes(cfg.themes || [], curThemeId);
      applyThemeToFrame();
      writeStudioHash();
    },
  });

  let res, data;
  try {
    res = await fetch("/__studio/api/config");
    data = await res.json();
  } catch (e) {
    res = { ok: false };
    data = { error: "설정을 불러오지 못했어요: " + (e && e.message ? e.message : String(e)) };
  }

  if (!res.ok || data.error) {
    canvasEl.hidden = true;
    errorEl.hidden = false;
    errorEl.textContent = data.error || "스튜디오 설정을 읽지 못했어요.";
    return;
  }

  cfg = data;
  visibleScreens = (cfg.screens || []).filter((s) => s.enabled !== false);
  projEl.textContent = cfg.project || "검수 스튜디오";
  document.title = `${cfg.project} · 검수 스튜디오`;

  const dW = (cfg.viewports && cfg.viewports.d) || 1440;
  const mW = (cfg.viewports && cfg.viewports.m) || 390;
  vpDEl.textContent = `데스크톱 ${dW}`;
  vpMEl.textContent = `모바일 ${mW}`;

  const m = cfg.meta || { count: visibleScreens.length, missingPreview: 0, skipped: 0 };
  metaEl.textContent = `화면 ${m.count}개 · 예시 주소 필요 ${m.missingPreview}개 · 건너뜀 ${m.skipped}개`;

  const stHash = parseStudioHash();
  curVp = stHash.v;
  const validThemes = cfg.themes || [];
  curThemeId = validThemes.some((t) => t.id === stHash.t)
    ? stHash.t
    : (validThemes[0] ? validThemes[0].id : "");

  curScreen = visibleScreens.find((s) => s.preview && (s.preview === stHash.s || s.route === stHash.s))
    || visibleScreens.find((s) => s.preview)
    || visibleScreens[0];

  panel.renderThemes(validThemes, curThemeId);
  setViewport(curVp);
  renderNav();
  writeStudioHash();

  frameEl.addEventListener("load", () => {
    frameLoadedOnce = true;
    applyThemeToFrame();
    if (panel.isPicking()) ensurePickerInFrame(true);
  });

  if (curScreen && curScreen.preview) {
    navigateFrame(curScreen, true);
  }

  new ResizeObserver(() => layoutFrame()).observe(canvasEl);
}

vpDEl.addEventListener("click", () => setViewport("d"));
vpMEl.addEventListener("click", () => setViewport("m"));
reloadBtn.addEventListener("click", () => {
  if (curScreen) navigateFrame(curScreen, true);
});
openTabBtn.addEventListener("click", () => {
  if (curScreen && curScreen.preview) window.open(targetUrl(curScreen.preview), "_blank", "noopener");
});
filterEl.addEventListener("input", () => {
  filterText = filterEl.value;
  renderNav();
});

boot();
