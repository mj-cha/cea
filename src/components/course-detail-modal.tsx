import { useEffect } from "react";
import { ArrowRight, Award, BookOpen, CheckCircle2, FileSpreadsheet, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/courses";
import { getCourseSyllabus } from "@/data/course-syllabus";

export function CourseDetailModal({
  course,
  onClose,
  onConsult,
}: {
  course: Course | null;
  onClose: () => void;
  onConsult: (topic: string) => void;
}) {
  useEffect(() => {
    if (!course) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [course, onClose]);

  if (!course) return null;
  const syllabus = getCourseSyllabus(course);

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 p-3 backdrop-blur-xs sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`${course.title} 상세 커리큘럼`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl break-keep">
        <div className="flex items-start justify-between gap-3 border-b bg-card px-5 py-4 sm:px-6">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className="bg-primary/15 text-primary">{course.level}</Badge>
              {course.esgDomain && (
                <Badge variant="outline" className="text-[11px] font-semibold">
                  {course.esgDomain}
                  {course.topic ? ` · ${course.topic}` : ""}
                </Badge>
              )}
              {course.hmcCode && (
                <Badge variant="secondary" className="font-mono text-[11px] font-semibold">
                  HMC {course.hmcCode}
                </Badge>
              )}
              {course.ecovadisCode && (
                <Badge variant="secondary" className="font-mono text-[11px] font-semibold">
                  EcoVadis {course.ecovadisCode}
                </Badge>
              )}
            </div>
            <h3 className="text-lg leading-snug font-extrabold sm:text-xl">{course.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed font-medium text-foreground">
            {syllabus.hook}
          </p>

          <div>
            <h4 className="mb-2.5 flex items-center gap-1.5 text-sm font-bold">
              <BookOpen className="size-4 text-primary" />
              차시별 커리큘럼 구성
            </h4>
            <ol className="space-y-2">
              {syllabus.lessons.map((l) => (
                <li key={l.no} className="flex items-start justify-between gap-3 rounded-lg border bg-card px-3.5 py-2.5 text-sm">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                      {l.no}
                    </span>
                    <span className="leading-snug font-medium">{l.title}</span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{l.minutes}분</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/25 p-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileSpreadsheet className="size-4 text-primary" />
                제공 교안 · 평가 증빙
              </h4>
              <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                {syllabus.materials.map((m) => (
                  <li key={m} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-muted/25 p-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Award className="size-4 text-primary" />
                추천 수강 대상 · 운영 방식
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{course.audience}</p>
              <p className="mt-2 text-xs font-semibold text-foreground/85">{course.format}</p>
              {syllabus.sourceNote && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">※ {syllabus.sourceNote}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button asChild variant="outline" className="min-h-11 gap-1.5 font-semibold" onClick={onClose}>
            <a href="#lms">
              <Play className="size-4" /> 온라인 강의실 이동
            </a>
          </Button>
          <Button
            asChild
            className="min-h-11 gap-1.5 font-bold"
            onClick={() => {
              onConsult(course.track === "hmc-ecovadis" ? `HMC·EcoVadis 교육 (${course.title})` : `온라인 교육 (${course.title})`);
              onClose();
            }}
          >
            <a href="#contact">
              기업 단체 도입 · 수강 문의 <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
