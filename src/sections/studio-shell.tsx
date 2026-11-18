import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Copy, Monitor, Smartphone } from "lucide-react";
import { CEA_SCREENS, CEA_STUDIO_THEMES, type ScreenItem } from "@/data/screens-config";
import type { PickedBlockInfo } from "@/lib/studio-bridge";
import { cn } from "@/lib/utils";
import { StudioRightPanel, type StudioNote } from "@/sections/studio-panel";

const NOTES_KEY = "cea-studio-notes-v1";
const GROUPS: ScreenItem["group"][] = ["공개 화면", "회원 · 강의실", "관리자 콘솔", "안내 · 문의"];

function loadNotes(): StudioNote[] {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTES_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function StudioShell({ onExit }: { onExit: () => void }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [selectedId, setSelectedId] = useState<string>(CEA_SCREENS[0].id);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [filterQ, setFilterQ] = useState("");
  const [picking, setPicking] = useState(false);
  const [pickedBlock, setPickedBlock] = useState<PickedBlockInfo | null>(null);
  const [memo, setMemo] = useState("");
  const [themeId, setThemeId] = useState<string>(CEA_STUDIO_THEMES[0].id);
  const [notes, setNotes] = useState<StudioNote[]>(loadNotes);
  const [toastMsg, setToastMsg] = useState("");

  const currentScreen = useMemo(
    () => CEA_SCREENS.find((s) => s.id === selectedId) ?? CEA_SCREENS[0],
    [selectedId],
  );

  const filteredScreens = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    if (!q) return CEA_SCREENS;
    return CEA_SCREENS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.hash.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
    );
  }, [filterQ]);

  const initialSrc = useMemo(() => `${window.location.pathname}?studio_embed=1#top`, []);

  const postToFrame = (payload: Record<string, unknown>) => {
    const win = frameRef.current?.contentWindow;
    if (win) win.postMessage(payload, window.location.origin);
  };

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || !ev.data || typeof ev.data !== "object") return;
      const d = ev.data as { type?: string; block?: PickedBlockInfo; hash?: string };
      if (d.type === "STUDIO_BLOCK_PICKED" && d.block) {
        setPickedBlock(d.block);
        setPicking(false);
      } else if (d.type === "STUDIO_HASH_SYNC" && typeof d.hash === "string") {
        const hit = CEA_SCREENS.find((s) => s.hash === d.hash);
        if (hit) setSelectedId(hit.id);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const selectScreen = (item: ScreenItem) => {
    setSelectedId(item.id);
    setPickedBlock(null);
    setPicking(false);
    postToFrame({ type: "STUDIO_PICK_MODE", active: false });
    postToFrame({ type: "STUDIO_NAV", hash: item.hash });
  };

  const togglePick = () => {
    const next = !picking;
    setPicking(next);
    postToFrame({ type: "STUDIO_PICK_MODE", active: next });
  };

  const applyTheme = (id: string) => {
    setThemeId(id);
    const preset = CEA_STUDIO_THEMES.find((t) => t.id === id);
    if (preset) postToFrame({ type: "STUDIO_THEME", vars: preset.vars });
  };

  const flashToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 2400);
  };

  const copyText = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  const saveEditRequest = async () => {
    const clean = memo.trim();
    if (!clean) {
      flashToast("고칠 내용을 한 줄 이상 적어 주세요.");
      return;
    }
    const blockLabel = pickedBlock ? pickedBlock.label : "화면 전체";
    const entry: StudioNote = {
      id: Date.now().toString(36),
      at: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      screenTitle: currentScreen.title,
      hash: currentScreen.hash,
      block: blockLabel,
      text: clean,
    };
    const next = [entry, ...notes].slice(0, 30);
    setNotes(next);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch { /* 저장 불가 환경 무시 */ }
    const formatted = `[CEA 화면 수정 지시]\n- 화면: ${entry.screenTitle} (${entry.hash})\n- 블록: ${entry.block}\n- 요청: ${entry.text}`;
    await copyText(formatted);
    setMemo("");
    flashToast("수정 지시를 저장하고 클립보드에 복사했어요.");
  };

  const copyAllNotes = async () => {
    if (!notes.length) return;
    const all = notes
      .map((n, i) => `${i + 1}. [${n.screenTitle} ${n.hash} | ${n.block}] ${n.text}`)
      .join("\n");
    await copyText(`# CEA 스튜디오 수정 요청 모음 (${notes.length}건)\n${all}`);
    flashToast(`전체 ${notes.length}건 지시서를 복사했어요.`);
  };

  const removeNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch { /* 무시 */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b101b] text-slate-100" data-studio-root="1">
      {/* 상단 바: 사이트 나가기 · 데스크톱/모바일 토글 · 전체 지시 복사 */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0d1322] px-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="size-3.5" />
            CEA 플랫폼
          </button>
          <div className="flex items-center rounded-md border border-slate-700 bg-slate-900 p-0.5" role="group" aria-label="미리보기 화면 크기">
            <button
              type="button"
              data-studio-vp="desktop"
              aria-pressed={viewport === "desktop"}
              onClick={() => setViewport("desktop")}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-bold transition-colors",
                viewport === "desktop" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white",
              )}
            >
              <Monitor className="size-3.5" />
              데스크톱
            </button>
            <button
              type="button"
              data-studio-vp="mobile"
              aria-pressed={viewport === "mobile"}
              onClick={() => setViewport("mobile")}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-bold transition-colors",
                viewport === "mobile" ? "bg-white text-slate-950" : "text-slate-400 hover:text-white",
              )}
            >
              <Smartphone className="size-3.5" />
              모바일 (390px)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-slate-400 md:inline">
            현재: <strong className="text-slate-200">{currentScreen.title}</strong> ({currentScreen.hash})
          </span>
          {notes.length > 0 && (
            <button
              type="button"
              onClick={copyAllNotes}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 text-xs font-bold text-slate-100 hover:bg-slate-700"
            >
              <Copy className="size-3.5" />
              모아둔 지시 복사 ({notes.length})
            </button>
          )}
        </div>
      </header>

      {/* 본문 3단 레이아웃: 좌측 페이지 목록 / 중앙 미리보기 / 우측 편집·테마 */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)_310px]">
        {/* 좌측: 페이지 목록 */}
        <aside className="flex min-h-0 flex-col border-b border-slate-800 bg-[#0d1322] lg:border-r lg:border-b-0" aria-label="페이지 목록">
          <div className="border-b border-slate-800 p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200">페이지 목록 ({CEA_SCREENS.length})</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">A안 스튜디오</span>
            </div>
            <input
              type="search"
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="화면·주소 검색…"
              aria-label="페이지 목록 검색"
              className="h-8 w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <nav className="flex-1 overflow-y-auto p-2" aria-label="전체 화면 탐색">
            {GROUPS.map((grp) => {
              const items = filteredScreens.filter((s) => s.group === grp);
              if (!items.length) return null;
              return (
                <div key={grp} className="mb-3">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-500">{grp}</div>
                  <ul className="space-y-0.5">
                    {items.map((item) => {
                      const on = item.id === currentScreen.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            data-studio-screen={item.id}
                            onClick={() => selectScreen(item)}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                              on ? "bg-slate-800 font-bold text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                            )}
                          >
                            <span className="truncate">{item.title}</span>
                            <span className="shrink-0 text-[10px] text-slate-500">{item.status}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* 중앙: 실시간 iframe 미리보기 */}
        <section className="flex min-h-[420px] flex-col overflow-hidden bg-[#141b2d]">
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#101727] px-4 py-1.5 text-[11px] text-slate-400">
            <span className="truncate">
              <strong className="mr-1.5 text-slate-200">실시간 미리보기</strong>
              {currentScreen.desc}
            </span>
            <a
              href={currentScreen.hash}
              onClick={onExit}
              className="shrink-0 font-semibold text-slate-300 underline underline-offset-2 hover:text-white"
            >
              단독 창으로 열기
            </a>
          </div>

          <div className="flex flex-1 items-start justify-center overflow-auto p-3 md:p-5">
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-slate-700 bg-background shadow-2xl transition-all duration-200",
                viewport === "mobile" ? "h-[844px] w-[390px] shrink-0" : "h-full min-h-[640px] w-full max-w-[1440px]",
              )}
            >
              <iframe
                ref={frameRef}
                title="CEA 화면 실시간 미리보기"
                src={initialSrc}
                onLoad={() => {
                  postToFrame({ type: "STUDIO_NAV", hash: currentScreen.hash });
                  const preset = CEA_STUDIO_THEMES.find((t) => t.id === themeId);
                  if (preset) postToFrame({ type: "STUDIO_THEME", vars: preset.vars });
                }}
                className="h-full w-full border-0 bg-white"
              />
            </div>
          </div>
        </section>

        <StudioRightPanel
          currentScreen={currentScreen}
          picking={picking}
          pickedBlock={pickedBlock}
          memo={memo}
          themeId={themeId}
          notes={notes}
          toastMsg={toastMsg}
          onTogglePick={togglePick}
          onClearPicked={() => setPickedBlock(null)}
          onMemoChange={setMemo}
          onSaveRequest={saveEditRequest}
          onApplyTheme={applyTheme}
          onCopyAll={copyAllNotes}
          onRemoveNote={removeNote}
        />
      </div>
    </div>
  );
}
