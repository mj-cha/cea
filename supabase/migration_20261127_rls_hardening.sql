-- CEA 보안 강화 마이그레이션 (2026-11-27)
-- 목적: 비로그인 사용자의 기업 상담 목록(이메일·담당자명) 무단 조회 차단 및 LMS 쓰기 권한 인증 잠금
-- 적용 방법: Supabase Dashboard -> SQL Editor 에 붙여넣고 [Run] 실행

-- 1. 상담 접수 테이블: 동의 이력 컬럼 추가 + SELECT 권한을 인증된 사용자로 제한
alter table public.cea_consult_requests
  add column if not exists privacy_agreed boolean not null default true,
  add column if not exists privacy_agreed_at timestamptz not null default now();

drop policy if exists "cea_consult_requests_select" on public.cea_consult_requests;
create policy "cea_consult_requests_select_auth"
  on public.cea_consult_requests for select
  using (auth.role() = 'authenticated');

drop policy if exists "cea_consult_requests_update_auth" on public.cea_consult_requests;
create policy "cea_consult_requests_update_auth"
  on public.cea_consult_requests for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "cea_consult_requests_delete_auth" on public.cea_consult_requests;
create policy "cea_consult_requests_delete_auth"
  on public.cea_consult_requests for delete
  using (auth.role() = 'authenticated');

-- 2. LMS 통합 저장소: 쓰기(INSERT/UPDATE/DELETE)는 인증된 세션으로 제한
drop policy if exists "cea_lms_store_public_write" on public.cea_lms_store;
create policy "cea_lms_store_auth_write"
  on public.cea_lms_store for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
