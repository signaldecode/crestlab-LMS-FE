# CLAUDE.md

## 개발 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npx tsc --noEmit # 타입 체크 (빌드 없이)
```

---

## 핵심 아키텍처

- **Next.js App Router** + React 19 + TypeScript (strict mode)
- **상태관리**: Zustand — `stores/` 디렉토리에 도메인별 스토어 분리
- **스타일**: SCSS + Design Token System
- **라우팅**: slug 기반 (`/courses/[slug]`), id 기반 라우팅 사용 금지
- **Path alias**: `@/*` → 프로젝트 루트

### 데이터 흐름
`data/*.json` → `data/index.ts` (통합 로더) → `lib/data.ts` (조회 함수) → 컴포넌트

### 디자인 시스템
피그마 디자인 스펙은 `docs/figma-main-page-spec.md`에 정리되어 있다. 디자인 작업 시 참고한다.

---

## 데이터 분리 원칙 (절대)

모든 UI 텍스트는 `data/*.json`에서 관리한다. **하드코딩 절대 금지.**
- 페이지 타이틀 / 메타 설명 / OG 태그
- 이미지 alt, 버튼 label, aria-label
- 섹션 제목 / 설명 / FAQ
- 강의 요약, 커리큘럼, 난이도, 기간 등

---

## 네이밍 규칙

**컴포넌트 파일명** (PascalCase):
- 큰 섹션: `SomethingContainer.tsx`
- 레이아웃: `SomethingLayout.tsx`
- 래퍼: `SomethingWrap.tsx`

**CSS 클래스** (kebab-case, BEM 스타일):
- ul: `-list`, li: `-item`
- 스타일 용도 id 사용 금지 (form label용 id/htmlFor는 허용)

---

## 스타일 / 토큰 규칙 (절대 준수)

- inline style 금지
- HEX / px 직접 사용 금지 — 항상 토큰 사용
- 컴포넌트 파일 내 스타일 선언 금지 (CSS-in-JS 금지)
- 토큰 파일: `assets/styles/tokens/` (`_colors.scss`, `_typography.scss`, `_spacing.scss`, `_z-index.scss`)

**주요 토큰 값:**
- 콘텐츠 max-width: `$container-max-width` (90rem / 1440px)
- letter-spacing 기본값: `$letter-spacing-normal` (-0.025em, 피그마 -2.5%)
- 섹션 라벨 폰트: `$font-family-accent` (Roboto)
- 본문 폰트: `$font-family-base` (Pretendard)

---

## SEO / A11y 규칙

- 시맨틱 태그: `<main>`, `<section>`, `<article>`, `<nav>` 등
- 페이지당 H1 1개, 이후 H2 → H3 계층
- alt, aria-label은 반드시 data에서 가져오기
- 키보드 접근성: 인터랙션 요소는 `<button>`, `<a>`, `<input>` 사용
- Metadata API로 메타 태그 생성, JSON-LD 구조화 데이터 지원

---

## Video Streaming (HLS)

- HLS 기반 재생 (`hls.js` + Safari native fallback)
- 권한 제어: 백엔드 발급 프리사인드 URL 또는 서명 쿠키 사용
- 프론트에서 서명/토큰 생성 로직 구현 금지
- HLS URL을 data/localStorage에 저장 금지 (메모리만 사용)
- 스트리밍 세션: `POST /api/streaming/session` → `manifestUrl` + `expiresAt` + `type`

---

## Backend API 계약

- 강의 목록: `GET /api/courses?category&level&sort&page&pageSize&query`
- 강의 상세: `GET /api/courses/{slug}`
- 프론트/백엔드 모두 slug 기준 조회
- 접근성 텍스트(alt/aria)는 data에서 관리 (백엔드 의존 금지)
- 필요 시 Next Route Handler(`/app/api/...`)로 프록시

---

## 커스터마이징 원칙

고객사 변경 시 아래만 수정:
1. `data/*.json` — 문구/구성/SEO 데이터
2. `assets/styles/tokens/` — 브랜드 컬러/타이포/스페이싱
3. `config/index.ts` — API base URL 등

컴포넌트/페이지 구조 변경은 **최후의 수단**.

---

## 금지 사항

- inline style / HEX / px 직접 사용
- UI 텍스트/alt/aria 하드코딩
- 불필요한 `any` 타입
- 스트리밍 서명/토큰을 프론트에서 생성
- HLS URL을 data에 저장
