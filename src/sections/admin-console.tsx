import { useEffect, useState } from "react";
import { Database, LayoutGrid, RotateCcw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUPABASE_CONFIG, useLms } from "@/lib/lms-store";
import type { AdminMenuId } from "@/lib/lms-types";
import { cn } from "@/lib/utils";
import { AdminViewsPartA } from "@/sections/admin-views-a";
import { AdminViewsPartB } from "@/sections/admin-views-b";

const ADMIN_MENUS: { id: AdminMenuId; no: string; label: string; group: string }[] = [
  { id: "dashboard", no: "01", label: "운영 현황 대시보드", group: "운영 · 인프라" },
  { id: "contents", no: "02", label: "교육 과정 관리", group: "운영 · 인프라" },
  { id: "host-plan", no: "03", label: "호스트와 요금제 현황", group: "운영 · 인프라" },
  { id: "subscriptions", no: "04", label: "기업 구독 관리", group: "구독 · 매출" },
  { id: "accounts", no: "05", label: "가입 계정 목록", group: "계정 · 역할" },
  { id: "account-detail", no: "06", label: "계정 상세와 역할", group: "계정 · 역할" },
  { id: "corporations", no: "07", label: "계약 법인 관리", group: "기업 · 수료증" },
  { id: "admin-overview", no: "08", label: "관리자 현황", group: "관리자 · 이력" },
  { id: "admin-list", no: "09", label: "관리자 목록", group: "관리자 · 이력" },
  { id: "admin-detail", no: "10", label: "관리자 업무 이력", group: "관리자 · 이력" },
  { id: "corp-integration", no: "11", label: "기업 연동 상태", group: "기업 · 수료증" },
  { id: "corp-completions", no: "12", label: "교육 이수 · 수료증 출력", group: "기업 · 수료증" },
  { id: "qna-history", no: "13", label: "Q&A 문의 이력", group: "운영 · 인프라" },
  { id: "payments-revenue", no: "14", label: "결제 내역과 매출", group: "구독 · 매출" },
];

const PART_A_IDS: AdminMenuId[] = [
  "dashboard",
  "contents",
  "host-plan",
  "subscriptions",
  "accounts",
  "account-detail",
  "corporations",
];

export function AdminConsole({ onGoLms }: { onGoLms: () => void }) {
  const { users, admins, syncStatus, resetDemoData } = useLms();
  const [menu, setMenu] = useState<AdminMenuId>(() => {
    const sub = window.location.hash.replace(/^#admin\/?/, "");
    return ADMIN_MENUS.some((m) => m.id === sub) ? (sub as AdminMenuId) : "dashboard";
  });
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "usr-101");
  const [selectedAdminId, setSelectedAdminId] = useState(admins[0]?.id ?? "adm-1");

  useEffect(() => {
    const syncSubMenu = () => {
      const sub = window.location.hash.replace(/^#admin\/?/, "");
      if (ADMIN_MENUS.some((m) => m.id === sub)) setMenu(sub as AdminMenuId);
    };
    window.addEventListener("hashchange", syncSubMenu);
    return () => window.removeEventListener("hashchange", syncSubMenu);
  }, []);

  const activeMenuObj = ADMIN_MENUS.find((m) => m.id === menu) ?? ADMIN_MENUS[0];

  return (
    <section id="admin" className="bg-muted/10 py-10 md:py-14">
      <div className="container break-keep">
        {/* 상단 관리자 헤더 */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 md:flex-row md:items-center">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Shield className="size-3.5" />
                관리자 콘솔
              </Badge>
              <button
                type="button"
                onClick={() => setMenu("host-plan")}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-primary sm:min-h-8 sm:py-1"
              >
                <Database className="size-3.5 text-primary" />
                {SUPABASE_CONFIG.isConnected ? `DB 연결됨 (${syncStatus})` : "DB 연결 설정"}
              </button>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
              {activeMenuObj.label}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="min-h-11 gap-1.5 px-3.5 font-bold sm:min-h-9">
              <a href="#__studio">
                <LayoutGrid className="size-3.5" />
                화면 검수 스튜디오 (DOM 메모)
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={onGoLms} className="min-h-11 px-3.5 font-semibold sm:min-h-9">
              ← 온라인 강의실 보기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm("관리자 콘솔 데이터를 초기 상태로 되돌릴까요?")) resetDemoData();
              }}
              className="min-h-11 gap-1.5 px-3 text-xs text-muted-foreground sm:min-h-9"
            >
              <RotateCcw className="size-3.5" />
              초기화
            </Button>
          </div>
        </div>

        {/* 모바일(<lg)에서는 14개 메뉴를 드롭다운으로 압축해 본문 접근성 개선 */}
        <div className="mb-5 rounded-2xl border bg-card p-4 lg:hidden">
          <label htmlFor="admin-mobile-menu" className="mb-1.5 block text-xs font-bold text-muted-foreground">
            관리 메뉴 이동 (14개)
          </label>
          <select
            id="admin-mobile-menu"
            value={menu}
            onChange={(e) => setMenu(e.target.value as AdminMenuId)}
            className="h-11 w-full rounded-lg border bg-background px-3 text-sm font-bold"
          >
            {ADMIN_MENUS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.no}. {m.label} ({m.group})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden rounded-2xl border bg-card p-3 lg:block">
            <p className="px-3 py-2 text-[11px] font-bold tracking-wider text-muted-foreground">관리 메뉴</p>
            <nav className="space-y-1" aria-label="관리자 콘솔 메뉴">
              {ADMIN_MENUS.map((m) => {
                const active = m.id === menu;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMenu(m.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                      active ? "bg-primary font-bold text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="font-mono text-[11px] opacity-75">{m.no}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            {PART_A_IDS.includes(menu) ? (
              <AdminViewsPartA
                menu={menu}
                onNavigate={setMenu}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            ) : (
              <AdminViewsPartB
                menu={menu}
                onNavigate={setMenu}
                selectedAdminId={selectedAdminId}
                onSelectAdmin={setSelectedAdminId}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
