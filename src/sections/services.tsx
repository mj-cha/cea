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
  return <h4 className="mb-4 text-[13px] font-bold tracking-tight text-primary">{children}</h4>;
}

function Panel({ s }: { s: Service }) {
  const { requestConsult } = useService();
  const related = courses.filter((c) => c.service === s.id);
  return (
    <article className="animate-fade-up overflow-hidden rounded-2xl border bg-card">
      <header className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[0.12] via-card to-card px-6 py-8 md:px-10 md:py-10">
        <span
          className="tabular pointer-events-none absolute -top-6 -right-2 text-[110px] leading-none font-extrabold text-primary/[0.08] select-none md:text-[150px]"
          aria-hidden="true"
        >
          {s.no}
        </span>
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {s.en}
            </Badge>
            <Badge variant="secondary">{s.stakeholder} 대응</Badge>
          </div>
          <h3 className="text-[26px] font-extrabold tracking-[-0.02em] md:text-[34px]">{s.title}</h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-foreground/85 md:text-[16px]">{s.summary}</p>
        </div>
      </header>

      <div className="space-y-11 px-5 py-7 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <section>
          <SubHead>필요한 이유</SubHead>
          <p className="mb-6 text-[15.5px] leading-[1.8] text-muted-foreground">{s.why}</p>
          <ol className="grid gap-4 md:grid-cols-3">
            {s.purposes.map((p) => (
              <li key={p.title} className="rounded-xl border bg-background/40 p-5">
                <p className="text-[15px] leading-snug font-bold">{p.title}</p>
                {p.desc && <p className="mt-2.5 text-[14px] leading-[1.75] text-muted-foreground">{p.desc}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SubHead>주요 서비스</SubHead>
          <ul className="grid gap-3.5 sm:grid-cols-2">
            {s.areas.map((a) => (
              <li key={a.name} className="rounded-xl bg-muted/70 px-5 py-4">
                <p className="flex items-start gap-2.5 text-[15px] leading-snug font-semibold">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{a.name}</span>
                </p>
                {a.items?.length ? (
                  <ul className="mt-2.5 space-y-1.5 pl-[26px]">
                    {a.items.map((it) => (
                      <li key={it} className="text-[14px] leading-[1.72] text-muted-foreground">
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
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
          >
            {s.process.map((p, i) => (
              <li key={p.phase} className="bg-card p-5">
                <p className="tabular font-mono text-[11.5px] font-semibold text-primary">{i + 1}단계</p>
                <p className="mt-1.5 text-[15px] font-bold">{p.phase}</p>
                <ul className="mt-3 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2 text-[13.5px] leading-[1.7] text-muted-foreground">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary/70" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SubHead>CEA가 다른 점</SubHead>
          <div className="grid gap-5 md:grid-cols-3">
            {s.strengths.map((st) => (
              <div key={st.title} className="border-l-2 border-primary/60 pl-4">
                <p className="text-[15px] leading-snug font-bold">{st.title}</p>
                <p className="mt-2 text-[14px] leading-[1.75] text-muted-foreground">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {s.details.length > 0 && (
          <section>
            <SubHead>컨설팅 상세 안내</SubHead>
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
          <Button asChild variant="secondary" className="min-h-11 shrink-0 gap-2 px-4 font-semibold">
            <a href="#contact" onClick={() => requestConsult(s.title)}>
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
    <section id="services" className="py-14 md:py-22">
      <div className="container break-keep">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-primary">분야별 전문 자문 (컨설팅 시 담당자 필수 교육 포함)</p>
            <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[42px]">
              핵심 ESG 자문 · 실무 구축 영역
            </h2>
          </div>
          <p className="text-[16px] leading-[1.7] text-muted-foreground">
            기후·RE100 전환부터 KSSB 의무공시, 공급망 탄소·실사, 녹색금융·택소노미까지 기업 현안에 맞춘 실무 자문을 제공합니다.
            <br />모든 컨설팅 과업에는 담당자 내재화를 위한 맞춤 실무 교육이 함께 포함됩니다.
          </p>
        </div>

        <Tabs
          orientation="vertical"
          value={selected}
          onValueChange={select}
          className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start"
        >
          <TabsList className="grid h-auto! w-full grid-cols-1 gap-1.5 rounded-2xl border bg-card p-2 sm:grid-cols-2 lg:sticky lg:top-24 lg:flex lg:flex-col">
            {services.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="group min-h-11 h-auto w-full justify-start gap-2.5 rounded-xl border-0 px-3.5 py-3 text-left text-[14px] leading-snug whitespace-normal text-muted-foreground transition-colors duration-150 after:hidden hover:bg-accent data-active:bg-foreground! data-active:text-background! data-active:shadow-none lg:gap-3.5 lg:px-4 lg:py-3.5 lg:text-[15px]"
              >
                <span className="tabular shrink-0 font-mono text-[11px] opacity-60 group-data-active:opacity-100 lg:text-[12px]">{s.no}</span>
                <span className="font-bold break-keep">{s.title}</span>
                <ArrowRight className="ml-auto hidden size-4 shrink-0 opacity-0 transition-[opacity,transform] duration-150 group-hover:opacity-50 group-data-active:translate-x-0.5 group-data-active:opacity-100 lg:block" />
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
