// 온라인 교육 과정 — 최상단 1~4번에 ① RE100·PPA·전환금융, ② K-택소노미·ESG 투자 전략, ③ 스타트업·환경벤처 ESG 경영·투자유치, ④ Scope 1~3 탄소회계·PCF(CBAM) 전면 배치
import { hmcEcovadisCourses, hmcEcovadisCourseIds } from "@/data/courses-hmc-ecovadis";

export type Level = "입문" | "실무" | "심화";
export type CourseTrack = "core" | "hmc-ecovadis";
export type EsgDomain = "환경(E)" | "사회(S)" | "거버넌스(G)";
export type CoursePriority = "최우선" | "우선" | "정규" | "시범";

export type Course = {
  id: string;
  track?: CourseTrack;
  level: Level;
  title: string;
  desc: string;
  format: string;
  audience: string;
  outcomes: string[];
  service: string; // services.ts의 id
  durationMin?: number;
  esgDomain?: EsgDomain;
  topic?: string;
  hmcCode?: string;
  ecovadisCode?: string;
  priority?: CoursePriority;
};

export const levels: Level[] = ["입문", "실무", "심화"];
export const esgDomains: EsgDomain[] = ["환경(E)", "사회(S)", "거버넌스(G)"];

export const coreCourses: Course[] = [
  {
    id: "board-valueup",
    level: "실무",
    title: "RE100 이행 전략과 PPA · REC 조달 및 전환금융 실무",
    desc: "사업장 전력 사용량 진단부터 직접/제3자 PPA, REC, 녹색프리미엄의 경제성(LCOE) 비교 분석과 전환금융 조달, 연도별 RE100 로드맵 수립 실무를 배웁니다.",
    format: "VOD 7강 · LCOE 경제성 분석 시트 제공",
    audience: "에너지·환경·재무·구매 담당자 · 글로벌 수출·방산·제조 기업 ESG 팀",
    outcomes: ["RE100 이행 수단별 단가·리스크 비교 모델링", "장기 PPA 계약 핵심 조건 및 전환금융 연계", "CDP·글로벌 고객사 RE100 이행보고서 작성"],
    service: "re100",
  },
  {
    id: "rating-upgrade",
    level: "심화",
    title: "K-택소노미 적합성 평가와 녹색·전환금융 · ESG 투자 전략",
    desc: "한국형 녹색분류체계(K-택소노미) 4대 적합성 판단 기준부터 녹색채권·SLB 구조 설계, 기관투자자·PEF/VC 책임투자(PRI) 및 M&A ESG 실사(DD)를 다룹니다.",
    format: "VOD 7강 · 택소노미 판정표 & ESG DD 체크리스트",
    audience: "금융기관·운용사·PEF/VC 심사역 · 기업 재무·IR·M&A 담당자",
    outcomes: ["K-택소노미 활동·인정·배제·보호 기준 적격성 판정", "M&A·투자 전 ESG 실사(Red Flag 식별 및 밸류에이션 반영)", "PCAF 금융배출량 산정 및 포트폴리오 밸류업"],
    service: "responsible-investment",
  },
  {
    id: "startup-esg-course",
    level: "실무",
    title: "스타트업 · 환경벤처를 위한 ESG 경영과 VC/임팩트 투자유치",
    desc: "기후테크·환경벤처·기술창업 기업이 정부 R&D·창업지원 가점을 확보하고, VC/PE 투자심사(ESG DD)와 대기업 공급망 진입을 통과하는 핵심 실무를 다룹니다.",
    format: "VOD 6강 · 스타트업 ESG IR 덱 & 감축량 산정 템플릿",
    audience: "기후테크·환경벤처 창업가 · 스타트업 전략·IR·투자유치 담당자",
    outcomes: ["환경벤처 기술·제품의 탄소감축 기여량(Avoided Emissions) 정량화", "임팩트 펀드·VC 투자심사(ESG DD) 대응 체계 구축", "대기업 오픈이노베이션·공급망 진입용 EcoVadis·ISO 패스트트랙"],
    service: "startup-esg",
  },
  {
    id: "ghg-scope3",
    level: "실무",
    title: "Scope 1~3 탄소회계 및 제품 탄소발자국(PCF · EU CBAM) 산정",
    desc: "GHG Protocol·ISO 14064 기준 연결 인벤토리 구축부터 가치사슬 Scope 3 배출량, EU 탄소국경조정제도(CBAM) 대응을 위한 제품별 탄소발자국(LCA)을 직접 계산합니다.",
    format: "VOD 7강 · Scope 3 & CBAM 산정 실습 시트",
    audience: "환경·기후·생산기술 담당자 · EU 수출 제조기업 실무자",
    outcomes: ["연결 기준 Scope 1·2·3 배출량 산정 및 검증 대응", "제품 전과정평가(LCA) 및 탄소발자국(PCF) 산출", "EU CBAM 내재배출량 보고서 작성 실무"],
    service: "re100",
  },
  {
    id: "issb-kssb",
    level: "심화",
    title: "TCFD 기후 시나리오 분석 및 IFRS S2 · KSSB 재무영향 정량화",
    desc: "TCFD 및 IFRS S2·KSSB 4대 축(지배구조·전략·위험관리·지표)을 해부하고, NGFS/IEA 시나리오 기반 물리적·전환 리스크 재무영향(Climate VaR)을 산정합니다.",
    format: "VOD 8강 · 시나리오 재무영향 모델링 워크숍",
    audience: "기후공시 의무화 대상 상장사의 ESG·재무·리스크 담당자",
    outcomes: ["TCFD·IFRS S2 기후공시 보고서 작성", "1.5℃/2℃ 시나리오별 재무영향(영업이익·자산손상) 산출", "TNFD 자연자본 LEAP 분석 연계"],
    service: "re100",
  },
  {
    id: "supply-chain-dd",
    level: "실무",
    title: "글로벌 공급망 ESG 실사(CSDDD · CBAM)와 Green Procurement",
    desc: "친환경 녹색구매(Green Procurement) 기준 설계, 협력사 행동규범 수립, 자가진단(SAQ) 배포, 고위험 협력사 현장 실사 및 시정조치(CAP) 흐름을 다룹니다.",
    format: "VOD 6강 · 녹색구매 지침 & 협력사 SAQ 양식 제공",
    audience: "구매·조달·동반성장 담당자 · 수출 제조기업 실무자",
    outcomes: ["Green Procurement 정책 및 구매 입찰 평가 반영법", "협력사 ESG SAQ 문항 설계 및 현장 실사", "공급망 탄소·인권 리스크 통합 관리 체계"],
    service: "supply-chain",
  },
  {
    id: "esg-101",
    level: "입문",
    title: "전사 ESG 관리체계 수립 및 연결 데이터 내부통제 실무",
    desc: "이사회 ESG위원회 거버넌스부터 부서별 핵심성과지표(KPI) 설계, 종속회사 연결 기준 ESG 데이터 내부통제 매뉴얼 구축까지 전사 관리체계를 완성합니다.",
    format: "VOD 6강 · ESG 데이터 정의서 템플릿 제공",
    audience: "기업 ESG 전담팀 · 경영기획·내부통제 담당자",
    outcomes: ["전사 ESG 전략 로드맵 및 이사회 거버넌스 구축", "부서별 ESG KPI 및 성과평가(MBO) 연계", "공시 검증 대비 연결 데이터 내부통제 표준화"],
    service: "esg-management",
  },
  {
    id: "report-writing",
    level: "실무",
    title: "Real Value 화폐화 측정과 지속가능경영보고서 · AA1000 검증",
    desc: "경제·환경·사회 통합 임팩트(Real Value) 화폐화 측정과 이중 중대성 평가, 지속가능경영보고서 발간, AA1000AS 제3자 검증 및 평가 대응을 익힙니다.",
    format: "VOD 8강 · 화폐화 계수표 & 보고서·검증 템플릿",
    audience: "보고서 발간 담당자 · ESG 평가·사회공헌·IR 담당자",
    outcomes: ["Real Value 통합 임팩트 화폐가치 환산 및 SROI 분석", "GRI·ISSB 이중 중대성 평가 및 보고서 작성", "AA1000 제3자 검증 및 KCGS·MSCI 등급 상향"],
    service: "disclosure",
  },
];

export const courses: Course[] = [
  ...coreCourses.map((c) => ({ ...c, track: "core" as const })),
  ...hmcEcovadisCourses,
];

export { hmcEcovadisCourses, hmcEcovadisCourseIds };
