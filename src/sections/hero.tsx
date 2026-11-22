import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";

/** 이해관계자 요구 → 우리 회사 → CEA 실무 완성 도식 */
function ValueChain() {
  const { select } = useService();
  return (
    <div className="relative rounded-2xl border bg-card/85 p-5 shadow-xs backdrop-blur-sm sm:p-6 md:p-7" aria-label="ESG 이해관계자와 자문 영역 연결도">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] leading-snug font-bold break-keep text-foreground/85">기후 · 금융 · 공급망 요구는 기업 실무로 모입니다</p>
        <span className="text-xs font-semibold text-primary">분야 클릭 시 상세 이동</span>
      </div>
      <ul className="grid gap-2.5 sm:gap-2">
        {services.map((s) => (
          <li key={s.id}>
            <a
              href="#services"
              onClick={() => select(s.id)}
              className="group flex min-h-11 flex-col justify-center gap-1 rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 transition-colors duration-150 hover:border-primary/40 hover:bg-accent sm:grid sm:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.35fr)] sm:items-center sm:gap-3 sm:border-transparent sm:bg-transparent sm:px-2.5 sm:py-2"
            >
              <span className="text-[12px] leading-snug font-semibold text-muted-foreground sm:text-right sm:text-[13px]">{s.stakeholder}</span>
              <span className="relative hidden h-px w-6 bg-border sm:block md:w-8">
                <span className="absolute -top-[3px] -right-0.5 size-[7px] rounded-full border border-primary/60 bg-background transition-colors group-hover:bg-primary" />
              </span>
              <span className="text-[14.5px] leading-snug font-bold break-keep text-foreground group-hover:text-primary sm:text-[15px]">{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-center leading-snug text-primary-foreground">
        <span className="text-[14px] font-semibold opacity-95">데이터·금융 모델링으로 전략을 세우고</span>
        <ArrowRight className="size-4 shrink-0" />
        <span className="text-[14.5px] font-extrabold">실무 교육과 자문으로 현장에 내재화합니다</span>
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
      <div className="relative container grid items-center gap-10 pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-22 md:pb-26 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-12">
        <div className="animate-fade-up break-keep">
          <div className="mb-5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 text-[11.5px] leading-tight font-bold text-primary sm:gap-2 sm:px-3.5 sm:text-[13px]">
            <Check className="size-3.5 shrink-0 text-primary sm:size-4" />
            <span className="break-keep">전환금융 · 기후 · RE100 · 택소노미 · 스타트업 ESG</span>
          </div>

          <p className="mb-3 text-[14px] font-bold text-foreground/80">
            주식회사 씨이에이(CEA) · Corporate Ecosystem Advisory
          </p>

          <h1 className="text-[32px] leading-[1.28] font-extrabold tracking-[-0.03em] sm:text-5xl md:text-[52px]">
            전환금융·기후·RE100부터{" "}
            <br />
            <span className="relative inline-block text-primary">
              택소노미와 투자 전략
              <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9 C 50 2, 120 2, 198 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            까지
          </h1>

          <div className="mt-6 max-w-2xl space-y-2 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17.5px] md:text-[18px]">
            <p>기후 시나리오·재무영향(TCFD)과 RE100 이행 전략, K-택소노미 적격성 자문 및 ESG 투자 전략을 수행합니다.</p>
            <p>스타트업·환경벤처와 글로벌 공급망 ESG 경영까지 데이터와 금융의 언어로 현장에 실행합니다.</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
            <Button asChild className="min-h-12 gap-2 px-6 text-[15.5px] font-semibold">
              <a href="#contact">
                전문 자문 · 상담 신청
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="min-h-12 px-6 text-[15.5px] font-semibold">
              <a href="#services">7대 핵심 자문 보기</a>
            </Button>
            <Button asChild variant="secondary" className="min-h-12 px-5 text-[15px] font-semibold">
              <a href="#education">온라인 아카데미</a>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <ValueChain />
        </div>
      </div>
    </section>
  );
}
