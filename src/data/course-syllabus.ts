import type { Course } from "@/data/courses";

export interface CourseSyllabus {
  hook: string;
  lessons: { no: string; title: string; minutes: number }[];
  materials: string[];
  sourceNote?: string;
}

const detailedSyllabi: Record<string, CourseSyllabus> = {
  "hmc-soc-supplier-hr-env": {
    hook: "현대차그룹·EcoVadis 공급망 평가에서 배점이 가장 높은 '협력사 인권·환경' 문항을 60분 실무 강의와 행동규범 점검표로 한 번에 통과합니다.",
    lessons: [
      { no: "1강", title: "글로벌 원청사(현대차·EU CSDDD) 협력사 ESG 평가 구조와 탈락 리스크", minutes: 15 },
      { no: "2강", title: "협력사 행동규범(CoC) 핵심 4대 축(인권·노동·환경·윤리)과 현장 위반 사례", minutes: 15 },
      { no: "3강", title: "EcoVadis 증빙 문서 작성 원칙(결합 문서 금지·최신성·범위 일치) 고득점 전략", minutes: 15 },
      { no: "4강", title: "하위 협력사 자가진단(SAQ) 운영 및 시정조치(CAP) 보고서 작성 실습", minutes: 15 },
    ],
    materials: ["협력사 행동규범(CoC) 표준 점검표(Excel)", "EcoVadis 제출 문서 가이드(PDF)", "HMC Q2.4 · EcoVadis SUP300 병기 수료증"],
    sourceNote: "CEA·대신경제연구소 공급망 ESG 실무 교안 기반",
  },
  "ghg-scope3": {
    hook: "수출 제조기업이 당장 직면한 EU 탄소국경조정제도(CBAM)와 Scope 1~3 탄소회계를 실전 배출량 계산 시트와 함께 완성합니다.",
    lessons: [
      { no: "1강", title: "2026 EU ESG 핵심 통상 규제 지도(CBAM·CSDDD·배터리법·에코디자인)", minutes: 15 },
      { no: "2강", title: "GHG Protocol·ISO 14064 연결 인벤토리 및 Scope 1·2 산정 실무", minutes: 20 },
      { no: "3강", title: "가치사슬 Scope 3 배출량 및 제품 탄소발자국(PCF·LCA) 산출", minutes: 20 },
      { no: "4강", title: "실습 시트로 따라 하는 EU CBAM 제품당 내재배출량 보고서 작성", minutes: 20 },
    ],
    materials: ["CBAM 제품당 배출량 산정 시트(Excel)", "EU ESG 통상 규제 대응 로드맵(PDF)", "Scope 3 배출계수 적용 가이드"],
    sourceNote: "무역협회 EU 통상규제 세미나(2025.05) · CBAM 실습 시트 기반",
  },
  "esg-101": {
    hook: "전담 인력이 없는 중소·중견기업도 3단계 사전진단 체크리스트만으로 우리 회사 ESG 수준을 진단하고 올해 실행 과제를 도출합니다.",
    lessons: [
      { no: "1강", title: "왜 지금 중소·중견기업에 ESG인가? (원청사 평가·금융 조달·공공입찰 가점)", minutes: 15 },
      { no: "2강", title: "E·S·G 영역별 필수 관리 지표와 우리 회사 사전진단 체크리스트 실습", minutes: 20 },
      { no: "3강", title: "전사 ESG 거버넌스·부서별 KPI 설계 및 연결 데이터 내부통제 표준화", minutes: 25 },
      { no: "4강", title: "저비용·고효과 1년 차 ESG 개선 과제 우선순위 및 증빙 파일철 구축법", minutes: 20 },
    ],
    materials: ["중소·중견기업 ESG 사전진단 체크리스트(Excel)", "ESG 데이터 정의서 템플릿(PDF)", "강사 실무 해설 요약본"],
    sourceNote: "농식품부·산자부 중소중견 ESG 경영전문가 과정 교안 기반",
  },
  "hmc-env-energy": {
    hook: "사업장 전력·연료 에너지 절감 수칙과 기후변화 대응 기록 관리로 HMC Q6.1 · EcoVadis ENV312 교육 증빙을 충족합니다.",
    lessons: [
      { no: "1강", title: "기후변화 규제와 협력사 온실가스·에너지 감축 요구사항", minutes: 15 },
      { no: "2강", title: "사업장 전력·설비 에너지 절감 수칙 및 부서별 실천 과제", minutes: 15 },
      { no: "3강", title: "에너지 사용량 기록·증빙 관리 및 HMC·EcoVadis 평가 대응", minutes: 15 },
    ],
    materials: ["사업장 에너지 절감 점검표(Excel)", "HMC Q6.1 · EcoVadis ENV312 병기 수료증"],
  },
  "hmc-gov-anticorruption": {
    hook: "청탁금지법·공정거래법·이해충돌 금지 사례와 내부 윤리제보 절차를 50분 실무 사례로 익히고 평가 증빙을 확보합니다.",
    lessons: [
      { no: "1강", title: "부패·뇌물·리베이트·이해충돌 유형별 핵심 법령과 실제 위반 사례", minutes: 18 },
      { no: "2강", title: "하도급·담합·불공정거래 예방 수칙 및 영업·구매 현장 체크포인트", minutes: 17 },
      { no: "3강", title: "사내 윤리제보 채널 활용, 제보자 보호 원칙 및 평가 대응", minutes: 15 },
    ],
    materials: ["윤리강령·반부패 자가진단 시트(PDF)", "HMC Q3.4 · EcoVadis FB3102 병기 수료증"],
  },
};

export function getCourseSyllabus(course: Course): CourseSyllabus {
  if (detailedSyllabi[course.id]) return detailedSyllabi[course.id];
  const totalMin = course.durationMin ?? 60;
  const perLesson = Math.max(10, Math.round(totalMin / Math.max(1, course.outcomes.length)));
  const evalCodes = [
    course.hmcCode ? `HMC ${course.hmcCode}` : null,
    course.ecovadisCode ? `EcoVadis ${course.ecovadisCode}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    hook: course.desc,
    lessons: course.outcomes.map((o, i) => ({
      no: `${i + 1}강`,
      title: o,
      minutes: perLesson,
    })),
    materials: [
      course.format,
      evalCodes ? `${evalCodes} 평가 증빙 코드 병기 공식 수료증` : "CEA 공식 교육 수료증 (PDF 출력)",
    ],
  };
}
