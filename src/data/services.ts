// 주식회사 씨이에이(CEA) 핵심 ESG 자문 · 실무 구축 영역
// 01. RE100 이행 전략
// 02. ESG 관리체계 수립
// 03. TCFD 보고서 발간 및 시나리오 분석
// 04. 친환경 공급망 · 녹색조달 전략 수립
// 05. 통합 임팩트 화폐가치 측정
// 06. K-택소노미 · 책임투자 및 ESG 금융 전략
// 07. 지속가능경영보고서 · KSSB 공시 및 제3자 검증

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
