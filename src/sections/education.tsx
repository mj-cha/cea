import { useState } from "react";
import { ArrowRight, BookOpen, Check, Play, ShieldCheck } from "lucide-react";
import { CourseDetailModal } from "@/components/course-detail-modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { coreCourses, courses, esgDomains, hmcEcovadisCourses, levels, type Course } from "@/data/courses";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";
import { cn } from "@/lib/utils";

type TrackTab = "all" | "core" | "hmc-ecovadis";

const levelTone: Record<string, string> = {
  입문: "bg-blue-600/15 text-blue-700 dark:text-blue-200",
  실무: "bg-primary/15 text-primary",
  심화: "bg-indigo-600/15 text-indigo-800 dark:text-indigo-200",
};

const priorityTone: Record<string, string> = {
  최우선: "bg-rose-600/15 text-rose-700 dark:text-rose-200",
  우선: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  시범: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

const priorityLabel: Record<string, string> = {
  최우선: "최우선 핵심",
  우선: "우선 제작",
  시범: "시범문항",
};

export function Education() {
  const [track, setTrack] = useState<TrackTab>("all");
  const [levelFilter, setLevelFilter] = useState("전체");
  const [domainFilter, setDomainFilter] = useState("전체");
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const { select, requestConsult } = useService();

  const baseList = track === "core" ? coreCourses : track === "hmc-ecovadis" ? hmcEcovadisCourses : courses;
  const list =
    track === "hmc-ecovadis"
      ? domainFilter === "전체"
        ? baseList
        : baseList.filter((c) => c.esgDomain === domainFilter)
      : levelFilter === "전체"
        ? baseList
        : baseList.filter((c) => c.level === levelFilter);

  const serviceName = (id: string) => services.find((s) => s.id === id)?.title ?? "";

  return (
    <section id="education" className="py-14 md:py-22">
      <div className="container break-keep">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-primary">실무 온라인 아카데미 (단독 수강 가능 · 기업 단체 환급 연계)</p>
            <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[42px]">
              실무자가 직접 이해하는{" "}
              <br />
              온라인 ESG 직무 과정
            </h2>
          </div>
          <p className="text-[16px] leading-[1.7] text-muted-foreground">
            교육만 단독으로 수강하실 수도 있고, 컨설팅 진행 시에는 담당자 필수 과정으로 함께 편성됩니다.
            <br />현대차(HMC)·EcoVadis 2026 협력사 평가 대응 12개 필수 과정은 수료증에 평가 문항 코드가 자동 병기됩니다.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <Tabs
            value={track}
            onValueChange={(v) => {
              setTrack(v as TrackTab);
              setLevelFilter("전체");
              setDomainFilter("전체");
            }}
          >
            <TabsList aria-label="교육 트랙 선택" className="h-auto! flex-wrap gap-1 p-1">
              <TabsTrigger value="all" className="min-h-11 px-4 text-sm font-bold">
                전체 과정 ({courses.length})
              </TabsTrigger>
              <TabsTrigger value="core" className="min-h-11 px-4 text-sm font-bold">
                직무 심화 ({coreCourses.length})
              </TabsTrigger>
              <TabsTrigger value="hmc-ecovadis" className="min-h-11 px-4 text-sm font-bold">
                현대차·EcoVadis 필수 ({hmcEcovadisCourses.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {track === "hmc-ecovadis" ? (
              <Tabs value={domainFilter} onValueChange={setDomainFilter}>
                <TabsList aria-label="ESG 분야별 보기" className="h-auto! flex-wrap gap-1 p-1">
                  {["전체", ...esgDomains].map((d) => (
                    <TabsTrigger key={d} value={d} className="min-h-10 px-3.5 text-xs font-semibold sm:text-sm">
                      {d}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            ) : (
              <Tabs value={levelFilter} onValueChange={setLevelFilter}>
                <TabsList aria-label="난이도별 과정 보기" className="h-auto! flex-wrap gap-1 p-1">
                  {["전체", ...levels].map((l) => (
                    <TabsTrigger key={l} value={l} className="min-h-10 px-3.5 text-xs font-semibold sm:text-sm">
                      {l}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          {track === "hmc-ecovadis" && (
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5 text-sm sm:flex-row sm:items-center">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="leading-relaxed text-foreground/90">
                  <strong>2026 현대차그룹(HMC)·EcoVadis 협력사 필수 12개 트랙</strong> — 환경(2)·사회(7)·거버넌스(3) 전 문항 매핑 완료. 수료 시 평가 증빙용 코드가 수료증에 자동 기재됩니다.
                </p>
              </div>
              <a
                href="#contact"
                onClick={() => requestConsult("현대차·EcoVadis 필수 교육 패키지")}
                className="inline-flex min-h-10 shrink-0 items-center gap-1 font-bold text-primary hover:underline"
              >
                12개 패키지 도입 문의
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Card
              key={c.id}
              className="group animate-fade-up gap-0 py-0 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:ring-primary/40"
            >
              <CardHeader className="px-6 pt-6 pb-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold", levelTone[c.level])}>{c.level}</span>
                    {c.esgDomain && (
                      <Badge variant="outline" className="text-[11px] font-semibold">
                        {c.esgDomain}
                        {c.topic ? ` · ${c.topic}` : ""}
                      </Badge>
                    )}
                    {c.priority && priorityLabel[c.priority] && (
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", priorityTone[c.priority])}>
                        {priorityLabel[c.priority]}
                      </span>
                    )}
                  </div>
                  <a
                    href="#lms"
                    aria-label={`${c.title} 강의실 열기`}
                    className="grid size-11 min-h-11 min-w-11 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Play className="size-4" />
                  </a>
                </div>
                {(c.hmcCode || c.ecovadisCode) && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {c.hmcCode && (
                      <Badge variant="secondary" className="font-mono text-[11px] font-semibold">
                        HMC {c.hmcCode}
                      </Badge>
                    )}
                    {c.ecovadisCode && (
                      <Badge variant="secondary" className="font-mono text-[11px] font-semibold">
                        EcoVadis {c.ecovadisCode}
                      </Badge>
                    )}
                  </div>
                )}
                <CardTitle className="text-[18px] leading-[1.4] font-bold">{c.title}</CardTitle>
                <CardDescription className="mt-2 text-[14px] leading-[1.72]">{c.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-6 pb-5">
                <ul className="space-y-2 border-t pt-4">
                  {c.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[14px] leading-[1.68]">
                      <Check className="mt-1 size-4 shrink-0 text-primary" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2.5 border-t bg-muted/30 px-6 py-4">
                <p className="text-[13px] font-semibold text-foreground/85">{c.format}</p>
                <p className="text-[13px] leading-[1.65] text-muted-foreground">대상 · {c.audience}</p>
                <div className="mt-1.5 flex w-full flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDetailCourse(c)}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-foreground transition-colors hover:text-primary"
                  >
                    <BookOpen className="size-3.5 text-primary" />
                    상세 커리큘럼
                  </button>
                  <div className="flex items-center gap-3">
                    <a
                      href="#services"
                      onClick={() => select(c.service)}
                      className="inline-flex min-h-11 items-center gap-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                        연계
                      </Badge>
                      {serviceName(c.service)}
                    </a>
                    <a
                      href="#contact"
                      onClick={() => requestConsult(c.track === "hmc-ecovadis" ? `HMC·EcoVadis 교육 (${c.title})` : "온라인 교육")}
                      className="inline-flex min-h-11 items-center gap-1 text-[13px] font-bold text-primary hover:underline"
                    >
                      수강 문의
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-muted-foreground">
          임직원 전체 교육이나 사내 맞춤 과정이 필요하면{" "}
          <a
            href="#contact"
            onClick={() => requestConsult("기업 단체 교육")}
            className="font-semibold text-foreground underline underline-offset-4 hover:text-primary"
          >
            기업 단체 교육 문의
          </a>
          로 알려 주세요.
        </p>
      </div>
      <CourseDetailModal
        course={detailCourse}
        onClose={() => setDetailCourse(null)}
        onConsult={requestConsult}
      />
    </section>
  );
}
