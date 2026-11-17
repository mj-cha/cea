# AGENTS.md — CEA ESG 교육·컨설팅 홈페이지 AI 공통 규칙 (SSOT)

이 저장소에서 일하는 모든 AI 에이전트(Claude CTO · Antigravity/Gemini · Codex/GPT)가 따르는 **단일 기준(SSOT)**입니다.

## 1.7대 설계 선행 기준 (Rules First)
1. **버전 관리 (Git)**: 로컬에서 타입 검사·빌드·검증(`npm run build && npm run audit:cto`)을 모두 통과한 뒤 **1작업 = 1커밋**으로 기록합니다. 코드 변경 없는 빈 시작 커밋은 금지합니다.
2. **브랜치 전략**: 일상 작업 기준 브랜치는 `dev`입니다. 운영 브랜치(`main`)에는 MJ의 명시적 지시 없이 push·머지하지 않습니다.
3. **디렉토리 구조**:
   - `src/sections/` : 화면 섹션 컴포넌트 (파일당 15KB 상한)
   - `src/components/` : 공통 레이아웃(`layout.tsx`) 및 `ui/` 부품
   - `src/data/` : 교육 과정(`courses.ts`) 및 ESG 서비스(`services*.ts`) 정적 데이터
   - `src/lib/` : 상태 컨텍스트(`service-context.tsx`) 및 유틸리티(`utils.ts`)
   - 화면 폴더(`src/sections/`) 안에 순수 데이터 파일을 섞어 두지 않습니다.
4. **프레임워크 · 디자인 패턴 (단일화)**:
   - **React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + shadcn/ui(`radix-ui` + `lucide-react`)** 단일 스택만 사용합니다.
   - **타 UI 프레임워크 중복 설치 절대 금지**: MUI, Ant Design, Bootstrap, HeroUI 등 다른 UI 라이브러리를 추가하거나 혼용하지 않습니다.
   - 파일 하나가 **15KB(약 350줄)**를 넘어가면 하위 섹션이나 부품 파일로 분리합니다.
5. **아키텍처**: 정적·클라이언트 중심 웹앱 구조이며, 문의 폼·외부 연동 추가 시 서버/함수 계층을 분리합니다. 미사용 패키지는 즉시 제거합니다.
6. **데이터 관리**: 서비스 선택 상태는 `ServiceProvider`(`src/lib/service-context.tsx`)로 관리하고, 정적 데이터는 타입(`Service`, `Course`)을 엄격히 준수합니다.
7. **코드 · 깃 컨벤션 및 토큰 절약**:
   - **선(先) 텍스트 설계안 합의 후 1안 코딩**: 새 화면·섹션을 만들 때 처음부터 코드를 2~3벌 짜지 않습니다. 먼저 **5줄 이내의 텍스트 설계안 비교**를 제시해 MJ가 고른 뒤 **선택된 1안만 코딩**합니다.
   - 클래스 병합은 반드시 `@/lib/utils`의 `cn`(`clsx` + `tailwind-merge`)을 사용합니다.

## 2. 에이전트 분업 및 교차 검증 구조
- **Claude (CTO)**: 기획·카피라이팅·작업 지시서 초안 작성 및 통합. 복합 작업 지시서를 쓸 때는 반드시 `cto-reviewer` 서브에이전트 또는 `npm run audit:cto`를 실행해 하단에 `[교차 검증 결과]`를 첨부해야 합니다.
- **Antigravity (Gemini)**: 섹션 UI·반응형 레이아웃·접근성 구현 및 CTO 설계·셋팅 감사(`/audit-cto`).
- **Codex (GPT)**: TypeScript 타입·데이터 정합성 검증, `cto-audit.mjs --codex` 교차 검증 및 로직 분업.

## 3. 완료 전 필수 실행 명령
- `npm run audit:cto` → **FAIL 0건** 확인
- `npm run build` (`tsc --noEmit && vite build`) → **타입 및 빌드 오류 0건** 확인
