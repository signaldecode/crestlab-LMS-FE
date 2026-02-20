# CLAUDE.md (Next.js + React + TypeScript · Lecture Platform Template)

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
- 강의 데이터는 `data/mainData.json` 또는 확장 data 파일에서 로드한다.
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
│  ├─ (site)                         # 공개 사이트 Route Group (헤더/푸터 공통)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                    # 홈(랜딩)
│  │  ├─ about
│  │  │  └─ page.tsx
│  │
│  │  ├─ courses
│  │  │  ├─ page.tsx                 # 강의 목록(검색/필터/정렬)
│  │  │  └─ [slug]
│  │  │     └─ page.tsx              # 강의 상세(SEO 핵심, 커리큘럼/후기/Q&A)
│  │
│  │  ├─ community
│  │  │  ├─ page.tsx                 # 커뮤니티 메인(탭/검색)
│  │  │  ├─ new
│  │  │  │  └─ page.tsx              # 글 작성
│  │  │  └─ [slug]
│  │  │     ├─ page.tsx              # 글 상세
│  │  │     └─ edit
│  │  │        └─ page.tsx           # 글 수정
│  │
│  │  ├─ cart
│  │  │  └─ page.tsx                 # 장바구니
│  │  ├─ checkout
│  │  │  └─ page.tsx                 # 결제(쿠폰/포인트/결제수단)
│  │  ├─ order
│  │  │  └─ complete
│  │  │     └─ page.tsx              # 결제 완료
│  │
│  │  ├─ learn
│  │  │  ├─ page.tsx                 # 내 강의실(구매 강의/진행률/이어보기)
│  │  │  └─ [courseSlug]
│  │  │     └─ [lectureId]
│  │  │        └─ page.tsx           # ⭐ 강의 플레이어(이어보기/자막/노트/북마크)
│  │
│  │  ├─ account
│  │  │  ├─ page.tsx                 # 계정 메인(프로필/설정)
│  │  │  ├─ orders
│  │  │  │  └─ page.tsx              # 주문 내역
│  │  │  ├─ community
│  │  │  │  └─ page.tsx              # 내 커뮤니티 활동
│  │  │  └─ devices
│  │  │     └─ page.tsx              # (선택) 로그인 기기/동시접속 관리
│  │
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ page.tsx              # 로그인
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx              # 회원가입
│  │  │  └─ callback
│  │  │     └─ page.tsx              # (선택) 소셜 로그인 콜백
│  │
│  │  ├─ support
│  │  │  ├─ page.tsx                 # 고객센터(FAQ/공지)
│  │  │  └─ tickets
│  │  │     ├─ page.tsx              # 1:1 문의 목록
│  │  │     └─ new
│  │  │        └─ page.tsx           # 1:1 문의 작성
│  │
│  │  └─ etc
│  │     ├─ terms
│  │     │  └─ page.tsx
│  │     ├─ privacy
│  │     │  └─ page.tsx
│  │     └─ refund
│  │        └─ page.tsx              # 환불 정책(추천)
│  │
│  ├─ (admin)                        # (선택) 관리자 Route Group (운영)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                    # 대시보드
│  │  ├─ courses
│  │  │  ├─ page.tsx                 # 강의 관리
│  │  │  └─ [id]
│  │  │     └─ page.tsx              # 강의 편집(커리큘럼/영상/자료)
│  │  ├─ orders
│  │  │  └─ page.tsx                 # 주문/환불 관리
│  │  ├─ users
│  │  │  └─ page.tsx                 # 유저/권한 관리
│  │  └─ community
│  │     └─ page.tsx                 # 게시글/신고 관리
│  │
│  ├─ api                            # Next Route Handler(선택)
│  │  ├─ health
│  │  │  └─ route.ts                 # 헬스체크
│  │  ├─ proxy
│  │  │  └─ [...path]
│  │  │     └─ route.ts              # 백엔드 프록시
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.ts
│  │  │  └─ refresh
│  │  │     └─ route.ts
│  │  └─ payments
│  │     ├─ confirm
│  │     │  └─ route.ts              # 결제 승인 처리(선택)
│  │     └─ webhook
│  │        └─ route.ts              # 결제 웹훅(선택)
│  │
│  └─ providers.tsx                  # 전역 Provider(Zustand/Theme/Toasts)
│
├─ components
│  ├─ common
│  │  ├─ AppHeader.tsx
│  │  ├─ AppFooter.tsx
│  │  ├─ AppLogo.tsx
│  │  └─ SkipToContent.tsx
│  │
│  ├─ layout
│  │  ├─ GlobalNav.tsx
│  │  ├─ SidebarMenu.tsx
│  │  └─ Modal.tsx
│  │
│  ├─ ui
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ SectionTitle.tsx
│  │  ├─ Accordion.tsx
│  │  ├─ Tabs.tsx
│  │  ├─ Pagination.tsx
│  │  ├─ Toast.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ LoadingSpinner.tsx
│  │  ├─ ProfileImage.tsx
│  │  └─ VideoPlayerShell.tsx        # (중요) 플레이어 UI 컨테이너
│  │
│  ├─ containers
│  │  ├─ HomeHeroContainer.tsx
│  │  ├─ FeaturedCoursesContainer.tsx
│  │  ├─ CourseGridContainer.tsx
│  │  ├─ CourseDetailContainer.tsx
│  │  ├─ TestimonialsContainer.tsx
│  │  ├─ FaqContainer.tsx
│  │  ├─ CommunityContainer.tsx
│  │  ├─ CartContainer.tsx
│  │  ├─ CheckoutContainer.tsx
│  │  ├─ LearnDashboardContainer.tsx
│  │  └─ LecturePlayerContainer.tsx
│  │
│  ├─ courses                        # ⭐ 강의 도메인 컴포넌트
│  │  ├─ CourseCard.tsx
│  │  ├─ CourseFilterBar.tsx
│  │  ├─ CourseSort.tsx
│  │  ├─ CourseCurriculum.tsx
│  │  ├─ CoursePreview.tsx
│  │  ├─ CourseReviewList.tsx
│  │  ├─ CourseReviewItem.tsx
│  │  ├─ CourseQnaList.tsx
│  │  └─ CourseQnaEditor.tsx
│  │
│  ├─ learn                          # ⭐ 플레이어/수강 도메인
│  │  ├─ LectureSidebar.tsx
│  │  ├─ LectureTopBar.tsx
│  │  ├─ LectureTranscript.tsx       # 자막/스크립트
│  │  ├─ LectureNotes.tsx            # 노트
│  │  ├─ LectureBookmarks.tsx        # 북마크
│  │  ├─ LectureControls.tsx         # 배속/화질/다음강의 등
│  │  └─ ProgressMeter.tsx           # 진행률
│  │
│  ├─ community
│  │  ├─ CommunityPageShell.tsx
│  │  ├─ CommunityHeader.tsx
│  │  ├─ CommunityTabs.tsx
│  │  ├─ PostList.tsx
│  │  ├─ PostCard.tsx
│  │  ├─ PostDetail.tsx
│  │  ├─ PostEditor.tsx
│  │  ├─ CommentList.tsx
│  │  ├─ CommentItem.tsx
│  │  ├─ CommentEditor.tsx
│  │  ├─ LikeButton.tsx
│  │  ├─ ShareButton.tsx
│  │  ├─ ReportButton.tsx
│  │  ├─ PostActionsMenu.tsx
│  │  ├─ CommunityProfileModal.tsx
│  │  └─ FollowButton.tsx
│  │
│  ├─ auth                           # (선택) 로그인/회원가입 UI
│  │  ├─ LoginForm.tsx
│  │  └─ SignupForm.tsx
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
│  ├─ mainData.json                  # UI 문구/SEO/FAQ/엔티티(강의/게시글)
│  ├─ schema                         # JSON schema (선택)
│  │  └─ mainData.schema.json
│  └─ seeds                          # (선택) 개발용 mock/seed
│     ├─ courses.mock.json
│     └─ community.mock.json
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
│     ├─ mixins
│     ├─ components
│     ├─ themes
│     └─ main.scss
│
├─ lib
│  ├─ data.ts                        # mainData 로드/조회(findBySlug)
│  ├─ seo.ts                         # Metadata + JSON-LD 생성기
│  ├─ api.ts                         # fetch 래퍼/에러 처리
│  ├─ auth.ts                        # 토큰/쿠키/세션 유틸
│  ├─ payments.ts                    # 결제 유틸(금액계산/쿠폰검증)
│  └─ player.ts                      # 플레이어 유틸(진행률/이어보기 저장 등)
│
├─ stores
│  ├─ useCourseStore.ts
│  ├─ useCommunityStore.ts
│  ├─ useCartStore.ts
│  ├─ useAuthStore.ts
│  ├─ usePlayerStore.ts
│  └─ useToastStore.ts
│
├─ config
│  ├─ env.ts                         # 환경변수 안전 로드/검증(선택)
│  ├─ featureFlags.ts                # 기능 플래그(선택)
│  └─ siteConfig.ts                  # 사이트 이름/도메인/SEO 기본값
│
├─ public
│  ├─ favicon.ico
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ og                             # OG 이미지
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

- `app/(site)/learn/`
  - 수강 영역(내 강의실/플레이어). 구매한 강의를 시청하고, 진행률/이어보기/노트/북마크/자막 등 학습 UX가 집중되는 구간이다.
  
- `app/(site)/cart/`, `app/(site)/checkout/`, `app/(site)/order/complete/`
  - 구매 플로우. 장바구니→결제→완료 화면으로 이어지는 결제 경험을 구성한다(쿠폰/포인트/결제수단 포함).
  
- `app/(site)/auth/`
  - 인증 영역. 로그인/회원가입/소셜 콜백 등 인증 관련 UI를 담당한다.
  
- `app/(site)/support/`
  - 고객센터 영역. 공지/FAQ/1:1 문의 등 CS 동선을 담당한다.
  
- `app/(admin)/`
  - 운영자(관리자) 영역 Route Group(선택). 강의 등록/편집, 주문·환불 관리, 커뮤니티 신고 처리, 유저 권한 등 운영 기능을 제공한다.
  
  
---

- `components/`
  - **페이지를 구성하는 재사용 컴포넌트 모음**. 라우트와 분리되어 있으며, 구조(페이지)와 표현(UI)을 조립 가능한 단위로 유지한다.

- `components/common/`
  - 사이트 전역에서 거의 항상 쓰이는 **고정 공통 요소**(Header/Footer/Logo/SkipToContent).

- `components/layout/`
  - 레이아웃을 구성하는 조립용 요소들. 예) 헤더 내부 내비(`GlobalNav`), 사이드바(`SidebarMenu`), 공용 모달(`Modal`).

- `components/ui/`
  - 도메인 지식이 없는 **순수 범용 UI 부품**(Button/Input/Tabs/Accordion/Pagination 등).  
  - 텍스트/alt/aria는 props로만 받아 렌더링하고, 하드코딩하지 않는다.

- `components/containers/`
  - **페이지 섹션 단위 조립 레이어**. 여러 UI/도메인 컴포넌트를 묶어 홈/강의/상세/커뮤니티 같은 큰 덩어리를 만든다.

- `components/community/`
  - 커뮤니티에서만 쓰이는 **도메인 전용 컴포넌트**(PostList/PostDetail/Comment 등).  
  - 규모가 크고 내부 규칙(작성/수정/권한/댓글)이 많으므로 common/ui에 섞지 않고 도메인 폴더로 분리한다.
  
- `components/courses/`
  -강의에서만 쓰이는 도메인 전용 컴포넌트(카드/필터/커리큘럼/후기/Q&A 등).
	- SEO 핵심 페이지(강의 상세)를 구성하는 블록이므로 ui/common에 섞지 않는다.
  
- `components/community/`
  - 커뮤니티에서만 쓰이는 **도메인 전용 컴포넌트**(PostList/PostDetail/Comment 등).  
  - 규모가 크고 내부 규칙(작성/수정/권한/댓글)이 많으므로 common/ui에 섞지 않고 도메인 폴더로 분리한다.
  
- `components/payments/`
  - 결제 UI 블록(쿠폰/포인트/결제수단/금액 요약 등)을 모아 결제 페이지를 조립한다(선택).
  
- `components/auth/`
  - 로그인/회원가입 폼 등 인증 UI를 모아둔다(선택).
  
- `components/support/`
  - 공지/FAQ/1:1 문의 폼 등 고객센터 UI를 모아둔다(선택).
  
---

- `data/`
  - **하드코딩 금지 원칙의 중심**. UI 문구/버튼 라벨/alt/aria/SEO/AEO/GEO/FAQ/엔티티(강의·게시글) 데이터를 JSON으로 관리한다.  
  - 고객사 커스터마이징은 기본적으로 여기만 바꾸면 되도록 설계한다.

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

- `lib/`
  - **비즈니스 로직/헬퍼 함수 모음**. UI와 분리하여 테스트/재사용이 쉽다.
  - `data.ts`: mainData 로드/slug 조회(findCourseBySlug 등)
  - `seo.ts`: Metadata API + JSON-LD 생성기
  - `api.ts`: fetch 래퍼/에러 처리/엔드포인트 유틸(선택)
  - `auth.ts`: 토큰/쿠키/세션 처리 유틸(선택)
	- `payments.ts`: 금액 계산/쿠폰 검증/결제 흐름 유틸(선택)
	- `player.ts`: 진행률/이어보기/학습도구(노트/북마크) 유틸(선택)

- `stores/`
  - Zustand 전역 상태. 예) 강의 필터/검색/페이지네이션, 커뮤니티 탭/검색 등.

- `config/`
  - 환경별 설정(API baseURL, feature flag, 운영 옵션 등)을 모아두는 폴더(선택).

- `public/`
  - Next 정적 서빙 경로. favicon, robots.txt, sitemap.xml 등 SEO 파일도 여기서 관리 가능.

- `next.config.ts`
  - Next 설정 파일(이미지 도메인 허용, 리다이렉트/리라이트, 빌드 옵션 등).



## Data 설계 원칙 (SEO/AEO/GEO + A11y 포함)

UI 텍스트 / 이미지 경로 / 섹션 정보 / 접근성용 텍스트 / 메타 정보 등은
**절대 페이지/컴포넌트에 하드코딩하지 않는다.**

반드시 `data/mainData.json` 또는 확장된 data 파일에서 관리한다.

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
- `data/mainData.json` (문구/구성/SEO/AEO/GEO/A11y/강의 데이터)
- `assets/styles/tokens/` (브랜드 컬러/타이포/스페이싱/레이어)
- 필요 시 `config` 또는 API base URL 정도만 수정

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