import { useState } from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { courses, levels } from "@/data/courses";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";
import { cn } from "@/lib/utils";

const levelTone: Record<string, string> = {
  입문: "bg-blue-600/15 text-blue-700 dark:text-blue-200",
  실무: "bg-primary/15 text-primary",
  심화: "bg-indigo-600/15 text-indigo-800 dark:text-indigo-200",
};

export function Education() {
  const [filter, setFilter] = useState("전체");
  const { select, requestConsult } = useService();
  const list = filter === "전체" ? courses : courses.filter((c) => c.level === filter);
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
            <br />기업 단체 수강 시 사업주 직업능력개발훈련(고용보험 환급) 및 바우처 연계 설계를 지원합니다.
          </p>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList aria-label="난이도별 과정 보기" className="h-auto! flex-wrap gap-1 p-1">
            {["전체", ...levels].map((l) => (
              <TabsTrigger key={l} value={l} className="min-h-11 px-4 text-sm font-semibold">
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Card
              key={c.id}
              className="group animate-fade-up gap-0 py-0 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:ring-primary/40"
            >
              <CardHeader className="px-6 pt-6 pb-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold", levelTone[c.level])}>{c.level}</span>
                  <a
                    href="#lms"
                    aria-label={`${c.title} 강의실 열기`}
                    className="grid size-11 min-h-11 min-w-11 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Play className="size-4" />
                  </a>
                </div>
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
                  <a
                    href="#services"
                    onClick={() => select(c.service)}
                    className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <Badge variant="outline" className="mr-1 px-1.5 py-0 text-[10px]">
                      연계
                    </Badge>
                    {serviceName(c.service)}
                  </a>
                  <a
                    href="#contact"
                    onClick={() => requestConsult("온라인 교육")}
                    className="inline-flex min-h-11 items-center gap-1 text-[13px] font-bold text-primary hover:underline"
                  >
                    수강 문의
                    <ArrowRight className="size-3.5" />
                  </a>
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
    </section>
  );
}
