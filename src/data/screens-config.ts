export type ScreenStatus = "있음" | "시안" | "대기";

export interface ScreenItem {
  id: string;
  group: "공개 화면" | "회원 · 강의실" | "관리자 콘솔" | "안내 · 문의";
  title: string;
  hash: string;
  status: ScreenStatus;
  desc: string;
  /** 2단계(C안 기능·화면 체크리스트 빌더) 확장을 위한 기능 모듈 키 */
  featureKey?: string;
}

export interface StudioThemePreset {
  id: string;
  name: string;
  badge: string;
  sampleBg: string;
  sampleInk: string;
  sampleBtn: string;
  vars: Record<string, string>;
}

/** CEA 전체 화면 목록 (단일 기준 SSOT — #__studio 좌측 페이지 목록과 자동 연동) */
export const CEA_SCREENS: ScreenItem[] = [
  { id: "hero", group: "공개 화면", title: "홈 · 메인 히어로", hash: "#top", status: "있음", desc: "CEA 핵심 슬로건과 도입 지표 요약", featureKey: "core" },
  { id: "why-now", group: "공개 화면", title: "도입 배경 (Why Now)", hash: "#why-now", status: "있음", desc: "공급망 ESG 실사 및 법정의무 대응 배경", featureKey: "core" },
  { id: "services", group: "공개 화면", title: "분야별 ESG 자문 (RE100·TCFD 등)", hash: "#services", status: "있음", desc: "RE100·ESG관리체계·TCFD·녹색조달·임팩트·택소노미·공시", featureKey: "catalog" },
  { id: "publications", group: "공개 화면", title: "정부지원사업 · 공공 정책 아카이브", hash: "#publications", status: "있음", desc: "환경산업기술원·에너지경제연구원 등 최근 1년 공고·발간물 모아보기", featureKey: "catalog" },
  { id: "education", group: "공개 화면", title: "직무·직급별 교육 과정", hash: "#education", status: "있음", desc: "임원·실무자·협력사 맞춤 커리큘럼", featureKey: "lms" },
  { id: "process", group: "공개 화면", title: "도입 · 진행 절차", hash: "#process", status: "있음", desc: "사전 진단부터 사후 리포트까지 단계 안내", featureKey: "core" },
  { id: "fit", group: "공개 화면", title: "도입 추천 기업 유형", hash: "#fit", status: "있음", desc: "기업 규모·상황별 맞춤 도입 가이드", featureKey: "core" },

  { id: "lms", group: "회원 · 강의실", title: "나의 온라인 강의실", hash: "#lms", status: "있음", desc: "수강생 진도율 학습 및 수료증 개별 발급", featureKey: "lms" },
  { id: "apply", group: "회원 · 강의실", title: "기업 전용 아이디 등록 폼", hash: "#apply", status: "있음", desc: "기업 코드 기반 수강 계정 등록·강의 자동 오픈", featureKey: "auth" },

  { id: "adm-01", group: "관리자 콘솔", title: "01. 운영 현황 대시보드", hash: "#admin/dashboard", status: "있음", desc: "전체 수강·기업·매출 핵심 지표 요약", featureKey: "admin" },
  { id: "adm-02", group: "관리자 콘솔", title: "02. 전체 컨텐츠 관리", hash: "#admin/contents", status: "있음", desc: "강의 영상·합격 기준율·메타데이터 관리", featureKey: "admin" },
  { id: "adm-03", group: "관리자 콘솔", title: "03. 호스트 · 요금제 · DB", hash: "#admin/host-plan", status: "있음", desc: "Supabase 실서버 연결 및 플랜 상태", featureKey: "admin" },
  { id: "adm-04", group: "관리자 콘솔", title: "04. 유료 구독 관리", hash: "#admin/subscriptions", status: "있음", desc: "기업별 구독 플랜·갱신일 관리", featureKey: "billing" },
  { id: "adm-05", group: "관리자 콘솔", title: "05. 가입 계정 목록", hash: "#admin/accounts", status: "있음", desc: "수강생 계정 검색·상태 조회", featureKey: "admin" },
  { id: "adm-06", group: "관리자 콘솔", title: "06. 계정 상세와 역할", hash: "#admin/account-detail", status: "있음", desc: "개별 회원 권한 및 수강 과목 점검", featureKey: "admin" },
  { id: "adm-07", group: "관리자 콘솔", title: "07. 기업별 법인 관리", hash: "#admin/corporations", status: "있음", desc: "계약 법인 및 전용 신청 링크 관리", featureKey: "admin" },
  { id: "adm-08", group: "관리자 콘솔", title: "08. 관리자 현황", hash: "#admin/admin-overview", status: "있음", desc: "운영진 권한 등급 요약", featureKey: "admin" },
  { id: "adm-09", group: "관리자 콘솔", title: "09. 관리자 목록", hash: "#admin/admin-list", status: "있음", desc: "관리자 계정 목록 및 상태", featureKey: "admin" },
  { id: "adm-10", group: "관리자 콘솔", title: "10. 관리자 상세 · 이력", hash: "#admin/admin-detail", status: "있음", desc: "관리자별 처리 업무 로그", featureKey: "admin" },
  { id: "adm-11", group: "관리자 콘솔", title: "11. 기업 고객 연동 상태", hash: "#admin/corp-integration", status: "있음", desc: "고객사 인사/SSO 연동 현황", featureKey: "admin" },
  { id: "adm-12", group: "관리자 콘솔", title: "12. 교육 이수 · 수료증 일괄출력", hash: "#admin/corp-completions", status: "있음", desc: "기업별 이수율 확인 및 수료증 일괄 인쇄", featureKey: "lms" },
  { id: "adm-13", group: "관리자 콘솔", title: "13. Q&A 문의 이력", hash: "#admin/qna-history", status: "있음", desc: "학습자·담당자 질의응답 관리", featureKey: "support" },
  { id: "adm-14", group: "관리자 콘솔", title: "14. 결제 내역 · 누적 매출", hash: "#admin/payments-revenue", status: "있음", desc: "세금계산서·카드 결제 내역 집계", featureKey: "billing" },

  { id: "faq", group: "안내 · 문의", title: "자주 묻는 질문 (FAQ)", hash: "#faq", status: "있음", desc: "교육비 환급·수료증·커스텀 과정 안내", featureKey: "support" },
  { id: "contact", group: "안내 · 문의", title: "도입 상담 · 견적 문의", hash: "#contact", status: "있음", desc: "담당자 상담 신청 폼", featureKey: "support" },
];

export const CEA_STUDIO_THEMES: StudioThemePreset[] = [
  {
    id: "trust-blue",
    name: "CEA 로고 화이트 · 네이비 · 블루",
    badge: "기본 (공식)",
    sampleBg: "#f8fafc",
    sampleInk: "#0f172a",
    sampleBtn: "#1d4ed8",
    vars: {},
  },
  {
    id: "deep-navy",
    name: "CEA 딥 네이비 (진한 남색) · 블루",
    badge: "네이비 다크",
    sampleBg: "#0c1b33",
    sampleInk: "#f8fafc",
    sampleBtn: "#2563eb",
    vars: {
      "--background": "#0c1b33",
      "--foreground": "#f8fafc",
      "--card": "#13284c",
      "--card-foreground": "#f8fafc",
      "--popover": "#13284c",
      "--popover-foreground": "#f8fafc",
      "--primary": "#2563eb",
      "--primary-foreground": "#ffffff",
      "--secondary": "#1e3a6e",
      "--secondary-foreground": "#f8fafc",
      "--muted": "#173059",
      "--muted-foreground": "#cbd5e1",
      "--accent": "#1e3a8a",
      "--accent-foreground": "#ffffff",
      "--border": "#26467a",
      "--input": "#26467a",
      "--ring": "#3b82f6",
    },
  },
  {
    id: "modern-emerald",
    name: "모던 에메랄드 (라이트)",
    badge: "친환경",
    sampleBg: "#f6fbf8",
    sampleInk: "#11221b",
    sampleBtn: "#059669",
    vars: {
      "--background": "#f6fbf8",
      "--foreground": "#11221b",
      "--card": "#ffffff",
      "--card-foreground": "#11221b",
      "--popover": "#ffffff",
      "--popover-foreground": "#11221b",
      "--primary": "#059669",
      "--primary-foreground": "#ffffff",
      "--secondary": "#e6f4ed",
      "--secondary-foreground": "#11221b",
      "--muted": "#edf7f1",
      "--muted-foreground": "#3f5f51",
      "--accent": "#d1fae5",
      "--accent-foreground": "#064e3b",
      "--border": "#cce3d6",
      "--input": "#cce3d6",
      "--ring": "#059669",
    },
  },
  {
    id: "minimal-mono",
    name: "미니멀 모노",
    badge: "심플",
    sampleBg: "#ffffff",
    sampleInk: "#111111",
    sampleBtn: "#18181b",
    vars: {
      "--background": "#ffffff",
      "--foreground": "#111111",
      "--card": "#fafafa",
      "--card-foreground": "#111111",
      "--popover": "#ffffff",
      "--popover-foreground": "#111111",
      "--primary": "#18181b",
      "--primary-foreground": "#ffffff",
      "--secondary": "#f4f4f5",
      "--secondary-foreground": "#18181b",
      "--muted": "#f4f4f5",
      "--muted-foreground": "#52525b",
      "--accent": "#f4f4f5",
      "--accent-foreground": "#18181b",
      "--border": "#e4e4e7",
      "--input": "#e4e4e7",
      "--ring": "#18181b",
    },
  },
];
