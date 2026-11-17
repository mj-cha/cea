import { Fragment } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services, type Service } from "@/data/services";
import { courses } from "@/data/courses";
import { useService } from "@/lib/service-context";

function SubHead({ children }: { children: string }) {
  return <h4 className="mb-4 text-[12px] font-bold tracking-[0.14em] text-primary uppercase">{children}</h4>;
}

function Panel({ s }: { s: Service }) {
  const related = courses.filter((c) => c.service === s.id);
  return (
    <article className="animate-fade-up overflow-hidden rounded-2xl border bg-card">
      <header className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[0.14] via-card to-card px-6 py-8 md:px-10 md:py-10">
        <span
          className="tabular pointer-events-none absolute -top-6 -right-2 text-[120px] leading-none font-extrabold text-primary/[0.09] select-none md:text-[160px]"
          aria-hidden="true"
        >
          {s.no}
        </span>
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono tracking-wider uppercase">
              {s.en}
            </Badge>
            <Badge variant="secondary">{s.stakeholder} 대응</Badge>
          </div>
          <h3 className="text-[28px] font-extrabold tracking-[-0.02em] md:text-[34px]">{s.title}</h3>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-foreground/85">{s.summary}</p>
        </div>
      </header>

      <div className="space-y-10 px-6 py-8 md:px-10 md:py-10">
        <section>
          <SubHead>Why</SubHead>
          <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">{s.why}</p>
          <ol className="grid gap-3 md:grid-cols-3">
            {s.purposes.map((p, i) => (
              <li key={p.title} className="rounded-xl border bg-background/40 p-4">
                <span className="tabular font-mono text-[12px] text-primary">0{i + 1}</span>
                <p className="mt-1.5 leading-snug font-bold">{p.title}</p>
                {p.desc && <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.desc}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SubHead>주요 서비스</SubHead>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {s.areas.map((a) => (
              <li key={a.name} className="rounded-xl bg-muted/70 px-4 py-3.5">
                <p className="flex items-center gap-2.5 font-semibold">
                  <Check className="size-4 shrink-0 text-primary" />
                  {a.name}
                </p>
                {a.items?.length ? (
                  <ul className="mt-2 space-y-1 pl-[26px]">
                    {a.items.map((it) => (
                      <li key={it} className="text-[13px] leading-relaxed text-muted-foreground">
                        {it}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SubHead>수행 절차</SubHead>
          <ol
            className="grid gap-px overflow-hidden rounded-xl border bg-border"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}
          >
            {s.process.map((p, i) => (
              <li key={p.phase} className="bg-card p-4">
                <p className="tabular font-mono text-[11px] text-muted-foreground">STEP {i + 1}</p>
                <p className="mt-1 font-bold">{p.phase}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2 text-[13px] leading-snug text-muted-foreground">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/70" />
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SubHead>CEA가 다른 점</SubHead>
          <div className="grid gap-3 md:grid-cols-3">
            {s.strengths.map((st) => (
              <div key={st.title} className="border-l-2 border-primary/60 pl-4">
                <p className="leading-snug font-bold">{st.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {s.details.length > 0 && (
          <section>
            <SubHead>컨설팅 상세</SubHead>
            <Accordion type="single" collapsible className="border-t">
              {s.details.map((d) => (
                <AccordionItem key={d.name} value={d.name} className="border-b">
                  <AccordionTrigger className="items-center py-5 text-[15px] font-semibold hover:text-primary hover:no-underline">
                    {d.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <p className="mb-4 text-[14px] leading-relaxed text-foreground/85">{d.feature}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-muted/60 p-4">
                        <p className="mb-2 text-[12px] font-bold text-muted-foreground">주요 대상</p>
                        <ul className="space-y-1.5">
                          {d.targets.map((t) => (
                            <li key={t} className="leading-relaxed">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-primary/[0.08] p-4">
                        <p className="mb-2 text-[12px] font-bold text-primary">기대 효과</p>
                        <ul className="space-y-1.5">
                          {d.effects.map((t) => (
                            <li key={t} className="leading-relaxed">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        <footer className="flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          {related.length ? (
            <p className="text-sm text-muted-foreground">
              관련 교육 ·{" "}
              {related.map((c, i) => (
                <Fragment key={c.id}>
                  {i > 0 && ", "}
                  <a href="#education" className="font-semibold text-foreground underline-offset-4 hover:underline">
                    {c.title}
                  </a>
                </Fragment>
              ))}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">기업 상황에 맞는 대응 전략을 전문 컨설턴트가 제안해 드립니다.</p>
          )}
          <Button asChild variant="secondary" className="h-10 shrink-0 gap-2 px-4 font-semibold">
            <a href="#contact">
              {s.title} 상담하기
              <ArrowRight />
            </a>
          </Button>
        </footer>
      </div>
    </article>
  );
}

export function Services() {
  const { selected, select } = useService();
  return (
    <section id="services" className="border-t py-20 md:py-28">
      <div className="container">
        <div className="mb-12 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
          <div>
            <p className="mb-4 text-[13px] font-semibold text-primary">ESG CONSULTING</p>
            <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[44px]">종합 ESG 서비스</h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted-foreground">
            7개 전문 영역으로 기업의 ESG 경영 전 과정을 지원합니다. 영역을 고르면 필요한 이유, 세부 서비스, 수행 절차를 확인할 수 있어요.
          </p>
        </div>

        <Tabs
          orientation="vertical"
          value={selected}
          onValueChange={select}
          className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start"
        >
          <TabsList className="flex h-auto! w-full snap-x justify-start gap-1 overflow-x-auto rounded-2xl border bg-card p-2 group-data-vertical/tabs:flex-row lg:sticky lg:top-24 lg:overflow-visible lg:group-data-vertical/tabs:flex-col">
            {services.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="group h-auto flex-none shrink-0 snap-start justify-start gap-4 rounded-xl border-0 px-4 py-3.5 text-left text-[15px] text-muted-foreground transition-colors duration-150 after:hidden hover:bg-accent data-active:bg-foreground! data-active:text-background! data-active:shadow-none lg:w-full"
              >
                <span className="tabular font-mono text-[12px] opacity-60 group-data-active:opacity-100">{s.no}</span>
                <span className="font-bold">{s.title}</span>
                <ArrowRight className="ml-auto hidden size-4 opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-50 group-data-active:translate-x-0.5 group-data-active:opacity-100 lg:block" />
              </TabsTrigger>
            ))}
          </TabsList>
          {services.map((s) => (
            <TabsContent key={s.id} value={s.id} className="text-base">
              <Panel s={s} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
