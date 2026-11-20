// 종합 ESG 컨설팅 7대 핵심 영역 (PwC Sustainability Platform 벤치마킹 · CEA 고도화 모델)
// 01. RE100 이행 전략 (최상단 배치, 거버넌스 단독 컨설팅 제외)
// 02. ESG 관리체계 수립
// 03. TCFD 보고서 발간 및 시나리오 분석
// 04. Green Procurement 전략 수립
// 05. Real Value Measurement
// 06. 책임투자 · ESG 펀드 운영 전략
// 07. ESG 공시 · 보고서 검증 및 평가 대응

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
