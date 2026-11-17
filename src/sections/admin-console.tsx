import { useState } from "react";
import { Database, RotateCcw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUPABASE_CONFIG, useLms } from "@/lib/lms-store";
import type { AdminMenuId } from "@/lib/lms-types";
import { cn } from "@/lib/utils";
import { AdminViewsPartA } from "@/sections/admin-views-a";
import { AdminViewsPartB } from "@/sections/admin-views-b";

const ADMIN_MENUS: { id: AdminMenuId; no: string; label: string; group: string }[] = [
  { id: "dashboard", no: "01", label: "전체 운영 현황 대시보드", group: "운영 · 인프라" },
  { id: "contents", no: "02", label: "전체 컨텐츠 관리", group: "운영 · 인프라" },
  { id: "host-plan", no: "03", label: "호스트와 요금제 현황", group: "운영 · 인프라" },
  { id: "subscriptions", no: "04", label: "유료 구독 관리", group: "구독 · 매출" },
  { id: "accounts", no: "05", label: "가입 계정 목록", group: "계정 · 역할" },
  { id: "account-detail", no: "06", label: "계정 상세와 역할", group: "계정 · 역할" },
  { id: "corporations", no: "07", label: "기업별 법인", group: "기업 · 수료증" },
  { id: "admin-overview", no: "08", label: "관리자 현황", group: "관리자 · 이력" },
  { id: "admin-list", no: "09", label: "관리자 목록", group: "관리자 · 이력" },
  { id: "admin-detail", no: "10", label: "관리자 상세와 업무 이력", group: "관리자 · 이력" },
  { id: "corp-integration", no: "11", label: "전체 기업 고객과 연동 상태", group: "기업 · 수료증" },
  { id: "corp-completions", no: "12", label: "기업별 교육 이수 내역 (수료증)", group: "기업 · 수료증" },
  { id: "qna-history", no: "13", label: "Q&A 이력", group: "운영 · 인프라" },
  { id: "payments-revenue", no: "14", label: "결제 내역과 누적 매출", group: "구독 · 매출" },
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
  const { users, admins, resetDemoData } = useLms();
  const [menu, setMenu] = useState<AdminMenuId>("dashboard");
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "usr-101");
  const [selectedAdminId, setSelectedAdminId] = useState(admins[0]?.id ?? "adm-1");

  const activeMenuObj = ADMIN_MENUS.find((m) => m.id === menu) ?? ADMIN_MENUS[0];

  return (
    <section id="admin" className="border-t bg-muted/10 py-10 md:py-14">
      <div className="container">
        {/* 상단 관리자 헤더 */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 md:flex-row md:items-center">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Shield className="size-3.5" />
                CEA 통합 관리자 콘솔 (14대 운영 모듈)
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs">
                <Database className="size-3 text-primary" />
                {SUPABASE_CONFIG.isConnected
                  ? "Supabase 실서버 클라우드 연결됨"
                  : "Supabase 로컬 동기화 모드 (.env 설정 시 실서버 직결)"}
              </Badge>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
              {activeMenuObj.no}. {activeMenuObj.label}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={onGoLms} className="font-semibold">
              ← 수강생 강의실 · 기업 신청폼 보기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDemoData}
              className="gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              데모 데이터 초기화
            </Button>
          </div>
        </div>

        {/* 좌측 14개 메뉴 사이드바 + 우측 본문 */}
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-2xl border bg-card p-3">
            <p className="px-3 py-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              관리자 전체 메뉴 (14)
            </p>
            <nav className="space-y-1" aria-label="관리자 콘솔 14대 메뉴">
              {ADMIN_MENUS.map((m) => {
                const active = m.id === menu;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMenu(m.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
