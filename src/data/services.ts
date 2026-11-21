// 주식회사 씨이에이(CEA) 7대 핵심 ESG 자문 · 실무 구축 영역 (고려대 및 대외 심사 정합성 기준 최상단 배치)
// 01. 전환금융 · 기후 리스크(TCFD) 및 RE100 이행 전략
// 02. 택소노미 · 전환금융 및 ESG 투자 전략 (최상단 2순위 격상)
// 03. 스타트업 · 환경벤처 ESG 경영 및 투자유치 컨설팅 (최상단 3순위 신규 배치)
// 04. 글로벌 공급망 ESG 실사(CSDDD·CBAM) 및 Green Procurement
// 05. 전사 ESG 관리체계 및 데이터 거버넌스 수립
// 06. Real Value (통합 임팩트 화폐화) 측정
// 07. ESG 공시 · 지속가능경영보고서 발간 및 AA1000 제3자 검증

export type Detail = { name: string; feature: string; targets: string[]; effects: string[] };
export type Service = {
  id: string;
  no: string;
  title: string;
  en: string;
  stakeholder: string;
  summary: string;
  why: string;
  purposes: { title: string; desc?: string }[];
  areas: { name: string; items?: string[] }[];
  process: { phase: string; items: string[] }[];
  strengths: { title: string; desc: string }[];
  details: Detail[];
};

import { envServices } from "./services-env";
import { climateServices } from "./services-climate";
import { socialServices } from "./services-social";
import { reportingServices } from "./services-reporting";

export const services: Service[] = [
  ...envServices,
  ...climateServices,
  ...socialServices,
  ...reportingServices,
];
export const totalSubServices = services.reduce((n, s) => n + s.areas.length, 0);
