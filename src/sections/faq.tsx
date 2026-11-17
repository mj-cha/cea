import { QA } from "@/components/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "교육만 듣거나 컨설팅만 받아도 되나요?",
    a: "네. 각각 따로 신청할 수 있어요. 다만 담당자가 교육을 먼저 들으면 컨설팅 회의가 짧아지고 결과물을 내부에서 이어받기 쉬워서, 함께 진행하는 경우가 많습니다.",
  },
  {
    q: "상장사가 아닌 중견·중소기업도 해당되나요?",
    a: "네. 공시 의무가 없어도 글로벌 고객사의 공급망 실사, EcoVadis 평가, 원청의 협력사 자가진단 요구에 대응해야 하는 경우가 늘고 있어요. 회사 규모와 요구 수준에 맞게 범위를 줄여 진행합니다.",
  },
  {
    q: "지속가능경영보고서 발간에는 얼마나 걸리나요?",
    a: "환경 분석 → 기획·작성 → 디자인 → 제3자 검증 4단계로 진행하며, 자료 준비 상태와 검증 일정에 따라 기간이 달라집니다. 첫 상담에서 발간 목표일 기준으로 일정을 역산해 드려요.",
  },
  {
    q: "IFRS S2·KSSB 공시는 언제부터 준비해야 하나요?",
    a: "적용 시점은 기업 규모와 상장 여부에 따라 다릅니다. 온실가스 배출량 산정과 기후 리스크 평가는 데이터가 쌓이는 데 시간이 걸리므로, 의무화 전에 한 해라도 먼저 시험 산정해 보는 것을 권합니다.",
  },
  {
    q: "온라인 교육은 어떻게 수강하나요?",
    a: "과정별 VOD를 원하는 시간에 듣고, 정해진 일정의 라이브 Q&A나 워크숍에서 질문할 수 있어요. 기업 단체 수강과 사내 맞춤 과정도 문의로 안내해 드립니다.",
  },
  {
    q: "비용은 어떻게 정해지나요?",
    a: "교육은 과정·인원 기준, 컨설팅은 범위와 기간 기준으로 견적을 드립니다. 상담에서 필요한 범위를 먼저 정한 뒤 견적을 안내하고, 이후 범위가 바뀌지 않으면 금액도 바뀌지 않습니다.",
  },
];

export function Faq() {
  return (
    <QA
      id="faq"
      eyebrow="자주 묻는 질문"
      q={
        <>
          궁금한 점을
          <br />
          먼저 확인하세요
        </>
      }
    >
      <Accordion type="single" collapsible className="border-t">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-b">
            <AccordionTrigger className="items-center py-5 text-[16px] font-semibold hover:text-primary hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </QA>
  );
}
