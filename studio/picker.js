/* studio v1.0 — 공통 파일. 사이트별로 고치지 않고, 바꾸면 고수템·CEA 둘 다 같이 */
(function () {
  if (window.__studioPicker) return;
  window.__studioPicker = true;

  const CAND_SEL = "[data-block], section, header, footer, nav, aside, article, form, dialog, [role=dialog], [aria-label]";
  let active = false;
  let currentEl = null;

  function ensureOverlay() {
    let ov = document.getElementById("__studio-ov");
    if (ov) return ov;
    ov = document.createElement("div");
    ov.id = "__studio-ov";
    ov.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;border:2px solid #FF6A00;background:rgba(255,106,0,0.08);pointer-events:none;z-index:2147483646;display:none;box-sizing:border-box;";
    const badge = document.createElement("span");
    badge.id = "__studio-ov-label";
    badge.style.cssText = "position:absolute;left:-2px;top:-22px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#FF6A00;color:#fff;font:700 11px/18px Pretendard,sans-serif;padding:0 6px;border-radius:3px;";
    ov.appendChild(badge);
    document.documentElement.appendChild(ov);
    return ov;
  }

  function cleanClass(el) {
    if (!el.classList || !el.classList.length) return "";
    for (const c of el.classList) {
      if (/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(c)) return c;
    }
    return "";
  }

  function labelOf(el) {
    if (!el || el.nodeType !== 1) return "요소";
    const db = el.getAttribute("data-block");
    if (db && db.trim()) return db.trim().slice(0, 40);
    const al = el.getAttribute("aria-label");
    if (al && al.trim()) return al.trim().slice(0, 40);
    const h = el.querySelector("h1, h2, h3");
    if (h && h.textContent && h.textContent.trim()) return h.textContent.replace(/\s+/g, " ").trim().slice(0, 24);
    const tag = el.tagName.toLowerCase();
    const cls = cleanClass(el);
    return cls ? `${tag}.${cls}` : tag;
  }

  function selectorOf(el) {
    const parts = [];
    let cur = el;
    let depth = 0;
    while (cur && cur.nodeType === 1 && cur !== document.body && cur !== document.documentElement && depth < 4) {
      if (cur.id && /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(cur.id)) {
        parts.unshift(`#${cur.id}`);
        break;
      }
      const tag = cur.tagName.toLowerCase();
      const cls = cleanClass(cur);
      let nth = 1;
      if (cur.parentElement) {
        const sibs = [...cur.parentElement.children].filter((x) => x.tagName === cur.tagName);
        if (sibs.length > 1) nth = sibs.indexOf(cur) + 1;
      }
      parts.unshift(`${tag}${cls ? "." + cls : ""}:nth-of-type(${nth})`);
      cur = cur.parentElement;
      depth++;
    }
    return parts.join(" > ") || el.tagName.toLowerCase();
  }

  function findCandidate(raw) {
    let cur = raw && raw.nodeType === 1 ? raw : raw && raw.parentElement;
    if (!cur) return null;
    let step = 0;
    while (cur && cur !== document.body && cur !== document.documentElement && step < 8) {
      if (cur.id !== "__studio-ov" && cur.matches && cur.matches(CAND_SEL)) return cur;
      cur = cur.parentElement;
      step++;
    }
    return raw && raw.nodeType === 1 ? raw : null;
  }

  function drawOverlay(el) {
    const ov = ensureOverlay();
    if (!el || !active) {
      ov.style.display = "none";
      return;
    }
    const r = el.getBoundingClientRect();
    ov.style.display = "block";
    ov.style.left = `${Math.round(r.left)}px`;
    ov.style.top = `${Math.round(r.top)}px`;
    ov.style.width = `${Math.round(r.width)}px`;
    ov.style.height = `${Math.round(r.height)}px`;
    const lbl = ov.firstElementChild;
    if (lbl) {
      lbl.textContent = labelOf(el);
      lbl.style.top = r.top < 24 ? "2px" : "-22px";
    }
  }

  function stopPick(notifyCancel) {
    active = false;
    currentEl = null;
    document.documentElement.style.removeProperty("cursor");
    const ov = document.getElementById("__studio-ov");
    if (ov) ov.style.display = "none";
    if (notifyCancel) {
      window.parent.postMessage({ ns: "studio", type: "pick:cancel" }, window.location.origin);
    }
  }

  function startPick() {
    active = true;
    document.documentElement.style.cursor = "crosshair";
    ensureOverlay();
  }

  window.addEventListener("mousemove", (e) => {
    if (!active) return;
    const cand = findCandidate(e.target);
    if (cand && cand !== currentEl) {
      currentEl = cand;
    }
    drawOverlay(currentEl);
  }, true);

  window.addEventListener("scroll", () => {
    if (active && currentEl) drawOverlay(currentEl);
  }, true);

  window.addEventListener("pointerdown", (e) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);

  window.addEventListener("click", (e) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const target = currentEl || findCandidate(e.target);
    if (!target) return;
    const payload = {
      ns: "studio",
      type: "pick",
      label: labelOf(target),
      selector: selectorOf(target),
      text: (target.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      route: window.location.hash || "",
    };
    stopPick(false);
    window.parent.postMessage(payload, window.location.origin);
  }, true);

  window.addEventListener("keydown", (e) => {
    if (!active) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      stopPick(true);
    } else if (e.key === "ArrowUp" && currentEl) {
      e.preventDefault();
      e.stopPropagation();
      let p = currentEl.parentElement;
      while (p && p !== document.body && p !== document.documentElement) {
        if (p.matches && p.matches(CAND_SEL)) {
          currentEl = p;
          drawOverlay(currentEl);
          return;
        }
        p = p.parentElement;
      }
      if (currentEl.parentElement && currentEl.parentElement !== document.documentElement) {
        currentEl = currentEl.parentElement;
        drawOverlay(currentEl);
      }
    }
  }, true);

  window.addEventListener("message", (ev) => {
    if (ev.origin !== window.location.origin) return;
    const d = ev.data;
    if (!d || d.ns !== "studio") return;
    if (d.type === "pick:start") startPick();
    else if (d.type === "pick:stop") stopPick(false);
  });
})();
