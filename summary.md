# 프로젝트 인수인계 요약서

## 1. 프로젝트 개요

**프로젝트명:** 강의 플랫폼 프론트엔드 템플릿 (class_project)
**목적:** 고객사별 최소 수정으로 빠르게 커스터마이징 가능한 온라인 강의 플랫폼
**설계 철학:** 구조 = 코드, 내용 = data(JSON), 스타일 = SCSS 토큰으로 완전 분리

---

## 2. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| UI | React + TypeScript | 19.2.3 / 5.9.3 |
| 상태관리 | Zustand | 5.0.11 |
| 스타일 | SASS (토큰 기반 SCSS) | 1.97.3 |
| 영상 업로드 | AWS SDK (S3 Presigned URL) | 2.1693.0 |
| 영상 재생 | HLS (hls.js + Safari native fallback) | 미연동 |
| 백엔드 | Java Spring REST API (별도 서버) | 미연동 |

---

## 3. 핵심 아키텍처

### 컴포넌트 계층 구조
```
Page (app/) → Container (components/containers/) → Domain Component → UI Component
```

- **Page**: 라우팅 엔트리. data 로딩 + SEO 메타 + Container 연결만 담당 (얇게 유지)
- **Container**: 여러 도메인/UI 컴포넌트를 조합하는 섹션 단위 레이어
- **Domain Component**: 특정 도메인 전용 (courses/, community/, mypage/, learn/)
- **UI Component**: 도메인 무관 범용 부품 (Button, Input, Accordion 등)
- **Common/Layout**: 전역 고정 요소 (Header, Footer, Nav, Modal)

### 데이터 흐름
```
mainData.json → lib/data.ts(조회 함수) → Page/Container → 컴포넌트 props
```
- 모든 UI 텍스트, alt, aria-label, SEO 메타는 `data/mainData.json`에서 관리
- 컴포넌트 내부 문자열 하드코딩 금지 (프로젝트 핵심 규칙)

### 라우팅 규칙
- **slug 기반** URL 사용 (ID 기반 금지)
- 예: `/courses/real-estate-intermediate` (O) / `/courses/123` (X)
- SEO 친화적 의미 있는 URL 보장

---

## 4. 폴더 구조 요약

```
├─ app/
│  ├─ (site)/          # 공개 사이트 (헤더/푸터 공유 레이아웃)
│  ├─ (admin)/         # 관리자 영역
│  ├─ api/             # Route Handler (프록시/헬스체크)
│  ├─ layout.tsx       # 루트 레이아웃
│  └─ providers.tsx    # 전역 Provider
├─ components/
│  ├─ common/          # AppHeader, AppFooter, SkipToContent 등
│  ├─ layout/          # GlobalNav, SidebarMenu, Modal
│  ├─ ui/              # Button, Input, Accordion, Tabs 등 (30+)
│  ├─ containers/      # 페이지 섹션 조립 레이어 (15+)
│  ├─ courses/         # 강의 도메인 컴포넌트
│  ├─ community/       # 커뮤니티 도메인 컴포넌트
│  ├─ mypage/          # 마이페이지 도메인 컴포넌트
│  ├─ home/            # 홈 전용 컴포넌트
│  ├─ curriculum/      # 커리큘럼 컴포넌트
│  ├─ auth/            # 인증 UI (AuthModal)
│  └─ admin/           # 관리자 컴포넌트 (영상 업로드)
├─ data/
│  └─ mainData.json    # 마스터 데이터 (1200+ 줄, 강의 20+개 포함)
├─ lib/                # 비즈니스 로직 헬퍼
│  ├─ data.ts          # 데이터 로드/slug 조회
│  ├─ seo.ts           # Metadata + JSON-LD 생성
│  ├─ api.ts           # fetch 래퍼
│  ├─ auth.ts          # 토큰/세션 유틸
│  ├─ payments.ts      # 결제 유틸
│  ├─ player.ts        # 플레이어 유틸
│  └─ upload.ts        # S3 업로드 유틸
├─ stores/             # Zustand 전역 상태 (9개 스토어)
├─ types/index.ts      # 공유 타입 정의
├─ config/index.ts     # 환경 설정 (API base URL 등)
├─ assets/styles/      # 토큰 기반 SCSS 시스템
│  ├─ tokens/          # _colors, _typography, _spacing, _z-index
│  ├─ mixins/          # _breakpoints (반응형)
│  ├─ base/            # reset, 글로벌 타이포
│  ├─ components/      # 컴포넌트별 스타일 (20+)
│  └─ main.scss        # import 엔트리
└─ public/             # 정적 파일 (로고, 배너 이미지)
```

---

## 5. 구현된 페이지 (45+ 페이지)

### 공개 사이트 (`/`)
| 경로 | 설명 | 상태 |
|------|------|------|
| `/` | 홈 (히어로 캐러셀, 카테고리 내비, 추천 섹션) | ✅ |
| `/about` | 소개 | ✅ |
| `/courses` | 강의 목록 (필터/검색/정렬/페이지네이션) | ✅ |
| `/courses/[slug]` | 강의 상세 (SEO, FAQ, JSON-LD) | ✅ |
| `/best` | 베스트 강의 | ✅ |
| `/upcoming` | 오픈 예정 강의 | ✅ |
| `/curriculum` | 커리큘럼/학습 로드맵 | ✅ |
| `/community` | 커뮤니티 메인 (탭/검색/피드) | ✅ |
| `/community/[slug]` | 게시글 상세 | ✅ |
| `/community/new` | 글 작성 | ✅ |
| `/community/[slug]/edit` | 글 수정 | ✅ |
| `/learn` | 내 강의실 (수강 중인 강의/진행률) | ✅ |
| `/learn/[courseSlug]/[lectureId]` | 영상 플레이어 | ✅ (UI만) |
| `/cart` | 장바구니 | ✅ |
| `/checkout` | 결제 (쿠폰/포인트/결제수단) | ✅ |
| `/order/complete` | 결제 완료 | ✅ |
| `/auth/login` | 로그인 | ✅ |
| `/auth/signup` | 회원가입 | ✅ |
| `/auth/callback` | 소셜 로그인 콜백 | ✅ (플레이스홀더) |
| `/support` | 고객센터 (FAQ/공지) | ✅ |
| `/support/tickets` | 1:1 문의 목록 | ✅ |
| `/support/tickets/new` | 문의 작성 | ✅ |
| `/etc/terms` | 이용약관 | ✅ |
| `/etc/privacy` | 개인정보처리방침 | ✅ |

### 마이페이지 (`/mypage`)
| 경로 | 설명 |
|------|------|
| `/mypage` | 내 강의실 |
| `/mypage/[userId]` | 사용자 프로필 |
| `/mypage/orders` | 구매 내역 |
| `/mypage/reviews` | 내 수강평 |
| `/mypage/wishlist` | 위시리스트 |
| `/mypage/profile/edit` | 프로필 수정 |
| `/mypage/certificates` | 수료증 |
| `/mypage/coupons` | 쿠폰 |
| `/mypage/points` | 포인트 |
| `/mypage/giftcards` | 기프트카드 |
| `/mypage/consultations` | 상담 내역 |
| `/mypage/community` | 내 커뮤니티 활동 |

### 관리자 (`/admin`)
| 경로 | 설명 |
|------|------|
| `/admin/courses/[id]` | 강의 편집 (영상 업로드) |

---

## 6. 상태관리 (Zustand Stores)

| 스토어 | 역할 |
|--------|------|
| `useAuthStore` | 로그인 상태, 유저 정보, 토큰 (현재 목데이터) |
| `useCourseStore` | 강의 필터/검색/정렬 상태 |
| `useCartStore` | 장바구니 아이템, 쿠폰 코드, 추가/삭제 |
| `useCommunityStore` | 커뮤니티 게시글, 댓글, 좋아요, 필터 |
| `usePlayerStore` | 영상 플레이어 상태 (현재 시간, 진행률, 북마크) |
| `useWishlistStore` | 위시리스트 강의 관리 |
| `useMyPageStore` | 마이페이지 탭, 프로필 상태 |
| `useCouponStore` | 쿠폰 검증/관리 |
| `useUploadStore` | 영상 업로드 진행률 |

---

## 7. SEO / AEO / A11y 구현 현황

### SEO
- Next.js Metadata API로 동적 메타 생성 (강의 data 기반 title/description/OG)
- JSON-LD 구조화 데이터: `FAQPage`, `Course`, `BreadcrumbList`
- slug 기반 의미 있는 URL 구조
- 시맨틱 HTML (`<main>`, `<header>`, `<footer>`, `<article>`, `<section>`)

### AEO (Answer Engine Optimization)
- 강의 `summary` 필드로 핵심 답변 제공
- FAQ 데이터 구조화 및 Accordion UI로 노출

### A11y (WCAG)
- `SkipToContent` 링크 구현
- 모든 텍스트/alt/aria-label을 mainData.json에서 관리
- Accordion: `aria-expanded`, `aria-controls`, `id` 매칭
- 폼: `<label htmlFor>` + input id 연결
- 키보드 접근성 고려

---

## 8. 스타일 시스템

### SCSS 토큰 체계
```scss
// 컬러 토큰 (_colors.scss)
$color-primary: #2563eb;
$color-secondary: #7c3aed;
$color-text-primary: #111827;
$color-bg-primary: #ffffff;
$color-border: #e5e7eb;
$color-success / $color-error / $color-warning

// 타이포그래피 토큰 (_typography.scss)
// 스페이싱 토큰 (_spacing.scss)
// z-index 토큰 (_z-index.scss)
```

### 스타일 규칙 (엄수)
- inline style 금지
- HEX / px 직접 사용 금지 (토큰 변수만 사용)
- CSS-in-JS 금지
- CSS 클래스명: kebab-case

---

## 9. 개발 진행 상황

### 완료된 부분
- ✅ 전체 프로젝트 구조 및 라우팅 (45+ 페이지)
- ✅ 강의 시스템 (목록, 상세, FAQ, 데이터 기반 렌더링)
- ✅ 커뮤니티 (게시글 CRUD, 댓글, 좋아요, 신고, 공유)
- ✅ 마이페이지 (12개 서브 페이지: 강의실, 주문, 수강평, 위시리스트, 쿠폰 등)
- ✅ 인증 UI (로그인/회원가입 모달 + 페이지)
- ✅ 구매 흐름 UI (장바구니 → 결제 → 완료)
- ✅ 관리자 영상 업로드 UI
- ✅ 데이터 레이어 (mainData.json, 강의 20+개, 목데이터 완비)
- ✅ SEO 인프라 (메타데이터, JSON-LD, slug 라우팅)
- ✅ 토큰 기반 SCSS 디자인 시스템
- ✅ Zustand 스토어 (9개 도메인별 상태관리)
- ✅ UI 컴포넌트 라이브러리 (30+개)

### 백엔드 연동 대기 (프론트 구조는 준비됨)
- 🔶 REST API 연동 (`lib/api.ts` fetch 래퍼 존재, 실제 엔드포인트 미연결)
- 🔶 HLS 영상 플레이어 (VideoPlayerShell UI 존재, hls.js 로직 미구현)
- 🔶 영상 업로드 (S3 Presigned URL 흐름 코드 존재, 백엔드 API 미연결)
- 🔶 결제 처리 (UI 완성, 실제 PG 연동 필요)
- 🔶 실제 인증 (목 토큰 사용 중, OAuth/JWT 미연동)

### 미구현
- ❌ 소셜 로그인 (OAuth 콜백 플레이스홀더만 존재)
- ❌ 실시간 검색 (클라이언트 필터링만, 서버 검색 미구현)
- ❌ 이메일 알림
- ❌ 분석/트래킹
- ❌ 반응형 모바일 최적화 (일부 breakpoint mixin 존재)

---

## 10. 백엔드 API 계약 (Spring REST 기준)

### 설정
```typescript
// config/index.ts
apiBase: process.env.NEXT_PUBLIC_API_BASE || '/api'
```

### 예정 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/courses` | 강의 목록 (필터/정렬/페이지네이션) |
| GET | `/api/courses/{slug}` | 강의 상세 |
| GET | `/api/me/courses` | 내 수강 목록 |
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/me/orders` | 주문 내역 |
| POST | `/api/streaming/session` | 스트리밍 세션 발급 |
| POST | `/api/upload/presigned` | S3 업로드 URL 발급 |
| POST | `/api/upload/confirm` | 업로드 완료 확인 |

---

## 11. 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev        # http://localhost:3000

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트
npm run lint
```

### 환경변수 (.env.local 생성 필요)
```bash
NEXT_PUBLIC_API_BASE=https://api.example.com   # 백엔드 API URL
NEXT_PUBLIC_SITE_NAME=강의 플랫폼               # 사이트명
```

---

## 12. 고객사 커스터마이징 가이드

최소 수정으로 다른 사이트로 변환 가능:

| 수정 대상 | 파일 | 변경 내용 |
|-----------|------|-----------|
| 콘텐츠/문구 | `data/mainData.json` | 사이트명, 강의 데이터, SEO, FAQ, UI 텍스트 |
| 브랜드 컬러 | `assets/styles/tokens/_colors.scss` | primary/secondary 컬러 변경 |
| 타이포그래피 | `assets/styles/tokens/_typography.scss` | 폰트 패밀리/사이즈 |
| API 연결 | `config/index.ts` + `.env.local` | 백엔드 URL |
| 로고/이미지 | `public/`, `assets/images/` | 로고, 배너, 썸네일 교체 |

> 컴포넌트/페이지 구조 변경은 최후의 수단

---

## 13. 주의사항 및 규칙

### 절대 금지
- inline style 사용
- HEX / px 직접 사용 (토큰만 사용)
- 컴포넌트 내 UI 텍스트/alt/aria 하드코딩
- CSS-in-JS 사용
- 불필요한 `any` 타입
- HLS URL을 data/localStorage에 저장
- 프론트에서 스트리밍 서명/토큰 생성

### 개발 순서 (항상)
```
레이아웃 → 페이지 → 컨테이너 → 블록/요소 → UI → 데이터 → SEO/AEO/GEO/A11y
```

### 답변 출력 형식 (기능 개발 시)
1. 요구 요약
2. 구조 설계 트리
3. 생성/수정 파일 목록
4. 코드
5. 연결되는 data 구조
6. SEO/AEO/GEO & A11y 준수 설명
7. 커스터마이징 가이드
8. (스트리밍 포함 시) 권한/세션 흐름 설명

---

## 14. 다음 단계 (우선순위 순)

1. **백엔드 API 연동** — `lib/api.ts`의 fetch 래퍼에 실제 엔드포인트 연결
2. **인증 시스템 구현** — 목 토큰 → 실제 JWT/OAuth 연동
3. **HLS 영상 플레이어 완성** — hls.js 초기화 + presigned URL 세션 흐름
4. **결제 PG 연동** — 결제 승인/웹훅 처리
5. **반응형 모바일 최적화** — breakpoint 기반 레이아웃 조정
6. **소셜 로그인** — OAuth 콜백 구현
7. **배포** — Vercel 또는 자체 서버 배포 설정
