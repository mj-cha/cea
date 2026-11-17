import { ArrowRight, Check, X } from "lucide-react";
import { QA } from "@/components/layout";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";

export function WhyNow() {
  const { select } = useService();
  return (
    <QA
      eyebrow="시작하기 전"
      q={
        <>
          ESG, 어디서부터
          <br />
          손대야 하나요?
        </>
      }
      a="우리 회사에 ESG를 묻는 상대가 누구인지부터 정리하면 순서가 보여요."
    >
      <p className="mb-8 leading-relaxed text-muted-foreground">
        투자자는 공시를, 고객사는 공급망 실사를, 평가기관은 등급 근거를 요구합니다. 요구하는 쪽마다 필요한 대응이 다르기 때문에, 한 번에 모든 걸 하기보다 지금 가장 급한 요구부터 답하는 편이 빠릅니다.
      </p>
      <ul className="divide-y border-y">
        {services.map((s) => (
          <li key={s.id}>
            <a
              href="#services"
              onClick={() => select(s.id)}
              className="group flex items-center gap-4 py-4 transition-colors duration-150 hover:text-primary"
            >
              <span className="w-28 shrink-0 text-[13px] text-muted-foreground md:w-36">{s.stakeholder}</span>
              <span className="font-semibold">{s.title}</span>
              <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ul>
    </QA>
  );
}

const steps = [
  { t: "온라인 교육", d: "담당자가 먼저 기준과 용어를 익힙니다. 회의에서 같은 말을 쓰게 되면 컨설팅 기간이 짧아집니다.", tag: "1~2주" },
  { t: "진단 워크숍", d: "우리 회사 자료로 현재 수준과 요구사항의 차이(Gap)를 함께 점검하고, 이번에 할 범위를 정합니다.", tag: "1회" },
  { t: "컨설팅 실행", d: "보고서 발간, 배출량 산정, 평가 대응 등 정한 범위를 전문 컨설턴트가 끝까지 함께 만듭니다.", tag: "프로젝트" },
  { t: "내재화 · 사후관리", d: "결과물과 작업 방식을 인계하고, 다음 해 평가·공시 일정에 맞춰 다시 점검합니다.", tag: "연간" },
];

export function Process() {
  return (
    <QA
      id="process"
      eyebrow="진행 방식"
      q={
        <>
          교육과 컨설팅,
          <br />
          어떻게 이어지나요?
        </>
      }
      a="배운 사람이 함께 만들고, 만든 결과가 회사에 남도록 진행해요."
    >
      <ol className="relative">
        {steps.map((s, i) => (
          <li key={s.t} className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && <span className="absolute top-10 left-[19px] h-[calc(100%-2.5rem)] w-px bg-border" aria-hidden="true" />}
            <span className="tabular grid size-10 place-items-center rounded-full border border-primary/50 bg-primary/10 font-mono text-[13px] font-bold text-primary">
              {i + 1}
            </span>
            <div className="pt-1.5">
              <p className="flex items-center gap-2 font-bold">
                {s.t}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{s.tag}</span>
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
  { t: "올해 안에 보고서나 공시를 내야 합니다", d: "발간 일정, 공시 의무화, 고객사 요청처럼 미룰 수 없는 기한이 있는 경우." },
  { t: "ESG 담당자가 새로 정해졌습니다", d: "담당자는 교육으로 빠르게 익히고, 첫해 실무는 컨설턴트와 함께 해 나가는 경우." },
  { t: "평가 등급이나 고객사 심사 결과가 아쉬웠습니다", d: "전년도 결과를 근거로 무엇을 고칠지 정하고 싶은 경우." },
  { t: "결과물을 회사 안에 남기고 싶습니다", d: "다음 해에는 내부 인력이 직접 할 수 있도록 방법까지 가져가려는 경우." },
];
const notFits = [
  { t: "보고서 한 권만 빠르게 받고 싶습니다", d: "담당자 참여 없이 결과물만 받는 방식은 맞지 않습니다." },
  { t: "근거 없이 등급만 올리고 싶습니다", d: "데이터와 증빙이 없는 개선은 다음 평가에서 그대로 드러납니다." },
];

export function Fit() {
  return (
    <section className="border-t py-20 md:py-28">
      <div className="container">
        <p className="mb-4 text-[13px] font-semibold text-primary">맞는 기업 · 안 맞는 기업</p>
        <h2 className="max-w-2xl text-[28px] leading-[1.3] font-bold tracking-[-0.02em] md:text-[34px]">모든 기업에 같은 방식이 맞지는 않습니다</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Check className="size-4 text-primary" /> 이런 기업에 잘 맞습니다
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
              <X className="size-4" /> 이런 경우는 권하지 않습니다
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
