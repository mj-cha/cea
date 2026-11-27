import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
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
import {
  AUTH_STORAGE_KEY,
  STORAGE_KEY,
  SUPABASE_CONFIG,
  THEME_STORAGE_KEY,
  computeUpdatedUserProgress,
  createAuditLog,
  mergeBulkOpenUsers,
  mergeSeedCorps,
  mergeSeedCourseMedia,
  nowDate,
  useLmsCloudSync,
  type PersistedLmsState,
  type SyncStatus,
} from "@/lib/lms-sync";
import {
  consumeAuthCallbackFromHash,
  getStoredAuthSession,
  refreshSupabaseSession,
  sendSupabasePasswordReset,
  signInWithSupabasePassword,
  signOutSupabase,
  signUpWithSupabasePassword,
  updateSupabasePassword,
  type AuthActionResult,
} from "@/lib/supabase-auth";
import type {
  AdminAuditLog,
  AdminMember,
  HostPlanStatus,
  PaymentRecord,
  SubscriptionItem,
  UserAccount,
  UserRole,
  VideoSourceType,
} from "@/lib/lms-types";

export { SUPABASE_CONFIG };

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
  recoveryToken: string;
  clearRecoveryToken: () => void;
  loginWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; isAdmin: boolean; user?: UserAccount; message: string }>;
  setupFirstPassword: (email: string, password: string) => Promise<AuthActionResult>;
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  completePasswordRecovery: (newPassword: string) => Promise<AuthActionResult>;
  logout: () => void;
  themeMode: "white" | "navy";
  setThemeMode: (mode: "white" | "navy") => void;
  syncStatus: SyncStatus;
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
  const [loggedInEmail, setLoggedInEmail] = useState(() => getStoredAuthSession()?.user.email || "");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"white" | "navy">(() =>
    localStorage.getItem(THEME_STORAGE_KEY) === "navy" ? "navy" : "white",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "navy");
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const applyPersisted = useCallback((parsed: Partial<PersistedLmsState>) => {
    if (parsed.courseMedia?.length) setCourseMedia(mergeSeedCourseMedia(parsed.courseMedia, initialCourseMedia));
    if (parsed.corps?.length) setCorps(mergeSeedCorps(parsed.corps, initialCorps));
    if (parsed.users?.length) setUsers(parsed.users);
    if (parsed.auditLogs?.length) setAuditLogs(parsed.auditLogs);
    if (parsed.qnas?.length) setQnas(parsed.qnas);
  }, []);

  const { syncStatus, syncMessage, syncToCloud, pullFromCloud, refreshSupabaseConfig } = useLmsCloudSync(
    { courseMedia, corps, users, auditLogs, qnas },
    applyPersisted,
  );

  const resolveSignedInEmail = useCallback(
    (cleanEmail: string) => {
      const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
      const matchedAdmin = admins.find((a) => a.email.toLowerCase() === cleanEmail);
      let userObj = matchedUser;
      if (!userObj && matchedAdmin) {
        userObj = users[0];
      }
      if (!userObj) {
        const created: UserAccount = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          corpCode: "cea",
          corpName: "주식회사 씨이에이(CEA)",
          department: "외부 수강생",
          role: "수강생",
          joinedAt: nowDate(),
          status: "활성",
          enrolledCourseIds: [],
          progress: {},
          completedAt: {},
          certNumbers: {},
        };
        setUsers((prev) => (prev.some((u) => u.email.toLowerCase() === cleanEmail) ? prev : [created, ...prev]));
        userObj = created;
      }
      setLoggedInEmail(cleanEmail);
      setActiveUserId(userObj.id);
      setLoginModalOpen(false);
      const adminFlag = Boolean(userObj.role === "관리자" || matchedAdmin);
      return { userObj, adminFlag };
    },
    [admins, users],
  );

  useEffect(() => {
    let active = true;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    void (async () => {
      const cb = await consumeAuthCallbackFromHash();
      if (!active) return;
      if (cb.type === "recovery" && cb.accessToken) {
        setRecoveryToken(cb.accessToken);
        setLoginModalOpen(true);
        return;
      }
      if (cb.type === "signup" && cb.session) {
        setLoggedInEmail(cb.session.user.email);
        return;
      }
      const refreshed = await refreshSupabaseSession();
      if (!active) return;
      setLoggedInEmail(refreshed?.user.email || "");
    })();
    return () => {
      active = false;
    };
  }, []);

  const loggedInUser = users.find((u) => u.email.toLowerCase() === loggedInEmail.toLowerCase()) ?? null;
  const isAdminLoggedIn = Boolean(
    loggedInUser?.role === "관리자" || admins.some((a) => a.email.toLowerCase() === loggedInEmail.toLowerCase()),
  );

  const loginWithPassword: LmsContextValue["loginWithPassword"] = async (email, password) => {
    const res = await signInWithSupabasePassword(email, password);
    if (!res.ok || !res.session) {
      return { ok: false, isAdmin: false, message: res.message };
    }
    const { userObj, adminFlag } = resolveSignedInEmail(res.session.user.email);
    window.location.hash = adminFlag ? "#admin" : "#lms";
    return { ok: true, isAdmin: adminFlag, user: userObj, message: `${userObj.name}님 로그인 완료` };
  };

  const setupFirstPassword: LmsContextValue["setupFirstPassword"] = async (email, password) => {
    const res = await signUpWithSupabasePassword(email, password);
    if (res.ok && res.session) {
      const { adminFlag } = resolveSignedInEmail(res.session.user.email);
      window.location.hash = adminFlag ? "#admin" : "#lms";
    }
    return res;
  };

  const requestPasswordReset: LmsContextValue["requestPasswordReset"] = async (email) =>
    sendSupabasePasswordReset(email);

  const completePasswordRecovery: LmsContextValue["completePasswordRecovery"] = async (newPassword) => {
    if (!recoveryToken) {
      return { ok: false, message: "재설정 토큰이 만료되었습니다. 비밀번호 재설정 메일을 다시 요청해 주세요." };
    }
    const res = await updateSupabasePassword(recoveryToken, newPassword);
    if (res.ok) setRecoveryToken("");
    return res;
  };

  const clearRecoveryToken = () => setRecoveryToken("");

  const logout = () => {
    void signOutSupabase();
    setLoggedInEmail("");
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (window.location.hash.startsWith("#admin") || window.location.hash.startsWith("#lms")) {
      window.location.hash = "#top";
    }
  };

  const addLog = (actionType: AdminAuditLog["actionType"], target: string, detail: string) => {
    setAuditLogs((prev) => [createAuditLog(actionType, target, detail), ...prev]);
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
    setUsers((prev) => mergeBulkOpenUsers(prev, emails, corp, openIds));
    addLog("강의일괄오픈", `${corp.name} (${emails.length}명)`, `관리자 일괄 등록으로 ${openIds.length}개 과정 오픈`);
    return emails.length;
  };

  const updateProgress = (userId: string, courseId: string, nextPct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextPct)));
    const passRate = courseMedia.find((m) => m.courseId === courseId)?.passRate ?? 80;
    setUsers((prev) => computeUpdatedUserProgress(prev, userId, courseId, clamped, passRate));
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
        courseMedia, corps, users, admins, auditLogs, subscriptions, payments, qnas, hostPlans,
        activeUserId, setActiveUserId, loggedInUser, isAdminLoggedIn, loginModalOpen, setLoginModalOpen,
        recoveryToken, clearRecoveryToken, loginWithPassword, setupFirstPassword, requestPasswordReset,
        completePasswordRecovery, logout, themeMode, setThemeMode, syncStatus, syncMessage, syncToCloud,
        pullFromCloud, refreshSupabaseConfig, applyByCorpForm, bulkOpenCourses, updateProgress,
        updateCourseMedia, updateUserRole, toggleCorpAutoOpen, answerQnA, logBatchCertificatePrint, resetDemoData,
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
