import { Link2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLms } from "@/lib/lms-store";
import type { AdminMenuId } from "@/lib/lms-types";
import { AdminViewsCompletions } from "@/sections/admin-views-completions";

export function AdminViewsPartB({
  menu,
  onNavigate,
  selectedAdminId,
  onSelectAdmin,
}: {
  menu: AdminMenuId;
  onNavigate: (m: AdminMenuId) => void;
  selectedAdminId: string;
  onSelectAdmin: (id: string) => void;
}) {
  const { corps, admins, auditLogs, toggleCorpAutoOpen } = useLms();

  if (menu === "corp-completions" || menu === "qna-history" || menu === "payments-revenue") {
    return <AdminViewsCompletions menu={menu} />;
  }

  /* 8. 관리자 현황 */
  if (menu === "admin-overview") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["전체 운영 관리자", `${admins.length}명`, "등급별 권한 분리 운영"],
            ["활동중 관리자", `${admins.filter((a) => a.status === "활동중").length}명`, "실시간 접속 · 처리 가능"],
            ["누적 업무 처리", `${admins.reduce((s, a) => s + a.handledCount, 0)}건`, "강의오픈 · 수료증 · Q&A"],
            ["감사 로그 기록", `${auditLogs.length}건`, "전 작업 이력 자동 추적"],
          ].map(([label, val, sub]) => (
            <Card key={label} className="py-4">
              <CardHeader className="px-5 pb-1">
                <CardDescription className="text-xs font-semibold">{label}</CardDescription>
                <CardTitle className="text-2xl font-extrabold">{val}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 text-xs text-muted-foreground">{sub}</CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-5">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="text-base font-extrabold">관리자 등급별 역할 및 책임 현황</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 sm:grid-cols-2">
            {admins.map((a) => (
              <div key={a.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/15 text-primary">{a.grade}</Badge>
                  <span className="text-xs text-muted-foreground">누적 처리 {a.handledCount}건</span>
                </div>
                <p className="mt-2 font-extrabold">
                  {a.name} <span className="text-xs font-normal text-muted-foreground">({a.department})</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">보유 권한: {a.permissions.join(" · ")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  /* 9. 관리자 목록 */
  if (menu === "admin-list") {
    return (
      <Card className="py-5">
        <CardHeader className="px-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
            <ShieldCheck className="size-5 text-primary" />
            관리자 목록 ({admins.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs text-muted-foreground">
                <tr>
                  <th className="py-2.5">이름 (이메일)</th>
                  <th className="py-2.5">등급 · 부서</th>
                  <th className="py-2.5">상태</th>
                  <th className="py-2.5">최근 접속</th>
                  <th className="py-2.5">처리 건수</th>
                  <th className="py-2.5">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 font-bold">
                      {a.name} <span className="text-xs font-normal text-muted-foreground">({a.email})</span>
                    </td>
                    <td className="py-3 text-xs">
                      {a.grade} · {a.department}
                    </td>
                    <td className="py-3">
                      <Badge variant={a.status === "활동중" ? "default" : "outline"}>{a.status}</Badge>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{a.lastLogin}</td>
                    <td className="py-3 font-semibold">{a.handledCount}건</td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onSelectAdmin(a.id);
                          onNavigate("admin-detail");
                        }}
                      >
                        상세 · 업무이력 →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* 10. 관리자 상세와 업무 이력 */
  if (menu === "admin-detail") {
    const adm = admins.find((a) => a.id === selectedAdminId) ?? admins[0];
    return (
      <div className="space-y-6">
        <Card className="py-5">
          <CardHeader className="px-6 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-extrabold">
                  관리자 상세 — {adm.name} ({adm.grade})
                </CardTitle>
                <CardDescription>
                  이메일: {adm.email} · 소속: {adm.department} · 최근 로그인: {adm.lastLogin}
                </CardDescription>
              </div>
              <select
                aria-label="조회할 관리자 선택"
                value={adm.id}
                onChange={(e) => onSelectAdmin(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-xs font-bold"
              >
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.grade})
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-wrap gap-2">
              {adm.permissions.map((p) => (
                <Badge key={p} variant="outline" className="px-3 py-1">
                  ✓ {p}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="text-base font-extrabold">관리자 전체 업무 처리 이력 (Audit Log)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 px-6">
            {auditLogs.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3.5 text-sm">
                <div>
                  <span className="font-bold text-primary">[{l.actionType}]</span>{" "}
                  <span className="font-semibold">{l.target}</span>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.detail}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">{l.adminName}</p>
                  <p>{l.createdAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  /* 11. 전체 기업 고객과 연동 상태 */
  return (
    <Card className="py-5">
      <CardHeader className="px-6 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
          <Link2 className="size-5 text-primary" />
          전체 기업 고객과 연동 상태 (전용 폼 · 아이디 자동 오픈 스위치)
        </CardTitle>
        <CardDescription>
          기업별 전용 신청 링크(`#apply?corp=기업코드`)에 수강생이 아이디를 입력했을 때 강의를 자동 오픈할지 제어합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6">
        {corps.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold">{c.name}</h4>
                <Badge variant={c.autoOpenEnabled ? "default" : "outline"}>{c.integrationStatus}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                전용 코드: <code className="font-mono text-foreground">{c.code}</code> · 계약 기간: {c.contractPeriod} · 연결 과정 {c.allowedCourseIds.length}개
              </p>
            </div>
            <Button
              size="sm"
              variant={c.autoOpenEnabled ? "default" : "outline"}
              onClick={() => toggleCorpAutoOpen(c.id)}
            >
              {c.autoOpenEnabled ? "자동 강의 오픈 ON (활성)" : "자동 강의 오픈 OFF (수동대기)"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
