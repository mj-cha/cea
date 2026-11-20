import { useState } from "react";
import { CheckCircle2, Copy, Database, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLms } from "@/lib/lms-store";
import type { AdminMenuId, UserRole } from "@/lib/lms-types";

export function AdminViewsAccounts({
  menu,
  onNavigate,
  selectedUserId,
  onSelectUser,
}: {
  menu: AdminMenuId;
  onNavigate: (m: AdminMenuId) => void;
  selectedUserId: string;
  onSelectUser: (id: string) => void;
}) {
  const { courseMedia, corps, users, bulkOpenCourses, updateUserRole } = useLms();
  const [bulkCorp, setBulkCorp] = useState(corps[0]?.code ?? "cea");
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  /* 5. 가입 계정 목록 (+ 일괄 아이디 강의 오픈) */
  if (menu === "accounts") {
    return (
      <div className="space-y-6">
        <Card className="border-primary/40 py-5">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-extrabold">
              <Sparkles className="size-4 text-primary" />
              기업 수강생 아이디 일괄 강의 오픈 (관리자 직접 입력)
            </CardTitle>
            <CardDescription className="text-xs">
              폼으로 접수된 임직원 아이디(이메일) 여러 개를 붙여넣으면 해당 기업의 계약 강의들이 일괄 오픈됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            <div className="space-y-2">
              <Label className="text-xs font-bold">대상 기업 선택</Label>
              <select
                aria-label="일괄 오픈 대상 기업"
                value={bulkCorp}
                onChange={(e) => setBulkCorp(e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm font-semibold"
              >
                {corps.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.name} (과정 {c.allowedCourseIds.length}개)
                  </option>
                ))}
              </select>
              <Button
                className="w-full font-bold"
                onClick={() => {
                  const target = corps.find((c) => c.code === bulkCorp);
                  const count = bulkOpenCourses(bulkCorp, bulkEmails, target?.allowedCourseIds ?? []);
                  if (count > 0) {
                    setBulkMsg(`✓ 총 ${count}개 아이디에 강의가 일괄 오픈되었습니다.`);
                    setBulkEmails("");
                  }
                }}
              >
                입력한 아이디 일괄 강의 오픈
              </Button>
              {bulkMsg && <p className="text-xs font-semibold text-primary">{bulkMsg}</p>}
            </div>
            <div>
              <Label className="text-xs font-bold">수강생 아이디(이메일) 목록 (줄바꿈 또는 쉼표로 구분)</Label>
              <Textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="by.yoo@cea.co.kr, mj.kim@cea.co.kr"
                className="mt-1.5 min-h-[92px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
              <Users className="size-5 text-primary" />
              가입 계정 목록 ({users.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2.5">성명 (아이디)</th>
                    <th className="py-2.5">소속 법인 · 부서</th>
                    <th className="py-2.5">역할</th>
                    <th className="py-2.5">오픈 과정</th>
                    <th className="py-2.5">발급 수료증</th>
                    <th className="py-2.5">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 font-bold">
                        {u.name} <span className="text-xs font-normal text-muted-foreground">({u.email})</span>
                      </td>
                      <td className="py-3 text-xs">
                        {u.corpName} · {u.department}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{u.role}</Badge>
                      </td>
                      <td className="py-3 font-semibold">{u.enrolledCourseIds.length}개 과정</td>
                      <td className="py-3 font-semibold text-primary">{Object.keys(u.certNumbers).length}건</td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onSelectUser(u.id);
                            onNavigate("account-detail");
                          }}
                        >
                          상세 · 역할 →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* 6. 계정 상세와 역할 */
  if (menu === "account-detail") {
    const user = users.find((u) => u.id === selectedUserId) ?? users[0];
    return (
      <Card className="py-5">
        <CardHeader className="px-6 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-extrabold">
                계정 상세와 역할 — {user.name} ({user.email})
              </CardTitle>
              <CardDescription>
                소속: {user.corpName} ({user.department}) · 가입일: {user.joinedAt}
              </CardDescription>
            </div>
            <select
              aria-label="조회할 계정 선택"
              value={user.id}
              onChange={(e) => onSelectUser(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-xs font-bold"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/20 p-4">
            <span className="text-xs font-bold">계정 역할(권한) 변경:</span>
            {(["수강생", "기업담당자", "강사", "관리자"] as UserRole[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={user.role === r ? "default" : "outline"}
                onClick={() => updateUserRole(user.id, r)}
              >
                {r}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold">오픈된 강의 및 진도율 · 수료 상태</h4>
            {user.enrolledCourseIds.map((cid) => {
              const cm = courseMedia.find((m) => m.courseId === cid);
              const pct = user.progress[cid] ?? 0;
              const cert = user.certNumbers[cid];
              return (
                <div key={cid} className="flex items-center justify-between rounded-xl border p-3.5 text-sm">
                  <div>
                    <p className="font-bold">{cm?.title ?? cid}</p>
                    <p className="text-xs text-muted-foreground">
                      수료일: {user.completedAt[cid] ?? "학습 진행 중"} · 증서번호: {cert ?? "-"}
                    </p>
                  </div>
                  <Badge variant={cert ? "default" : "outline"}>진도율 {pct}%</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  /* 7. 기업별 법인 */
  return (
    <Card className="py-5">
      <CardHeader className="px-6 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
          <Database className="size-5 text-primary" />
          기업별 법인 관리 (전용 가입·수강신청 링크 발급)
        </CardTitle>
        <CardDescription>
          각 법인 담당자에게 전달할 전용 폼 링크(`#apply?corp=기업코드`)와 계약 정보를 관리합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        {corps.map((c) => {
          const link = `https://www.cea.co.kr/#apply?corp=${c.code}`;
          return (
            <div key={c.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-extrabold">{c.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    사업자번호: {c.bizNo} · 교육담당: {c.managerName} ({c.managerEmail} / {c.managerPhone})
                  </p>
                </div>
                <Badge>{c.planName}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                <span className="font-mono">{link}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => {
                    navigator.clipboard?.writeText(link);
                    setCopiedCode(c.code);
                  }}
                >
                  {copiedCode === c.code ? <CheckCircle2 className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                  {copiedCode === c.code ? "링크 복사됨" : "전용 폼 링크 복사"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
