import { Award, ExternalLink, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseMediaConfig, UserAccount } from "@/lib/lms-types";

export function LmsCoursePlayer({
  course,
  activeUser,
  currentProgress,
  isCompleted,
  isAdminLoggedIn,
  onOpenCert,
  onUpdateProgress,
}: {
  course: CourseMediaConfig;
  activeUser?: UserAccount;
  currentProgress: number;
  isCompleted: boolean;
  isAdminLoggedIn: boolean;
  onOpenCert: () => void;
  onUpdateProgress: (userId: string, courseId: string, nextPct: number) => void;
}) {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/15 text-primary">{course.level} 과정</Badge>
            <span className="text-xs text-muted-foreground">
              수료 기준: 진도율 {course.passRate}% 이상 · 총 {course.durationMin}분
            </span>
          </div>
          {isCompleted && (
            <Button size="sm" onClick={onOpenCert} className="min-h-11 gap-1.5 px-3.5 font-semibold">
              <Award className="size-4" /> 수료증 확인 · 인쇄
            </Button>
          )}
        </div>
        <CardTitle className="mt-2 text-xl leading-[1.4] font-extrabold">{course.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="aspect-video w-full overflow-hidden rounded-xl border bg-slate-950">
          {course.videoSourceType === "mp4" ? (
            <video
              key={course.videoUrl}
              src={course.videoUrl}
              controls
              className="h-full w-full"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration > 0 && activeUser) {
                  const watchedPct = Math.round((v.currentTime / v.duration) * 100);
                  if (watchedPct > currentProgress) onUpdateProgress(activeUser.id, course.courseId, watchedPct);
                }
              }}
            />
          ) : (
            <iframe
              key={course.videoUrl}
              src={course.videoUrl}
              title={course.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">나의 수강 진도율</p>
              <p className="mt-0.5 text-lg font-extrabold">
                {isCompleted ? `수료 완료 (${currentProgress}%)` : `현재 진도율 ${currentProgress}%`}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  ({isCompleted ? `증서번호 ${activeUser?.certNumbers[course.courseId] ?? "발급됨"}` : `${course.passRate}% 이상 수강 시 수료증 발급`})
                </span>
              </p>
            </div>
            {isAdminLoggedIn ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 px-3"
                  onClick={() => activeUser && onUpdateProgress(activeUser.id, course.courseId, Math.min(100, currentProgress + 20))}
                >
                  +20% 진도 반영 (관리자)
                </Button>
                <Button size="sm" className="min-h-11 px-3.5 font-semibold" onClick={() => activeUser && onUpdateProgress(activeUser.id, course.courseId, 100)}>
                  100% 수료 처리 (관리자)
                </Button>
              </div>
            ) : (
              <p className="text-xs leading-[1.7] text-muted-foreground">
                영상 시청 시 진도율이 자동 기록됩니다. 수료 처리·과정 배정은 관리자가 관리합니다.
              </p>
            )}
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${currentProgress}%` }} />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold">강의 교안(PDF) · 실무 엑셀 템플릿</p>
              <p className="text-xs leading-relaxed text-muted-foreground">강의 수강에 필요한 교안과 실습 양식을 내려받습니다.</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0 gap-1.5 px-3.5">
            <a href={course.driveMaterialUrl} target="_blank" rel="noreferrer">
              강의 자료 열기 <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
