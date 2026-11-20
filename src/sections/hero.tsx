import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";

/** 이해관계자 요구 → 우리 회사 → CEA 실무 완성 도식 */
function ValueChain() {
  const { select } = useService();
  return (
    <div className="relative rounded-2xl border bg-card/80 p-6 shadow-xs backdrop-blur-sm md:p-7" aria-label="ESG 이해관계자와 자문 영역 연결도">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-[14px] font-bold text-foreground/85">이해관계자의 ESG 요구는 기업 실무로 모입니다</p>
        <span className="text-xs font-semibold text-primary">분야 클릭 시 상세 이동</span>
      </div>
      <ul className="grid gap-2">
        {services.map((s) => (
          <li key={s.id}>
            <a
              href="#services"
              onClick={() => select(s.id)}
              className="group grid grid-cols-[1fr_auto_1.15fr] items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-150 hover:bg-accent"
            >
              <span className="truncate text-right text-[14px] font-medium text-muted-foreground">{s.stakeholder}</span>
              <span className="relative h-px w-6 bg-border md:w-9">
                <span className="absolute -top-[3px] -right-0.5 size-[7px] rounded-full border border-primary/60 bg-background transition-colors group-hover:bg-primary" />
              </span>
              <span className="truncate text-[15.5px] font-bold text-foreground group-hover:text-primary">{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-center text-primary-foreground">
        <span className="text-[14px] font-semibold opacity-95">실무 교육으로 기준을 잡고</span>
        <ArrowRight className="size-4 shrink-0" />
        <span className="text-[14.5px] font-extrabold">우리 회사 보고서·공시까지 직접 완성합니다</span>
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
      <div className="relative container grid items-center gap-12 pt-14 pb-20 md:pt-22 md:pb-26 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <div className="animate-fade-up break-keep">
          {/* 상단 최우선 배치 안내 (#13 · #14) */}
          <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-[13.5px] font-semibold text-foreground">
            <Check className="size-4 shrink-0 text-primary" />
            <span>첫 상담에서 우리 회사에 필요한 ESG 대응 범위를 먼저 짚어 드려요.</span>
          </div>

          <p className="mb-3 text-[14px] font-bold text-primary">주식회사 씨이에이(CEA) · ESG 실무 교육 &amp; 전문 자문</p>

          <h1 className="text-[38px] leading-[1.24] font-extrabold tracking-[-0.03em] sm:text-5xl md:text-[56px]">
            ESG 보고서와 공시,{" "}
            <br />
            <span className="relative inline-block">
              배우면서
              <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9 C 50 2, 120 2, 198 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{" "}
            완성해요
          </h1>

          <p className="mt-7 max-w-2xl text-[18px] leading-[1.72] text-muted-foreground md:text-[19px]">
            실무자는 온라인 교육으로 기준과 방법을 익히고,{" "}
            <br />
            전문 컨설턴트는 그 위에서 우리 회사 보고서·공시·평가 대응을
            <br className="hidden sm:inline" /> 함께 만듭니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild className="h-12 gap-2 px-6 text-[15.5px] font-semibold">
              <a href="#contact">
                무료 상담 신청
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 px-6 text-[15.5px] font-semibold">
              <a href="#education">교육 과정 보기</a>
            </Button>
            <Button asChild variant="secondary" className="h-12 px-5 text-[15px] font-semibold">
              <a href="#publications">정부지원사업 모아보기</a>
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
