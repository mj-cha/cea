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
  입문: "bg-sky-400/15 text-sky-300",
  실무: "bg-primary/15 text-primary",
  심화: "bg-amber-400/15 text-amber-300",
};

export function Education() {
  const [filter, setFilter] = useState("전체");
  const { select } = useService();
  const list = filter === "전체" ? courses : courses.filter((c) => c.level === filter);
  const serviceName = (id: string) => services.find((s) => s.id === id)?.title ?? "";

  return (
    <section id="education" className="border-t py-20 md:py-28">
      <div className="container">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
          <div>
            <p className="mb-4 text-[13px] font-semibold text-primary">ONLINE ACADEMY</p>
            <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[44px]">
              온라인 교육으로
              <br />
              먼저 공통 언어를
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted-foreground">
            컨설팅 결과물이 회사에 남으려면 실무자가 기준을 이해하고 있어야 합니다. 영역별 과정을 원하는 시간에 듣고, 라이브 Q&A에서 우리 회사 상황을 직접 물어보세요.
          </p>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList aria-label="난이도별 과정 보기" className="h-10!">
            {["전체", ...levels].map((l) => (
              <TabsTrigger key={l} value={l} className="px-3.5 text-sm font-semibold">
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c) => (
            <Card
              key={c.id}
              className="group animate-fade-up gap-0 py-0 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:ring-primary/40"
            >
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-bold", levelTone[c.level])}>{c.level}</span>
                  <span className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Play className="size-3.5" />
                  </span>
                </div>
                <CardTitle className="text-[17px] leading-snug font-bold">{c.title}</CardTitle>
                <CardDescription className="mt-1 text-[13px] leading-relaxed">{c.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-6 pb-4">
                <ul className="space-y-1.5 border-t pt-4">
                  {c.outcomes.map((o) => (
                    <li key={o} className="flex gap-2 text-[13px] leading-snug">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {o}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col items-start gap-3 border-t bg-muted/30 px-6 py-4">
                <p className="text-[12px] text-muted-foreground">{c.format}</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">대상 · {c.audience}</p>
                <a
                  href="#services"
                  onClick={() => select(c.service)}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground transition-colors hover:text-primary"
                >
                  <Badge variant="outline" className="mr-1 px-2 py-0 text-[11px]">
                    연계
                  </Badge>
                  {serviceName(c.service)}
                  <ArrowRight className="size-3.5" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-muted-foreground">
          임직원 전체 교육이나 사내 맞춤 과정이 필요하면{" "}
          <a href="#contact" className="font-semibold text-foreground underline underline-offset-4">
            기업 교육 문의
          </a>
          로 알려 주세요.
        </p>
      </div>
    </section>
  );
}
