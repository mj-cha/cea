import { useState } from "react";
import { Save, Server, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";
import type { AdminMenuId, VideoSourceType } from "@/lib/lms-types";
import { SupabaseSetupPanel } from "@/components/supabase-setup-panel";
import { AdminViewsAccounts } from "@/sections/admin-views-accounts";

export function AdminViewsPartA({
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
  const { courseMedia, corps, users, subscriptions, payments, qnas, hostPlans, auditLogs, updateCourseMedia } =
    useLms();

  const [editingCourseId, setEditingCourseId] = useState(courseMedia[0]?.courseId ?? "esg-101");
  const targetCourse = courseMedia.find((c) => c.courseId === editingCourseId) ?? courseMedia[0];
  const [vType, setVType] = useState<VideoSourceType>(targetCourse?.videoSourceType ?? "youtube");
  const [vUrl, setVUrl] = useState(targetCourse?.videoUrl ?? "");
  const [driveUrl, setDriveUrl] = useState(targetCourse?.driveMaterialUrl ?? "");
  const [passRate, setPassRate] = useState(targetCourse?.passRate ?? 80);
  const [savedMsg, setSavedMsg] = useState("");

  if (menu === "accounts" || menu === "account-detail" || menu === "corporations") {
    return (
      <AdminViewsAccounts
        menu={menu}
        onNavigate={onNavigate}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
      />
    );
  }

  const totalRevenue = payments.filter((p) => p.status === "결제완료").reduce((a, p) => a + p.amount, 0);
  const totalCerts = users.reduce((a, u) => a + Object.keys(u.certNumbers).length, 0);
  const pendingQna = qnas.filter((q) => q.status === "답변대기").length;

  const selectCourseForEdit = (cid: string) => {
    setEditingCourseId(cid);
    const found = courseMedia.find((c) => c.courseId === cid);
    if (found) {
      setVType(found.videoSourceType);
      setVUrl(found.videoUrl);
      setDriveUrl(found.driveMaterialUrl);
      setPassRate(found.passRate);
      setSavedMsg("");
    }
  };

  if (menu === "dashboard") {
    const kpis = [
      ["전체 계약 법인 · 수강 계정", `${corps.length}개 법인 · ${users.length}명`, `자동 오픈 활성 ${corps.filter((c) => c.autoOpenEnabled).length}곳`],
      ["누적 수료증 발급 건수", `${totalCerts}건`, "수료 기준 80% 이상 자동 발급"],
      ["누적 확정 매출 (B2B 일괄)", `${(totalRevenue / 10000).toLocaleString()}만 원`, `구독 활성 ${subscriptions.filter((s) => s.status === "구독중").length}건`],
      ["미답변 Q&A · 과정 수", `${pendingQna}건 대기`, `총 ${courseMedia.length}개 온라인 과정 운영`],
    ];
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([title, val, sub], i) => (
            <Card key={title} className="py-4">
              <CardHeader className="px-5 pb-2">
                <CardDescription className="text-xs font-semibold">{title}</CardDescription>
                <CardTitle className={`text-2xl font-extrabold ${i === 1 ? "text-primary" : ""}`}>{val}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 text-xs text-muted-foreground">
                {i === 1 ? (
                  <button
                    type="button"
                    onClick={() => onNavigate("corp-completions")}
                    className="font-semibold text-foreground underline underline-offset-4"
                  >
                    기업별 수료증 일괄 출력 바로가기 →
                  </button>
                ) : (
                  sub
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="py-5">
            <CardHeader className="px-6 pb-3">
              <CardTitle className="text-base font-bold">기업별 단체 수강 및 이수 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6">
              {corps.map((c) => {
                const corpCerts = users
                  .filter((u) => u.corpCode === c.code)
                  .reduce((a, u) => a + Object.keys(u.certNumbers).length, 0);
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border p-3.5 text-sm">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.planName} · 등록 {c.enrolledCount}/{c.seatLimit}명 · 과정 {c.allowedCourseIds.length}개
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">수료증 {corpCerts}건</Badge>
                      <p className="text-[11px] font-semibold text-primary">{c.integrationStatus}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="py-5">
            <CardHeader className="px-6 pb-3">
              <CardTitle className="text-base font-bold">최근 관리자 업무 이력 (실시간 감사 로그)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-xl border p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-primary">[{log.actionType}] {log.target}</span>
                    <span className="text-muted-foreground">{log.createdAt}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{log.detail} — {log.adminName}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (menu === "contents") {
    return (
      <Card className="py-5">
        <CardHeader className="px-6 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
            <Video className="size-5 text-primary" />
            전체 컨텐츠 관리 (YouTube 비공개 · Vimeo · MP4 직접 업로드 통합)
          </CardTitle>
          <CardDescription>
            강의 영상을 ① 유튜브 일부공개, ② Vimeo, ③ MP4 직접 업로드 중 선택해 연결하고 수료 기준 학습률(%)과 구글 드라이브 교안을 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-2">
            {courseMedia.map((m) => (
              <button
                key={m.courseId}
                type="button"
                onClick={() => selectCourseForEdit(m.courseId)}
                className={`w-full rounded-xl border p-3 text-left text-sm ${
                  m.courseId === editingCourseId ? "border-primary bg-primary/10" : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px]">{m.level} · {m.videoSourceType.toUpperCase()}</Badge>
                  <span className="text-xs text-muted-foreground">수료기준 {m.passRate}%</span>
                </div>
                <p className="mt-1 font-bold">{m.title}</p>
              </button>
            ))}
          </div>

          {targetCourse && (
            <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
              <h3 className="text-base font-extrabold">{targetCourse.title}</h3>
              <div className="grid grid-cols-3 gap-2">
                {([["youtube", "YouTube 비공개"], ["vimeo", "Vimeo 보안"], ["mp4", "MP4 업로드"]] as const).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVType(key)}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold ${
                        vType === key ? "border-primary bg-primary text-primary-foreground" : "bg-card"
                      }`}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="video-url" className="text-xs font-bold">영상 URL (YouTube / Vimeo / MP4)</Label>
                <Input id="video-url" value={vUrl} onChange={(e) => setVUrl(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="drive-url" className="text-xs font-bold">구글 드라이브 교안 공유 링크</Label>
                <Input id="drive-url" value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pass-rate" className="text-xs font-bold">수료 기준 학습률 (%)</Label>
                <Input id="pass-rate" type="number" min={50} max={100} value={passRate} onChange={(e) => setPassRate(Number(e.target.value))} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-primary">{savedMsg}</span>
                <Button
                  onClick={() => {
                    updateCourseMedia(targetCourse.courseId, { videoSourceType: vType, videoUrl: vUrl, driveMaterialUrl: driveUrl, passRate });
                    setSavedMsg("✓ 설정이 저장되었습니다.");
                  }}
                  className="gap-2 font-bold"
                >
                  <Save className="size-4" /> 저장
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (menu === "host-plan") {
    return (
      <div className="space-y-6">
        <SupabaseSetupPanel />
        <Card className="py-5">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
              <Server className="size-5 text-primary" />
              호스트와 요금제 현황 (도메인 · 웹호스팅 · Supabase DB · 영상 · 구글 드라이브)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6">
            {hostPlans.map((h) => (
              <div key={h.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/15 text-primary">{h.category}</Badge>
                    <span className="font-extrabold">{h.provider}</span>
                    <span className="text-xs text-muted-foreground">({h.planName})</span>
                  </div>
                  <span className="text-sm font-bold text-primary">월 비용: {h.monthlyCost}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{h.usageSummary} — {h.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="py-5">
      <CardHeader className="px-6 pb-3">
        <CardTitle className="text-lg font-extrabold">유료 구독 관리 (기업 B2B 수강권 플랜)</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs text-muted-foreground">
              <tr>
                <th className="py-2.5">법인명</th>
                <th className="py-2.5">구독 플랜</th>
                <th className="py-2.5">좌석 사용량</th>
                <th className="py-2.5">월 환산 요금</th>
                <th className="py-2.5">결제 주기</th>
                <th className="py-2.5">갱신 예정일</th>
                <th className="py-2.5">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscriptions.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 font-bold">{s.corpName}</td>
                  <td className="py-3">{s.planTier}</td>
                  <td className="py-3">{s.usedSeats} / {s.seatQuota}석</td>
                  <td className="py-3 font-semibold">{s.monthlyFee.toLocaleString()}원</td>
                  <td className="py-3">{s.billingCycle}</td>
                  <td className="py-3">{s.nextBillingDate}</td>
                  <td className="py-3"><Badge variant={s.status === "구독중" ? "default" : "outline"}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
