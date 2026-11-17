// 온라인 교육 과정 — 7개 컨설팅 영역에 맞춘 예시 커리큘럼.
// 과정명·차시·대상은 초안이며 실제 개설 전 확정이 필요하다.

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
    title: "이해관계자가 요구하는 ESG, 한 번에 정리",
    desc: "투자자·고객사·규제 당국·평가기관이 각각 무엇을 묻는지, 우리 회사는 어디서부터 답해야 하는지 큰 그림을 잡습니다.",
    format: "VOD 6강 · 라이브 Q&A 1회",
    audience: "ESG 업무를 처음 맡은 실무자 · 전 직원 공통 교육",
    outcomes: ["ESG 용어와 주요 공시 기준 구분", "우리 회사 이해관계자 지도 작성", "다음에 들을 실무 과정 선택"],
    service: "disclosure",
  },
  {
    id: "report-writing",
    level: "실무",
    title: "지속가능경영보고서 기획부터 원고까지",
    desc: "환경 분석과 중대성 평가로 중요 이슈를 확정하고, 목차 기획과 원고 작성, AA1000 검증 준비까지 실제 발간 순서대로 배웁니다.",
    format: "VOD 8강 · 템플릿 제공",
    audience: "보고서 발간 담당자 · 홍보·IR 담당자",
    outcomes: ["이중 중대성 평가 수행", "보고서 목차와 원고 초안 작성", "검증 대비 근거자료 정리법"],
    service: "disclosure",
  },
  {
    id: "ghg-scope3",
    level: "실무",
    title: "온실가스 인벤토리와 Scope 3 산정",
    desc: "GHG Protocol·ISO 14064 기준으로 조직경계를 정하고 활동자료를 모아 Scope 1~3 배출량을 직접 계산해 봅니다.",
    format: "VOD 7강 · 산정 실습 시트",
    audience: "환경·안전 담당자 · 구매·공급망 담당자",
    outcomes: ["조직경계·운영경계 설정", "Scope 3 중요 카테고리 선별", "검증 가능한 산정 근거 관리"],
    service: "climate",
  },
  {
    id: "issb-kssb",
    level: "심화",
    title: "IFRS S2 · KSSB 기후공시 대응",
    desc: "지배구조·전략·리스크 관리·지표 및 목표 4개 축으로 공시 요구사항을 뜯어보고, 시나리오 분석과 재무영향 산정 방법을 익힙니다.",
    format: "VOD 6강 · 라이브 워크숍 1회",
    audience: "공시 의무화를 앞둔 상장사의 ESG·재무·IR 담당자",
    outcomes: ["IFRS S2 요구사항 Gap 점검", "기후 리스크 재무영향 산정 흐름 이해", "TNFD 자연자본 공시 개요"],
    service: "climate-disclosure",
  },
  {
    id: "supply-chain-dd",
    level: "실무",
    title: "공급망 ESG 실사와 인권영향평가",
    desc: "행동규범 수립, 협력사 자가진단(SAQ) 설계, 고위험 협력사 관리, UNGPs 기반 인권영향평가까지 실사 흐름을 다룹니다.",
    format: "VOD 6강 · SAQ 양식 제공",
    audience: "구매·협력사 관리 담당자 · 수출 제조기업 실무자",
    outcomes: ["CSDDD 등 실사 규제 요점 파악", "협력사 SAQ 문항 설계", "인권 리스크 식별·구제 절차"],
    service: "supply-chain",
  },
  {
    id: "rating-upgrade",
    level: "심화",
    title: "KCGS · MSCI · EcoVadis 등급 개선 전략",
    desc: "평가기관별 방법론 차이와 공통 지표를 비교하고, 한 번의 개선 활동으로 여러 평가 점수를 올리는 대응 계획을 세웁니다.",
    format: "VOD 7강 · 지표 매핑표 제공",
    audience: "ESG 평가 대응 담당자 · 경영기획 담당자",
    outcomes: ["전년도 평가결과 읽는 법", "요구사항 Gap 분석", "증빙자료 통합 관리 체계"],
    service: "esg-rating",
  },
  {
    id: "board-valueup",
    level: "심화",
    title: "이사회 운영과 밸류업 공시",
    desc: "이사회 평가, 사외이사 독립성, 주주총회 의안 대응, 기업가치 제고 계획 공시까지 지배구조 실무를 사례 중심으로 다룹니다.",
    format: "VOD 5강 · 임원 대상 라이브 1회",
    audience: "이사회 사무국 · 공시·법무 담당자 · 임원",
    outcomes: ["이사회 평가 지표 설계", "주주총회 의안별 대응 논리", "밸류업 공시 구성 요소"],
    service: "governance",
  },
  {
    id: "social-impact",
    level: "실무",
    title: "사회공헌 기획과 사회적 가치 측정",
    desc: "본업과 연계한 사회공헌 프로그램을 기획하고, 대체 비용법 등으로 성과를 화폐 가치로 환산해 보고서에 담는 법을 배웁니다.",
    format: "VOD 6강 · 측정 사례집",
    audience: "CSR·사회공헌 담당자 · 재단 실무자",
    outcomes: ["CSV 관점의 사업 재구성", "측정 대상·방법론 설정", "SDGs 연계 성과 공시"],
    service: "social-value",
  },
];
