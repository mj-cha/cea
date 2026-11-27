-- CEA (Corporate Ecosystem Advisory & Assurance) 통합 플랫폼 Supabase 스키마
-- Supabase Dashboard -> SQL Editor 에 붙여넣고 [Run] 을 누르면 즉시 생성됩니다.

-- 1. LMS 통합 상태 저장소 (법인, 수강생 진도율, 수료증 번호, 미디어 설정, 감사 로그 동기화)
create table if not exists public.cea_lms_store (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cea_lms_store enable row level security;

drop policy if exists "cea_lms_store_public_read" on public.cea_lms_store;
create policy "cea_lms_store_public_read"
  on public.cea_lms_store for select
  using (true);

drop policy if exists "cea_lms_store_public_write" on public.cea_lms_store;
drop policy if exists "cea_lms_store_auth_write" on public.cea_lms_store;
create policy "cea_lms_store_auth_write"
  on public.cea_lms_store for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 2. 홈페이지 ESG 컨설팅 · 기업 교육 상담 신청 접수 테이블
create table if not exists public.cea_consult_requests (
  id bigint generated always as identity primary key,
  company text not null,
  manager_name text not null,
  email text not null,
  interests text[] not null default '{}',
  message text not null default '',
  privacy_agreed boolean not null default true,
  privacy_agreed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.cea_consult_requests enable row level security;

drop policy if exists "cea_consult_requests_insert" on public.cea_consult_requests;
create policy "cea_consult_requests_insert"
  on public.cea_consult_requests for insert
  with check (true);

drop policy if exists "cea_consult_requests_select" on public.cea_consult_requests;
drop policy if exists "cea_consult_requests_select_auth" on public.cea_consult_requests;
create policy "cea_consult_requests_select_auth"
  on public.cea_consult_requests for select
  using (auth.role() = 'authenticated');
