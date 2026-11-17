import type { Level } from "@/data/courses";

/** 강의 영상 제공 방식: 유튜브 일부공개 / Vimeo / MP4 직접 업로드 */
export type VideoSourceType = "youtube" | "vimeo" | "mp4";

export interface CourseMediaConfig {
  courseId: string;
  title: string;
  level: Level;
  durationMin: number;
  passRate: number; // 수료 기준 학습률 (예: 80%)
  videoSourceType: VideoSourceType;
  videoUrl: string;
  driveMaterialUrl: string; // 구글 드라이브 교안/템플릿 링크
  updatedAt: string;
}

export type UserRole = "수강생" | "기업담당자" | "강사" | "관리자";

export interface UserAccount {
  id: string;
  email: string; // 로그인 아이디
  name: string;
  corpCode: string;
  corpName: string;
  department: string;
  role: UserRole;
  joinedAt: string;
  status: "활성" | "대기" | "휴면";
  enrolledCourseIds: string[];
  progress: Record<string, number>; // courseId -> 0~100 (%)
  completedAt: Record<string, string>; // courseId -> YYYY-MM-DD
  certNumbers: Record<string, string>; // courseId -> CEA-2026-XXXX
}

export interface CorpEntity {
  id: string;
  code: string; // 전용 링크용 슬러그 (예: samsung-display)
  name: string; // 법인명
  bizNo: string; // 사업자등록번호
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  planName: string;
  seatLimit: number;
  enrolledCount: number;
  allowedCourseIds: string[];
  autoOpenEnabled: boolean; // 전용 폼 아이디 제출 시 자동 강의 오픈 여부
  integrationStatus: "연동 정상" | "폼 대기" | "점검 필요";
  contractPeriod: string;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  grade: "총괄관리자" | "운영관리자" | "교육매니저" | "CS담당";
  department: string;
  status: "활동중" | "자리비움" | "권한정지";
  lastLogin: string;
  permissions: string[];
  handledCount: number;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  actionType: "강의일괄오픈" | "수료증일괄출력" | "콘텐츠수정" | "권한변경" | "법인연동";
  target: string;
  detail: string;
  createdAt: string;
}

export interface SubscriptionItem {
  id: string;
  corpCode: string;
  corpName: string;
  planTier: "Enterprise 연간" | "Business 반기" | "Standard 단과";
  seatQuota: number;
  usedSeats: number;
  monthlyFee: number;
  billingCycle: "연납(일괄)" | "반기납" | "월납";
  status: "구독중" | "갱신예정" | "만료";
  nextBillingDate: string;
}

export interface PaymentRecord {
  id: string;
  paidAt: string;
  corpName: string;
  itemTitle: string;
  method: "세금계산서(무통장)" | "법인카드" | "계좌이체";
  amount: number;
  status: "결제완료" | "발행대기" | "환불";
  invoiceNo: string;
}

export interface QnAItem {
  id: string;
  courseId: string;
  courseTitle: string;
  authorName: string;
  authorEmail: string;
  corpName: string;
  question: string;
  answer: string;
  status: "답변완료" | "답변대기";
  createdAt: string;
}

export interface HostPlanStatus {
  id: string;
  category: "도메인(DNS)" | "웹 호스팅" | "데이터베이스(DB)" | "영상 스트리밍" | "교안 스토리지";
  provider: string;
  planName: string;
  monthlyCost: string;
  usageSummary: string;
  usagePercent: number;
  status: "정상" | "주의";
  note: string;
}

export type AdminMenuId =
  | "dashboard"
  | "contents"
  | "host-plan"
  | "subscriptions"
  | "accounts"
  | "account-detail"
  | "corporations"
  | "admin-overview"
  | "admin-list"
  | "admin-detail"
  | "corp-integration"
  | "corp-completions"
  | "qna-history"
  | "payments-revenue";
