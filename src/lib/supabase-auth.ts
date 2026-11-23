/**
 * CEA 플랫폼 Supabase Auth(GoTrue REST v1) 실인증 클라이언트
 * 외부 SDK 없이 표준 Fetch API로 이메일·비밀번호 로그인, 최초 비밀번호 설정(가입),
 * 비밀번호 재설정 메일 발송, 세션 자동 복구·갱신을 처리한다.
 */

import { getSupabaseConfig } from "@/lib/supabase-client";

const AUTH_SESSION_KEY = "cea_supabase_auth_session_v1";
const REQUEST_TIMEOUT_MS = 8000;

export interface SupabaseAuthUser {
  id: string;
  email: string;
}

export interface SupabaseAuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp (ms)
  user: SupabaseAuthUser;
}

export interface AuthActionResult {
  ok: boolean;
  session?: SupabaseAuthSession;
  needsEmailConfirmation?: boolean;
  message: string;
}

function buildAuthHeaders(anonKey: string, bearerToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: anonKey,
    "Content-Type": "application/json",
  };
  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  } else if (anonKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${anonKey}`;
  }
  return headers;
}

function translateAuthError(raw: string, status: number): string {
  const lower = raw.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "아이디 또는 비밀번호가 올바르지 않습니다. 처음 이용하신다면 '처음 비밀번호 설정'을 진행해 주세요.";
  }
  if (lower.includes("email not confirmed")) {
    return "이메일 인증이 아직 완료되지 않았습니다. 받은 편지함의 인증 링크를 먼저 클릭해 주세요.";
  }
  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "이미 비밀번호가 설정된 계정입니다. '로그인' 또는 '비밀번호 재설정'을 이용해 주세요.";
  }
  if (lower.includes("password should be at least")) {
    return "비밀번호는 최소 6자 이상으로 입력해 주세요.";
  }
  if (lower.includes("rate limit") || status === 429) {
    return "요청이 잠시 많습니다. 1분 정도 뒤에 다시 시도해 주세요.";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
    return "올바른 이메일 주소 형식이 아닙니다.";
  }
  return `인증 처리 실패 (HTTP ${status}): ${raw.slice(0, 120) || "잠시 후 다시 시도해 주세요."}`;
}

export function getStoredAuthSession(): SupabaseAuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SupabaseAuthSession>;
    if (!parsed.accessToken || !parsed.user?.email) return null;
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken || "",
      expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0,
      user: { id: parsed.user.id || "", email: parsed.user.email.toLowerCase() },
    };
  } catch {
    return null;
  }
}

export function saveAuthSession(session: SupabaseAuthSession | null) {
  try {
    if (!session) localStorage.removeItem(AUTH_SESSION_KEY);
    else localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // 스토리지 제한 환경 무시
  }
}

function extractSessionFromPayload(data: Record<string, unknown>): SupabaseAuthSession | null {
  const accessToken = typeof data.access_token === "string" ? data.access_token : "";
  const refreshToken = typeof data.refresh_token === "string" ? data.refresh_token : "";
  const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 3600;
  const userObj = (data.user && typeof data.user === "object" ? data.user : null) as
    | { id?: string; email?: string }
    | null;
  const email = (userObj?.email || "").trim().toLowerCase();
  if (!accessToken || !email) return null;
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user: { id: userObj?.id || "", email },
  };
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const txt = await res.text();
    try {
      const json = JSON.parse(txt) as { error_description?: string; msg?: string; message?: string; error?: string };
      return json.error_description || json.msg || json.message || json.error || txt;
    } catch {
      return txt;
    }
  } catch {
    return "";
  }
}

/** 1. 이메일 + 비밀번호 실인증 로그인 */
export async function signInWithSupabasePassword(email: string, password: string): Promise<AuthActionResult> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) {
    return { ok: false, message: "실서버 인증(Supabase)이 연결되지 않았습니다. 관리자에게 문의해 주세요." };
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { ok: false, message: "이메일과 비밀번호를 모두 입력해 주세요." };
  }

  try {
    const res = await fetchWithTimeout(`${cfg.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: buildAuthHeaders(cfg.anonKey),
      body: JSON.stringify({ email: cleanEmail, password }),
    });
    if (!res.ok) {
      const rawErr = await parseErrorMessage(res);
      return { ok: false, message: translateAuthError(rawErr, res.status) };
    }
    const data = (await res.json()) as Record<string, unknown>;
    const session = extractSessionFromPayload(data);
    if (!session) {
      return { ok: false, message: "인증 응답에 세션 정보가 없습니다. 다시 시도해 주세요." };
    }
    saveAuthSession(session);
    return { ok: true, session, message: "로그인 성공" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `인증 서버 연결 오류 (제한 ${REQUEST_TIMEOUT_MS}ms): ${msg}` };
  }
}

/** 2. 최초 비밀번호 설정 (Supabase Auth 이메일 계정 등록) */
export async function signUpWithSupabasePassword(email: string, password: string): Promise<AuthActionResult> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) {
    return { ok: false, message: "실서버 인증(Supabase)이 연결되지 않았습니다." };
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || password.length < 6) {
    return { ok: false, message: "업무용 이메일과 6자 이상의 비밀번호를 입력해 주세요." };
  }

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  try {
    const res = await fetchWithTimeout(
      `${cfg.url}/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method: "POST",
        headers: buildAuthHeaders(cfg.anonKey),
        body: JSON.stringify({ email: cleanEmail, password }),
      },
    );
    if (!res.ok) {
      const rawErr = await parseErrorMessage(res);
      return { ok: false, message: translateAuthError(rawErr, res.status) };
    }
    const data = (await res.json()) as Record<string, unknown>;
    const session = extractSessionFromPayload(data);
    if (session) {
      saveAuthSession(session);
      return { ok: true, session, message: "비밀번호 설정 및 로그인이 완료되었습니다." };
    }
    return {
      ok: true,
      needsEmailConfirmation: true,
      message: `${cleanEmail} 주소로 인증 메일을 보냈습니다. 메일의 확인 링크를 누른 뒤 로그인해 주세요.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `가입 요청 오류 (제한 ${REQUEST_TIMEOUT_MS}ms): ${msg}` };
  }
}

/** 3. 비밀번호 재설정 메일 발송 */
export async function sendSupabasePasswordReset(email: string): Promise<AuthActionResult> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) {
    return { ok: false, message: "실서버 인증(Supabase)이 연결되지 않았습니다." };
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, message: "비밀번호를 재설정할 이메일 주소를 입력해 주세요." };
  }

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  try {
    const res = await fetchWithTimeout(
      `${cfg.url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method: "POST",
        headers: buildAuthHeaders(cfg.anonKey),
        body: JSON.stringify({ email: cleanEmail }),
      },
    );
    if (!res.ok) {
      const rawErr = await parseErrorMessage(res);
      return { ok: false, message: translateAuthError(rawErr, res.status) };
    }
    return {
      ok: true,
      message: `${cleanEmail} 주소로 비밀번호 재설정 링크를 보냈습니다. 메일함을 확인해 주세요.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `재설정 메일 발송 오류 (제한 ${REQUEST_TIMEOUT_MS}ms): ${msg}` };
  }
}

/** 4. 재설정 링크로 진입한 뒤 새 비밀번호 저장 */
export async function updateSupabasePassword(accessToken: string, newPassword: string): Promise<AuthActionResult> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) return { ok: false, message: "실서버 인증(Supabase)이 연결되지 않았습니다." };
  if (newPassword.length < 6) {
    return { ok: false, message: "새 비밀번호는 6자 이상으로 입력해 주세요." };
  }
  try {
    const res = await fetchWithTimeout(`${cfg.url}/auth/v1/user`, {
      method: "PUT",
      headers: buildAuthHeaders(cfg.anonKey, accessToken),
      body: JSON.stringify({ password: newPassword }),
    });
    if (!res.ok) {
      const rawErr = await parseErrorMessage(res);
      return { ok: false, message: translateAuthError(rawErr, res.status) };
    }
    return { ok: true, message: "새 비밀번호가 저장되었습니다. 이제 로그인할 수 있습니다." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `비밀번호 변경 오류 (제한 ${REQUEST_TIMEOUT_MS}ms): ${msg}` };
  }
}

/** 5. 리프레시 토큰으로 세션 갱신 및 현재 사용자 검증 */
export async function refreshSupabaseSession(): Promise<SupabaseAuthSession | null> {
  const cfg = getSupabaseConfig();
  const current = getStoredAuthSession();
  if (!cfg.isConnected || !current) return null;

  // 만료까지 60초 이상 남았으면 현재 세션 유지
  if (current.expiresAt > Date.now() + 60_000) {
    return current;
  }
  if (!current.refreshToken) {
    saveAuthSession(null);
    return null;
  }

  try {
    const res = await fetchWithTimeout(`${cfg.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: buildAuthHeaders(cfg.anonKey),
      body: JSON.stringify({ refresh_token: current.refreshToken }),
    });
    if (!res.ok) {
      saveAuthSession(null);
      return null;
    }
    const data = (await res.json()) as Record<string, unknown>;
    const next = extractSessionFromPayload(data);
    saveAuthSession(next);
    return next;
  } catch {
    return current;
  }
}

/** 6. 인증 메일/재설정 링크 복귀 시 URL 해시(#access_token=...) 해석 */
export async function consumeAuthCallbackFromHash(): Promise<{
  type: "recovery" | "signup" | "none";
  accessToken?: string;
  session?: SupabaseAuthSession;
}> {
  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token=")) return { type: "none" };
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token") || "";
  const refreshToken = params.get("refresh_token") || "";
  const expiresIn = Number(params.get("expires_in") || "3600");
  const rawType = params.get("type") || "";
  if (!accessToken) return { type: "none" };

  // 토큰이 주소창에 남지 않도록 즉시 정리
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#top`);

  if (rawType === "recovery") {
    return { type: "recovery", accessToken };
  }

  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) return { type: "none" };
  try {
    const res = await fetchWithTimeout(`${cfg.url}/auth/v1/user`, {
      method: "GET",
      headers: buildAuthHeaders(cfg.anonKey, accessToken),
    });
    if (!res.ok) return { type: "none" };
    const user = (await res.json()) as { id?: string; email?: string };
    if (!user.email) return { type: "none" };
    const session: SupabaseAuthSession = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
      user: { id: user.id || "", email: user.email.toLowerCase() },
    };
    saveAuthSession(session);
    return { type: "signup", session };
  } catch {
    return { type: "none" };
  }
}

/** 7. 로그아웃 (서버 세션 무효화 + 로컬 세션 삭제) */
export async function signOutSupabase(): Promise<void> {
  const cfg = getSupabaseConfig();
  const current = getStoredAuthSession();
  saveAuthSession(null);
  if (!cfg.isConnected || !current?.accessToken) return;
  try {
    await fetchWithTimeout(`${cfg.url}/auth/v1/logout`, {
      method: "POST",
      headers: buildAuthHeaders(cfg.anonKey, current.accessToken),
    });
  } catch {
    // 네트워크 실패 시에도 로컬 로그아웃 유지
  }
}
