import { Check, Crosshair, Sparkles, Trash2 } from "lucide-react";
import { CEA_STUDIO_THEMES, type ScreenItem } from "@/data/screens-config";
import type { PickedBlockInfo } from "@/lib/studio-bridge";
import { cn } from "@/lib/utils";

export interface StudioNote {
  id: string;
  at: string;
  screenTitle: string;
  hash: string;
  block: string;
  text: string;
}

interface StudioRightPanelProps {
  currentScreen: ScreenItem;
  picking: boolean;
  pickedBlock: PickedBlockInfo | null;
  memo: string;
  themeId: string;
  notes: StudioNote[];
  toastMsg: string;
  onTogglePick: () => void;
  onClearPicked: () => void;
  onMemoChange: (v: string) => void;
  onSaveRequest: () => void;
  onApplyTheme: (id: string) => void;
  onCopyAll: () => void;
  onRemoveNote: (id: string) => void;
}

export function StudioRightPanel({
  currentScreen,
  picking,
  pickedBlock,
  memo,
  themeId,
  notes,
  toastMsg,
  onTogglePick,
  onClearPicked,
  onMemoChange,
  onSaveRequest,
  onApplyTheme,
  onCopyAll,
  onRemoveNote,
}: StudioRightPanelProps) {
  return (
    <aside className="flex min-h-0 flex-col overflow-y-auto border-t border-slate-800 bg-[#0d1322] p-3.5 lg:border-t-0 lg:border-l" aria-label="편집 및 디자인 패널">
      <div className="mb-4">
        <h2 className="mb-2 text-xs font-extrabold text-slate-200">페이지 고치기</h2>
        <button
          type="button"
          data-studio-pick="1"
          aria-pressed={picking}
          onClick={onTogglePick}
          className={cn(
            "mb-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-md border text-xs font-bold transition-colors",
            picking
              ? "border-orange-500 bg-orange-500/15 text-orange-300"
              : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800",
          )}
        >
          <Crosshair className="size-3.5" />
          {picking ? "미리보기에서 구역을 클릭하세요…" : "미리보기에서 블록 고르기"}
        </button>

        {pickedBlock ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-orange-500/40 bg-orange-500/10 px-2.5 py-1.5 text-[11px] text-orange-200">
            <span className="truncate font-semibold">선택됨: {pickedBlock.label}</span>
            <button type="button" onClick={onClearPicked} className="text-orange-300 hover:text-white" aria-label="블록 선택 해제">
              ×
            </button>
          </div>
        ) : (
          <p className="mb-2 text-[11px] text-slate-500">블록을 안 고르면 현재 화면({currentScreen.hash}) 전체를 고쳐요.</p>
        )}

        <textarea
          rows={4}
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          aria-label="페이지 수정 지시 입력"
          placeholder="예: 카드를 두 줄로 크게 보여 주고, 상담 버튼 문구를 더 또렷하게 바꿔 줘"
          className="mb-2 w-full rounded-md border border-slate-700 bg-slate-900 p-2.5 text-xs leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
        />

        <button
          type="button"
          data-studio-save="1"
          onClick={onSaveRequest}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-orange-500 text-xs font-extrabold text-white transition-colors hover:bg-orange-600"
        >
          <Sparkles className="size-3.5" />
          고치기 지시 복사 · 저장
        </button>
        {toastMsg && (
          <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-400" role="status">
            <Check className="size-3.5" />
            {toastMsg}
          </p>
        )}
      </div>

      <div className="mb-4 border-t border-slate-800 pt-3.5">
        <h2 className="mb-2 text-xs font-extrabold text-slate-200">디자인 · 테마 비교</h2>
        <div className="grid grid-cols-2 gap-2">
          {CEA_STUDIO_THEMES.map((th) => {
            const active = th.id === themeId;
            return (
              <button
                key={th.id}
                type="button"
                data-studio-theme={th.id}
                aria-pressed={active}
                onClick={() => onApplyTheme(th.id)}
                className={cn(
                  "overflow-hidden rounded-lg border text-left transition-all",
                  active ? "border-orange-500 ring-1 ring-orange-500" : "border-slate-700 hover:border-slate-500",
                )}
              >
                <div className="p-2.5" style={{ background: th.sampleBg, color: th.sampleInk }}>
                  <div className="text-xs font-extrabold">가나다 Aa</div>
                  <span
                    className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: th.sampleBtn, color: th.sampleBg }}
                  >
                    버튼
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 px-2 py-1.5 text-[11px]">
                  <span className="truncate font-semibold text-slate-200">{th.name}</span>
                  <span className="shrink-0 text-[10px] text-emerald-400">{th.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3.5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-200">저장한 수정 지시 ({notes.length})</h2>
          {notes.length > 0 && (
            <button type="button" onClick={onCopyAll} className="text-[11px] font-bold text-orange-400 hover:underline">
              전체 복사
            </button>
          )}
        </div>
        {notes.length === 0 ? (
          <p className="text-[11px] leading-relaxed text-slate-500">
            화면마다 고칠 점을 적어 두면 여기에 차곡차곡 쌓여요. 한 번에 복사해 Claude·Antigravity에게 붙여넣으세요.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-md border border-slate-800 bg-slate-900/90 p-2 text-[11px]">
                <div className="mb-1 flex items-center justify-between gap-1 text-slate-400">
                  <strong className="truncate text-slate-200">{n.screenTitle}</strong>
                  <button type="button" onClick={() => onRemoveNote(n.id)} aria-label="지시 삭제" className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="size-3" />
                  </button>
                </div>
                <div className="mb-1 text-[10px] text-orange-300">{n.block} · {n.at}</div>
                <p className="text-slate-200">{n.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
