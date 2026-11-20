import { morePublicNotices } from "./publications-public-more";

export type PublicPubCategory = "전체" | "정부·공공 지원사업" | "공공기관 연구·발간물" | "주요 정책 · 기사";
export type SupportStatus = "접수중" | "상시접수" | "공고예정" | "연구발간" | "정책브리핑";

export interface PublicNoticeItem {
  id: string;
  no: string;
  category: Exclude<PublicPubCategory, "전체">;
  status: SupportStatus;
  agency: string;
  topicTag: string;
  title: string;
  date: string;
  periodText: string;
  targetScale: string;
  fitReason: string;
  summary: string[];
  keyPoints: string[];
  externalUrl: string;
  relatedServiceId: string;
}

export const PUBLIC_PUB_CATEGORIES: PublicPubCategory[] = [
  "전체",
  "정부·공공 지원사업",
  "공공기관 연구·발간물",
  "주요 정책 · 기사",
];

const corePublicNotices: PublicNoticeItem[] = [
  {
    id: "gov-keiti-carbon-consult-2026",
    no: "01",
    category: "정부·공공 지원사업",
    status: "접수중",
    agency: "한국환경산업기술원 (KEITI)",
    topicTag: "환경·탄소중립 컨설팅 지원",
    title: "2026년 중소·중견기업 글로벌 환경규제 및 탄소중립(ESG) 컨설팅 지원사업 공고",
    date: "2026-11",
    periodText: "2026.11.04 ~ 예산 소진 시",
    targetScale: "국내 중소·중견 수출기업 · 기업당 최대 4,000만 원 (국고보조 70~80%)",
    fitReason: "EU CBAM·공급망 실사·제품 탄소발자국(LCA) 대응이 시급한 수출 제조기업에 가장 유리한 국고보조 사업입니다.",
    summary: [
      "환경부 산하 한국환경산업기술원(KEITI)에서 국내 수출 중소·중견기업의 글로벌 환경·ESG 규제(EU CBAM, 공급망 실사, 에코디자인, EcoVadis 등) 적기 대응을 위해 전문 컨설팅 비용의 최대 80%를 지원합니다.",
      "사업장 온실가스(Scope 1·2·3) 인벤토리 구축, 제품별 전과정평가(LCA) 탄소발자국 산정, 글로벌 바이어 요구 ESG 진단 및 시정조치 체계 구축 과제를 선택해 신청할 수 있습니다.",
    ],
    keyPoints: [
      "수행기관 컨설팅 + 실무 담당자 내재화 교육을 패키지로 구성해 신청 가능",
      "직전 연도 직·간접 수출 실적 보유 기업 및 원청 협력사 우대 가점 부여",
      "환경산업기술원 중소환경기업 사업화·컨설팅 지원 포털(KONETIC) 온라인 접수",
    ],
    externalUrl: "https://www.keiti.re.kr",
    relatedServiceId: "supply-chain",
  },
  {
    id: "gov-kosmes-esg-voucher-2026",
    no: "02",
    category: "정부·공공 지원사업",
    status: "접수중",
    agency: "중소벤처기업부 · 중소벤처기업진흥공단",
    topicTag: "탄소중립 경영혁신 바우처",
    title: "2026년 중소기업 탄소중립 경영혁신 바우처 및 ESG 심층진단 지원사업",
    date: "2026-10",
    periodText: "하반기 추가 모집 접수중",
    targetScale: "제조 중소기업 · 기업당 최대 5,000만 원 바우처 (정부지원 50~85%)",
    fitReason: "매출액 규모에 따라 최대 85%까지 바우처로 보조받아 온실가스 감축 진단과 ESG 경영체계를 동시에 구축할 수 있습니다.",
    summary: [
      "고탄소 업종 및 공급망 협력 중소기업의 저탄소 전환을 돕기 위해 탄소중립 수준 진단, 온실가스 인벤토리 구축, 에너지 효율화 컨설팅 및 친환경 인증 취득을 바우처 형태로 지원합니다.",
      "최근 3개년 평균 매출액에 따라 정부지원율이 차등(120억 이하 85% ~ 500억 초과 50%) 적용되어 초기 ESG 도입 비용 부담을 크게 줄일 수 있습니다.",
    ],
    keyPoints: [
      "탄소중립 경영 컨설팅 · 공정 진단 · 친환경 인증(ISO 14001·환경성적표지) 선택 조합",
      "공급망 원청기업의 ESG 평가 요구서(SAQ) 보유 협력사 선정 우대",
      "혁신바우처 플랫폼 온라인 사업계획서 제출 전 사전 진단 설계 권장",
    ],
    externalUrl: "https://www.mssmiv.com",
    relatedServiceId: "esg-management",
  },
  {
    id: "res-keei-ppa-re100-2026",
    no: "03",
    category: "공공기관 연구·발간물",
    status: "연구발간",
    agency: "에너지경제연구원 (KEEI)",
    topicTag: "RE100 · PPA 전력시장 분석",
    title: "[KEEI 에너지포커스] 국내 기업의 재생에너지 조달(직접 PPA · REC) 경제성 비교와 전력시장 제도 변화",
    date: "2026-11",
    periodText: "2026년 11월호 정기간행물",
    targetScale: "RE100 추진 기업 · 전력구매 및 기후공시 담당자 필독 자료",
    fitReason: "산업용 전기요금 인상 국면에서 녹색프리미엄·REC·직접 PPA 중 우리 회사에 유리한 장기 계약 시점을 판단하는 공인 기준 자료입니다.",
    summary: [
      "국책연구기관인 에너지경제연구원(KEEI)이 발간한 본 분석 보고서는 국내 산업용 전력요금 개편과 재생에너지 발전단가(LCOE) 추이를 바탕으로 기업별 RE100 조달 수단의 중장기 비용 구조를 비교합니다.",
      "특히 직접 PPA 망사용료 지원 정책 변화, 현물·장기계약 REC 가격 변동성, 그리고 글로벌 CDP·RE100 기술위원회의 Scope 2 시장기반 감축 인정 요건을 실증 데이터로 정리했습니다.",
    ],
    keyPoints: [
      "산업용 전기요금 대비 태양광·풍력 직접 PPA 손익분기 시점 시뮬레이션",
      "단기(녹색프리미엄·REC) 및 중장기(직접 PPA·자가발전) 혼합 포트폴리오 권고",
      "전력다소비 제조 사업장의 시간대별 부하 패턴을 고려한 조달 물량 산정",
    ],
    externalUrl: "https://www.keei.re.kr",
    relatedServiceId: "re100",
  },
  {
    id: "gov-hrd-kpc-refund-2026",
    no: "04",
    category: "정부·공공 지원사업",
    status: "상시접수",
    agency: "고용노동부 · 한국산업인력공단 · KPC",
    topicTag: "사업주 직업능력개발훈련 (교육비 환급)",
    title: "고용보험 사업주 직업능력개발훈련을 통한 임직원 ESG 실무 교육비 환급 제도 안내",
    date: "2026-10",
    periodText: "연중 상시 (과정 개강 전 신청)",
    targetScale: "고용보험 가입 기업 · 훈련비 기준단가의 40~90% 환급 지원",
    fitReason: "임직원 단체 ESG 교육을 도입할 때 법인 명의 결제와 수료율(80% 이상) 요건을 충족해 교육비 부담을 대폭 낮출 수 있는 핵심 제도입니다.",
    summary: [
      "고용보험에 가입한 사업주가 소속 재직 근로자의 직무 역량 강화를 위해 공인 환급과정(한국생산성본부 KPC 등 위탁·원격훈련 포함)을 실시할 경우, 기업 규모에 따라 교육비 기준금액의 40~90%를 한국산업인력공단으로부터 환급받습니다.",
      "우선지원대상기업(중소기업)은 기준단가의 최대 90%(연간 납부 개산보험료의 240% 한도), 1,000인 미만 중견기업은 60%, 1,000인 이상 대기업은 40%가 적용됩니다.",
    ],
    keyPoints: [
      "필수 주의: 반드시 사업주 명의 법인카드 또는 법인 계좌로 교육비를 납부해야 환급 가능(개인 카드 불가)",
      "수료 요건: 온라인 원격훈련 진도율 80% 이상 + 평가 통과 후 정식 수료증 발급",
      "기업별 당해 연도 고용보험 지원금 잔여 한도 사전 조회 후 과정 편성",
    ],
    externalUrl: "https://www.hrd.go.kr",
    relatedServiceId: "esg-management",
  },
  {
    id: "pol-fsc-kssb-roadmap-2026",
    no: "05",
    category: "주요 정책 · 기사",
    status: "정책브리핑",
    agency: "금융위원회 · 한국회계기준원 (KSSB)",
    topicTag: "KSSB 지속가능성 법정공시 로드맵",
    title: "국내 지속가능성(ESG) 공시 제도화 로드맵: 2028년 자산 10조 상장사부터 단계적 법정공시 시행",
    date: "2026-09",
    periodText: "국내 상장사 의무공시 기준 공표",
    targetScale: "코스피 상장사 (2028년 10조 → 2029년 5조 → 2030년 2조 원 이상)",
    fitReason: "거래소 자율공시가 아닌 자본시장법상 사업보고서 법정공시로 직행하므로 의무 대상 연도 1~2년 전부터 시범 산정이 필수입니다.",
    summary: [
      "금융위원회와 관계기관이 발표한 지속가능성 공시 제도화 방안에 따라 국내 KSSB(IFRS S1·S2 기반) 공시는 자본시장법상 사업보고서 법정공시로 도입되며, 연결자산총액 10조 원 이상 코스피 상장사가 2028년(FY2027 실적)부터 첫 의무공시를 시작합니다.",
      "이어 2029년(FY2028 실적) 5조 원 이상, 2030년(FY2029 실적) 2조 원 이상 코스피 상장사로 확대되며, Scope 3 공급망 배출량은 각 의무화 시점부터 3년 유예, 제3자 인증은 2030년 의무화가 추진됩니다.",
    ],
    keyPoints: [
      "시행 초기 3년간 예측·추정 정보에 대한 한시적 책임 면제(Safe Harbor) 병행 추진",
      "연결 기준 종속회사 온실가스 데이터 내부통제 및 재무영향 분석 사전 구축 필요",
      "최초 발간·공시 준비 기업은 데이터 검증 기간을 고려해 연말 조기 착수 권장",
    ],
    externalUrl: "https://www.fsc.go.kr",
    relatedServiceId: "tcfd-climate",
  },
  {
    id: "gov-keco-ghg-subsidy-2026",
    no: "06",
    category: "정부·공공 지원사업",
    status: "공고예정",
    agency: "환경부 · 한국환경공단 (K-eco)",
    topicTag: "온실가스 감축설비 · 탄소산정 보조",
    title: "탄소중립 설비투자 국고보조사업 및 중소사업장 온실가스 인벤토리 구축 지원 안내",
    date: "2026-08",
    periodText: "매년 연초 본공고 · 연말 사전 수요조사",
    targetScale: "배출권 할당업체 및 중소·중견 사업장 · 설비투자비 50~70% 국고 보조",
    fitReason: "노후 보일러·공정 설비 교체나 인버터·폐열회수 도입 계획이 있는 사업장이 설비 투자비의 최대 70%를 지원받을 수 있습니다.",
    summary: [
      "한국환경공단(K-eco)은 중소·중견기업의 실질적인 Scope 1·2 온실가스 감축을 위해 고효율 설비 교체, 연료 전환, 폐열 회수, 자가 태양광 설치 비용의 50~70%를 국고보조금으로 지원합니다.",
      "보조금 선정 평가에서 온실가스 예상 감축량 산정 근거서의 정합성이 당락을 좌우하므로, 전년도 하반기부터 사전 진단과 감축량 산정서를 미리 준비하는 기업이 선정에 유리합니다.",
    ],
    keyPoints: [
      "예상 온실가스 감축량(tCO2eq) 산정 및 투자비 회수기간 타당성 검토서 필수 제출",
      "한국형 녹색분류체계(K-택소노미) 인정 활동 부합 시 녹색금융 우대금리 연계 가능",
      "환경공단 국고보조금 통합관리시스템(e나라도움) 연계 정산 관리",
    ],
    externalUrl: "https://www.keco.or.kr",
    relatedServiceId: "tcfd-climate",
  },
];

export const publicNotices: PublicNoticeItem[] = [...corePublicNotices, ...morePublicNotices];
