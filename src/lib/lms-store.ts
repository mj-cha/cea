import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
import { getSupabaseConfig, pullLmsStateFromSupabase, pushLmsStateToSupabase } from "@/lib/supabase-client";

const STORAGE_KEY = "cea_lms_state_v2";
const AUTH_STORAGE_KEY = "cea_auth_user_v2";
const THEME_STORAGE_KEY = "cea_theme_mode_v2";

export const SUPABASE_CONFIG = {
  get url() { return getSupabaseConfig().url; },
  get anonKey() { return getSupabaseConfig().anonKey; },
  get isConnected() { return getSupabaseConfig().isConnected; },
};

interface PersistedLmsState {
  courseMedia: CourseMediaConfig[];
  corps: CorpEntity[];
  users: UserAccount[];
  auditLogs: AdminAuditLog[];
  qnas: QnAItem[];
}

interface LmsContextValue extends PersistedLmsState {
  admins: AdminMember[];
  subscriptions: SubscriptionItem[];
  payments: PaymentRecord[];
  hostPlans: HostPlanStatus[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  loggedInUser: UserAccount | null;
  isAdminLoggedIn: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  loginWithEmail: (email: string) => { ok: boolean; isAdmin: boolean; user?: UserAccount; message: string };
  logout: () => void;
  themeMode: "white" | "navy";
  setThemeMode: (mode: "white" | "navy") => void;
  syncStatus: "로컬전용" | "진행 중" | "성공" | "실패";
  syncMessage: string;
  syncToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
  refreshSupabaseConfig: () => void;
  applyByCorpForm: (p: { corpCode: string; email: string; name: string; department: string }) => {
    ok: boolean;
    message: string;
    user?: UserAccount;
    openedCount: number;
  };
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
const nowDate = () => new Date().toISOString().slice(0, 10);
const nowDateTime = () => {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
};

export function LmsProvider({ children }: { children: ReactNode }) {
  const [courseMedia, setCourseMedia] = useState(initialCourseMedia);
  const [corps, setCorps] = useState(initialCorps);
  const [users, setUsers] = useState(initialUsers);
  const [admins] = useState(initialAdmins);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [subscriptions] = useState(initialSubscriptions);
  const [payments] = useState(initialPayments);
  const [qnas, setQnas] = useState(initialQnAs);
  const [hostPlans] = useState(initialHostPlans);
  const [activeUserId, setActiveUserId] = useState(initialUsers[1]?.id ?? "usr-101");
  const [loggedInEmail, setLoggedInEmail] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || "");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"white" | "navy">(() =>
    localStorage.getItem(THEME_STORAGE_KEY) === "navy" ? "navy" : "white",
  );
  const [configTick, setConfigTick] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"로컬전용" | "진행 중" | "성공" | "실패">(() =>
    getSupabaseConfig().isConnected ? "진행 중" : "로컬전용",
  );
  const [syncMessage, setSyncMessage] = useState("");
  const isInitialLoaded = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "navy");
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const loggedInUser = users.find((u) => u.email.toLowerCase() === loggedInEmail.toLowerCase()) ?? null;
  const isAdminLoggedIn = Boolean(
    loggedInUser?.role === "관리자" || admins.some((a) => a.email.toLowerCase() === loggedInEmail.toLowerCase()),
  );

  const loginWithEmail: LmsContextValue["loginWithEmail"] = (email) => {
    const clean = email.trim().toLowerCase();
    const matchedUser = users.find((u) => u.email.toLowerCase() === clean);
    const matchedAdmin = admins.find((a) => a.email.toLowerCase() === clean);
    if (!matchedUser && !matchedAdmin) {
      return { ok: false, isAdmin: false, message: "등록되지 않은 아이디입니다. 아래 예시 계정을 클릭해 주세요." };
    }
    const userObj = matchedUser ?? users[0];
    setLoggedInEmail(clean);
    localStorage.setItem(AUTH_STORAGE_KEY, clean);
    setActiveUserId(userObj.id);
    setLoginModalOpen(false);
    const adminFlag = Boolean(userObj.role === "관리자" || matchedAdmin);
    window.location.hash = adminFlag ? "#admin" : "#lms";
    return {
      ok: true,
      isAdmin: adminFlag,
      user: userObj,
      message: `${userObj.name}님 로그인 완료`,
    };
  };

  const logout = () => {
    setLoggedInEmail("");
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (window.location.hash.startsWith("#admin")) window.location.hash = "#top";
  };

  const applyPersisted = useCallback((parsed: Partial<PersistedLmsState>) => {
    if (parsed.courseMedia?.length) setCourseMedia(parsed.courseMedia);
    if (parsed.corps?.length) setCorps(parsed.corps);
    if (parsed.users?.length) setUsers(parsed.users);
    if (parsed.auditLogs?.length) setAuditLogs(parsed.auditLogs);
    if (parsed.qnas?.length) setQnas(parsed.qnas);
  }, []);

  const pullFromCloud = useCallback(async () => {
    if (!getSupabaseConfig().isConnected) {
      setSyncStatus("로컬전용");
      return;
    }
    setSyncStatus("진행 중");
    const res = await pullLmsStateFromSupabase<PersistedLmsState>();
    if (!res.ok) {
      setSyncStatus("실패");
      setSyncMessage(`실패: ${res.error || "조회 오류"}`);
      return;
    }
    if (res.data) applyPersisted(res.data);
    setSyncStatus("성공");
    setSyncMessage("성공: Supabase 클라우드 동기화 완료");
  }, [applyPersisted]);

  const syncToCloud = useCallback(async () => {
    if (!getSupabaseConfig().isConnected) {
      setSyncStatus("로컬전용");
      return;
    }
    setSyncStatus("진행 중");
    const res = await pushLmsStateToSupabase({ courseMedia, corps, users, auditLogs, qnas });
    setSyncStatus(res.ok ? "성공" : "실패");
    setSyncMessage(res.ok ? `성공: 동기화 완료 (${nowDateTime()})` : `실패: ${res.error || "저장 오류"}`);
  }, [courseMedia, corps, users, auditLogs, qnas]);

  const refreshSupabaseConfig = useCallback(() => setConfigTick((t) => t + 1), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) applyPersisted(JSON.parse(raw));
    } catch {
      // 기본 시드 유지
    }
    isInitialLoaded.current = true;
  }, [applyPersisted]);

  useEffect(() => {
    if (getSupabaseConfig().isConnected) void pullFromCloud();
    else {
      setSyncStatus("로컬전용");
      setSyncMessage("");
    }
  }, [configTick, pullFromCloud]);

  useEffect(() => {
    if (!isInitialLoaded.current) return;
    const payload: PersistedLmsState = { courseMedia, corps, users, auditLogs, qnas };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 무시
    }
    if (getSupabaseConfig().isConnected) {
      const timer = setTimeout(() => {
        void pushLmsStateToSupabase(payload).then((res) => setSyncStatus(res.ok ? "성공" : "실패"));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [courseMedia, corps, users, auditLogs, qnas]);

  const addLog = (actionType: AdminAuditLog["actionType"], target: string, detail: string) => {
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: "adm-1",
        adminName: "차명진 대표 (총괄)",
        actionType,
        target,
        detail,
        createdAt: nowDateTime(),
      },
      ...prev,
    ]);
  };

  const applyByCorpForm: LmsContextValue["applyByCorpForm"] = ({ corpCode, email, name, department }) => {
    const cleanEmail = email.trim().toLowerCase();
    const corp = corps.find((c) => c.code === corpCode);
    if (!corp) return { ok: false, message: "유효하지 않은 기업 코드입니다.", openedCount: 0 };
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
      addLog("강의일괄오픈", `${corp.name} · ${cleanEmail}`, `전용 폼 제출로 ${targetCourses.length}개 과정 자동 오픈`);
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
      department: department.trim() || "ESG컨설팅본부",
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
    const emails = rawEmails.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter((s) => s.includes("@"));
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
            department: "ESG컨설팅본부",
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
    addLog("강의일괄오픈", `${corp.name} (${emails.length}명)`, `관리자 일괄 등록으로 ${openIds.length}개 과정 오픈`);
    return emails.length;
  };

  const updateProgress = (userId: string, courseId: string, nextPct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextPct)));
    const passRate = courseMedia.find((m) => m.courseId === courseId)?.passRate ?? 80;
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
        return { ...u, progress: nextProgress, completedAt: nextCompleted, certNumbers: nextCerts };
      }),
    );
  };

  const updateCourseMedia: LmsContextValue["updateCourseMedia"] = (courseId, patch) => {
    setCourseMedia((prev) => prev.map((m) => (m.courseId === courseId ? { ...m, ...patch, updatedAt: nowDate() } : m)));
    addLog("콘텐츠수정", courseMedia.find((m) => m.courseId === courseId)?.title ?? courseId, `영상(${patch.videoSourceType}) 및 수료 기준(${patch.passRate}%) 변경`);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    if (target) addLog("권한변경", `${target.name} (${target.email})`, `역할을 [${role}](으)로 변경`);
  };

  const toggleCorpAutoOpen = (corpId: string) => {
    setCorps((prev) =>
      prev.map((c) => (c.id === corpId ? { ...c, autoOpenEnabled: !c.autoOpenEnabled, integrationStatus: !c.autoOpenEnabled ? "연동 정상" : "폼 대기" } : c)),
    );
  };

  const answerQnA = (qnaId: string, answer: string) => {
    if (!answer.trim()) return;
    setQnas((prev) => prev.map((q) => (q.id === qnaId ? { ...q, answer: answer.trim(), status: "답변완료" } : q)));
  };

  const logBatchCertificatePrint = (corpName: string, count: number) => {
    addLog("수료증일괄출력", `${corpName} (${count}건)`, `수료자 ${count}명 수료증 일괄 출력`);
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
        loggedInUser,
        isAdminLoggedIn,
        loginModalOpen,
        setLoginModalOpen,
        loginWithEmail,
        logout,
        themeMode,
        setThemeMode,
        syncStatus,
        syncMessage,
        syncToCloud,
        pullFromCloud,
        refreshSupabaseConfig,
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
