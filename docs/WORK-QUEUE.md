# CEA 교육·컨설팅 홈페이지 에이전트 분업 큐 (WORK-QUEUE)

> **규칙 원본**: `AGENTS.md`(7대 설계 기준·15KB 파일 상한·단일 UI 스택), `CLAUDE.md`(교차 검증 의무).

## 1. 에이전트 역할 및 전담 파일 구역 (충돌 방지)

| 에이전트 | 역할 | 전담 업무 및 파일 구역 |
|---|---|---|
| **① 유료 구독 클로드 (총괄 CTO)** | 기획 · 핵심 카피 · 최종 방향 결정 (쿼터 절약) | 무거운 코딩 금지. 전체 방향성·핵심 카피 컨펌만 담당 |
| **② Antigravity (Gemini 4 Argon)** | 설계·코드 감사 및 화면 섹션 UI·반응형·접근성 전담 | `docs/WORK-QUEUE.md`, `src/sections/*` (`hero`, `why-now`, `services`, `education`, `faq`), `src/components/*` |
| **③ Codex (GPT-6 Astra)** | 데이터 스키마 · 상담 폼 로직 · CLI 교차 검증 전담 | `src/data/*` (`courses.ts`, `services*.ts`), `src/sections/contact.tsx`(폼/선택 연동), `src/lib/*` |

*(참고: `freellmapi` 터미널 클로드는 무료 API 키 1개의 분당 호출 제한 `429 Rate Limit`으로 인해 다중 파일 탐색 시 80초 쿨다운이 발생하므로, 코드 감사는 Antigravity와 Codex CLI가 직접 수행합니다.)*

---

## 2. [W2 완료] 현행 8개 섹션 실제 코드 검수 결과 (작성자 보고서 없이 코드 직접 감사)

1. **[치명] 상담 신청 폼 접수 불능 및 컨텍스트 단절 (`contact.tsx`, `services.tsx`, `education.tsx`)**:
   - `CONTACT_EMAIL = ""`로 비어 있어 폼 제출 시 무조건 *"온라인 접수 창구를 준비하고 있어요"*라며 실패함.
   - `Services`의 `"{s.title} 상담하기"` 버튼이나 `Education`의 `"기업 교육 문의"`를 눌러 `#contact`로 이동해도 상담 폼의 `관심 분야` 칩이 자동 선택되지 않음.
2. **[치명] 교육 과정(`Education`) 카드가 클릭 불가능한 정적 장식임 (`education.tsx`)**:
   - 교육 홈페이지임에도 과정 카드 우측 상단의 `<Play />` 아이콘이 버튼/링크가 아닌 단순 `<span>` 장식이며, 과정 클릭 시 상세 커리큘럼(차시·시간) 확인이나 해당 과정 수강 문의로 이어지는 동작이 없음.
3. **[데이터 누락] 01 거버넌스 자문 · 02 ESG 공시 탭만 '컨설팅 상세(`details`)'가 비어 있음 (`services-env.ts`)**:
   - 03~07번 서비스에는 `details`(아코디언 상세 설명·주요 대상·기대 효과)가 있으나, 첫 화면에 기본 노출되는 **01번(`governance`)과 02번(`disclosure`)은 `details: []` 빈 배열**이라 가장 중요한 첫 탭에서 상세 아코디언이 아예 렌더링되지 않음.
4. **[모바일 UX 및 AI 티] 7개 서비스 탭 모바일 잘림 및 영문 대문자 라벨 (`services.tsx`, `hero.tsx`)**:
   - 모바일(390px)에서 7개 서비스 탭(`TabsList`)이 가로 스크롤 한 줄이라 뒷번호 탭(04~07)이 화면 밖으로 가려져 인지하기 어려움(모바일 2열 그리드 또는 스크롤 인디케이터 필요).
   - `SubHead`의 `Why` 영문 대문자·`01/02/03` 번호 매기기 등 AI 티 요소가 남아 있음.

---

## 3. 분업 작업 지시서 (W3 · W4)

### [W3] UI · 반응형 · 교육/상담 동선 개선 (담당: Antigravity)
- **5줄 텍스트 설계안**:
  1. `services.tsx`: 모바일(390px)에서 7개 서비스 탭이 잘리지 않도록 모바일 전용 2열 선택 그리드(데스크톱은 좌측 수직 탭 유지)로 개선하고, `Why` 등 영문 대문자 라벨을 자연스러운 한국어 소제목으로 교체한다.
  2. `services.tsx` & `education.tsx`: 각 서비스의 `"○○ 상담하기"`, 교육 카드의 `"이 과정 문의하기"` 클릭 시 상담 섹션(`#contact`)의 관심 분야가 자동 선택되도록 `service-context.tsx`의 상태와 연결한다.
  3. `education.tsx`: 장식용 `<Play />` 스팬을 제거하고, 카드 하단에 과정별 수강·단체교육 문의 버튼과 커리큘럼 요약 구성을 명확히 표시한다.
- **범위**: `src/sections/services.tsx`, `src/sections/education.tsx`, `src/sections/hero.tsx`, `src/lib/service-context.tsx`
- **하지 말 것**: 새로운 npm 패키지 추가 금지, 파일당 15KB 상한 초과 금지, `src/data/*` 파일 직접 수정 금지(Codex 전담).
- **완료 조건**: `npm run build` 오류 0, `npm run audit:cto` FAIL 0, 390px 모바일 화면에서 가로 스크롤 0 및 서비스/교육 클릭 시 상담 폼 관심 분야 자동 반영 확인.

### [W4] 01·02번 서비스 상세 데이터 보강 및 상담 폼 접수 완성 (담당: Codex)
- **5줄 텍스트 설계안**:
  1. `src/data/services-env.ts`: 현재 `details: []`로 비어 있는 `01 거버넌스 자문`(이사회 평가, 주주총회 대응, 밸류업 공시 등)과 `02 ESG 공시·검증`(중대성 평가, 보고서 작성, AA1000 검증 등)에 상세 항목을 채워 7개 탭 모두 일관된 구성을 갖추게 한다.
  2. `src/sections/contact.tsx`: 환경변수(`VITE_CONTACT_EMAIL`) 또는 기본 대표 이메일 폴백과 클립보드 복사/접수 요약 미리보기를 제공해 폼 제출 시 먹통(`unavailable`)이 되지 않게 개선한다.
  3. 외부 섹션(`Services`, `Education`)에서 넘어온 관심 분야 선택값을 `picked` 상태에 자동 동기화한다.
- **범위**: `src/data/services-env.ts`, `src/data/courses.ts`, `src/sections/contact.tsx`, `.env.example`
- **하지 말 것**: 파일당 15KB 상한 초과 금지(`services-env.ts`가 15KB를 넘으면 파일 분리), 지어낸 허위 실적 숫자·과장 문구 사용 금지.
- **완료 조건**: 01·02번 탭에서 '컨설팅 상세' 아코디언 정상 표시, 상담 신청 제출 시 요약 안내 및 메일/복사 정상 동작, `npm run build` 및 `npm run audit:cto` FAIL 0.

---

## 4. 현재 작업 큐 상태

| 번호 | 구분 | 작업 내용 | 담당 에이전트 | 상태 |
|---|---|---|---|---|
| **W1** | 초기 셋팅 | 중복 UI 라이브러리 4종 제거, `cn` 버그 수정, 15KB 초과 파일 분리, Git 초기화 | Antigravity | **완료** |
| **W2** | 코드 검수 · 지시서 | 8개 섹션 실제 코드 감사 및 W3/W4 분업 작업 지시서 + 교차 검증 첨부 | Antigravity | **완료** |
| **W3** | UI · 반응형 · 동선 | 모바일 7개 탭 가시성 개선, 교육 카드 클릭 동선, 상담 관심분야 연동 | Antigravity | **완료** |
| **W4** | 데이터 · 상담 폼 | 01·02번 서비스 `details` 데이터 채우기 및 상담 신청 폼 접수 동작 완성 | Antigravity | **완료** |
| **S1** | 검수 스튜디오 `/__studio` | 고수템과 동일한 공통 `studio/` v1.0 3단 뷰어(1440/390 전환·블록 고르기·`STUDIO-QUEUE` 고치기 큐·테마 3종) 이식 (`src/**` 수정 0, 빌드 미포함) | Antigravity | **완료** |

---

## [교차 검증 결과 (cto-audit.mjs)]
- **판정**: **통과 (PASS)**
- **정량 감사 요약**: FAIL 0건 / WARN 0건 / PASS 7건 (`WORK-QUEUE.md` 필수 3요소 및 5줄 텍스트 설계안 준수 확인)
