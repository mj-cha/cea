import { useEffect } from "react";

export interface PickedBlockInfo {
  selector: string;
  label: string;
  snippet: string;
}

const APPLIED_KEYS: string[] = [];

function describeElement(el: HTMLElement): PickedBlockInfo {
  const sec = el.closest("section[id], header, footer, [data-block], article, .rounded-2xl") as HTMLElement | null;
  const target = sec ?? el;
  const idPart = target.id ? `#${target.id}` : target.tagName.toLowerCase();
  const heading = target.querySelector("h1, h2, h3, h4")?.textContent?.trim().slice(0, 36) ?? "";
  const text = (target.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
  return {
    selector: idPart,
    label: heading ? `${idPart} · ${heading}` : idPart,
    snippet: text,
  };
}

/** 스튜디오 iframe 안에서 실행되는 브리지 훅 (블록 선택 · 해시 이동 · 테마 프리셋 실시간 반영) */
export function useStudioChildBridge() {
  useEffect(() => {
    const isEmbed = new URLSearchParams(window.location.search).get("studio_embed") === "1";
    if (!isEmbed) return;

    let picking = false;
    let hovered: HTMLElement | null = null;

    const clearHover = () => {
      if (hovered) {
        hovered.style.removeProperty("outline");
        hovered.style.removeProperty("outline-offset");
        hovered = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!picking) return;
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const cand = (t.closest("section[id], header, footer, article, .rounded-2xl") as HTMLElement | null) ?? t;
      if (cand === hovered) return;
      clearHover();
      hovered = cand;
      hovered.style.outline = "2px solid #f97316";
      hovered.style.outlineOffset = "2px";
    };

    const onClick = (e: MouseEvent) => {
      if (!picking) return;
      e.preventDefault();
      e.stopPropagation();
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const info = describeElement(t);
      picking = false;
      clearHover();
      document.body.style.removeProperty("cursor");
      window.parent.postMessage({ type: "STUDIO_BLOCK_PICKED", block: info }, window.location.origin);
    };

    const onMsg = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || !ev.data || typeof ev.data !== "object") return;
      const d = ev.data as { type?: string; hash?: string; active?: boolean; vars?: Record<string, string> };

      if (d.type === "STUDIO_NAV" && typeof d.hash === "string") {
        window.location.hash = d.hash;
        const cleanId = d.hash.replace(/^#/, "");
        requestAnimationFrame(() => {
          const el = document.getElementById(cleanId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          else if (cleanId === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else if (d.type === "STUDIO_PICK_MODE") {
        picking = Boolean(d.active);
        if (!picking) clearHover();
        document.body.style.cursor = picking ? "crosshair" : "";
      } else if (d.type === "STUDIO_THEME" && d.vars) {
        const root = document.documentElement;
        while (APPLIED_KEYS.length) {
          const k = APPLIED_KEYS.pop();
          if (k) root.style.removeProperty(k);
        }
        for (const [k, v] of Object.entries(d.vars)) {
          root.style.setProperty(k, v);
          APPLIED_KEYS.push(k);
        }
      }
    };

    const notifyHash = () => {
      window.parent.postMessage({ type: "STUDIO_HASH_SYNC", hash: window.location.hash || "#top" }, window.location.origin);
    };

    window.addEventListener("message", onMsg);
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", notifyHash);
    notifyHash();

    return () => {
      clearHover();
      window.removeEventListener("message", onMsg);
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", notifyHash);
    };
  }, []);
}
