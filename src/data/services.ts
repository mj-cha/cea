// 종합 ESG 서비스 7개 영역
// 출처: 대신경제연구소 사업소개(2026-11-17 확인) 내용을 CEA 서비스 문구로 정리.
// 원 사이트의 담당자·연락처·회사명은 옮기지 않았다.

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

export const services: Service[] = [...envServices, ...climateServices, ...socialServices];
export const totalSubServices = services.reduce((n, s) => n + s.areas.length, 0);
