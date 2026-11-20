import { ArrowRight, Check, X } from "lucide-react";
import { QA } from "@/components/layout";

const entryCases = [
  {
    who: "투자자 · 규제당국 요구",
    title: "KSSB · TCFD 기후공시 및 지속가능경영보고서 준비",
    desc: "법정공시 의무화나 최초 보고서 발간을 앞두고 전사 데이터 수집 체계와 시범 산정부터 시작해야 하는 기업",
    serviceId: "tcfd-climate",
  },
  {
    who: "글로벌 바이어 · 원청 요구",
    title: "RE100 조달 로드맵 · EU CBAM 및 공급망 ESG 실사",
    desc: "수출 계약 유지와 입찰 참여를 위해 재생에너지 전환 계획서, 제품 탄소발자국, EcoVadis 평가 대응이 급한 기업",
    serviceId: "re100",
  },
  {
    who: "경영진 · 비용 효율화 요구",
    title: "정부지원사업 · 바우처 및 고용보험 환급 교육 연계",
    desc: "환경산업기술원·중진공 바우처나 사업주 환급 교육을 활용해 초기 예산 부담을 줄이면서 내부 실무진을 육성하려는 기업",
    serviceId: "esg-management",
  },
];

export function WhyNow() {
  return (
    <QA
      id="why-now"
      eyebrow="시작하기 전"
      q={
        <>
          ESG, 어디서부터{" "}
          <br />
          손대야 하나요?
        </>
      }
      a="우리 회사에 지금 가장 먼저 답을 요구하는 상대부터 짚으면 우선순위가 명확해집니다."
    >
      <p className="mb-8 text-[15.5px] leading-[1.72] break-keep text-muted-foreground">
        투자자는 기후·재무 영향 공시를, 글로벌 고객사는 공급망 탄소·인권 증빙을, 평가기관은 검증된 데이터 근거를 요구합니다.
        <br />한 번에 모든 과제를 벌이기보다 지금 기한이 정해진 핵심 과제 하나를 교육과 함께 해결하는 편이 가장 빠르고 정확합니다.
      </p>

      {/* 상단 ValueChain과 중복되던 7개 단순 리스트를 제거하고(#15), 기업 상황별 3대 출발 가이드로 구성 */}
      <div className="grid gap-3.5">
        {entryCases.map((c) => (
          <a
            key={c.title}
            href="#services"
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-primary">{c.who}</span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1.5 text-[16px] font-bold">{c.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{c.desc}</p>
          </a>
        ))}
      </div>
    </QA>
  );
}

const steps = [
  { t: "필수 실무 교육", d: "컨설팅 착수 시 담당자가 기준과 핵심 용어를 먼저 익힙니다. 같은 기준으로 소통하면 프로젝트 기간이 단축되고 산출물 이해도가 높아집니다.", tag: "컨설팅 필수 포함 · 단독 수강 가능" },
  { t: "현황 · Gap 진단", d: "우리 회사 데이터 관리 현황과 공시·고객사 요구 수준의 차이를 점검하고, 이번 프로젝트의 범위와 발간·대응 일정을 역산합니다.", tag: "사전 진단" },
  { t: "맞춤 자문 · 공동 작성", d: "지속가능경영보고서 발간, Scope 1~3 배출량 산정, RE100·평가 대응 등 확정한 범위를 전문 컨설턴트가 실무진과 함께 완성합니다.", tag: "본 과업" },
  { t: "내재화 · 차년도 연계", d: "산정 시트와 작성 매뉴얼을 사내에 인계하여 다음 해에는 내부 인력이 주도적으로 운영할 수 있도록 사후 점검을 지원합니다.", tag: "연간 내재화" },
];

export function Process() {
  return (
    <QA
      id="process"
      eyebrow="진행 방식"
      q={
        <>
          교육과 컨설팅,{" "}
          <br />
          어떻게 이어지나요?
        </>
      }
      a="실무자가 교육을 통해 직접 이해하고 만들어야 결과물이 회사 안에 남습니다."
    >
      <ol className="relative">
        {steps.map((s, i) => (
          <li key={s.t} className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && <span className="absolute top-10 left-[19px] h-[calc(100%-2.5rem)] w-px bg-border" aria-hidden="true" />}
            <span className="tabular grid size-10 place-items-center rounded-full border border-primary/50 bg-primary/10 font-mono text-[13px] font-bold text-primary">
              {i + 1}
            </span>
            <div className="pt-1.5">
              <p className="flex flex-wrap items-center gap-2 font-bold">
                {s.t}
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{s.tag}</span>
              </p>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </QA>
  );
}

const fits = [
  { t: "기한 내에 보고서 발간·법정공시·고객사 실사에 대응해야 합니다", d: "연례·최초 지속가능경영보고서, KSSB 기후공시 사전 준비, 바이어 ESG 실사처럼 명확한 일정이 정해진 기업." },
  { t: "ESG 전담 인력이 새로 배치되어 기초부터 함께 잡아야 합니다", d: "담당자 실무 교육과 첫해 컨설팅을 결합해 시행착오 없이 표준 체계를 세우려는 기업." },
  { t: "정부지원사업·바우처·환급 교육과 연계해 도입하고 싶습니다", d: "환경산업기술원·중진공 바우처나 고용보험 환급과정을 활용해 합리적인 예산으로 추진하려는 중견·중소기업." },
  { t: "일회성 외주가 아니라 사내에 데이터 관리 역량을 남기고 싶습니다", d: "산정 로직과 보고서 작성 체계를 내부 실무진이 직접 운영할 수 있도록 내재화하려는 기업." },
];
const notFits = [
  { t: "현업 데이터 확인 없이 외주 대행만으로 보고서를 받고 싶습니다", d: "실무자 참여와 실증 데이터 없는 대행 방식은 검증 통과와 사후 관리가 불가능해 진행하지 않습니다." },
  { t: "실제 개선 근거 없이 단기 평가 등급만 높이려 합니다", d: "증빙 없는 서술은 그린워싱 제재와 차년도 평가 하락으로 이어지므로 권하지 않습니다." },
];

export function Fit() {
  return (
    <section id="fit" className="border-t py-16 md:py-24">
      <div className="container break-keep">
        <p className="mb-3 text-[13px] font-semibold text-primary">도입 적합 기업 안내</p>
        <h2 className="max-w-2xl text-[28px] leading-[1.32] font-bold tracking-[-0.02em] md:text-[34px]">
          우리 회사 상황에 맞는지 먼저 확인해 보세요
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Check className="size-4 text-primary" /> 이런 기업에 적합합니다
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {fits.map((f) => (
                <li key={f.t} className="rounded-xl border bg-card p-5">
                  <p className="leading-snug font-bold">{f.t}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <X className="size-4" /> 이런 방식은 진행하지 않습니다
            </p>
            <ul className="grid gap-3">
              {notFits.map((f) => (
                <li key={f.t} className="rounded-xl border border-dashed p-5">
                  <p className="leading-snug font-bold text-foreground/80">{f.t}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
