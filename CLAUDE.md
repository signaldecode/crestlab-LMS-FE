# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
npx tsc --noEmit # TypeScript 타입 체크 (빌드 없이)
```

## 핵심 아키텍처 요약

- **Next.js 16 App Router** + React 19 + TypeScript 5.9 (strict mode)
- **상태관리**: Zustand — stores/ 디렉토리에 도메인별 스토어 분리
- **스타일**: SCSS + Design Token System — inline style/HEX/px 직접 사용 금지
- **데이터 분리 원칙**: UI 텍스트/alt/aria/SEO 메타 등 모든 문구는 `data/*.json`에서 관리, 하드코딩 절대 금지
- **라우팅**: slug 기반 (`/courses/[slug]`), id 기반 라우팅 사용하지 않음
- **환경설정**: `config/index.ts`에서 통합 관리 (apiBase, backendBase, siteName, isProd)
- **Path alias**: `@/*` → 프로젝트 루트

### 데이터 흐름
`data/*.json` → `data/index.ts` (통합 로더) → `lib/data.ts` (조회 함수) → 컴포넌트

### 마이페이지 SPA 구조
마이페이지(`/mypage`)는 라우트 기반이 아닌 **클라이언트 상태 기반 SPA 방식**으로 동작한다.
- `useMyPageStore`의 `activeSection` 상태로 모든 콘텐츠 패널을 전환
- 토글 스위치(강의실 ↔ 프로필)와 서브 콘텐츠 모두 동일한 CSS 트랜지션 적용
- `/mypage/[userId]`만 별도 라우트로 유지 (타 유저 공개 프로필)

---

# 상세 가이드 (Next.js + React + TypeScript · Lecture Platform Template)

## 핵심 목표 (절대 우선순위)

1️⃣ **구조가 튼튼하고 재사용 가능한 템플릿 유지**
2️⃣ **고객사 맞춤 커스터마이징을 “최소 수정”으로 빠르게 수행**
3️⃣ **구조 = 코드, 내용 = data, 스타일 = scss + token** 으로 분리
4️⃣ **간결한 TypeScript 코드로 웹 최적화** (불필요한 추상화/과설계 금지)
5️⃣ **SEO / AEO / GEO에 유리한 구조를 기본 내장**
6️⃣ **웹 접근성(WCAG, A11y)을 기본적으로 준수**
7️⃣ **커스터마이징은 `data + 스타일 토큰 + 필요 시 API 연동부`만 수정**

---

## 개발 사고 순서 (항상 이 순서로 설계/출력)

레이아웃 → 페이지 → 컨테이너 → 블록/요소 → UI → 데이터 → SEO/AEO/GEO/A11y

---

## 기술 스택

- **Next.js (App Router)**
- **React + TSX**
- **TypeScript**
- **State: Zustand (기본)**
- **SCSS + Design Token System**
- **Streaming: HLS (m3u8)**
- **Player: hls.js (MSE 기반) + native HLS (Safari fallback)**
- Backend: **Java (Spring 등, REST `/api/...`)**
- SEO/AEO: **Next Metadata API + JSON-LD 구조화 데이터**

---

## 강의 플랫폼 URL 식별자 규칙 (slug) — 필수

### slug 정의
- slug는 URL에 들어가는 “사람이 읽기 좋은 식별자”다.
- 강의 상세 페이지는 `/courses/[slug]` 구조를 사용한다.
- 코드에서 id 기반 라우팅(`/courses/123`)을 기본으로 사용하지 않는다.

### slug 사용 이유 (템플릿 철학과 연결)
- SEO/AEO에 유리한 의미 있는 URL을 보장한다.
- 고객사 커스터마이징 시 URL 구조가 안정적으로 유지된다.
- 강의 데이터 매핑을 data 중심으로 관리할 수 있다.

### data 필드 규칙
- 각 강의 엔티티는 반드시 `slug`를 포함한다.
- 예: `data.courses[].slug`
- `slug`는 중복되면 안 된다(유일).

### slug 포맷 규칙 (권장)
- 소문자 영문/숫자/하이픈만 허용: `react-masterclass`, `js-basic-101`
- 공백은 하이픈으로 치환, 특수문자 제거
- 중복 시 짧은 접미사 추가: `react-masterclass-2` 또는 `react-masterclass-beginner`

### 라우팅/렌더링 규칙
- `app/(site)/courses/[slug]/page.tsx`에서 `params.slug`로 강의 데이터를 찾는다.
- 강의 데이터는 `data/coursesData.json`에서 로드한다(`data/index.ts` 통해 접근).
- 강의 제목/요약/썸네일 alt/CTA ariaLabel/FAQ 등은 전부 data에서 가져온다.

### SEO/JSON-LD 규칙
- `/courses/[slug]`는 강의 data 기반으로 metadata(title/description/og)를 생성한다.
- FAQ가 있으면 data 기반으로 `FAQPage` JSON-LD를 주입한다.
- breadcrumb는 `BreadcrumbList` JSON-LD로 구성 가능하게 한다.

---

## 폴더 구조 (강의 플랫폼 템플릿)

자동 생성 / 수정 금지:
- `.next/`
- `node_modules/`

권장 구조:
project
├─ app
│  ├─ layout.tsx                     # 루트 레이아웃
│  ├─ providers.tsx                  # 전역 Provider(Zustand/Theme/Toasts)
│  │
│  ├─ (site)                         # 공개 사이트 Route Group (헤더/푸터 공통)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                    # 홈(랜딩)
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  │
│  │  ├─ courses
│  │  │  ├─ page.tsx                 # 강의 목록(검색/필터/정렬)
│  │  │  └─ [slug]
│  │  │     └─ page.tsx              # 강의 상세(SEO 핵심, 커리큘럼/후기/Q&A)
│  │  │
│  │  ├─ best
│  │  │  └─ page.tsx                 # 베스트 강의(인기/추천 강의 모아보기)
│  │  │
│  │  ├─ upcoming
│  │  │  └─ page.tsx                 # 오픈 예정 강의(사전 알림/티저)
│  │  │
│  │  ├─ curriculum
│  │  │  └─ page.tsx                 # 커리큘럼 로드맵(학습 경로 안내)
│  │  │
│  │  ├─ community
│  │  │  ├─ page.tsx                 # 커뮤니티 메인(탭/검색)
│  │  │  ├─ new
│  │  │  │  └─ page.tsx              # 글 작성
│  │  │  └─ [slug]
│  │  │     ├─ page.tsx              # 글 상세
│  │  │     └─ edit
│  │  │        └─ page.tsx           # 글 수정
│  │  │
│  │  ├─ cart
│  │  │  └─ page.tsx                 # 장바구니
│  │  ├─ checkout
│  │  │  └─ page.tsx                 # 결제(쿠폰/포인트/결제수단)
│  │  ├─ order
│  │  │  └─ complete
│  │  │     └─ page.tsx              # 결제 완료
│  │  │
│  │  ├─ learn
│  │  │  ├─ page.tsx                 # 내 강의실(구매 강의/진행률/이어보기)
│  │  │  └─ [courseSlug]
│  │  │     └─ [lectureId]
│  │  │        ├─ layout.tsx         # 플레이어 전용 레이아웃
│  │  │        ├─ page.tsx           # ⭐ 강의 플레이어(이어보기/자막/노트/북마크)
│  │  │        ├─ loading.tsx        # 플레이어 로딩 UI
│  │  │        ├─ error.tsx          # 플레이어 에러 바운더리
│  │  │        └─ not-found.tsx      # 강의 없음 UI
│  │  │
│  │  ├─ mypage                      # ⭐ 마이페이지(학습 관리 허브)
│  │  │  ├─ page.tsx                 # 마이페이지 메인(내 강의실/대시보드)
│  │  │  ├─ [userId]
│  │  │  │  └─ page.tsx              # 공개 프로필(다른 유저 프로필 조회)
│  │  │  ├─ profile
│  │  │  │  └─ edit
│  │  │  │     └─ page.tsx           # 프로필 수정
│  │  │  ├─ orders
│  │  │  │  └─ page.tsx              # 주문 내역
│  │  │  ├─ wishlist
│  │  │  │  └─ page.tsx              # 위시리스트(찜한 강의)
│  │  │  ├─ reviews
│  │  │  │  └─ page.tsx              # 내 수강평
│  │  │  ├─ coupons
│  │  │  │  └─ page.tsx              # 쿠폰함
│  │  │  ├─ points
│  │  │  │  └─ page.tsx              # 포인트 내역
│  │  │  ├─ giftcards
│  │  │  │  └─ page.tsx              # 상품권/기프트카드
│  │  │  ├─ certificates
│  │  │  │  └─ page.tsx              # 수료증
│  │  │  └─ consultations
│  │  │     └─ page.tsx              # 상담 내역
│  │  │
│  │  ├─ account
│  │  │  ├─ page.tsx                 # 계정 메인(프로필/설정)
│  │  │  ├─ orders
│  │  │  │  └─ page.tsx              # 주문 내역
│  │  │  └─ community
│  │  │     └─ page.tsx              # 내 커뮤니티 활동
│  │  │
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ page.tsx              # 로그인
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx              # 회원가입
│  │  │  └─ callback
│  │  │     └─ page.tsx              # (선택) 소셜 로그인 콜백
│  │  │
│  │  ├─ support
│  │  │  ├─ page.tsx                 # 고객센터(FAQ/공지)
│  │  │  └─ tickets
│  │  │     ├─ page.tsx              # 1:1 문의 목록
│  │  │     └─ new
│  │  │        └─ page.tsx           # 1:1 문의 작성
│  │  │
│  │  └─ etc
│  │     ├─ terms
│  │     │  └─ page.tsx
│  │     └─ privacy
│  │        └─ page.tsx
│  │
│  ├─ (admin)                        # 관리자 Route Group (운영)
│  │  ├─ layout.tsx
│  │  └─ admin
│  │     └─ courses
│  │        └─ [id]
│  │           └─ page.tsx           # 강의 편집(커리큘럼/영상 업로드/자료)
│  │
│  └─ api                            # Next Route Handler
│     ├─ route.ts                    # 헬스체크(루트)
│     ├─ proxy
│     │  └─ [...path]
│     │     └─ route.ts              # 백엔드 프록시
│     ├─ auth
│     │  ├─ login
│     │  │  └─ route.ts
│     │  ├─ logout
│     │  │  └─ route.ts              # 로그아웃(쿠키 삭제)
│     │  └─ refresh
│     │     └─ route.ts
│     └─ streaming
│        └─ session
│           └─ route.ts              # 스트리밍 세션 발급
│
├─ components
│  ├─ common
│  │  ├─ AppHeader.tsx
│  │  ├─ AppFooter.tsx
│  │  ├─ AppLogo.tsx
│  │  ├─ AuthTrigger.tsx             # 로그인/회원가입 트리거 버튼
│  │  ├─ TopBanner.tsx               # 상단 프로모션/공지 배너
│  │  └─ SkipToContent.tsx
│  │
│  ├─ layout
│  │  ├─ GlobalNav.tsx
│  │  ├─ SubNav.tsx                  # 서브 네비게이션(2차 메뉴)
│  │  ├─ TopBarNav.tsx               # 상단바 네비게이션(유틸리티 링크)
│  │  ├─ CategoryMegaMenu.tsx        # 카테고리 메가 메뉴(드롭다운)
│  │  ├─ CategoryMenuTrigger.tsx     # 메가 메뉴 트리거 버튼
│  │  ├─ SidebarMenu.tsx
│  │  └─ Modal.tsx
│  │
│  ├─ ui
│  │  ├─ Button.tsx
│  │  ├─ IconButton.tsx              # 아이콘 전용 버튼
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ SectionTitle.tsx
│  │  ├─ Accordion.tsx
│  │  ├─ Tabs.tsx
│  │  ├─ Pagination.tsx
│  │  ├─ Toast.tsx
│  │  ├─ Tooltip.tsx                 # 툴팁
│  │  ├─ Badge.tsx                   # 배지/라벨
│  │  ├─ Breadcrumb.tsx              # 브레드크럼 네비
│  │  ├─ Skeleton.tsx                # 스켈레톤 로딩 UI
│  │  ├─ EmptyState.tsx
│  │  ├─ LoadingSpinner.tsx
│  │  ├─ ProfileImage.tsx
│  │  ├─ VideoPlayerShell.tsx        # (중요) 플레이어 UI 컨테이너
│  │  ├─ VideoControls.tsx           # 플레이어 컨트롤 바(재생/볼륨/배속)
│  │  ├─ LectureSidebar.tsx          # 강의 목록 사이드바(플레이어 내)
│  │  └─ LectureNavFooter.tsx        # 이전/다음 강의 네비게이션
│  │
│  ├─ containers
│  │  ├─ HomeHeroContainer.tsx
│  │  ├─ FeaturedCoursesContainer.tsx
│  │  ├─ BestCoursesContainer.tsx    # 베스트 강의 섹션
│  │  ├─ UpcomingCoursesContainer.tsx # 오픈 예정 강의 섹션
│  │  ├─ CourseGridContainer.tsx
│  │  ├─ CourseDetailContainer.tsx
│  │  ├─ TestimonialsContainer.tsx
│  │  ├─ FaqContainer.tsx
│  │  ├─ CommunityContainer.tsx
│  │  ├─ CartContainer.tsx
│  │  ├─ CheckoutContainer.tsx
│  │  ├─ OrderCompleteContainer.tsx  # 결제 완료
│  │  ├─ LearnDashboardContainer.tsx
│  │  ├─ LecturePlayerContainer.tsx
│  │  ├─ LoginContainer.tsx          # 로그인 컨테이너
│  │  ├─ SignupContainer.tsx         # 회원가입 컨테이너
│  │  ├─ SupportContainer.tsx        # 고객센터 컨테이너
│  │  └─ TicketContainer.tsx         # 1:1 문의 컨테이너
│  │
│  ├─ courses                        # ⭐ 강의 도메인 컴포넌트
│  │  ├─ CourseCard.tsx
│  │  ├─ CourseBanner.tsx            # 강의 배너(상세 페이지 상단)
│  │  ├─ CourseDetailContent.tsx     # 강의 상세 본문 영역
│  │  ├─ CourseDetailSidebar.tsx     # 강의 상세 사이드바(구매/정보)
│  │  ├─ CourseSidebar.tsx           # 강의 목록 사이드바(필터)
│  │  ├─ CourseSort.tsx
│  │  ├─ BestCourseCard.tsx          # 베스트 강의 카드
│  │  ├─ BestCourseCardSkeleton.tsx  # 베스트 카드 스켈레톤
│  │  ├─ BestChipFilter.tsx          # 베스트 칩 필터(카테고리)
│  │  ├─ UpcomingCourseCard.tsx      # 오픈 예정 카드
│  │  └─ UpcomingCourseCardSkeleton.tsx
│  │
│  ├─ curriculum                     # ⭐ 커리큘럼/로드맵 도메인
│  │  ├─ CurriculumHero.tsx          # 커리큘럼 히어로 섹션
│  │  ├─ CurriculumRoadmap.tsx       # 학습 로드맵 시각화
│  │  ├─ CurriculumStep.tsx          # 로드맵 단계 아이템
│  │  └─ CurriculumFooter.tsx        # 커리큘럼 하단 CTA
│  │
│  ├─ home                           # ⭐ 홈 페이지 전용 컴포넌트
│  │  ├─ HomeCategoryNav.tsx         # 홈 카테고리 네비게이션
│  │  └─ HomeCourseSection.tsx       # 홈 강의 섹션(카테고리별 강의 목록)
│  │
│  ├─ mypage                         # ⭐ 마이페이지 도메인 컴포넌트
│  │  ├─ MyPageShell.tsx             # 마이페이지 공통 레이아웃 쉘
│  │  ├─ MyPageSidebar.tsx           # 마이페이지 사이드바 네비게이션
│  │  ├─ MyClassroomContent.tsx      # 내 강의실 콘텐츠
│  │  ├─ MyProfileContent.tsx        # 내 프로필 콘텐츠
│  │  ├─ ProfileEditContent.tsx      # 프로필 수정 폼
│  │  ├─ ProfileIntroTab.tsx         # 공개 프로필 소개 탭
│  │  ├─ ProfileFollowTab.tsx        # 공개 프로필 팔로우 탭
│  │  ├─ OrderContent.tsx            # 주문 내역 콘텐츠
│  │  ├─ WishlistContent.tsx         # 위시리스트 콘텐츠
│  │  ├─ ReviewContent.tsx           # 수강평 콘텐츠
│  │  ├─ CouponContent.tsx           # 쿠폰함 콘텐츠
│  │  ├─ PointContent.tsx            # 포인트 콘텐츠
│  │  ├─ GiftcardContent.tsx         # 상품권 콘텐츠
│  │  ├─ CertificateContent.tsx      # 수료증 콘텐츠
│  │  └─ ConsultationContent.tsx     # 상담 내역 콘텐츠
│  │
│  ├─ community
│  │  ├─ CommunityPageShell.tsx
│  │  ├─ CommunityHeader.tsx
│  │  ├─ CommunityTabs.tsx
│  │  ├─ CommunitySearchBar.tsx      # 커뮤니티 검색바
│  │  ├─ CommunitySidebar.tsx        # 커뮤니티 사이드바
│  │  ├─ CommunityAside.tsx          # 커뮤니티 보조 영역
│  │  ├─ CommunityFeed.tsx           # 피드 목록
│  │  ├─ MyFeedContent.tsx           # 내 피드 콘텐츠
│  │  ├─ MyPostsButton.tsx           # 내 글 보기 버튼
│  │  ├─ CategorySelect.tsx          # 카테고리 선택
│  │  ├─ TagChips.tsx                # 태그 칩 목록
│  │  ├─ PostList.tsx
│  │  ├─ PostCard.tsx
│  │  ├─ PostDetail.tsx
│  │  ├─ PostContent.tsx             # 글 본문 렌더링
│  │  ├─ PostAuthorAside.tsx         # 작성자 정보 영역
│  │  ├─ PostStatsBar.tsx            # 좋아요/댓글/조회수 바
│  │  ├─ PostEditor.tsx
│  │  ├─ PostActionsMenu.tsx
│  │  ├─ CommentList.tsx
│  │  ├─ CommentItem.tsx
│  │  ├─ CommentEditor.tsx
│  │  ├─ LikeButton.tsx
│  │  ├─ ShareButton.tsx
│  │  ├─ CopyLinkButton.tsx          # 링크 복사 버튼
│  │  ├─ ReportButton.tsx
│  │  ├─ ReportModal.tsx             # 신고 모달
│  │  ├─ CommunityProfileModal.tsx
│  │  └─ FollowButton.tsx
│  │
│  ├─ auth                           # 인증 UI
│  │  └─ AuthModal.tsx               # 로그인/회원가입 통합 모달
│  │
│  ├─ admin                          # 관리자 도메인 컴포넌트
│  │  ├─ AdminCourseEditContainer.tsx # 강의 편집 컨테이너
│  │  ├─ VideoUploadInput.tsx        # 영상 업로드 입력
│  │  └─ UploadProgress.tsx          # 업로드 진행률 표시
│  │
│  ├─ payments                       # (선택) 결제 UI
│  │  ├─ CouponSelect.tsx
│  │  ├─ PointUse.tsx
│  │  ├─ PaymentMethodSelect.tsx
│  │  └─ PriceSummary.tsx
│  │
│  └─ support                        # (선택) 고객센터 UI
│     ├─ NoticeList.tsx
│     ├─ FaqList.tsx
│     └─ TicketForm.tsx
│
├─ data
│  ├─ index.ts                       # data 통합 로더(각 JSON import/re-export)
│  ├─ siteData.json                  # 사이트 기본 정보(이름/도메인/SEO 기본값/GEO)
│  ├─ homeData.json                  # 홈 페이지 데이터(히어로/섹션/배너)
│  ├─ coursesData.json               # 강의 엔티티(목록/상세/커리큘럼/FAQ)
│  ├─ communityData.json             # 커뮤니티 데이터(카테고리/태그/게시글)
│  ├─ accountData.json               # 계정/마이페이지 데이터(메뉴/라벨)
│  ├─ pagesData.json                 # 각 페이지별 SEO/메타/섹션 데이터
│  ├─ uiData.json                    # 공통 UI 문구(버튼/라벨/aria/에러 메시지)
│  ├─ schema                         # JSON schema (선택)
│  │  └─ mainData.schema.json
│  └─ seeds                          # (선택) 개발용 mock/seed
│     ├─ courses.mock.json
│     └─ community.mock.json
│
├─ hooks                             # ⭐ 커스텀 훅 모음
│  ├─ index.ts                       # 훅 re-export
│  ├─ useAuth.ts                     # 인증 상태/로그인/로그아웃
│  ├─ useCart.ts                     # 장바구니 조작
│  ├─ useCourses.ts                  # 강의 목록/필터/검색
│  ├─ useCommunity.ts                # 커뮤니티 데이터/액션
│  ├─ usePlayer.ts                   # 플레이어 제어/진행률
│  ├─ useTheme.ts                    # 테마 전환(다크/라이트)
│  └─ useUpload.ts                   # 파일 업로드 처리
│
├─ types                             # ⭐ 공통 TypeScript 타입 정의
│  └─ index.ts                       # 엔티티/API 응답/공통 타입
│
├─ assets
│  ├─ images
│  │  ├─ logo
│  │  ├─ banners
│  │  ├─ courses
│  │  └─ community
│  └─ styles
│     ├─ tokens
│     │  ├─ _colors.scss
│     │  ├─ _typography.scss
│     │  ├─ _spacing.scss
│     │  └─ _z-index.scss
│     ├─ base
│     │  ├─ _reset.scss
│     │  └─ _typography.scss
│     ├─ mixins
│     │  └─ _breakpoints.scss
│     ├─ components
│     │  ├─ _accordion.scss
│     │  ├─ _admin-layout.scss
│     │  ├─ _app-footer.scss
│     │  ├─ _app-header.scss
│     │  ├─ _best-page.scss
│     │  ├─ _checkout-page.scss
│     │  ├─ _community-page.scss
│     │  ├─ _course-detail.scss
│     │  ├─ _courses-page.scss
│     │  ├─ _curriculum-page.scss
│     │  ├─ _global-nav.scss
│     │  ├─ _home-page.scss
│     │  ├─ _lecture-player.scss
│     │  ├─ _modal.scss
│     │  ├─ _mypage.scss
│     │  ├─ _skip-to-content.scss
│     │  ├─ _top-banner.scss
│     │  ├─ _upcoming-page.scss
│     │  ├─ _upload-progress.scss
│     │  └─ _video-upload.scss
│     ├─ themes
│     │  ├─ _default.scss
│     │  └─ _dark.scss
│     └─ main.scss
│
├─ lib
│  ├─ data.ts                        # data 로드/조회(findBySlug 등)
│  ├─ seo.ts                         # Metadata + JSON-LD 생성기
│  ├─ api.ts                         # fetch 래퍼/에러 처리
│  ├─ auth.ts                        # 토큰/세션 유틸
│  ├─ cookies.ts                     # 쿠키 조작 유틸(서버/클라이언트)
│  ├─ payments.ts                    # 결제 유틸(금액계산/쿠폰검증)
│  ├─ player.ts                      # 플레이어 유틸(진행률/이어보기 저장 등)
│  └─ upload.ts                      # 파일 업로드 유틸(청크/프로그레스)
│
├─ stores
│  ├─ useAuthStore.ts
│  ├─ useCourseStore.ts
│  ├─ useCommunityStore.ts
│  ├─ useCartStore.ts
│  ├─ usePlayerStore.ts
│  ├─ useMyPageStore.ts              # 마이페이지 상태
│  ├─ useWishlistStore.ts            # 위시리스트 상태
│  ├─ useCouponStore.ts              # 쿠폰 상태
│  └─ useUploadStore.ts              # 업로드 상태(진행률/큐)
│
├─ config
│  └─ index.ts                       # 환경변수/사이트 설정 통합 로더
│
├─ public
│  ├─ favicon.ico
│  ├─ robots.txt
│  ├─ sitemap.xml
│  ├─ images                         # 정적 서빙 이미지
│  │  └─ banners
│  └─ og                             # OG 이미지
│
├─ middleware.ts                     # ⭐ Next.js 미들웨어(인증/리다이렉트/쿠키)
│
└─ next.config.ts


--
## 폴더 역할 설명

- `app/`
  - **라우팅 엔트리(Next.js App Router)**. URL 구조를 정의하고, 페이지에서 data 로딩/SEO 메타 생성/컨테이너 연결만 담당한다(페이지는 얇게).

- `app/(site)/`
  - **공개 사이트 영역 Route Group**. URL에는 노출되지 않지만, 홈/강의/커뮤니티/약관 등 “헤더/푸터가 있는” 페이지들을 같은 레이아웃으로 묶는다.

- `app/(site)/layout.tsx`
  - (site) 하위 페이지에 공통 적용되는 **전역 레이아웃**(AppHeader/AppFooter/SkipToContent 포함).

- `app/api/`
  - **Route Handler**(선택). 백엔드 `/api/...` 프록시, 헬퍼 API, 토큰/쿠키 정책 안정화 등에 사용한다.

- `app/providers.tsx`
  - **전역 Provider**(선택). Zustand hydration, 테마, 전역 이벤트/토스트 등의 Provider를 묶는다.

- `app/(site)/best/`
  - 베스트/인기 강의 페이지. 추천·인기순 강의를 카테고리 칩 필터로 모아보는 큐레이션 페이지다.

- `app/(site)/upcoming/`
  - 오픈 예정 강의 페이지. 곧 출시될 강의를 미리 소개하고 사전 알림 등록을 유도한다.

- `app/(site)/curriculum/`
  - 커리큘럼/학습 로드맵 페이지. 단계별 학습 경로를 시각적으로 안내한다.

- `app/(site)/learn/`
  - 수강 영역(내 강의실/플레이어). 구매한 강의를 시청하고, 진행률/이어보기/노트/북마크/자막 등 학습 UX가 집중되는 구간이다.
  - `[courseSlug]/[lectureId]/`에는 전용 layout/loading/error/not-found boundary가 포함되어 플레이어 UX를 안정적으로 처리한다.

- `app/(site)/mypage/`
  - **마이페이지 허브**. 내 강의실, 프로필, 주문 내역, 위시리스트, 수강평, 쿠폰, 포인트, 상품권, 수료증, 상담 등 학습자 관리 기능을 모두 포함한다.
  - `[userId]/`는 다른 유저의 공개 프로필 조회 페이지다.

- `app/(site)/cart/`, `app/(site)/checkout/`, `app/(site)/order/complete/`
  - 구매 플로우. 장바구니→결제→완료 화면으로 이어지는 결제 경험을 구성한다(쿠폰/포인트/결제수단 포함).

- `app/(site)/auth/`
  - 인증 영역. 로그인/회원가입/소셜 콜백 등 인증 관련 UI를 담당한다.

- `app/(site)/support/`
  - 고객센터 영역. 공지/FAQ/1:1 문의 등 CS 동선을 담당한다.

- `app/(admin)/`
  - 운영자(관리자) 영역 Route Group. 강의 편집/영상 업로드 등 운영 기능을 제공한다. `admin/courses/[id]` 하위에서 강의별 편집 작업을 수행한다.
  
  
---

- `components/`
  - **페이지를 구성하는 재사용 컴포넌트 모음**. 라우트와 분리되어 있으며, 구조(페이지)와 표현(UI)을 조립 가능한 단위로 유지한다.

- `components/common/`
  - 사이트 전역에서 거의 항상 쓰이는 **고정 공통 요소**(Header/Footer/Logo/SkipToContent/TopBanner/AuthTrigger).

- `components/layout/`
  - 레이아웃을 구성하는 조립용 요소들. 헤더 내부 내비(`GlobalNav`), 서브 내비(`SubNav`), 상단바(`TopBarNav`), 카테고리 메가메뉴(`CategoryMegaMenu`/`CategoryMenuTrigger`), 사이드바(`SidebarMenu`), 공용 모달(`Modal`).

- `components/ui/`
  - 도메인 지식이 없는 **순수 범용 UI 부품**(Button/IconButton/Input/Tabs/Accordion/Pagination/Badge/Breadcrumb/Skeleton/Tooltip/VideoControls 등).
  - 텍스트/alt/aria는 props로만 받아 렌더링하고, 하드코딩하지 않는다.
  - `LectureSidebar`/`LectureNavFooter`/`VideoControls`는 플레이어 공용 UI로 ui에 배치한다.

- `components/containers/`
  - **페이지 섹션 단위 조립 레이어**. 여러 UI/도메인 컴포넌트를 묶어 홈/강의/상세/커뮤니티/인증/결제 같은 큰 덩어리를 만든다.
  - `BestCoursesContainer`/`UpcomingCoursesContainer`/`OrderCompleteContainer`/`LoginContainer`/`SignupContainer`/`SupportContainer`/`TicketContainer` 등 페이지별 컨테이너가 포함된다.

- `components/courses/`
  - 강의에서만 쓰이는 도메인 전용 컴포넌트(카드/배너/상세/사이드바/정렬/베스트/오픈예정 등).
  - SEO 핵심 페이지(강의 상세)를 구성하는 블록이므로 ui/common에 섞지 않는다.
  - 베스트(`BestCourseCard`/`BestChipFilter`)/오픈예정(`UpcomingCourseCard`) 관련 컴포넌트 포함.

- `components/curriculum/`
  - **커리큘럼/학습 로드맵 전용 컴포넌트**. 히어로(`CurriculumHero`), 로드맵(`CurriculumRoadmap`), 단계 아이템(`CurriculumStep`), 하단 CTA(`CurriculumFooter`)로 구성한다.

- `components/home/`
  - **홈 페이지 전용 컴포넌트**. 카테고리 네비게이션(`HomeCategoryNav`), 카테고리별 강의 섹션(`HomeCourseSection`) 등 홈에서만 쓰이는 블록을 분리한다.

- `components/mypage/`
  - **마이페이지 전용 컴포넌트**. 마이페이지 쉘(`MyPageShell`), 사이드바(`MyPageSidebar`), 각 서브페이지 콘텐츠(`MyClassroomContent`/`OrderContent`/`WishlistContent`/`CouponContent`/`PointContent`/`CertificateContent`/`ProfileEditContent` 등).
  - `ProfileIntroTab`/`ProfileFollowTab`은 공개 프로필(`[userId]`) 페이지에서 사용한다.

- `components/community/`
  - 커뮤니티에서만 쓰이는 **도메인 전용 컴포넌트**(PostList/PostDetail/Comment/Feed/Search/Tag/Report 등).
  - 규모가 크고 내부 규칙(작성/수정/권한/댓글/신고)이 많으므로 common/ui에 섞지 않고 도메인 폴더로 분리한다.
  - `CommunitySearchBar`/`CommunitySidebar`/`CommunityAside`/`CommunityFeed`/`MyFeedContent`/`TagChips`/`CategorySelect`/`CopyLinkButton`/`ReportModal`/`PostContent`/`PostAuthorAside`/`PostStatsBar` 등이 추가되었다.

- `components/auth/`
  - 인증 UI. `AuthModal.tsx`로 로그인/회원가입을 통합 모달로 처리한다.

- `components/admin/`
  - **관리자 도메인 컴포넌트**. 강의 편집(`AdminCourseEditContainer`), 영상 업로드(`VideoUploadInput`), 업로드 진행률(`UploadProgress`) 등 어드민 전용 UI를 분리한다.

- `components/payments/`
  - 결제 UI 블록(쿠폰/포인트/결제수단/금액 요약 등)을 모아 결제 페이지를 조립한다(선택).

- `components/support/`
  - 공지/FAQ/1:1 문의 폼 등 고객센터 UI를 모아둔다(선택).
  
---

- `data/`
  - **하드코딩 금지 원칙의 중심**. UI 문구/버튼 라벨/alt/aria/SEO/AEO/GEO/FAQ/엔티티(강의·게시글) 데이터를 JSON으로 관리한다.
  - 고객사 커스터마이징은 기본적으로 여기만 바꾸면 되도록 설계한다.
  - **카테고리별 분리 구조**: 기존 `mainData.json` 단일 파일 대신, 도메인별로 분리하여 관리한다.
    - `siteData.json`: 사이트 기본 정보/SEO 기본값/GEO
    - `homeData.json`: 홈 페이지 히어로/섹션/배너 데이터
    - `coursesData.json`: 강의 엔티티(목록/상세/커리큘럼/FAQ)
    - `communityData.json`: 커뮤니티 카테고리/태그/게시글 데이터
    - `accountData.json`: 계정/마이페이지 메뉴/라벨 데이터
    - `pagesData.json`: 각 페이지별 SEO/메타/섹션 데이터
    - `uiData.json`: 공통 UI 문구(버튼/라벨/aria/에러 메시지)
  - `data/index.ts`에서 통합 로드/re-export하여 기존 import 방식을 유지한다.

- `assets/images/`
  - 로고/배너/강의 썸네일/커뮤니티 이미지 등 정적 이미지 리소스.

- `assets/styles/`
  - 스타일 시스템. **토큰 기반 SCSS 구조**로 전역 스타일을 관리한다.
  - `tokens/`: 컬러/타이포/스페이싱/z-index 등 디자인 토큰(값 정의)
  - `base/`: reset, typography base, global element style
  - `mixins/`: mixin/function
  - `components/`: 컴포넌트별 스타일 모듈(예: _accordion.scss)
  - `themes/`: 테마 확장(선택)
  - `main.scss`: import 엔트리(토큰→믹스인→베이스→컴포넌트→테마 순)

---

- `hooks/`
  - **커스텀 훅 모음**. 컴포넌트에서 반복되는 상태 관리/비즈니스 로직을 훅으로 추출한다.
  - `useAuth.ts`: 인증 상태/로그인/로그아웃 로직
  - `useCart.ts`: 장바구니 조작
  - `useCourses.ts`: 강의 목록/필터/검색 로직
  - `useCommunity.ts`: 커뮤니티 데이터/액션
  - `usePlayer.ts`: 플레이어 제어/진행률
  - `useTheme.ts`: 테마 전환(다크/라이트)
  - `useUpload.ts`: 파일 업로드 처리(어드민)
  - `index.ts`: 훅 re-export

- `types/`
  - **공통 TypeScript 타입 정의**. 엔티티(Course/Post/User 등), API 응답, 공통 인터페이스를 `index.ts`에서 관리한다.

- `lib/`
  - **비즈니스 로직/헬퍼 함수 모음**. UI와 분리하여 테스트/재사용이 쉽다.
  - `data.ts`: data 로드/slug 조회(findCourseBySlug 등)
  - `seo.ts`: Metadata API + JSON-LD 생성기
  - `api.ts`: fetch 래퍼/에러 처리/엔드포인트 유틸
  - `auth.ts`: 토큰/세션 처리 유틸
  - `cookies.ts`: 쿠키 조작 유틸(서버/클라이언트 양쪽 지원)
  - `payments.ts`: 금액 계산/쿠폰 검증/결제 흐름 유틸
  - `player.ts`: 진행률/이어보기/학습도구(노트/북마크) 유틸
  - `upload.ts`: 파일 업로드 유틸(청크 업로드/프로그레스)

- `stores/`
  - Zustand 전역 상태. 강의 필터/검색, 커뮤니티 탭/검색, 장바구니, 인증, 플레이어 등.
  - `useMyPageStore.ts`: 마이페이지 상태
  - `useWishlistStore.ts`: 위시리스트 상태
  - `useCouponStore.ts`: 쿠폰 상태
  - `useUploadStore.ts`: 업로드 상태(진행률/큐)

- `config/`
  - 환경별 설정을 `index.ts` 하나로 통합(API baseURL, feature flag, 사이트 설정 등).

- `middleware.ts`
  - **Next.js 미들웨어**. 인증 토큰 검증/리다이렉트, 쿠키 처리, 라우트 보호 등을 Edge에서 처리한다.

- `public/`
  - Next 정적 서빙 경로. favicon, robots.txt, sitemap.xml, 배너 이미지 등. `public/images/banners/`에 배너 이미지를 배치한다.

- `next.config.ts`
  - Next 설정 파일(이미지 도메인 허용, 리다이렉트/리라이트, 빌드 옵션 등).



## Data 설계 원칙 (SEO/AEO/GEO + A11y 포함)

UI 텍스트 / 이미지 경로 / 섹션 정보 / 접근성용 텍스트 / 메타 정보 등은
**절대 페이지/컴포넌트에 하드코딩하지 않는다.**

반드시 `data/` 디렉토리의 JSON 파일(`siteData.json`, `coursesData.json`, `uiData.json` 등)에서 관리한다.

특히 아래는 **반드시 data에서 값 가져오기**:
- 페이지 타이틀 / 메타 설명 / 키워드 / OG 태그 등
- 이미지 alt 텍스트
- 버튼 / 링크 label, aria-label
- 섹션 제목 / 설명
- FAQ / Q&A 데이터
- 지역/주소/좌표/영업시간 등 GEO 관련 정보
- 강의 요약(AEO용 한 문장), 커리큘럼, 대상, 난이도, 기간 등

추가 원칙:
- `seo`(title/description/og)도 **가능하면 data에 둔다.**
- `seo`가 없으면, 최소한 `title/summary/thumbnail`로 **자동 생성**하되,
  컴포넌트 내부에서 임의 문구(CTA/aria/alt 포함)를 생성하지 않는다.

필드 네이밍 예:
- `name`, `title`, `label`, `description`, `summary`
- `alt`, `ariaLabel`, `ariaDescription`
- `slug`, `category`, `level`, `duration`, `price`
- `country`, `city`, `latitude`, `longitude`, `address`, `postalCode`, `businessHours`

---

## 네이밍 규칙

컴포넌트 파일명 (PascalCase):
- 레이아웃: `SomethingLayout.tsx`
- 큰 섹션/블록: `SomethingContainer.tsx`
- 소규모 래퍼: `SomethingWrap.tsx`
- 범용 박스: `SomethingBox.tsx`

리스트:
- ul → `XxxList`
- li → `XxxListItem`

CSS 클래스:
- kebab-case
- ul 관련: `-list` (예: `card-list`)
- li 관련: `-item` (예: `card-list-item`)
- 스타일 용도의 id 사용 금지 (form label용 id/for는 허용)

---

## 스타일 / 토큰 규칙 (절대 준수)

- inline style 금지
- HEX / px 직접 사용 금지
- 컴포넌트 파일 내 스타일 선언 금지 (CSS-in-JS 금지)
- 항상 토큰 사용 (`_colors.scss`, `_spacing.scss`, `_typography.scss`, `_z-index.scss`)

SCSS import 순서:
1) tokens
2) mixins / functions
3) base
4) components
5) themes

---

## 🔎 SEO / AEO / GEO / A11y 상세 규칙 (필수)

### 1️⃣ SEO

[구조 & 마크업]
- 의미 있는 시맨틱 태그: `<main> <header> <footer> <nav> <section> <article> <aside>`
- Heading 계층: **페이지당 H1 1개**, 이후 H2 → H3
- 제목 텍스트는 data의 `title` 기반

[메타 태그]
- Next App Router 기준으로 **Metadata API 사용**
- 문자열 하드코딩 금지: `data.site` 또는 `data.pages.*`에서 로드
- 강의 상세(`/courses/[slug]`)는 course data로 title/description/OG 구성

[URL & 라우팅]
- 의미 있는 슬러그 `/courses`, `/courses/[slug]`, `/account/orders` 등
- 페이지 내용과 URL 일관성 유지

[구조화 데이터(JSON-LD)]
- FAQ / Course / Organization / LocalBusiness / BreadcrumbList 등
- JSON-LD 텍스트도 data에서 가져온다.

### 2️⃣ AEO (Answer Engine Optimization)
- 주요 섹션 상단에 “한 문장 요약/핵심 답변”을 data의 `summary`/`description`으로 두고 UI에서 눈에 띄게 렌더링한다.
- FAQ는 질문-답변 구조를 data로 관리하고, 페이지에 명확히 노출한다.

### 3️⃣ GEO (Local SEO)
- `data.geo`에 `countryCode, city, address, postalCode, latitude, longitude, phone, businessHours` 정의
- “오시는 길/연락처/운영시간” 섹션은 geo 기반으로 렌더링
- 필요 시 LocalBusiness JSON-LD를 `data.site + data.geo`로 생성

### 4️⃣ A11y (WCAG)

[Alt/Aria data 기반]
- `alt`, `aria-label`, `aria-describedby`, `title`은 **항상 data에서만**
- 컴포넌트 내부에 문자열 직접 쓰지 않는다.

[키보드 접근성]
- 인터랙션 요소는 `<button>`, `<a>`, `<input>` 사용
- Enter/Space 조작 가능해야 함
- Tab 순서가 논리적인 DOM 순서를 따른다.

[폼 레이블링]
- `<label htmlFor="id">` + `<input id="id">`
- 에러/힌트는 `aria-describedby` 연결 가능하도록 id를 data로 관리 가능

[FAQ Accordion]
- `aria-expanded`, `aria-controls`, `id` 매칭 필수
- 키보드 토글 지원 필수

---

## Video Streaming (HLS + 권한 제어) — 필수

### 스트리밍 파트 핵심 목표 (우선순위)
1) **HLS(적응형 스트리밍) 기반 재생**을 기본으로 한다.
2) 권한 제어는 **프리사인드 URL(서명 URL)** 또는 **서명 쿠키(Signed Cookie)** 기반으로 한다.
3) 프론트는 서명 생성/암호화 로직을 구현하지 않는다. **백엔드에서 발급된 값만 사용**한다.
4) HLS manifest(.m3u8) 및 segment(.ts/.m4s)는 항상 권한 보호 하에 접근되어야 하며, **직링크/공유를 최소화**한다.
5) 고객사 커스터마이징은 `data + 토큰 + API endpoint` 변경으로 끝나도록 유지한다.

### 권한 발급/재생 흐름 (권장)
- 재생 시점에만 스트리밍 세션을 발급받는다.
1) 수강 권한 확인(서버 정책에 따라 통합 가능)
2) 재생 시작 시 `POST /api/streaming/session` 로 **세션/서명 발급**
3) 응답 타입에 따라 재생:
   - `PRESIGNED_URL`: 서명이 포함된 `manifestUrl` 사용
   - `SIGNED_COOKIE`: 서버의 `Set-Cookie`로 쿠키가 세팅되며, 프론트는 기본 `manifestUrl`로 재생

> 규칙: `manifestUrl`/토큰/서명값을 `data`에 저장하거나 localStorage/sessionStorage에 보관하지 않는다(메모리 사용 권장).

### API 계약 (프론트 기준 권장 스펙)
- `POST /api/streaming/session`
- body: `{ courseSlug: string, lessonSlug: string }`
- response 예시
```json
{
  "data": {
    "manifestUrl": "https://.../index.m3u8",
    "expiresAt": "2026-02-20T10:10:00Z",
    "type": "SIGNED_COOKIE"
  }
}

### 에러 규칙(권장)
- **401**: 로그인 필요
- **403**: 수강 권한 없음
- **410**: 세션 만료(재발급 유도)
- **429**: 재발급 과다(쿨다운 UI)

### 플레이어 구현 규칙
- **Safari/iOS**: native HLS 우선 (`<video src="...m3u8">`)
- **그 외 브라우저**: `hls.js`로 `attachMedia`
- **세션 만료/권한 에러 발생 시**
  - 재발급 버튼 제공 **또는**
  - 자동 재발급(최대 N회) 후 실패 시 안내

### 보안/노출 금지
- 콘솔 로그로 URL/토큰/서명값 출력 금지
- 에러 메시지는 data의 문구를 사용하되, 보안상 상세 사유(서명 파라미터 등) 노출 금지

### A11y (플레이어 필수)
- 재생/일시정지/볼륨/배속/자막 등의 컨트롤은 키보드로 조작 가능해야 한다.
- 버퍼링/오류/만료 상태는 `aria-live="polite"` 영역으로 공지한다.
- 버튼/메뉴 텍스트는 data의 `label/ariaLabel` 기반으로 렌더링한다.

### 데이터 설계 원칙 (Streaming 관련)
- data에는 “식별자 + UI 문구 + 접근성 텍스트”만 둔다.
- 실제 HLS 경로/서명 URL은 절대 data에 두지 않는다.
- 예: `courses[].lessons[]`에 `lessonSlug`, `title`, `duration`, `summary`, `captions`(선택), `a11y` 텍스트를 둔다.

---

## Backend API 계약 (Spring REST) — 기본 스펙

### 기본 엔드포인트
- 강의 목록: `GET /api/courses?category&level&sort&page&pageSize&query`
- 강의 상세: `GET /api/courses/{slug}`
- 내 수강: `GET /api/me/courses`
- 주문 생성: `POST /api/orders` body: `{ courseSlug, paymentMethod }`
- 주문 내역: `GET /api/me/orders?page&pageSize`

### (스트리밍 권장 엔드포인트)
- 스트리밍 세션 발급: `POST /api/streaming/session` body: `{ courseSlug, lessonSlug }`

### 규칙
- 프론트 라우팅은 slug 기준(`/courses/[slug]`), 백엔드도 slug로 상세 조회를 제공한다.
- 목록 응답은 카드에 필요한 최소 필드만 내려준다.
- 접근성 텍스트(alt/aria), UI 카피는 data에서 관리한다(백엔드에 의존하지 않는다).
- 필요 시 Next Route Handler(`/app/api/...`)로 프록시하여 도메인/인증 정책을 안정화한다.
- 스트리밍 서명/쿠키 발급 로직은 백엔드 책임이며, 프론트는 발급된 결과만 사용한다.

---

## “최소 수정 커스터마이징” 원칙 (외주용)

고객사 변경 시, 기본적으로 아래만 수정하게 설계한다:
- `data/*.json` (문구/구성/SEO/AEO/GEO/A11y/강의/커뮤니티/마이페이지 데이터)
- `assets/styles/tokens/` (브랜드 컬러/타이포/스페이싱/레이어)
- 필요 시 `config/index.ts` 또는 API base URL 정도만 수정

컴포넌트/페이지 구조 변경은 **최후의 수단**이다.

---

## 금지 (절대)
- inline style
- HEX / px 직접 사용
- 컴포넌트 파일 내 스타일 선언
- UI 텍스트/alt/aria 하드코딩
- data 구조 무시하고 임의 문자열 삽입
- SEO/AEO/GEO/A11y 무시한 마크업 제안
- 불필요한 `any` 타입 남발 금지 (strict TypeScript 준수, 타입 안전성 유지)
- 스트리밍 서명/토큰 생성 로직을 프론트에서 구현하는 행위
- HLS manifest/segment URL을 data에 저장하는 행위

---

## 기능/페이지 개발 시 “답변 출력 형식” (반드시 지킬 것)

어떤 기능/페이지/컴포넌트를 생성/수정할 때, 답변은 아래 형식을 따른다.

1️⃣ 요구 요약  
2️⃣ 구조 설계 트리 (레이아웃 → 페이지 → 컨테이너 → 요소)  
3️⃣ 생성/수정 파일 목록 (상대 경로)  
4️⃣ 코드 (TSX + TS + SCSS + 토큰 사용)  
5️⃣ 연결되는 data 구조  
6️⃣ SEO/AEO/GEO & A11y 관점에서 무엇을 어떻게 준수했는지 상세 설명  
7️⃣ 어떤 data/토큰을 바꾸면 다른 사이트로 쉽게 커스터마이징 되는지 설명  
8️⃣ (Streaming 포함 시) 권한/세션 발급 흐름(`PRESIGNED_URL` vs `SIGNED_COOKIE`)과 만료/에러 처리 방식을 상세 설명  