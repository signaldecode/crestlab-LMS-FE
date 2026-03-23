# 구현 계획서 (Implementation Plan)

> 최종 분석일: 2026-03-23
> 전체 구현율: **약 90~95%**

---

## 1. STUB 컨테이너 구현 — 🔴 높은 우선순위

파일은 존재하지만 내부가 주석만 있는 빈 껍데기 상태인 컨테이너 9개.
이 컨테이너들이 구현되지 않으면 해당 페이지가 실질적으로 동작하지 않음.

| 컨테이너 | 역할 | 영향 페이지 | 상태 |
|-----------|------|-------------|------|
| `LoginContainer.tsx` | 로그인 폼/로직 | `/auth/login` | ⬜ 미구현 |
| `SignupContainer.tsx` | 회원가입 폼/로직 | `/auth/signup` | ⬜ 미구현 |
| `CartContainer.tsx` | 장바구니 UI/로직 | `/cart` | ⬜ 미구현 |
| `LearnDashboardContainer.tsx` | 내 강의실 대시보드 | `/learn` | ⬜ 미구현 |
| `CommunityContainer.tsx` | 커뮤니티 메인 | `/community` | ⬜ 미구현 |
| `FeaturedCoursesContainer.tsx` | 추천 강의 섹션 | 홈 등 | ⬜ 미구현 |
| `TestimonialsContainer.tsx` | 수강후기 섹션 | 홈 등 | ⬜ 미구현 |
| `FaqContainer.tsx` | FAQ 섹션 | 홈/강의 상세 등 | ⬜ 미구현 |
| `CourseSort.tsx` | 강의 정렬 UI | `/courses` | ⬜ 미구현 |

---

## 2. 소셜 로그인 완성 — 🔴 높은 우선순위

현재 개발 진행 중. 아래 파일들이 변경/추가 상태:

| 파일 | 상태 |
|------|------|
| `app/api/auth/social/` | 🔨 신규 추가 |
| `lib/oauth.ts` | 🔨 신규 추가 |
| `components/auth/AuthModal.tsx` | 🔨 수정 중 |
| `app/(site)/auth/callback/page.tsx` | 🔨 수정 중 |
| `config/index.ts` | 🔨 OAuth 설정 추가 중 |

**지원 예정 Provider**: Google, Kakao

---

## 3. STUB 페이지 콘텐츠 구현 — 🟡 중간 우선순위

페이지 파일은 존재하지만 렌더링 로직이 없는 빈 페이지 3개.

| 페이지 | 경로 | 상태 |
|--------|------|------|
| `about/page.tsx` | `/about` | ⬜ 빈 섹션 |
| `terms/page.tsx` | `/etc/terms` | ⬜ 빈 섹션 |
| `privacy/page.tsx` | `/etc/privacy` | ⬜ 빈 섹션 |

---

## 4. 누락 컴포넌트 생성 — 🟡 중간 우선순위

CLAUDE.md에 명시되어 있지만 파일이 존재하지 않는 컴포넌트 3개.

| 컴포넌트 | 경로 | 용도 | 상태 |
|----------|------|------|------|
| `PointUse.tsx` | `components/payments/` | 결제 시 포인트 사용 UI | ⬜ 미생성 |
| `NoticeList.tsx` | `components/support/` | 공지사항 목록 | ⬜ 미생성 |
| `FaqList.tsx` | `components/support/` | FAQ 목록 렌더링 | ⬜ 미생성 |

---

## 5. SEO 메타데이터 보강 — 🟡 중간 우선순위

아래 페이지에 `generateMetadata()` 또는 정적 metadata export가 없음.

| 페이지 | 경로 | 상태 |
|--------|------|------|
| 홈 | `/` | ⬜ 루트 레이아웃 기본값에 의존 |
| 강의 목록 | `/courses` | ⬜ metadata 없음 |
| 커뮤니티 메인 | `/community` | ⬜ metadata 없음 |
| 커뮤니티 글 상세 | `/community/[slug]` | ⬜ metadata 없음 |
| 마이페이지 | `/mypage` | ⬜ metadata 없음 |
| 로그인 | `/auth/login` | ⬜ metadata 없음 |
| 회원가입 | `/auth/signup` | ⬜ metadata 없음 |
| 장바구니 | `/cart` | ⬜ metadata 없음 |
| 내 강의실 | `/learn` | ⬜ metadata 없음 |

---

## 6. 미들웨어 인증 가드 활성화 — 🟠 프로덕션 전 필수

`middleware.ts`에 인증 가드 구조가 준비되어 있지만 현재 비활성화(TODO) 상태.

**보호 대상 경로:**
- `/learn` — 수강 영역
- `/account` — 계정 관리
- `/checkout` — 결제
- `/cart` — 장바구니
- `/admin` — 관리자 영역

---

## 7. 선택적/부가 항목 — 🟢 낮은 우선순위

| 항목 | 경로 | 용도 | 상태 |
|------|------|------|------|
| JSON 스키마 검증 | `data/schema/` | data JSON 구조 검증 | ⬜ 미생성 (선택) |
| 개발용 Mock 데이터 | `data/seeds/` | 개발/테스트용 시드 | ⬜ 미생성 (선택) |

---

## 이미 구현 완료된 주요 영역 (참고)

| 영역 | 구현율 | 비고 |
|------|--------|------|
| 앱 라우팅/레이아웃 | ✅ 100% | App Router, Route Group, 에러 바운더리 |
| 강의 목록/상세 | ✅ 100% | SEO + JSON-LD + slug 기반 |
| 베스트/오픈예정/커리큘럼 | ✅ 100% | 데이터 기반 렌더링 |
| 강의 플레이어 (HLS) | ✅ 100% | Vidstack + 세션 발급 + 에러 처리 |
| 마이페이지 (SPA) | ✅ 100% | Zustand 상태 기반 패널 전환 |
| 커뮤니티 컴포넌트 | ✅ 100% | 29개 컴포넌트 전체 구현 |
| 결제 플로우 | ✅ 100% | 토스페이먼츠 + 결과 페이지 |
| API 라우트 | ✅ 100% | 인증/결제/스트리밍/프록시 |
| 디자인 토큰/SCSS | ✅ 100% | 31개 컴포넌트 스타일 |
| Zustand 스토어 | ✅ 100% | 11개 도메인별 스토어 |
| 커스텀 훅 | ✅ 100% | 9개 훅 (스트리밍 세션 포함) |
| 타입 정의 | ✅ 100% | 18.5KB 포괄적 타입 |
| data JSON | ✅ 100% | 8개 JSON 파일 |
| lib 유틸리티 | ✅ 100% | 10개 유틸리티 파일 |
