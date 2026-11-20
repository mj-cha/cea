import { useEffect, useState } from "react";
import { Award, ExternalLink, FileSpreadsheet, Link2, PlayCircle, UserCheck } from "lucide-react";
import { CertificateBatchModal, type CertificatePrintItem } from "@/components/certificate-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";
import { LmsApplyTab } from "@/sections/lms-apply-tab";

const SOURCE_LABELS = {
  youtube: "YouTube 일부공개",
  vimeo: "Vimeo 보안스트리밍",
  mp4: "MP4 직접업로드",
} as const;

export function LmsPortal({
  initialTab = "classroom",
  onGoAdmin,
}: {
  initialTab?: "classroom" | "apply";
  onGoAdmin: () => void;
}) {
  const { courseMedia, corps, users, activeUserId, setActiveUserId, isAdminLoggedIn, setLoginModalOpen, updateProgress } = useLms();
  const [tab, setTab] = useState<"classroom" | "apply">(initialTab);
  const [selectedCorpCode, setSelectedCorpCode] = useState(corps[0]?.code ?? "cea");

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const enrolledCourses = courseMedia.filter((m) => activeUser?.enrolledCourseIds.includes(m.courseId));
  const [selectedCourseId, setSelectedCourseId] = useState(enrolledCourses[0]?.courseId ?? courseMedia[0]?.courseId ?? "esg-101");
  const [certPreview, setCertPreview] = useState<CertificatePrintItem[]>([]);

  useEffect(() => {
    setTab(initialTab);
    const match = window.location.hash.match(/corp=([a-z0-9-]+)/i);
    if (match && corps.some((c) => c.code === match[1])) setSelectedCorpCode(match[1]);
  }, [initialTab, corps]);

  useEffect(() => {
    if (activeUser && !activeUser.enrolledCourseIds.includes(selectedCourseId)) {
      const first = activeUser.enrolledCourseIds[0];
      if (first) setSelectedCourseId(first);
    }
  }, [activeUser, selectedCourseId]);

  const currentCourse = courseMedia.find((c) => c.courseId === selectedCourseId) ?? enrolledCourses[0] ?? courseMedia[0];
  const currentProgress = activeUser?.progress[currentCourse.courseId] ?? 0;
  const isCompleted = currentProgress >= currentCourse.passRate;

  const openSingleCert = () => {
    if (!activeUser || !currentCourse) return;
    const cid = currentCourse.courseId;
    setCertPreview([{
      certNo: activeUser.certNumbers[cid] ?? "CEA-2026-1011",
      userName: activeUser.name,
      userEmail: activeUser.email,
      corpName: activeUser.corpName,
      department: activeUser.department,
      courseTitle: currentCourse.title,
      durationMin: currentCourse.durationMin,
      progress: currentProgress,
      completedAt: activeUser.completedAt[cid] ?? new Date().toISOString().slice(0, 10),
    }]);
  };

  return (
    <section id="lms" className="border-t py-12 md:py-16">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20">CEA B2B LMS · Supabase 연동</Badge>
              <span className="text-xs text-muted-foreground">www.cea.co.kr 온라인 교육 시스템</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">기업 전용 수강 신청 &amp; 온라인 강의실</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              기업 전용 링크로 아이디를 등록하면 계약된 강의가 즉시 열리고, 학습률 달성 시 수료증이 자동 발급됩니다.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isAdminLoggedIn ? onGoAdmin() : setLoginModalOpen(true))}
            className="min-h-11 w-full whitespace-normal font-semibold sm:w-auto sm:whitespace-nowrap"
          >
            {isAdminLoggedIn ? "관리자 콘솔(14대 메뉴 · 수료증 일괄출력) →" : "관리자 로그인 (수료증 일괄출력) →"}
          </Button>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "classroom" | "apply")} className="space-y-6">
          <TabsList className="grid h-auto! w-full grid-cols-1 gap-1 p-1 sm:inline-flex sm:h-11! sm:w-fit">
            <TabsTrigger value="classroom" className="min-h-11 w-full gap-2 px-3 whitespace-normal text-xs font-bold sm:w-auto sm:px-4 sm:whitespace-nowrap sm:text-sm">
              <PlayCircle className="size-4 shrink-0" /> 나의 온라인 강의실 (진도율 · 수료증)
            </TabsTrigger>
            <TabsTrigger value="apply" className="min-h-11 w-full gap-2 px-3 whitespace-normal text-xs font-bold sm:w-auto sm:px-4 sm:whitespace-nowrap sm:text-sm">
              <Link2 className="size-4 shrink-0" /> 기업 전용 아이디 등록 폼 (강의 자동 오픈)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classroom" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="flex w-full max-w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
                <span className="text-xs font-bold text-muted-foreground">현재 접속 수강생(예시 계정 전환):</span>
                <select
                  aria-label="접속 수강생 전환"
                  value={activeUser?.id ?? ""}
                  onChange={(e) => setActiveUserId(e.target.value)}
                  className="h-11 min-h-11 w-full max-w-full min-w-0 rounded-md border bg-background px-3 text-sm font-semibold sm:w-auto"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      [{u.corpName}] {u.name} ({u.email}) — 열린 강의 {u.enrolledCourseIds.length}개
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <UserCheck className="size-4 shrink-0 text-primary" />
                <span>소속: <strong className="text-foreground">{activeUser?.corpName}</strong> ({activeUser?.department})</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold">내 아이디에 오픈된 과정 ({enrolledCourses.length}개)</h2>
                  <button type="button" onClick={() => setTab("apply")} className="min-h-11 px-1 text-xs font-semibold text-primary underline underline-offset-4">
                    + 기업 링크로 추가 오픈
                  </button>
                </div>
                {enrolledCourses.map((m) => {
                  const pct = activeUser?.progress[m.courseId] ?? 0;
                  const done = pct >= m.passRate;
                  const active = m.courseId === currentCourse.courseId;
                  return (
                    <button
                      key={m.courseId}
                      type="button"
                      onClick={() => setSelectedCourseId(m.courseId)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left transition-all",
                        active ? "border-primary bg-primary/5 ring-1 ring-primary/40" : "bg-card hover:border-foreground/30",
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[11px]">{m.level} · {m.videoSourceType.toUpperCase()}</Badge>
                        <span className={cn("text-xs font-bold", done ? "text-primary" : "text-muted-foreground")}>
                          {done ? "✓ 수료 완료" : `진도율 ${pct}%`}
                        </span>
                      </div>
                      <p className="text-sm font-bold">{m.title}</p>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentCourse && (
                <Card className="overflow-hidden py-0">
                  <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/15 text-primary">소스: {SOURCE_LABELS[currentCourse.videoSourceType]}</Badge>
                        <span className="text-xs text-muted-foreground">
                          수료 기준: 학습률 {currentCourse.passRate}% 이상 (총 {currentCourse.durationMin}분)
                        </span>
                      </div>
                      {isCompleted && (
                        <Button size="sm" onClick={openSingleCert} className="min-h-11 gap-1.5 px-3.5 font-semibold">
                          <Award className="size-4" /> 수료증 확인 · 인쇄
                        </Button>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-xl font-extrabold">{currentCourse.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5 p-5 sm:p-6">
                    <div className="aspect-video w-full overflow-hidden rounded-xl border bg-slate-950">
                      {currentCourse.videoSourceType === "mp4" ? (
                        <video
                          key={currentCourse.videoUrl}
                          src={currentCourse.videoUrl}
                          controls
                          className="h-full w-full"
                          onTimeUpdate={(e) => {
                            const v = e.currentTarget;
                            if (v.duration > 0 && activeUser) {
                              const watchedPct = Math.round((v.currentTime / v.duration) * 100);
                              if (watchedPct > currentProgress) updateProgress(activeUser.id, currentCourse.courseId, watchedPct);
                            }
                          }}
                        />
                      ) : (
                        <iframe
                          key={currentCourse.videoUrl}
                          src={currentCourse.videoUrl}
                          title={currentCourse.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">실시간 학습률(진도율) 자동 기록 · Supabase DB 동기화</p>
                          <p className="mt-0.5 text-lg font-extrabold">
                            현재 학습률 <span className="text-primary">{currentProgress}%</span>{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({isCompleted ? `수료 완료 · 증서번호 ${activeUser?.certNumbers[currentCourse.courseId] ?? "발급됨"}` : `${currentCourse.passRate}% 이상 시 수료증 자동 발급`})
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-11 px-3"
                            onClick={() => activeUser && updateProgress(activeUser.id, currentCourse.courseId, Math.min(100, currentProgress + 20))}
                          >
                            +20% 시청 진행 (테스트)
                          </Button>
                          <Button size="sm" className="min-h-11 px-3.5 font-semibold" onClick={() => activeUser && updateProgress(activeUser.id, currentCourse.courseId, 100)}>
                            100% 수강 완료 처리
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${currentProgress}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-3">
                        <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-bold">강의 교안(PDF) · 실습 템플릿 (Google Drive 연동)</p>
                          <p className="text-xs text-muted-foreground">구독 중인 구글 드라이브 폴더에서 교안과 엑셀 실습 시트를 내려받습니다.</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0 gap-1.5 px-3.5">
                        <a href={currentCourse.driveMaterialUrl} target="_blank" rel="noreferrer">
                          구글 드라이브 교안 열기 <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="apply">
            <LmsApplyTab selectedCorpCode={selectedCorpCode} onChangeCorpCode={setSelectedCorpCode} onGoClassroom={() => setTab("classroom")} />
          </TabsContent>
        </Tabs>
      </div>

      <CertificateBatchModal open={certPreview.length > 0} onClose={() => setCertPreview([])} items={certPreview} title="개인 수료증 출력 미리보기" />
    </section>
  );
}
