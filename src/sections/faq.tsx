import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { QA } from "@/components/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const KAKAO_CHANNEL_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || "";

const faqs = [
  {
    q: "교육만 따로 신청할 수 있나요? 컨설팅만 별도로 진행할 수도 있나요?",
    points: [
      "온라인 교육은 컨설팅 없이 단독으로 신청·수강(개인 직무 수강 또는 기업 단체 수강)하실 수 있습니다.",
      "반면 컨설팅 프로젝트를 진행할 때는 실무 내재화와 산출물 품질 확보를 위해 담당자 필수 교육을 반드시 포함하여 함께 진행합니다.",
      "외주 대행만으로 보고서를 납품하면 다음 해에 사내 역량이 남지 않기 때문이며, 별도 교육 과정만 필요한 기업은 교육 단독 과정으로 자유롭게 수강하실 수 있습니다.",
    ],
  },
  {
    q: "기업 교육비를 정부지원사업(고용보험 환급과정)으로 지원받을 수 있나요?",
    points: [
      "고용보험 가입 사업주가 소속 재직 임직원 교육을 진행할 때 '사업주 직업능력개발훈련(고용보험 환급)' 및 정부 바우처와 연계할 수 있도록 과정 설계를 지원합니다.",
      "환급 필수 요건: ① 반드시 사업주 명의 법인카드 또는 법인 계좌이체로 교육비를 납부해야 하며(임직원 개인 카드 선결제 시 환급 불가), ② 수강생이 진도율 80% 이상 및 평가 기준을 충족해 수료해야 합니다.",
      "지원 비율: NCS 기준단가 대비 우선지원대상기업(중소기업) 최대 90%, 1,000인 미만 중견기업 약 60%, 1,000인 이상 대규모기업 약 40% 수준이며, 한국생산성본부(KPC) 등 공인 환급 위탁과정 연계 및 기업별 당해 연도 지원한도를 사전 상담에서 함께 설계해 드립니다.",
    ],
  },
  {
    q: "지속가능경영보고서 발간에는 기간이 얼마나 걸리나요? (국문·영문·디지털)",
    points: [
      "기업의 ESG 데이터 관리 수준과 발간 이력, 선택 옵션에 따라 맞춤 조합으로 일정을 설계합니다.",
      "연례 발간 기업: 전년도 데이터 체계가 갖춰져 있는 경우 기획·작성·디자인·제3자 검증까지 통상 약 6개월이 소요됩니다.",
      "최초 발간 기업: 전사 데이터 수집 체계 세팅과 현황 진단·중대성 파악이 선행되어야 하므로, 연례 발간 기업보다 1~2개월 앞당겨 전년도 연말(11~12월)에 착수하시는 것을 권장합니다.",
      "추가 발간 옵션: 국문 본보고서 외에 영문 보고서 발간 시 약 1개월이 추가되며, 인터랙티브 디지털(웹) 보고서 구축 시 약 3개월이 추가됩니다.",
    ],
  },
  {
    q: "국내 기업의 IFRS(ISSB) · KSSB 지속가능성 공시는 언제부터 의무화되나요?",
    points: [
      "국내 지속가능성 공시(KSSB 기준, IFRS S1·S2 기반)는 거래소 자율공시가 아닌 자본시장법상 사업보고서 법정공시로 도입되며, 공표된 단계적 의무화 대상 및 시기는 다음과 같습니다.",
      "의무 대상 기간: ① 2028년(FY2027 실적) 연결자산총액 10조 원 이상 코스피 상장사 → ② 2029년(FY2028 실적) 5조 원 이상 코스피 상장사 → ③ 2030년(FY2029 실적) 2조 원 이상 코스피 상장사로 단계적 확대가 예정되어 있습니다(Scope 3 공급망 배출량은 각 의무화 시점부터 3년 유예, 제3자 인증은 2030년 의무화 추진).",
      "선제 준비 가이드: 법정공시 첫해부터 종속회사 연결 기준 온실가스 데이터 내부통제와 기후 시나리오 재무영향 분석이 요구되므로, 의무 적용 최소 1~2년 전부터 시범 산정과 Gap 진단을 미리 시작하셔야 법적 리스크를 막을 수 있습니다.",
    ],
  },
  {
    q: "비상장 중견·중소기업도 지금 ESG 진단과 보고서·탄소 산정이 필요한가요?",
    points: [
      "국내 법정공시 직접 대상이 아니더라도 유럽 수출 제품에 부과되는 EU 탄소국경조정제도(CBAM), 공급망 실사지침(CSDDD), 글로벌 바이어의 EcoVadis·CDP·RE100 요구가 계약 유지 및 입찰 조건으로 작동하고 있습니다.",
      "중견·중소기업은 방대한 전체 공시 대신 원청·바이어가 요구하는 핵심 항목(Scope 1·2·제품 탄소발자국, 노동·안전·윤리 규정, EcoVadis 증빙)만 압축 구축하고, 환경산업기술원(KEITI)·중진공 바우처 국고보조사업(50~85% 지원)과 연계해 초기 비용 부담을 낮추도록 안내합니다.",
    ],
  },
  {
    q: "온라인 강의실 수강 방식과 수료증 발급, 견적 산정 기준은 어떻게 되나요?",
    points: [
      "기업 계약 완료 즉시 전용 등록 링크를 통해 임직원별 업무용 회사 이메일 계정으로 강의가 열리며, 진도율 달성 시 수료증(100% 이수 표기 가능)이 자동 발급되고 교육 담당자가 부서별 수료증을 일괄 출력할 수 있습니다.",
      "견적은 단독 교육의 경우 과정 수·수강 인원 기준으로, 컨설팅의 경우 사전 상담에서 기업 수준에 맞는 과업 범위(필수 교육 포함·영문/디지털 옵션·검증 여부)를 확정한 뒤 투명하게 산출해 드립니다.",
    ],
  },
];

export function Faq() {
  const [kakaoNotice, setKakaoNotice] = useState(false);

  const handleKakaoClick = () => {
    if (KAKAO_CHANNEL_URL) {
      window.open(KAKAO_CHANNEL_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setKakaoNotice((v) => !v);
  };

  return (
    <QA
      id="faq"
      eyebrow="자주 묻는 질문"
      q={
        <>
          궁금한 점을{" "}
          <br />
          먼저 확인하세요
        </>
      }
      a="교육·환급제도·보고서 소요 기간·KSSB 법정공시 일정을 실무 기준으로 정리했습니다."
    >
      <Accordion type="single" collapsible defaultValue={faqs[0].q} className="border-t">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-b">
            <AccordionTrigger className="items-center py-5 text-left text-[16px] leading-snug font-bold break-keep hover:text-primary hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <ul className="space-y-2.5 text-[14.5px] leading-[1.72] break-keep text-foreground/85">
                {f.points.map((pt, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 하단 상담 신청하기 + 카카오톡으로 문의하기 투버튼 영역 (#3) */}
      <div className="mt-8 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[15.5px] font-extrabold">우리 회사 상황에 맞춘 일정·환급 가능 여부가 궁금하신가요?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              업무용 이메일 상담 신청 또는 카카오톡 빠른 문의 중 편한 창구로 남겨 주세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              onClick={handleKakaoClick}
              className="min-h-11 gap-2 bg-[#FEE500] px-5 text-sm font-extrabold text-[#191919] hover:bg-[#FDD800]"
            >
              <MessageCircle className="size-4" />
              카카오톡으로 문의하기
            </Button>
            <Button asChild className="min-h-11 gap-2 px-5 text-sm font-bold">
              <a href="#contact">
                상담 신청하기
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        {kakaoNotice && !KAKAO_CHANNEL_URL && (
          <div role="status" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-foreground">
            <strong>카카오톡 비즈니스 채널 연결 안내:</strong> 공식 채널 주소(`VITE_KAKAO_CHANNEL_URL`) 개설 연동 중입니다. 급한 문의는{" "}
            <a href="#contact" className="font-bold text-primary underline underline-offset-4">상담 신청하기</a> 또는 공식 메일(
            <span className="font-mono font-semibold">contact@cea.co.kr</span>)로 남겨 주시면 우선 회신드립니다.
          </div>
        )}
      </div>
    </QA>
  );
}
