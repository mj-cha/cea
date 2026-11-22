/**
 * CEA 플랫폼 Supabase PostgREST 실서버 연동 클라이언트
 * 외부 무거운 SDK 의존성 없이 표준 Fetch + PostgREST 프로토콜로 동작하며,
 * 타임아웃(8000ms)과 명확한 성공/실패 상태를 반환한다.
 */

const RUNTIME_CONFIG_KEY = "cea_supabase_runtime_config_v1";
const REQUEST_TIMEOUT_MS = 8000;

export const SUPABASE_SCHEMA_SQL = `-- Supabase SQL Editor 에서 1회 실행
create table if not exists public.cea_lms_store (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.cea_lms_store enable row level security;
drop policy if exists "cea_lms_store_all" on public.cea_lms_store;
create policy "cea_lms_store_all" on public.cea_lms_store for all using (true) with check (true);

create table if not exists public.cea_consult_requests (
  id bigint generated always as identity primary key,
  company text not null,
  manager_name text not null,
  email text not null,
  interests text[] not null default '{}',
  message text not null default '',
  created_at timestamptz not null default now()
);
alter table public.cea_consult_requests enable row level security;
drop policy if exists "cea_consult_all" on public.cea_consult_requests;
create policy "cea_consult_all" on public.cea_consult_requests for all using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.cea_lms_store to anon, authenticated;
grant select, insert, update, delete on public.cea_consult_requests to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;`;

export interface SupabaseConnectionInfo {
  url: string;
  anonKey: string;
  source: "env" | "runtime" | "none";
  isConnected: boolean;
}

function normalizeSupabaseUrl(raw: string): string {
  return raw.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

export function getSupabaseConfig(): SupabaseConnectionInfo {
  const envUrl = normalizeSupabaseUrl((import.meta.env.VITE_SUPABASE_URL as string | undefined) || "");
  const envKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "").trim();

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, source: "env", isConnected: true };
  }

  try {
    const raw = localStorage.getItem(RUNTIME_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { url?: string; anonKey?: string };
      const rUrl = normalizeSupabaseUrl(parsed.url || "");
      const rKey = (parsed.anonKey || "").trim();
      if (rUrl && rKey) {
        return { url: rUrl, anonKey: rKey, source: "runtime", isConnected: true };
      }
    }
  } catch {
    // 무시
  }

  return { url: "", anonKey: "", source: "none", isConnected: false };
}

export function saveSupabaseRuntimeConfig(url: string, anonKey: string) {
  const cleanUrl = normalizeSupabaseUrl(url);
  const cleanKey = anonKey.trim();
  if (!cleanUrl || !cleanKey) {
    localStorage.removeItem(RUNTIME_CONFIG_KEY);
    return;
  }
  localStorage.setItem(RUNTIME_CONFIG_KEY, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));
}

function buildHeaders(anonKey: string, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: anonKey,
    "Content-Type": "application/json",
    ...extra,
  };
  // 레거시 JWT(eyJ...) 키만 Authorization Bearer 헤더를 함께 전송 (신규 sb_publishable_ 키는 apikey 헤더만 사용)
  if (anonKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${anonKey}`;
  }
  return headers;
}

export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string,
): Promise<{ ok: boolean; status: "성공" | "실패"; latencyMs: number; message: string }> {
  const cfg = getSupabaseConfig();
  const url = normalizeSupabaseUrl(customUrl ?? cfg.url);
  const key = (customKey ?? cfg.anonKey).trim();

  if (!url || !key) {
    return {
      ok: false,
      status: "실패",
      latencyMs: 0,
      message: "실패: Supabase URL 또는 Anon Key가 입력되지 않았습니다.",
    };
  }

  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${url}/rest/v1/cea_lms_store?select=id,updated_at&limit=1`, {
      method: "GET",
      headers: buildHeaders(key),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const latencyMs = Date.now() - t0;

    if (res.ok) {
      return {
        ok: true,
        status: "성공",
        latencyMs,
        message: `성공: Supabase 실서버 및 cea_lms_store 테이블 연결 확인 (${latencyMs}ms / 제한 ${REQUEST_TIMEOUT_MS}ms)`,
      };
    }

    const errText = await res.text();
    if (res.status === 404 || errText.includes("PGRST205") || errText.includes("cea_lms_store")) {
      return {
        ok: false,
        status: "실패",
        latencyMs,
        message: `실패(${res.status}, ${latencyMs}ms): Supabase 서버 인증은 성공했으나 'cea_lms_store' 테이블이 아직 없습니다. 아래 [SQL 스키마 복사] 후 Supabase SQL Editor에서 실행해 주세요.`,
      };
    }

    return {
      ok: false,
      status: "실패",
      latencyMs,
      message: `실패(HTTP ${res.status}, ${latencyMs}ms): ${errText.slice(0, 120) || "인증 키 또는 URL을 확인해 주세요."}`,
    };
  } catch (err) {
    clearTimeout(timer);
    const latencyMs = Date.now() - t0;
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: "실패",
      latencyMs,
      message: `실패(경과 ${latencyMs}ms / 제한 ${REQUEST_TIMEOUT_MS}ms): 네트워크 또는 URL 오류 (${msg})`,
    };
  }
}

export async function pullLmsStateFromSupabase<T>(): Promise<{
  ok: boolean;
  data?: T;
  updatedAt?: string;
  error?: string;
}> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) return { ok: false, error: "미연결" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${cfg.url}/rest/v1/cea_lms_store?id=eq.main&select=payload,updated_at`, {
      method: "GET",
      headers: buildHeaders(cfg.anonKey),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${txt.slice(0, 100)}` };
    }
    const rows = (await res.json()) as { payload?: T; updated_at?: string }[];
    if (!rows.length || !rows[0].payload) {
      return { ok: true, data: undefined };
    }
    return { ok: true, data: rows[0].payload, updatedAt: rows[0].updated_at };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function pushLmsStateToSupabase(payload: unknown): Promise<{
  ok: boolean;
  updatedAt?: string;
  error?: string;
}> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) return { ok: false, error: "미연결" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  const nowIso = new Date().toISOString();

  try {
    const res = await fetch(`${cfg.url}/rest/v1/cea_lms_store`, {
      method: "POST",
      headers: buildHeaders(cfg.anonKey, {
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify({
        id: "main",
        payload,
        updated_at: nowIso,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${txt.slice(0, 100)}` };
    }
    return { ok: true, updatedAt: nowIso };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function insertConsultToSupabase(params: {
  company: string;
  managerName: string;
  email: string;
  interests: string[];
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConnected) return { ok: false, error: "미연결" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${cfg.url}/rest/v1/cea_consult_requests`, {
      method: "POST",
      headers: buildHeaders(cfg.anonKey, { Prefer: "return=minimal" }),
      body: JSON.stringify({
        company: params.company,
        manager_name: params.managerName,
        email: params.email,
        interests: params.interests,
        message: params.message,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${txt.slice(0, 100)}` };
    }
    return { ok: true };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
