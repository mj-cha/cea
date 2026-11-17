---
description: CTO(클로드)가 만든 프로젝트 셋팅·규칙·작업 지시서를 정량 감사 스크립트와 타 에이전트(Codex/Antigravity) 시각으로 교차 검증한다
---

# /audit-cto — CTO 설계·셋팅·작업지시서 교차 검증 워크플로우

1. 작성자의 보고서를 먼저 읽지 말고, 아래 정량 감사 스크립트를 먼저 실행한다(timeout: 90,000ms = 90초):
   ```powershell
   npm run audit:cto
   ```
   (Codex CLI 실시간 교차 검증 포함 시: `node "C:\Users\aweth\.agents\scripts\cto-audit.mjs" --dir . --codex --timeout-ms 60000`)
2. 슬라이드 7대 설계 기준과 4대 하드캡(파일 15KB 상한, 단일 UI 프레임워크, 선 텍스트 합의 후 1안 코딩, 빈 시작 커밋 금지)을 대조한다.
3. FAIL 항목이 있으면 즉시 수정하거나 반려 사유를 표로 정리해 보고한다.
