/* studio v1.0 — 공통 파일. 사이트별로 고치지 않고, 바꾸면 고수템·CEA 둘 다 같이 */
export function initPanel(ctx) {
  const pickBtn = document.getElementById("st-pick-btn");
  const pickChip = document.getElementById("st-pick-chip");
  const pickText = document.getElementById("st-pick-text");
  const pickClear = document.getElementById("st-pick-clear");
  const pickHint = document.getElementById("st-pick-hint");
  const memoEl = document.getElementById("st-memo");
  const submitBtn = document.getElementById("st-submit");
  const resultEl = document.getElementById("st-result");
  const clipFb = document.getElementById("st-clip-fb");
  const sessionList = document.getElementById("st-session-list");
  const themesWrap = document.getElementById("st-themes");

  let picking = false;
  let picked = null;

  function renderPicked() {
    pickBtn.setAttribute("aria-pressed", picking ? "true" : "false");
    pickBtn.textContent = picking ? "미리보기에서 블록을 누르세요 (Esc 취소 · ↑ 바깥)" : "미리보기에서 블록 고르기";
    if (picked) {
      pickChip.hidden = false;
      pickHint.hidden = true;
      pickText.textContent = `${picked.label} (${picked.selector})`;
    } else {
      pickChip.hidden = true;
      pickHint.hidden = false;
      pickText.textContent = "";
    }
  }

  function setPicking(on) {
    picking = Boolean(on);
    renderPicked();
    ctx.onPickToggle(picking);
  }

  pickBtn.addEventListener("click", () => {
    setPicking(!picking);
  });

  pickClear.addEventListener("click", () => {
    picked = null;
    renderPicked();
  });

  memoEl.addEventListener("input", () => {
    submitBtn.disabled = !memoEl.value.trim();
  });

  window.addEventListener("message", (ev) => {
    if (ev.origin !== window.location.origin) return;
    const d = ev.data;
    if (!d || d.ns !== "studio") return;
    if (d.type === "pick") {
      picking = false;
      picked = { label: d.label || "블록", selector: d.selector || "", text: d.text || "" };
      renderPicked();
      ctx.onPickDone();
      memoEl.focus();
    } else if (d.type === "pick:cancel") {
      picking = false;
      renderPicked();
      ctx.onPickDone();
    }
  });

  async function tryCopy(lines) {
    clipFb.hidden = true;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        throw new Error("no-clipboard");
      }
      await navigator.clipboard.writeText(lines);
      return true;
    } catch {
      clipFb.value = lines;
      clipFb.hidden = false;
      clipFb.focus();
      clipFb.select();
      try { document.execCommand("copy"); } catch { /* 수동 선택 유지 */ }
      return false;
    }
  }

  function addSessionRow(idLabel, screen, block, text) {
    const li = document.createElement("li");
    li.className = "st-session-item";
    const head = document.createElement("div");
    head.className = "st-session-head";
    head.textContent = `${idLabel} · ${screen.title} (${screen.preview || screen.route}) · ${block ? block.label : "화면 전체"}`;
    const body = document.createElement("div");
    body.textContent = text;
    li.append(head, body);
    sessionList.prepend(li);
  }

  submitBtn.addEventListener("click", async () => {
    const text = memoEl.value.trim();
    if (!text) return;
    const st = ctx.getState();
    const vpLabel = st.viewport === "m" ? `모바일 ${st.viewports.m}` : `데스크톱 ${st.viewports.d}`;
    const themeName = st.theme ? st.theme.name : "기본";
    const routeCode = st.screen.preview || st.screen.route;
    const blockLine = picked ? `${picked.label} (${picked.selector})` : "화면 전체";

    const clipText = [
      `[화면] ${st.screen.title} \`${routeCode}\` · ${vpLabel} · 테마 ${themeName}`,
      `[블록] ${blockLine}`,
      `[수정 지시] ${text}`,
    ].join("\n");

    submitBtn.disabled = true;
    await tryCopy(clipText);

    try {
      const res = await fetch("/__studio/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: routeCode,
          title: st.screen.title,
          viewport: st.viewport,
          theme: themeName,
          block: picked ? { label: picked.label, selector: picked.selector } : null,
          text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      resultEl.className = data.warn ? "st-result st-warn" : "st-result";
      resultEl.textContent = `${data.id}로 큐에 넣고 복사했어요` + (data.warn ? ` (${data.warn})` : "");
      addSessionRow(data.id, st.screen, picked, text);
      memoEl.value = "";
      submitBtn.disabled = true;
    } catch (e) {
      const reason = e && e.message ? e.message : "연결 끊김";
      resultEl.className = "st-result st-warn";
      resultEl.textContent = `복사만 됐어요(큐 저장 실패: ${reason})`;
      addSessionRow("복사됨", st.screen, picked, text);
      submitBtn.disabled = !memoEl.value.trim();
    }
  });

  function renderThemes(themes, activeId) {
    themesWrap.innerHTML = "";
    for (const th of themes) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "st-theme-btn";
      btn.dataset.themeId = th.id;
      btn.setAttribute("aria-pressed", th.id === activeId ? "true" : "false");
      const nameSpan = document.createElement("span");
      nameSpan.textContent = th.name;
      btn.appendChild(nameSpan);
      btn.addEventListener("click", () => {
        ctx.onThemeSelect(th.id);
      });
      themesWrap.appendChild(btn);
    }
  }

  return {
    isPicking: () => picking,
    clearBlockOnRouteChange: () => {
      picked = null;
      renderPicked();
    },
    renderThemes,
  };
}
