import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import {
  initialAdmins,
  initialAuditLogs,
  initialCorps,
  initialCourseMedia,
  initialHostPlans,
  initialPayments,
  initialQnAs,
  initialSubscriptions,
  initialUsers,
} from "@/data/lms-seed";
import type {
  AdminAuditLog,
  AdminMember,
  CorpEntity,
  CourseMediaConfig,
  HostPlanStatus,
  PaymentRecord,
  QnAItem,
  SubscriptionItem,
  UserAccount,
  UserRole,
  VideoSourceType,
} from "@/lib/lms-types";

const STORAGE_KEY = "cea_lms_state_v1";

export const SUPABASE_CONFIG = {
  url: (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "",
  anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "",
  get isConnected() {
    return Boolean(this.url && this.anonKey);
  },
};

interface LmsContextValue {
  courseMedia: CourseMediaConfig[];
  corps: CorpEntity[];
  users: UserAccount[];
  admins: AdminMember[];
  auditLogs: AdminAuditLog[];
  subscriptions: SubscriptionItem[];
  payments: PaymentRecord[];
  qnas: QnAItem[];
  hostPlans: HostPlanStatus[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  applyByCorpForm: (params: {
    corpCode: string;
    email: string;
    name: string;
    department: string;
  }) => { ok: boolean; message: string; user?: UserAccount; openedCount: number };
  bulkOpenCourses: (corpCode: string, rawEmails: string, courseIds: string[]) => number;
  updateProgress: (userId: string, courseId: string, nextPct: number) => void;
  updateCourseMedia: (
    courseId: string,
    patch: { videoSourceType: VideoSourceType; videoUrl: string; driveMaterialUrl: string; passRate: number },
  ) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleCorpAutoOpen: (corpId: string) => void;
  answerQnA: (qnaId: string, answer: string) => void;
  logBatchCertificatePrint: (corpName: string, count: number) => void;
  resetDemoData: () => void;
}

const LmsContext = createContext<LmsContextValue | null>(null);

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

function nowDateTime() {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}

export function LmsProvider({ children }: { children: ReactNode }) {
  const [courseMedia, setCourseMedia] = useState<CourseMediaConfig[]>(initialCourseMedia);
  const [corps, setCorps] = useState<CorpEntity[]>(initialCorps);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [admins] = useState<AdminMember[]>(initialAdmins);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAuditLogs);
  const [subscriptions] = useState<SubscriptionItem[]>(initialSubscriptions);
  const [payments] = useState<PaymentRecord[]>(initialPayments);
  const [qnas, setQnas] = useState<QnAItem[]>(initialQnAs);
  const [hostPlans] = useState<HostPlanStatus[]>(initialHostPlans);
  const [activeUserId, setActiveUserId] = useState<string>(initialUsers[0]?.id ?? "usr-101");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.courseMedia) setCourseMedia(parsed.courseMedia);
      if (parsed.corps) setCorps(parsed.corps);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      if (parsed.qnas) setQnas(parsed.qnas);
    } catch {
      // 기본 시드 유지
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ courseMedia, corps, users, auditLogs, qnas }),
      );
    } catch {
      // 저장 공간 오류 무시
    }
  }, [courseMedia, corps, users, auditLogs, qnas]);

  const addLog = (actionType: AdminAuditLog["actionType"], target: string, detail: string) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      adminId: "adm-1",
      adminName: "MJ 대표 (총괄)",
      actionType,
      target,
      detail,
      createdAt: nowDateTime(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const applyByCorpForm: LmsContextValue["applyByCorpForm"] = ({ corpCode, email, name, department }) => {
    const cleanEmail = email.trim().toLowerCase();
    const corp = corps.find((c) => c.code === corpCode);
    if (!corp) {
      return { ok: false, message: "유효하지 않은 기업 전용 코드입니다.", openedCount: 0 };
    }
    const targetCourses = corp.allowedCourseIds;
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      const merged = Array.from(new Set([...existing.enrolledCourseIds, ...targetCourses]));
      const updated: UserAccount = {
        ...existing,
        name: name.trim() || existing.name,
        department: department.trim() || existing.department,
        corpCode: corp.code,
        corpName: corp.name,
        enrolledCourseIds: merged,
        status: "활성",
      };
      setUsers((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
      setActiveUserId(existing.id);
      addLog("강의일괄오픈", `${corp.name} · ${cleanEmail}`, `전용 폼 제출로 ${targetCourses.length}개 과정 즉시 자동 오픈`);
      return {
        ok: true,
        message: `[${corp.name}] 전용 과정 ${targetCourses.length}개가 아이디(${cleanEmail})에 즉시 오픈되었습니다!`,
        user: updated,
        openedCount: targetCourses.length,
      };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split("@")[0],
      corpCode: corp.code,
      corpName: corp.name,
      department: department.trim() || "ESG실무부서",
      role: "수강생",
      joinedAt: nowDate(),
      status: "활성",
      enrolledCourseIds: [...targetCourses],
      progress: Object.fromEntries(targetCourses.map((cid) => [cid, 0])),
      completedAt: {},
      certNumbers: {},
    };
    setUsers((prev) => [newUser, ...prev]);
    setCorps((prev) =>
      prev.map((c) => (c.id === corp.id ? { ...c, enrolledCount: c.enrolledCount + 1, integrationStatus: "연동 정상" } : c)),
    );
    setActiveUserId(newUser.id);
    addLog("강의일괄오픈", `${corp.name} · ${cleanEmail}`, `신규 아이디 등록 및 ${targetCourses.length}개 과정 자동 오픈`);
    return {
      ok: true,
      message: `[${corp.name}] 신규 아이디(${cleanEmail}) 등록과 함께 ${targetCourses.length}개 강의가 자동 오픈되었습니다!`,
      user: newUser,
      openedCount: targetCourses.length,
    };
  };

  const bulkOpenCourses = (corpCode: string, rawEmails: string, courseIds: string[]) => {
    const corp = corps.find((c) => c.code === corpCode) ?? corps[0];
    const emails = rawEmails
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.includes("@"));
    if (!corp || emails.length === 0) return 0;

    const openIds = courseIds.length > 0 ? courseIds : corp.allowedCourseIds;
    setUsers((prev) => {
      const next = [...prev];
      for (const em of emails) {
        const idx = next.findIndex((u) => u.email.toLowerCase() === em);
        if (idx >= 0) {
          const merged = Array.from(new Set([...next[idx].enrolledCourseIds, ...openIds]));
          next[idx] = { ...next[idx], enrolledCourseIds: merged, corpCode: corp.code, corpName: corp.name };
        } else {
          next.unshift({
            id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
            email: em,
            name: em.split("@")[0],
            corpCode: corp.code,
            corpName: corp.name,
            department: "단체등록",
            role: "수강생",
            joinedAt: nowDate(),
            status: "활성",
            enrolledCourseIds: [...openIds],
            progress: {},
            completedAt: {},
            certNumbers: {},
          });
        }
      }
      return next;
    });
    addLog("강의일괄오픈", `${corp.name} (${emails.length}명)`, `관리자 일괄 아이디 등록으로 ${openIds.length}개 과정 오픈`);
    return emails.length;
  };

  const updateProgress = (userId: string, courseId: string, nextPct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextPct)));
    const media = courseMedia.find((m) => m.courseId === courseId);
    const passRate = media?.passRate ?? 80;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextProgress = { ...u.progress, [courseId]: clamped };
        const nextCompleted = { ...u.completedAt };
        const nextCerts = { ...u.certNumbers };
        if (clamped >= passRate && !nextCompleted[courseId]) {
          nextCompleted[courseId] = nowDate();
          nextCerts[courseId] = `CEA-2026-${Math.floor(1100 + Math.random() * 8900)}`;
        }
        return {
          ...u,
          progress: nextProgress,
          completedAt: nextCompleted,
          certNumbers: nextCerts,
        };
      }),
    );
  };

  const updateCourseMedia: LmsContextValue["updateCourseMedia"] = (courseId, patch) => {
    setCourseMedia((prev) =>
      prev.map((m) => (m.courseId === courseId ? { ...m, ...patch, updatedAt: nowDate() } : m)),
    );
    const target = courseMedia.find((m) => m.courseId === courseId);
    addLog("콘텐츠수정", target?.title ?? courseId, `영상 소스(${patch.videoSourceType}) 및 수료 기준(${patch.passRate}%) 변경`);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    if (target) addLog("권한변경", `${target.name} (${target.email})`, `계정 역할을 [${role}](으)로 변경`);
  };

  const toggleCorpAutoOpen = (corpId: string) => {
    setCorps((prev) =>
      prev.map((c) => {
        if (c.id !== corpId) return c;
        const nextAuto = !c.autoOpenEnabled;
        return {
          ...c,
          autoOpenEnabled: nextAuto,
          integrationStatus: nextAuto ? "연동 정상" : "폼 대기",
        };
      }),
    );
  };

  const answerQnA = (qnaId: string, answer: string) => {
    if (!answer.trim()) return;
    setQnas((prev) =>
      prev.map((q) => (q.id === qnaId ? { ...q, answer: answer.trim(), status: "답변완료" } : q)),
    );
  };

  const logBatchCertificatePrint = (corpName: string, count: number) => {
    addLog("수료증일괄출력", `${corpName} (${count}건)`, `수료 기준 통과자 ${count}명 수료증 일괄 출력 실행`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCourseMedia(initialCourseMedia);
    setCorps(initialCorps);
    setUsers(initialUsers);
    setAuditLogs(initialAuditLogs);
    setQnas(initialQnAs);
  };

  return createElement(
    LmsContext.Provider,
    {
      value: {
        courseMedia,
        corps,
        users,
        admins,
        auditLogs,
        subscriptions,
        payments,
        qnas,
        hostPlans,
        activeUserId,
        setActiveUserId,
        applyByCorpForm,
        bulkOpenCourses,
        updateProgress,
        updateCourseMedia,
        updateUserRole,
        toggleCorpAutoOpen,
        answerQnA,
        logBatchCertificatePrint,
        resetDemoData,
      },
    },
    children,
  );
}

export function useLms() {
  const ctx = useContext(LmsContext);
  if (!ctx) throw new Error("useLms must be used inside LmsProvider");
  return ctx;
}
