// 온라인 교육 과정 — 7개 핵심 컨설팅 영역(RE100, ESG 관리체계, TCFD, Green Procurement, Real Value, 책임투자, 공시·검증) 연계 커리큘럼

export type Level = "입문" | "실무" | "심화";
export type Course = {
  id: string;
  level: Level;
  title: string;
  desc: string;
  format: string;
  audience: string;
  outcomes: string[];
  service: string; // services.ts의 id
};

export const levels: Level[] = ["입문", "실무", "심화"];

export const courses: Course[] = [
  {
    id: "esg-101",
    level: "입문",
    title: "ESG 관리체계 수립과 글로벌 규제 한 번에 정리",
    desc: "투자자·고객사·규제 당국이 요구하는 핵심 기준을 파악하고, 우리 회사의 전사 ESG 관리체계와 KPI를 어떻게 세울지 큰 그림을 잡습니다.",
    format: "VOD 6강 · 라이브 Q&A 1회",
    audience: "ESG 업무를 처음 맡은 실무자 · 전 직원 공통 교육",
    outcomes: ["전사 ESG 전략 및 거버넌스 구조 이해", "부서별 ESG 핵심성과지표(KPI) 설계법", "글로벌 공시·규제 대응 로드맵 수립"],
    service: "esg-management",
  },
  {
    id: "board-valueup",
    level: "실무",
    title: "RE100 이행 전략과 PPA · REC 조달 실무",
    desc: "사업장 전력 사용량 진단부터 직접/제3자 PPA, REC, 녹색프리미엄의 경제성(LCOE) 비교 분석과 연도별 RE100 로드맵 수립 실무를 배웁니다.",
    format: "VOD 7강 · LCOE 경제성 분석 시트 제공",
    audience: "에너지·환경·구매 담당자 · 글로벌 수출 기업 ESG 팀",
    outcomes: ["RE100 이행 수단별 단가·리스크 비교 모델링", "장기 PPA 계약 핵심 조건 및 회계 이슈 파악", "CDP·글로벌 고객사 RE100 이행보고서 작성"],
    service: "re100",
  },
  {
    id: "issb-kssb",
    level: "심화",
    title: "TCFD 보고서 발간 및 기후 시나리오 · 재무영향 분석",
    desc: "TCFD 및 IFRS S2·KSSB 4대 축(지배구조·전략·위험관리·지표)을 해부하고, NGFS/IEA 시나리오 기반 물리적·전환 리스크 재무영향을 산정합니다.",
    format: "VOD 8강 · 시나리오 재무영향 워크숍 1회",
    audience: "기후공시 의무화 대상 상장사의 ESG·재무·리스크 담당자",
    outcomes: ["TCFD·IFRS S2 기후공시 보고서 원고 작성", "1.5℃/2℃ 시나리오별 재무영향(Climate VaR) 산출", "TNFD 자연자본 LEAP 분석 개요"],
    service: "tcfd-climate",
  },
  {
    id: "ghg-scope3",
    level: "실무",
    title: "온실가스 인벤토리와 Scope 3 · LCA 산정 실무",
    desc: "GHG Protocol·ISO 14064 기준으로 연결 조직경계를 정하고 활동자료를 모아 Scope 1~3 배출량과 제품 탄소발자국을 직접 계산합니다.",
    format: "VOD 7강 · 산정 실습 시트 제공",
    audience: "환경·안전 담당자 · 구매·생산기술 담당자",
    outcomes: ["연결 기준 조직경계·운영경계 설정", "Scope 3 15개 카테고리 중요도 선별 및 산정", "제3자 검증 대비 산정 근거 및 내부통제 관리"],
    service: "tcfd-climate",
  },
  {
    id: "supply-chain-dd",
    level: "실무",
    title: "Green Procurement(녹색구매)와 공급망 ESG 실사",
    desc: "친환경 저탄소 조달 기준 설계, 협력사 행동규범 수립, 자가진단(SAQ) 배포, 고위험 협력사 현장 실사 및 EU CSDDD·CBAM 대응 흐름을 다룹니다.",
    format: "VOD 6강 · 녹색구매 지침 & SAQ 양식 제공",
    audience: "구매·조달·협력사 관리 담당자 · 수출 제조기업 실무자",
    outcomes: ["Green Procurement 정책 및 입찰 평가 반영법", "협력사 ESG SAQ 문항 설계 및 현장 실사", "공급망 탄소(Scope 3) 데이터 수집 체계 구축"],
    service: "supply-chain",
  },
  {
    id: "social-impact",
    level: "실무",
    title: "Real Value Measurement: 사회적·통합 가치 화폐화 측정",
    desc: "기업 경영활동과 사회공헌(CSV)이 창출하는 경제·환경·사회 임팩트를 화폐 가치(원화)로 환산하고 SROI(사회적 투자수익률)를 분석합니다.",
    format: "VOD 6강 · 화폐화 Proxy 계수표 및 측정 사례집",
    audience: "ESG·CSR·사회공헌 담당자 · 경영기획 실무자",
    outcomes: ["Input-Output-Outcome-Impact 경로 설계", "환경·사회 외부효과 화폐화 산식 및 계수 적용", "이사회 보고용 Real Value 통합 손익표 작성"],
    service: "social-value",
  },
  {
    id: "rating-upgrade",
    level: "심화",
    title: "책임투자(PRI) · ESG 펀드 운영 및 ESG 실사(DD) 전략",
    desc: "기관투자자·운용사·PEF 관점의 책임투자 체계, ESG 펀드 상품 설계·스크리닝, M&A 투자 전 ESG Due Diligence 및 피투자사 밸류업을 다룹니다.",
    format: "VOD 7강 · ESG DD 체크리스트 & PCAF 시트 제공",
    audience: "금융기관·운용사·PEF 심사역 · 기업 IR·M&A 담당자",
    outcomes: ["UN PRI 및 국내외 ESG 펀드 공시 규제 대응", "M&A ESG 실사(Red Flag 식별 및 재무 반영)", "PCAF 금융배출량 산정 및 포트폴리오 밸류업"],
    service: "responsible-investment",
  },
  {
    id: "report-writing",
    level: "실무",
    title: "지속가능경영보고서 발간 · AA1000 검증 및 평가 대응",
    desc: "이중 중대성 평가로 핵심 이슈를 확정하고, 보고서 원고 작성과 AA1000 검증, KCGS·MSCI·DJSI·EcoVadis 등급 개선 전략을 한 번에 익힙니다.",
    format: "VOD 8강 · 보고서 템플릿 & 평가 매핑표 제공",
    audience: "보고서 발간 담당자 · ESG 평가 대응·IR 담당자",
    outcomes: ["GRI·ISSB 기반 이중 중대성 평가 수행", "AA1000 제3자 검증 대비 증빙자료 관리", "KCGS·MSCI·EcoVadis 동시 등급 상향 전략"],
    service: "disclosure",
  },
];
