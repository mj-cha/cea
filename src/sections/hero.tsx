import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, totalSubServices } from "@/data/services";
import { courses } from "@/data/courses";
import { useService } from "@/lib/service-context";
import { cn } from "@/lib/utils";

const stats = [
  { n: String(services.length), unit: "개", label: "컨설팅 영역" },
  { n: String(totalSubServices), unit: "개", label: "세부 서비스" },
  { n: "6", unit: "곳", label: "평가기관 대응" },
  { n: String(courses.length), unit: "개", label: "온라인 과정" },
];

/** 6개 이해관계자 → 우리 회사 → CEA 로 모이는 ESG 밸류체인 도식 */
function ValueChain() {
  const { select } = useService();
  return (
    <div className="relative rounded-2xl border bg-card/70 p-5 backdrop-blur-sm md:p-6" aria-label="ESG 이해관계자와 서비스 연결도">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-muted-foreground">ESG 요구는 기업으로 모입니다</p>
        <span className="font-mono text-[11px] text-muted-foreground/70">VALUE CHAIN</span>
      </div>
      <ul className="grid gap-1.5">
        {services.map((s) => (
          <li key={s.id}>
            <a
              href="#services"
              onClick={() => select(s.id)}
              className="group grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-accent"
            >
              <span className="truncate text-right text-[13px] text-muted-foreground">{s.stakeholder}</span>
              <span className="relative h-px w-6 bg-border md:w-10">
                <span className="absolute -top-[3px] -right-0.5 size-[7px] rounded-full border border-primary/60 bg-background transition-colors group-hover:bg-primary" />
              </span>
              <span className="truncate text-[14px] font-semibold">{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
        <span className="text-[13px] font-semibold opacity-80">교육으로 이해하고</span>
        <ArrowRight className="size-4" />
        <span className="text-[14px] font-bold">컨설팅으로 실행합니다</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative container grid items-center gap-12 pt-16 pb-20 md:pt-24 md:pb-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="animate-fade-up">
          <p className="mb-5 text-[13px] font-semibold text-primary">ESG 온라인 교육 · 컨설팅</p>
          <h1 className="text-[38px] leading-[1.22] font-extrabold tracking-[-0.03em] sm:text-5xl md:text-[58px]">
            ESG 보고서와 공시,
            <br />
            <span className="relative inline-block">
              배우면서
              <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9 C 50 2, 120 2, 198 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{" "}
            완성해요
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            실무자는 온라인 교육으로 기준과 방법을 익히고, 전문 컨설턴트는 그 위에서 우리 회사 보고서·공시·평가 대응을 함께 만듭니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild className="h-12 gap-2 px-6 text-[15px] font-semibold">
              <a href="#contact">
                무료 상담 신청
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 px-6 text-[15px] font-semibold">
              <a href="#education">교육 과정 보기</a>
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Check className="size-4 text-primary" />
            첫 상담에서 우리 회사에 필요한 ESG 대응 범위를 먼저 짚어 드려요.
          </p>
        </div>
        <div className="animate-fade-up [animation-delay:120ms]">
          <ValueChain />
        </div>
      </div>
      <div className="relative container pb-16">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border bg-card/60 md:grid-cols-4 md:divide-x">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("px-6 py-6", i < 2 && "border-b md:border-b-0", i % 2 === 0 && "border-r md:border-r-0")}>
              <dt className="text-[13px] text-muted-foreground">{s.label}</dt>
              <dd className="tabular mt-1 text-3xl font-extrabold tracking-tight">
                {s.n}
                <span className="ml-0.5 text-lg font-bold text-muted-foreground">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
