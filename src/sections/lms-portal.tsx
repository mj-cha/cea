import { useEffect, useState } from "react";
import { Link2, PlayCircle, UserCheck } from "lucide-react";
import { CertificateBatchModal, type CertificatePrintItem } from "@/components/certificate-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";
import { LmsApplyTab } from "@/sections/lms-apply-tab";
import { LmsCoursePlayer } from "@/sections/lms-course-player";

export function LmsPortal({
  initialTab = "classroom",
  onGoAdmin,
}: {
  initialTab?: "classroom" | "apply";
  onGoAdmin: () => void;
}) {
  const { courseMedia, corps, users, activeUserId, setActiveUserId, isAdminLoggedIn, loggedInUser, updateProgress } = useLms();
  // 비로그인 방문자는 강의실을 볼 수 없고 전용 링크 등록 화면만 쓴다.
  const canSeeClassroom = Boolean(loggedInUser);
  // 강의 등록·기업 추가 탭 전환은 관리자 전용(수강생은 본인 강의실만 이용)
  const [tab, setTab] = useState<"classroom" | "apply">(canSeeClassroom ? (isAdminLoggedIn ? initialTab : "classroom") : "apply");
  const [selectedCorpCode, setSelectedCorpCode] = useState(corps[0]?.code ?? "cea");

  // 관리자만 다른 수강 계정을 볼 수 있다. 일반 수강생은 본인 계정 고정.
  const activeUser = isAdminLoggedIn
    ? (users.find((u) => u.id === activeUserId) ?? users[0])
    : (loggedInUser ?? undefined);
  const enrolledCourses = courseMedia.filter((m) => activeUser?.enrolledCourseIds.includes(m.courseId));
  const [selectedCourseId, setSelectedCourseId] = useState(enrolledCourses[0]?.courseId ?? courseMedia[0]?.courseId ?? "esg-101");
  const [certPreview, setCertPreview] = useState<CertificatePrintItem[]>([]);

  useEffect(() => {
    setTab(canSeeClassroom ? (isAdminLoggedIn ? initialTab : "classroom") : "apply");
    const match = window.location.hash.match(/corp=([a-z0-9-]+)/i);
    if (match && corps.some((c) => c.code === match[1])) setSelectedCorpCode(match[1]);
  }, [initialTab, corps, canSeeClassroom, isAdminLoggedIn]);

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
    setCertPreview([
      {
        certNo: activeUser.certNumbers[cid] ?? "CEA-2026-1011",
        userName: activeUser.name,
        userEmail: activeUser.email,
        corpName: activeUser.corpName,
        department: activeUser.department,
        courseTitle: currentCourse.title,
        durationMin: currentCourse.durationMin,
        progress: currentProgress,
        completedAt: activeUser.completedAt[cid] ?? new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <section id="lms" className="py-12 md:py-16">
      <div className="container break-keep">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold text-primary">기업 온라인 교육 시스템</p>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">기업 전용 수강 신청 &amp; 온라인 강의실</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              전용 링크로 업무용 이메일을 등록하면 계약된 과정이 즉시 열리고, 수료 기준 달성 시 수료증이 발급됩니다.
            </p>
          </div>
          {isAdminLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGoAdmin}
              className="min-h-11 w-full whitespace-normal font-semibold sm:w-auto sm:whitespace-nowrap"
            >
              관리자 콘솔 바로가기 →
            </Button>
          )}
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "classroom" | "apply")} className="space-y-6">
          {canSeeClassroom && isAdminLoggedIn && (
            <TabsList className="grid h-auto! w-full grid-cols-1 gap-1 p-1 sm:inline-flex sm:h-11! sm:w-fit">
              <TabsTrigger value="classroom" className="min-h-11 w-full gap-2 px-3 whitespace-normal text-xs font-bold sm:w-auto sm:px-4 sm:whitespace-nowrap sm:text-sm">
                <PlayCircle className="size-4 shrink-0" /> 나의 온라인 강의실
              </TabsTrigger>
              <TabsTrigger value="apply" className="min-h-11 w-full gap-2 px-3 whitespace-normal text-xs font-bold sm:w-auto sm:px-4 sm:whitespace-nowrap sm:text-sm">
                <Link2 className="size-4 shrink-0" /> 기업 전용 아이디 등록
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="classroom" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="flex w-full max-w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
                <span className="text-xs font-bold text-muted-foreground">수강 계정:</span>
                {isAdminLoggedIn ? (
                <select
                  aria-label="수강 계정 선택"
                  value={activeUser?.id ?? ""}
                  onChange={(e) => setActiveUserId(e.target.value)}
                  className="h-11 min-h-11 w-full max-w-full min-w-0 rounded-md border bg-background px-3 text-sm font-semibold sm:max-w-[340px]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.corpName}) · {u.enrolledCourseIds.length}개 과정
                    </option>
                  ))}
                </select>
                ) : (
                  <span className="text-sm font-semibold">{activeUser?.name} ({activeUser?.email})</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <UserCheck className="size-4 shrink-0 text-primary" />
                <span>
                  소속: <strong className="text-foreground">{activeUser?.corpName}</strong> ({activeUser?.department})
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold">수강 중인 과정 ({enrolledCourses.length}개)</h2>
                  {isAdminLoggedIn && (
                    <button type="button" onClick={() => setTab("apply")} className="min-h-11 px-1 text-xs font-semibold text-primary underline underline-offset-4">
                      + 기업 링크로 과정 추가
                    </button>
                  )}
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
                        {/* 유튜브·MP4 등 영상 포맷 노출 제거, 난이도·수강시간만 표시 (#8) */}
                        <Badge variant="outline" className="text-[11px]">
                          {m.level} · {m.durationMin}분
                        </Badge>
                        <span className={cn("text-xs font-bold", done ? "text-primary" : "text-muted-foreground")}>
                          {done ? `✓ 수료 완료 (${pct}%)` : `진도율 ${pct}%`}
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
                <LmsCoursePlayer
                  course={currentCourse}
                  activeUser={activeUser}
                  currentProgress={currentProgress}
                  isCompleted={isCompleted}
                  isAdminLoggedIn={isAdminLoggedIn}
                  onOpenCert={openSingleCert}
                  onUpdateProgress={updateProgress}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="apply">
            <LmsApplyTab selectedCorpCode={selectedCorpCode} onChangeCorpCode={setSelectedCorpCode} onGoClassroom={() => setTab("classroom")} />
          </TabsContent>
        </Tabs>
      </div>

      <CertificateBatchModal open={certPreview.length > 0} onClose={() => setCertPreview([])} items={certPreview} title="수료증 출력 미리보기" />
    </section>
  );
}
