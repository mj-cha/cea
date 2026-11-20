import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AdminAuditLog,
  CorpEntity,
  CourseMediaConfig,
  QnAItem,
  UserAccount,
} from "@/lib/lms-types";
import { getSupabaseConfig, pullLmsStateFromSupabase, pushLmsStateToSupabase } from "@/lib/supabase-client";

export const STORAGE_KEY = "cea_lms_state_v2";
export const AUTH_STORAGE_KEY = "cea_auth_user_v2";
export const THEME_STORAGE_KEY = "cea_theme_mode_v2";

export type SyncStatus = "로컬전용" | "진행 중" | "성공" | "실패";

export const SUPABASE_CONFIG = {
  get url() {
    return getSupabaseConfig().url;
  },
  get anonKey() {
    return getSupabaseConfig().anonKey;
  },
  get isConnected() {
    return getSupabaseConfig().isConnected;
  },
};

export interface PersistedLmsState {
  courseMedia: CourseMediaConfig[];
  corps: CorpEntity[];
  users: UserAccount[];
  auditLogs: AdminAuditLog[];
  qnas: QnAItem[];
}

export const nowDate = () => new Date().toISOString().slice(0, 10);

export const nowDateTime = () => {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
};

export function createAuditLog(
  actionType: AdminAuditLog["actionType"],
  target: string,
  detail: string,
): AdminAuditLog {
  return {
    id: `log-${Date.now()}`,
    adminId: "adm-1",
    adminName: "차명진 대표 (총괄)",
    actionType,
    target,
    detail,
    createdAt: nowDateTime(),
  };
}

export function mergeBulkOpenUsers(
  prev: UserAccount[],
  emails: string[],
  corp: CorpEntity,
  openIds: string[],
): UserAccount[] {
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
}

export function computeUpdatedUserProgress(
  users: UserAccount[],
  userId: string,
  courseId: string,
  clampedPct: number,
  passRate: number,
): UserAccount[] {
  return users.map((u) => {
    if (u.id !== userId) return u;
    const nextProgress = { ...u.progress, [courseId]: clampedPct };
    const nextCompleted = { ...u.completedAt };
    const nextCerts = { ...u.certNumbers };
    if (clampedPct >= passRate && !nextCompleted[courseId]) {
      nextCompleted[courseId] = nowDate();
      nextCerts[courseId] = `CEA-2026-${Math.floor(1100 + Math.random() * 8900)}`;
    }
    return { ...u, progress: nextProgress, completedAt: nextCompleted, certNumbers: nextCerts };
  });
}

export function useLmsCloudSync(
  state: PersistedLmsState,
  onHydrate: (parsed: Partial<PersistedLmsState>) => void,
) {
  const { courseMedia, corps, users, auditLogs, qnas } = state;
  const [configTick, setConfigTick] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    getSupabaseConfig().isConnected ? "진행 중" : "로컬전용",
  );
  const [syncMessage, setSyncMessage] = useState("");
  const isInitialLoaded = useRef(false);

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
    if (res.data) onHydrate(res.data);
    setSyncStatus("성공");
    setSyncMessage("성공: Supabase 클라우드 동기화 완료");
  }, [onHydrate]);

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
      if (raw) onHydrate(JSON.parse(raw));
    } catch {
      // 기본 시드 유지
    }
    isInitialLoaded.current = true;
  }, [onHydrate]);

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

  return { syncStatus, syncMessage, syncToCloud, pullFromCloud, refreshSupabaseConfig };
}
