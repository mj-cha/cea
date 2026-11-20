---
description: CEA 홈페이지 발간물(4대 회계법인·로펌·임팩트온·유튜브), 온라인 강의 영상·교안, 컨설팅 내용을 최신으로 업데이트하고 GitHub Pages(www.cea.co.kr)에 자동 검증·배포하는 운영 워크플로우
---

# CEA 홈페이지 정기·수시 업데이트 워크플로우 (`/update-site`)

1. **업데이트 대상 확인**:
   - **발간물 추가 요청 시**: `search_web`으로 삼일PwC·삼정KPMG·딜로이트·EY한영·법무법인·임팩트온·유튜브의 최신 ESG(RE100, TCFD, Green Procurement, Real Value, 책임투자, 공시) 자료를 조사해 `src/data/publications.ts` 또는 `src/data/publications-more.ts`에 핵심 요약 3문단과 실무 시사점(Key Takeaways) 3개를 추가합니다.
   - **신규 강의 영상·교안 등록 요청 시**: `src/data/courses.ts` 및 `src/data/lms-seed.ts`에 유튜브 일부공개 URL(`https://www.youtube.com/embed/...`)과 구글 드라이브 교안 링크를 등록합니다.
   - **기업 고객(법인) 추가 요청 시**: `src/data/lms-seed.ts`의 `initialCorps`에 새 기업 코드와 오픈 대상 강의 목록을 등록해 전용 링크(`https://www.cea.co.kr/#apply?corp=기업코드`)를 활성화합니다.

2. **파일 크기(15KB) 및 빌드·감사 검증**:
   - `npm.cmd run build` 실행하여 TypeScript 및 번들 오류 0건 확인
   - `npm.cmd run audit:cto` 실행하여 FAIL 0건 및 전 파일 15KB 이내 확인

3. **GitHub 및 Pages(`www.cea.co.kr`) 동기화**:
   - `git add -A && git commit` 후 `origin/dev`, `origin/main`, 그리고 빌드된 `dist` 폴더(`CNAME` 포함)를 `gh-pages` 브랜치에 푸시하여 실제 웹사이트를 최신 상태로 유지합니다.
