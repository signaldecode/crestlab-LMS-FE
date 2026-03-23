# LMS Admin 프로젝트 계획서

> 온라인 강의 플랫폼(LMS) 관리자 대시보드를 **별도 프로젝트**로 분리하여 구축한다.
> 기존 프론트엔드(`lecture_frontend`)와 동일한 백엔드(Spring REST)를 공유하되,
> 관리자 전용 API 엔드포인트(`/api/admin/...`)를 사용한다.

---

## 1. 프로젝트 분리 이유

| 관점 | 분리 전 (현재) | 분리 후 |
|------|---------------|---------|
| **배포** | 사용자/관리자 동시 배포 필수 | 독립 배포 — 관리자 기능 변경이 사용자 사이트에 영향 없음 |
| **접근 제어** | Route Group + 미들웨어로 분기 | 프로젝트 자체가 인증된 관리자만 접근 가능한 도메인/포트 |
| **번들 크기** | 사용자에게 불필요한 admin 코드 포함 | 각 프로젝트가 필요한 코드만 포함 |
| **기술 선택** | 사용자 사이트 제약에 묶임 | 차트/테이블/에디터 등 admin 전용 라이브러리 자유롭게 도입 |
| **팀 협업** | 같은 레포에서 충돌 가능 | 독립 레포로 병렬 작업 가능 |

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| **프레임워크** | Next.js 16 (App Router) | 기존 프로젝트와 통일 |
| **언어** | TypeScript 5.9 (strict) | 공유 타입 패키지 활용 가능 |
| **UI 라이브러리** | React 19 | 기존과 동일 |
| **UI 컴포넌트** | shadcn/ui | Radix UI 기반, 복사 방식(소유권 유지), Tailwind CSS 스타일링 |
| **스타일** | Tailwind CSS 4 | shadcn/ui와 통합, CSS 변수 기반 테마 커스터마이징 |
| **상태 관리** | Zustand | 기존과 동일 |
| **차트** | Recharts (shadcn/ui Charts) | shadcn/ui에서 제공하는 차트 컴포넌트 래퍼 활용 |
| **테이블** | TanStack Table + shadcn/ui DataTable | shadcn/ui DataTable 패턴 활용 |
| **에디터** | TipTap 또는 Toast UI Editor | 공지사항/강의 설명 작성용 리치 텍스트 에디터 |
| **폼 관리** | React Hook Form + Zod | shadcn/ui Form 컴포넌트와 통합 |
| **날짜** | date-fns | 경량 날짜 처리, shadcn/ui DatePicker와 연동 |
| **HTTP** | fetch 래퍼 (lib/api.ts) | 기존 패턴 유지, 인터셉터로 토큰 갱신 |
| **인증** | JWT (httpOnly Cookie) | 백엔드 통합 인증, 관리자 role 검증 |

### shadcn/ui 활용 전략

- **복사 방식**: shadcn/ui는 npm 패키지가 아닌 `components/ui/` 디렉토리에 소스 코드를 복사하여 사용한다. 이를 통해 완전한 커스터마이징 자유도를 확보한다.
- **테마 커스터마이징**: `app/globals.css`에서 CSS 변수(`--primary`, `--secondary`, `--background` 등)를 변경하여 admin 브랜드 컬러를 적용한다.
- **다크 모드**: Tailwind의 `dark:` 클래스와 shadcn/ui의 내장 다크 모드를 활용한다.
- **기존 프로젝트와의 차이**: `lecture_frontend`(SCSS + 자체 토큰)과 admin 프로젝트(Tailwind + shadcn/ui)는 스타일 시스템이 다르지만, 관리자 대시보드 특성상 shadcn/ui의 사전 구축된 컴포넌트가 개발 속도에 유리하다.

---

## 3. 핵심 기능 범위

> **라우팅 전략: 하이브리드 방식**
> - 공통 가능한 페이지(대시보드, 강의 목록 등)는 **같은 라우트 + 역할별 데이터 스코프 분리**
> - 역할 특화 기능(강사 매출/정산, 강사 Q&A 등)은 **전용 라우트(`/instructor/...`)로 추가**
> - 사이드바 메뉴는 `sidebarData.json`의 `roles` 필드로 역할별 필터링
> - 로그인 후 역할별 기본 페이지로 자동 리다이렉트

### 3.1 대시보드 (홈) — 역할별 위젯 분기

| 기능 | SUPER_ADMIN | INSTRUCTOR | CS_AGENT |
|------|:-----------:|:----------:|:--------:|
| 전체 지표 카드 (총 회원/매출/강의/수강생) | O | — | — |
| 내 강의 지표 카드 (내 수강생/내 매출/내 강의 완료율) | — | O | — |
| 문의 지표 카드 (미답변 문의/오늘 접수) | — | — | O |
| 매출 추이 차트 (전체) | O | — | — |
| 내 매출 추이 차트 (본인 강의만) | — | O | — |
| 수강 현황 차트 | O | O (본인) | — |
| 최근 주문 목록 | O | — | — |
| 최근 문의 목록 | O | — | O |
| 최근 Q&A 목록 (내 강의) | — | O | — |
| 시스템 알림 (환불 대기/미답변 문의) | O | — | O |

> **구현 방식**: `/dashboard` 페이지 하나에서 `role`에 따라 렌더링할 위젯 목록을 분기한다.
> 대시보드 위젯 자체는 동일한 컴포넌트를 사용하되, API 호출 시 역할에 따라 백엔드가 데이터 스코프를 필터링한다.

### 3.2 회원 관리 — `SUPER_ADMIN` / `CS_AGENT`(읽기 전용)

| 기능 | 설명 | SUPER_ADMIN | CS_AGENT |
|------|------|:-----------:|:--------:|
| 회원 목록 | 검색/필터(가입일, 등급, 상태) + 페이지네이션 | O | O (읽기) |
| 회원 상세 | 프로필 정보, 수강 내역, 주문 내역, 활동 로그 | O | O (읽기) |
| 회원 수정 | 등급 변경, 상태(활성/정지/탈퇴) 변경, 메모 | O | — |
| 포인트 지급/차감 | 수동 포인트 조정 + 사유 기록 | O | — |
| 쿠폰 지급 | 개별/대량 쿠폰 발급 | O | — |

> `INSTRUCTOR`는 회원 관리에 접근할 수 없다. 본인 강의 수강생 정보는 강사 전용 페이지에서 별도 제공.

### 3.3 강의 관리 — 공통 라우트, 데이터 스코프 분리

| 기능 | 설명 | SUPER_ADMIN | INSTRUCTOR |
|------|------|:-----------:|:----------:|
| 강의 목록 | 카테고리/상태 필터 + 검색 | 전체 | **본인 강의만** |
| 강의 생성/수정 | 기본 정보(제목/설명/썸네일/가격/카테고리/난이도/기간) | O | O (본인) |
| 커리큘럼 편집 | 섹션/레슨 추가/삭제/순서 변경 | O | O (본인) |
| 영상 업로드 | Presigned URL → S3, 진행률 표시 | O | O (본인) |
| 자막 관리 | 레슨별 자막 파일(.vtt) 업로드/삭제 | O | O (본인) |
| 강의 FAQ 관리 | FAQ 항목 CRUD | O | O (본인) |
| 강의 복제 | 기존 강의를 템플릿으로 새 강의 생성 | O | — |
| 강의 공개/비공개 | 상태 토글 (즉시 반영) | O | **요청만** (관리자 승인) |
| 베스트/오픈예정 지정 | 베스트 강의, 오픈 예정 강의 플래그 설정 | O | — |

> **공개 요청 플로우**: 강사가 "공개 요청" → 관리자 대시보드에 승인 대기 표시 → 관리자가 승인/반려.
> 같은 `/courses` 라우트를 사용하되, 백엔드가 `WHERE instructorId = me` 조건을 강제한다.

### 3.4 강사 전용 기능 — `/instructor/*` 전용 라우트

> `INSTRUCTOR` 역할에만 노출되는 메뉴/페이지. 다른 역할은 접근 시 403.

| 기능 | 설명 |
|------|------|
| **내 수강생** | 본인 강의별 수강생 목록, 진도율, 완료율 조회 |
| **Q&A 관리** | 본인 강의에 달린 질문 목록, 답변 작성/수정 |
| **수강평 관리** | 본인 강의 수강평 조회, 답글 작성 |
| **매출/정산** | 본인 강의 매출 추이, 월별 정산 내역, 정산 예정액 |
| **공개 요청 현황** | 본인이 요청한 강의 공개/비공개 승인 상태 확인 |
| **내 프로필 수정** | 강사 소개, 프로필 이미지, SNS 링크 등 |

### 3.5 주문/결제 관리 — `SUPER_ADMIN` 전용

| 기능 | 설명 |
|------|------|
| 주문 목록 | 상태별 필터(결제완료/취소/환불요청/환불완료) + 기간 검색 |
| 주문 상세 | 주문 정보, 결제 정보(토스페이먼츠), 수강 강의 목록 |
| 환불 처리 | 환불 요청 승인/거절 + 사유 기록 |
| 매출 통계 | 기간별 매출 집계, 강의별 매출 순위 |

### 3.6 쿠폰/포인트 관리 — `SUPER_ADMIN` 전용

| 기능 | 설명 |
|------|------|
| 쿠폰 목록 | 전체 쿠폰 현황 (활성/만료/사용 완료) |
| 쿠폰 생성 | 퍼센트/정액 할인, 유효 기간, 대상 강의/카테고리 지정 |
| 대량 발급 | CSV 업로드 또는 조건 기반 대량 쿠폰 발급 |
| 포인트 정책 | 적립률 설정, 포인트 만료 정책 관리 |

### 3.7 커뮤니티 관리 — `SUPER_ADMIN` 전용

| 기능 | 설명 |
|------|------|
| 게시글 목록 | 카테고리/신고 상태 필터 + 검색 |
| 게시글 상세/수정 | 내용 확인, 비공개 처리, 삭제 |
| 댓글 관리 | 신고된 댓글 처리, 삭제 |
| 신고 관리 | 신고 접수 목록, 처리(경고/삭제/정지) |
| 카테고리/태그 관리 | 커뮤니티 카테고리 CRUD, 태그 관리 |

### 3.8 고객센터 관리 — `SUPER_ADMIN` / `CS_AGENT`

| 기능 | 설명 | SUPER_ADMIN | CS_AGENT |
|------|------|:-----------:|:--------:|
| 1:1 문의 목록 | 상태별(대기/답변완료) 필터 | O | O |
| 문의 답변 | 리치 텍스트 답변 작성 + 첨부파일 | O | O |
| 공지사항 관리 | 공지 CRUD + 상단 고정/해제 | O | O |
| FAQ 관리 | 카테고리별 FAQ CRUD | O | O |

### 3.9 콘텐츠/사이트 관리 — `SUPER_ADMIN` 전용

| 기능 | 설명 |
|------|------|
| 배너 관리 | 상단 프로모션 배너 CRUD + 노출 기간/순서 설정 |
| 팝업 관리 | 메인 팝업 CRUD + 노출 조건 설정 |
| 약관 관리 | 이용약관/개인정보처리방침 버전 관리 + 에디터 |

### 3.10 통계/분석

| 기능 | 설명 | SUPER_ADMIN | INSTRUCTOR |
|------|------|:-----------:|:----------:|
| 가입 통계 | 일별/월별 신규 가입자 추이 | O | — |
| 수강 통계 (전체) | 강의별 수강생 수, 완료율, 평균 진도율 | O | — |
| 수강 통계 (내 강의) | 본인 강의 수강생/완료율/진도율 | — | O |
| 매출 통계 (전체) | 기간별/강의별/카테고리별 매출 분석 | O | — |
| 매출 통계 (내 강의) | 본인 강의 매출/정산 분석 | — | O |
| 유입 통계 | (선택) 페이지별 조회수, 전환율 | O | — |

> 같은 `/analytics` 라우트를 사용하되, 역할에 따라 보이는 탭과 데이터 범위가 다르다.

### 3.11 시스템 설정 — `SUPER_ADMIN` 전용

| 기능 | 설명 |
|------|------|
| 관리자/강사 계정 | 관리자·강사 목록, 역할(슈퍼관리자/강사/CS담당) 관리 |
| 역할 권한 | 메뉴/기능별 접근 권한 설정 |
| 강의 공개 승인 | 강사의 공개 요청 승인/반려 처리 |
| 활동 로그 | 관리자·강사 작업 이력 조회 (감사 추적) |
| 환경 설정 | API 연동 키, 결제 설정, 이메일 발송 설정 등 |

### 3.12 역할별 접근 권한 매트릭스 (요약)

| 메뉴/기능 | SUPER_ADMIN | INSTRUCTOR | CS_AGENT |
|-----------|:-----------:|:----------:|:--------:|
| 대시보드 | 전체 지표 | 내 강의 지표 | 문의 지표 |
| 회원 관리 | CRUD | — | 읽기 전용 |
| 강의 관리 | 전체 CRUD | 본인 강의 CRUD | — |
| 강사 전용 (Q&A/수강평/정산) | — | O | — |
| 주문/결제 | O | — | — |
| 쿠폰/포인트 | O | — | — |
| 커뮤니티 | O | — | — |
| 고객센터 | O | — | O |
| 콘텐츠 (배너/팝업/약관) | O | — | — |
| 통계/분석 | 전체 | 내 강의 | — |
| 시스템 설정 | O | — | — |

---

## 4. 폴더 구조

```
lecture_admin/
├─ app/
│  ├─ layout.tsx                        # 루트 레이아웃 (인증 체크)
│  ├─ providers.tsx                     # 전역 Provider
│  ├─ globals.css                       # Tailwind CSS + shadcn/ui CSS 변수 (테마)
│  │
│  ├─ (auth)/                           # 인증 Route Group (레이아웃 없음)
│  │  └─ login/
│  │     └─ page.tsx                    # 관리자/강사 통합 로그인
│  │
│  ├─ (dashboard)/                      # 인증 후 메인 Route Group
│  │  ├─ layout.tsx                     # 사이드바 + 헤더 + 메인 영역 (역할별 사이드바 필터링)
│  │  ├─ page.tsx                       # 대시보드 홈 (역할별 위젯 분기)
│  │  │
│  │  ├─ members/                       # 👥 회원 관리 — SUPER_ADMIN / CS_AGENT(읽기)
│  │  │  ├─ page.tsx                    # 회원 목록
│  │  │  └─ [id]/
│  │  │     └─ page.tsx                 # 회원 상세/수정
│  │  │
│  │  ├─ courses/                       # 📚 강의 관리 — SUPER_ADMIN(전체) / INSTRUCTOR(본인)
│  │  │  ├─ page.tsx                    # 강의 목록 (역할별 데이터 스코프)
│  │  │  ├─ new/
│  │  │  │  └─ page.tsx                 # 강의 생성
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx                 # 강의 수정 (기본 정보)
│  │  │     ├─ curriculum/
│  │  │     │  └─ page.tsx              # 커리큘럼 편집
│  │  │     └─ upload/
│  │  │        └─ page.tsx              # 영상 업로드
│  │  │
│  │  ├─ instructor/                    # 🎓 강사 전용 — INSTRUCTOR만 접근
│  │  │  ├─ students/
│  │  │  │  └─ page.tsx                 # 내 수강생 현황
│  │  │  ├─ qna/
│  │  │  │  ├─ page.tsx                 # 내 강의 Q&A 목록
│  │  │  │  └─ [id]/
│  │  │  │     └─ page.tsx              # Q&A 상세/답변
│  │  │  ├─ reviews/
│  │  │  │  └─ page.tsx                 # 내 강의 수강평
│  │  │  ├─ revenue/
│  │  │  │  └─ page.tsx                 # 매출/정산
│  │  │  ├─ requests/
│  │  │  │  └─ page.tsx                 # 공개 요청 현황
│  │  │  └─ profile/
│  │  │     └─ page.tsx                 # 강사 프로필 수정
│  │  │
│  │  ├─ orders/                        # 💰 주문/결제 — SUPER_ADMIN 전용
│  │  │  ├─ page.tsx                    # 주문 목록
│  │  │  └─ [id]/
│  │  │     └─ page.tsx                 # 주문 상세
│  │  │
│  │  ├─ coupons/                       # 🎟️ 쿠폰 — SUPER_ADMIN 전용
│  │  │  ├─ page.tsx                    # 쿠폰 목록
│  │  │  └─ new/
│  │  │     └─ page.tsx                 # 쿠폰 생성
│  │  │
│  │  ├─ community/                     # 💬 커뮤니티 — SUPER_ADMIN 전용
│  │  │  ├─ page.tsx                    # 게시글 관리
│  │  │  ├─ reports/
│  │  │  │  └─ page.tsx                 # 신고 관리
│  │  │  └─ categories/
│  │  │     └─ page.tsx                 # 카테고리/태그 관리
│  │  │
│  │  ├─ support/                       # 📞 고객센터 — SUPER_ADMIN / CS_AGENT
│  │  │  ├─ tickets/
│  │  │  │  ├─ page.tsx                 # 1:1 문의 목록
│  │  │  │  └─ [id]/
│  │  │  │     └─ page.tsx              # 문의 답변
│  │  │  ├─ notices/
│  │  │  │  ├─ page.tsx                 # 공지 목록
│  │  │  │  └─ new/
│  │  │  │     └─ page.tsx              # 공지 작성
│  │  │  └─ faq/
│  │  │     └─ page.tsx                 # FAQ 관리
│  │  │
│  │  ├─ content/                       # 🖼️ 콘텐츠 — SUPER_ADMIN 전용
│  │  │  ├─ banners/
│  │  │  │  └─ page.tsx                 # 배너 관리
│  │  │  ├─ popups/
│  │  │  │  └─ page.tsx                 # 팝업 관리
│  │  │  └─ terms/
│  │  │     └─ page.tsx                 # 약관 관리
│  │  │
│  │  ├─ analytics/                     # 📈 통계 — SUPER_ADMIN(전체) / INSTRUCTOR(내 강의)
│  │  │  ├─ page.tsx                    # 통계 메인 (역할별 탭 분기)
│  │  │  ├─ members/
│  │  │  │  └─ page.tsx                 # 가입 통계 (SUPER_ADMIN)
│  │  │  └─ courses/
│  │  │     └─ page.tsx                 # 수강 통계 (역할별 스코프)
│  │  │
│  │  └─ settings/                      # ⚙️ 설정 — SUPER_ADMIN 전용
│  │     ├─ page.tsx                    # 환경 설정
│  │     ├─ admins/
│  │     │  └─ page.tsx                 # 관리자/강사 계정 관리
│  │     ├─ roles/
│  │     │  └─ page.tsx                 # 역할/권한 관리
│  │     ├─ approvals/
│  │     │  └─ page.tsx                 # 강의 공개 승인 대기
│  │     └─ logs/
│  │        └─ page.tsx                 # 활동 로그
│  │
│  └─ api/                              # Route Handler (프록시)
│     ├─ proxy/
│     │  └─ [...path]/
│     │     └─ route.ts
│     └─ auth/
│        ├─ login/
│        │  └─ route.ts
│        ├─ logout/
│        │  └─ route.ts
│        └─ refresh/
│           └─ route.ts
│
├─ components/
│  ├─ common/                           # 전역 공통
│  │  ├─ AdminHeader.tsx                # 상단 헤더 (검색/알림/프로필)
│  │  ├─ AdminSidebar.tsx               # 사이드바 네비게이션 (역할별 메뉴 필터링)
│  │  ├─ AdminLogo.tsx                  # 관리자 로고
│  │  ├─ AdminBreadcrumb.tsx            # 브레드크럼
│  │  ├─ NotificationBell.tsx           # 알림 드롭다운
│  │  ├─ RoleGuard.tsx                  # 역할 기반 접근 제어 래퍼 컴포넌트
│  │  └─ ForbiddenPage.tsx              # 403 권한 없음 페이지
│  │
│  ├─ ui/                               # shadcn/ui 컴포넌트 (npx shadcn@latest add 로 설치)
│  │  ├─ button.tsx                     # shadcn/ui Button
│  │  ├─ input.tsx                      # shadcn/ui Input
│  │  ├─ select.tsx                     # shadcn/ui Select
│  │  ├─ textarea.tsx                   # shadcn/ui Textarea
│  │  ├─ checkbox.tsx                   # shadcn/ui Checkbox
│  │  ├─ switch.tsx                     # shadcn/ui Switch (토글)
│  │  ├─ badge.tsx                      # shadcn/ui Badge
│  │  ├─ dialog.tsx                     # shadcn/ui Dialog (모달)
│  │  ├─ alert-dialog.tsx               # shadcn/ui AlertDialog (확인/취소)
│  │  ├─ toast.tsx                      # shadcn/ui Toast (sonner)
│  │  ├─ toaster.tsx                    # Toast Provider
│  │  ├─ tooltip.tsx                    # shadcn/ui Tooltip
│  │  ├─ tabs.tsx                       # shadcn/ui Tabs
│  │  ├─ pagination.tsx                 # shadcn/ui Pagination
│  │  ├─ skeleton.tsx                   # shadcn/ui Skeleton
│  │  ├─ table.tsx                      # shadcn/ui Table (기본 테이블 마크업)
│  │  ├─ card.tsx                       # shadcn/ui Card
│  │  ├─ dropdown-menu.tsx              # shadcn/ui DropdownMenu
│  │  ├─ popover.tsx                    # shadcn/ui Popover
│  │  ├─ command.tsx                    # shadcn/ui Command (검색/커맨드 팔레트)
│  │  ├─ calendar.tsx                   # shadcn/ui Calendar (날짜 선택)
│  │  ├─ date-picker.tsx                # shadcn/ui DatePicker (Popover + Calendar)
│  │  ├─ form.tsx                       # shadcn/ui Form (React Hook Form 통합)
│  │  ├─ label.tsx                      # shadcn/ui Label
│  │  ├─ separator.tsx                  # shadcn/ui Separator
│  │  ├─ sheet.tsx                      # shadcn/ui Sheet (슬라이드 패널)
│  │  ├─ avatar.tsx                     # shadcn/ui Avatar
│  │  ├─ scroll-area.tsx                # shadcn/ui ScrollArea
│  │  ├─ chart.tsx                      # shadcn/ui Chart (Recharts 래퍼)
│  │  └─ sidebar.tsx                    # shadcn/ui Sidebar
│  │
│  ├─ composed/                         # shadcn/ui 조합 컴포넌트 (프로젝트 전용)
│  │  ├─ DataTable.tsx                  # TanStack Table + shadcn/ui Table 조합
│  │  ├─ DataTablePagination.tsx        # 테이블 페이지네이션 컨트롤
│  │  ├─ DataTableToolbar.tsx           # 테이블 필터/검색 툴바
│  │  ├─ StatCard.tsx                   # 통계 카드 (Card + 아이콘 + 숫자 + 증감률)
│  │  ├─ StatusBadge.tsx                # 상태별 색상 Badge 래퍼
│  │  ├─ SearchInput.tsx                # 검색 입력 (디바운스 + Command)
│  │  ├─ DateRangePicker.tsx            # 기간 선택 (Popover + Calendar 조합)
│  │  ├─ FileUploadZone.tsx             # 파일 드래그앤드롭 영역
│  │  ├─ UploadProgress.tsx             # 업로드 진행률 (Progress 바)
│  │  ├─ EmptyState.tsx                 # 빈 상태 안내
│  │  ├─ ConfirmDialog.tsx              # AlertDialog 기반 확인/취소
│  │  ├─ ImageUploadField.tsx           # 이미지 업로드 (미리보기)
│  │  ├─ RichTextEditor.tsx             # 리치 텍스트 에디터 래퍼
│  │  └─ ActivityTimeline.tsx           # 활동 타임라인
│  │
│  ├─ dashboard/                        # 대시보드 전용
│  │  ├─ DashboardSummary.tsx           # 지표 카드 그리드 (역할별 지표 분기)
│  │  ├─ AdminDashboardWidgets.tsx      # SUPER_ADMIN 전용 위젯 묶음
│  │  ├─ InstructorDashboardWidgets.tsx # INSTRUCTOR 전용 위젯 묶음
│  │  ├─ CsDashboardWidgets.tsx         # CS_AGENT 전용 위젯 묶음
│  │  ├─ RevenueChart.tsx               # 매출 추이 차트 (공통 — 데이터 스코프만 다름)
│  │  ├─ RecentOrdersTable.tsx          # 최근 주문
│  │  ├─ RecentTicketsTable.tsx         # 최근 문의
│  │  ├─ RecentQnaTable.tsx             # 최근 Q&A (강사용)
│  │  └─ SystemAlerts.tsx               # 시스템 알림
│  │
│  ├─ members/                          # 회원 관리 전용
│  │  ├─ MemberListTable.tsx
│  │  ├─ MemberDetailCard.tsx
│  │  ├─ MemberEditForm.tsx
│  │  ├─ MemberCourseHistory.tsx        # 수강 내역
│  │  ├─ MemberOrderHistory.tsx         # 주문 내역
│  │  └─ PointAdjustModal.tsx           # 포인트 지급/차감
│  │
│  ├─ courses/                          # 강의 관리 전용
│  │  ├─ CourseListTable.tsx             # 강의 목록 (역할별 컬럼/액션 분기)
│  │  ├─ CourseForm.tsx                 # 기본 정보 폼
│  │  ├─ CurriculumEditor.tsx           # 커리큘럼 편집 (드래그 정렬)
│  │  ├─ SectionEditor.tsx              # 섹션 단위 편집
│  │  ├─ LessonEditor.tsx               # 레슨 단위 편집
│  │  ├─ VideoUploadPanel.tsx           # 영상 업로드 패널
│  │  ├─ CaptionUploadField.tsx         # 자막 업로드
│  │  ├─ CourseFaqEditor.tsx            # FAQ 편집
│  │  ├─ CourseStatusToggle.tsx         # 공개/비공개 토글 (SUPER_ADMIN)
│  │  └─ CoursePublishRequest.tsx       # 공개 요청 버튼 (INSTRUCTOR)
│  │
│  ├─ instructor/                       # 🎓 강사 전용 컴포넌트
│  │  ├─ MyStudentsTable.tsx            # 내 수강생 테이블
│  │  ├─ MyStudentProgress.tsx          # 수강생 진도율 상세
│  │  ├─ QnaListTable.tsx               # Q&A 목록
│  │  ├─ QnaReplyPanel.tsx              # Q&A 답변 패널
│  │  ├─ ReviewListTable.tsx            # 수강평 목록
│  │  ├─ ReviewReplyForm.tsx            # 수강평 답글 폼
│  │  ├─ RevenueOverview.tsx            # 매출 요약 카드
│  │  ├─ SettlementTable.tsx            # 정산 내역 테이블
│  │  ├─ PublishRequestList.tsx         # 공개 요청 현황 목록
│  │  └─ InstructorProfileForm.tsx      # 강사 프로필 수정 폼
│  │
│  ├─ orders/                           # 주문 관리 전용
│  │  ├─ OrderListTable.tsx
│  │  ├─ OrderDetailCard.tsx
│  │  ├─ RefundProcessModal.tsx         # 환불 처리
│  │  └─ RevenueStatsPanel.tsx          # 매출 통계
│  │
│  ├─ coupons/                          # 쿠폰 관리 전용
│  │  ├─ CouponListTable.tsx
│  │  ├─ CouponCreateForm.tsx
│  │  └─ BulkIssueModal.tsx             # 대량 발급
│  │
│  ├─ community/                        # 커뮤니티 관리 전용
│  │  ├─ PostListTable.tsx
│  │  ├─ PostDetailPanel.tsx
│  │  ├─ ReportListTable.tsx
│  │  ├─ ReportActionModal.tsx          # 신고 처리
│  │  └─ CategoryTagManager.tsx         # 카테고리/태그 관리
│  │
│  ├─ support/                          # 고객센터 관리 전용
│  │  ├─ TicketListTable.tsx
│  │  ├─ TicketReplyPanel.tsx           # 답변 작성
│  │  ├─ NoticeListTable.tsx
│  │  ├─ NoticeForm.tsx
│  │  └─ FaqManager.tsx
│  │
│  ├─ content/                          # 콘텐츠 관리 전용
│  │  ├─ BannerListTable.tsx
│  │  ├─ BannerForm.tsx
│  │  ├─ PopupForm.tsx
│  │  └─ TermsEditor.tsx
│  │
│  └─ settings/                         # 시스템 설정 전용
│     ├─ AdminListTable.tsx             # 관리자/강사 목록
│     ├─ RolePermissionMatrix.tsx       # 권한 매트릭스
│     ├─ ApprovalQueue.tsx              # 강의 공개 승인 대기열
│     └─ ActivityLogTable.tsx
│
├─ data/
│  ├─ index.ts                          # 데이터 통합 로더
│  ├─ sidebarData.json                  # 사이드바 메뉴 구조 (역할별 roles 필드 포함)
│  ├─ dashboardData.json                # 대시보드 레이블/단위
│  ├─ permissionsData.json              # 역할별 라우트/기능 접근 권한 매핑
│  └─ uiData.json                       # 공통 UI 문구 (버튼/상태/에러)
│
├─ hooks/
│  ├─ index.ts
│  ├─ useAuth.ts                        # 관리자/강사 인증
│  ├─ useRole.ts                        # 현재 역할 조회 + 권한 체크
│  ├─ useDataTable.ts                   # 테이블 상태 (정렬/필터/페이지)
│  ├─ useDebounce.ts                    # 디바운스
│  ├─ useUpload.ts                      # 파일 업로드
│  └─ useConfirm.ts                     # 확인 다이얼로그
│
├─ types/
│  └─ index.ts                          # Admin 전용 타입 + 역할/권한 타입 + 공유 타입
│
├─ lib/
│  ├─ api.ts                            # fetch 래퍼 (인터셉터/토큰 갱신)
│  ├─ auth.ts                           # 토큰/세션 유틸
│  ├─ cookies.ts                        # 쿠키 유틸
│  ├─ upload.ts                         # 업로드 유틸 (Presigned URL)
│  ├─ format.ts                         # 날짜/금액/숫자 포맷 유틸
│  └─ permissions.ts                    # 역할별 라우트/기능 접근 권한 체크 유틸
│
├─ stores/
│  ├─ useAuthStore.ts                   # 관리자/강사 인증 상태 (role 포함)
│  ├─ useSidebarStore.ts                # 사이드바 열림/닫힘
│  ├─ useUploadStore.ts                 # 업로드 상태
│  └─ useNotificationStore.ts           # 알림 상태
│
├─ config/
│  └─ index.ts                          # 환경 설정 (API base, 사이트명 등)
│
├─ lib/
│  └─ utils.ts                          # cn() 유틸 (clsx + tailwind-merge, shadcn/ui 필수)
│
├─ middleware.ts                        # 인증 미들웨어 (비인증 → 로그인 리다이렉트, 역할별 라우트 보호)
├─ components.json                     # shadcn/ui 설정 (경로/스타일/별칭)
├─ next.config.ts
├─ tailwind.config.ts                  # Tailwind CSS 커스텀 설정 (필요 시)
├─ tsconfig.json
├─ package.json
└─ .env.local
```

---

## 5. 관리자 API 엔드포인트 (백엔드 계약)

> 모든 admin API는 `/api/admin/` prefix를 사용하며, 관리자 JWT 필수.

### 5.1 인증

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/admin/auth/login` | 관리자 로그인 |
| POST | `/api/admin/auth/logout` | 로그아웃 |
| POST | `/api/admin/auth/refresh` | 토큰 갱신 |
| GET | `/api/admin/auth/me` | 내 정보 (역할 포함) |

### 5.2 대시보드

| Method | Endpoint | 설명 | 역할 |
|--------|----------|------|------|
| GET | `/api/admin/dashboard/summary` | 전체 지표 (회원/매출/강의/문의) | SUPER_ADMIN |
| GET | `/api/admin/dashboard/revenue?period=daily&from&to` | 전체 매출 추이 | SUPER_ADMIN |
| GET | `/api/admin/dashboard/enrollments?period=daily&from&to` | 전체 수강 추이 | SUPER_ADMIN |
| GET | `/api/admin/instructor/dashboard/summary` | 내 강의 지표 (수강생/매출/완료율) | INSTRUCTOR |
| GET | `/api/admin/instructor/dashboard/revenue?period&from&to` | 내 매출 추이 | INSTRUCTOR |
| GET | `/api/admin/instructor/dashboard/recent-qna` | 내 강의 최근 Q&A | INSTRUCTOR |

### 5.3 회원

| Method | Endpoint | 설명 | 역할 |
|--------|----------|------|------|
| GET | `/api/admin/members?query&grade&status&sort&page&pageSize` | 목록 | SUPER_ADMIN, CS_AGENT |
| GET | `/api/admin/members/{id}` | 상세 | SUPER_ADMIN, CS_AGENT |
| PATCH | `/api/admin/members/{id}` | 수정 (등급/상태) | SUPER_ADMIN |
| POST | `/api/admin/members/{id}/points` | 포인트 지급/차감 | SUPER_ADMIN |
| POST | `/api/admin/members/{id}/coupons` | 쿠폰 지급 | SUPER_ADMIN |

### 5.4 강의

> INSTRUCTOR가 호출하면 백엔드가 `WHERE instructorId = JWT.userId` 조건을 자동 적용한다.

| Method | Endpoint | 설명 | 역할 |
|--------|----------|------|------|
| GET | `/api/admin/courses?category&status&sort&page&pageSize&query` | 목록 | SUPER_ADMIN(전체), INSTRUCTOR(본인) |
| POST | `/api/admin/courses` | 생성 | SUPER_ADMIN, INSTRUCTOR |
| GET | `/api/admin/courses/{id}` | 상세 | SUPER_ADMIN, INSTRUCTOR(본인) |
| PUT | `/api/admin/courses/{id}` | 수정 | SUPER_ADMIN, INSTRUCTOR(본인) |
| PATCH | `/api/admin/courses/{id}/status` | 상태 변경 (공개/비공개, 즉시 반영) | SUPER_ADMIN |
| POST | `/api/admin/courses/{id}/publish-request` | 공개 요청 (승인 대기 상태로 전환) | INSTRUCTOR |
| PATCH | `/api/admin/courses/{id}/publish-approve` | 공개 요청 승인 | SUPER_ADMIN |
| PATCH | `/api/admin/courses/{id}/publish-reject` | 공개 요청 반려 (사유 포함) | SUPER_ADMIN |
| DELETE | `/api/admin/courses/{id}` | 삭제 | SUPER_ADMIN |
| POST | `/api/admin/courses/{id}/duplicate` | 복제 | SUPER_ADMIN |
| PUT | `/api/admin/courses/{id}/curriculum` | 커리큘럼 저장 | SUPER_ADMIN, INSTRUCTOR(본인) |
| POST | `/api/admin/courses/{id}/lessons/{lessonId}/upload-url` | 영상 Presigned URL | SUPER_ADMIN, INSTRUCTOR(본인) |
| POST | `/api/admin/courses/{id}/lessons/{lessonId}/upload-confirm` | 업로드 확인 | SUPER_ADMIN, INSTRUCTOR(본인) |
| POST | `/api/admin/courses/{id}/lessons/{lessonId}/captions` | 자막 업로드 | SUPER_ADMIN, INSTRUCTOR(본인) |

### 5.5 강사 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/instructor/students?courseId&page&pageSize` | 내 수강생 목록 |
| GET | `/api/admin/instructor/students/{id}/progress` | 수강생 진도 상세 |
| GET | `/api/admin/instructor/qna?courseId&status&page&pageSize` | 내 강의 Q&A 목록 |
| GET | `/api/admin/instructor/qna/{id}` | Q&A 상세 |
| POST | `/api/admin/instructor/qna/{id}/reply` | Q&A 답변 작성 |
| PUT | `/api/admin/instructor/qna/{id}/reply` | Q&A 답변 수정 |
| GET | `/api/admin/instructor/reviews?courseId&page&pageSize` | 내 강의 수강평 목록 |
| POST | `/api/admin/instructor/reviews/{id}/reply` | 수강평 답글 작성 |
| GET | `/api/admin/instructor/revenue?period&from&to` | 매출 추이 |
| GET | `/api/admin/instructor/settlements?month&page&pageSize` | 정산 내역 |
| GET | `/api/admin/instructor/publish-requests?status&page&pageSize` | 공개 요청 현황 |
| GET | `/api/admin/instructor/profile` | 강사 프로필 조회 |
| PUT | `/api/admin/instructor/profile` | 강사 프로필 수정 |

### 5.6 주문 — SUPER_ADMIN 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/orders?status&from&to&query&page&pageSize` | 목록 |
| GET | `/api/admin/orders/{id}` | 상세 |
| POST | `/api/admin/orders/{id}/refund` | 환불 처리 |

### 5.7 쿠폰 — SUPER_ADMIN 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/coupons?status&page&pageSize` | 목록 |
| POST | `/api/admin/coupons` | 생성 |
| POST | `/api/admin/coupons/bulk-issue` | 대량 발급 |
| DELETE | `/api/admin/coupons/{id}` | 삭제/비활성화 |

### 5.8 커뮤니티 — SUPER_ADMIN 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/posts?category&status&reported&page&pageSize` | 게시글 목록 |
| PATCH | `/api/admin/posts/{id}/status` | 게시글 상태 변경 |
| DELETE | `/api/admin/posts/{id}` | 게시글 삭제 |
| GET | `/api/admin/reports?status&page&pageSize` | 신고 목록 |
| PATCH | `/api/admin/reports/{id}` | 신고 처리 |
| GET | `/api/admin/community/categories` | 카테고리 목록 |
| POST | `/api/admin/community/categories` | 카테고리 생성 |
| PUT | `/api/admin/community/categories/{id}` | 카테고리 수정 |
| DELETE | `/api/admin/community/categories/{id}` | 카테고리 삭제 |

### 5.9 고객센터 — SUPER_ADMIN / CS_AGENT

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/tickets?status&page&pageSize` | 문의 목록 |
| GET | `/api/admin/tickets/{id}` | 문의 상세 |
| POST | `/api/admin/tickets/{id}/reply` | 답변 작성 |
| GET | `/api/admin/notices?page&pageSize` | 공지 목록 |
| POST | `/api/admin/notices` | 공지 작성 |
| PUT | `/api/admin/notices/{id}` | 공지 수정 |
| DELETE | `/api/admin/notices/{id}` | 공지 삭제 |
| GET | `/api/admin/faq?category` | FAQ 목록 |
| POST | `/api/admin/faq` | FAQ 생성 |
| PUT | `/api/admin/faq/{id}` | FAQ 수정 |
| DELETE | `/api/admin/faq/{id}` | FAQ 삭제 |

### 5.10 콘텐츠 — SUPER_ADMIN 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/banners` | 배너 목록 |
| POST | `/api/admin/banners` | 배너 생성 |
| PUT | `/api/admin/banners/{id}` | 배너 수정 |
| DELETE | `/api/admin/banners/{id}` | 배너 삭제 |
| PATCH | `/api/admin/banners/order` | 배너 순서 변경 |

### 5.11 통계

| Method | Endpoint | 설명 | 역할 |
|--------|----------|------|------|
| GET | `/api/admin/analytics/signups?period&from&to` | 가입 통계 | SUPER_ADMIN |
| GET | `/api/admin/analytics/enrollments?courseId&from&to` | 수강 통계 (전체) | SUPER_ADMIN |
| GET | `/api/admin/analytics/revenue?groupBy&from&to` | 매출 통계 (전체) | SUPER_ADMIN |
| GET | `/api/admin/analytics/courses/ranking?sort&limit` | 강의 순위 | SUPER_ADMIN |
| GET | `/api/admin/instructor/analytics/enrollments?courseId&from&to` | 내 강의 수강 통계 | INSTRUCTOR |
| GET | `/api/admin/instructor/analytics/revenue?groupBy&from&to` | 내 강의 매출 통계 | INSTRUCTOR |

### 5.12 시스템 — SUPER_ADMIN 전용

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/admins?page&pageSize` | 관리자/강사 목록 |
| POST | `/api/admin/admins` | 관리자/강사 생성 |
| PATCH | `/api/admin/admins/{id}/role` | 역할 변경 |
| GET | `/api/admin/roles` | 역할 목록 |
| PUT | `/api/admin/roles/{id}/permissions` | 권한 수정 |
| GET | `/api/admin/publish-requests?status&page&pageSize` | 강의 공개 승인 대기 목록 |
| GET | `/api/admin/logs?adminId&action&from&to&page&pageSize` | 활동 로그 |

---

## 6. 인증/권한 구조

### 전체 흐름

```
[브라우저 — 관리자/강사/CS담당]
    │
    ▼
[Admin Next.js] ── middleware.ts ── JWT 검증 (httpOnly Cookie)
    │                                  │
    │                           실패 → /login 리다이렉트
    │                                  │
    │                           성공 → JWT에서 role 추출
    │                                  │
    │                           역할별 라우트 보호 (허용 목록 체크)
    │                                  │
    │                           비허용 라우트 → 역할별 기본 페이지로 리다이렉트
    │
    ▼
[Route Handler /api/proxy/...] ── Authorization 헤더 부착 → [Spring Backend]
                                                              │
                                                       role 검증 (SUPER_ADMIN / INSTRUCTOR / CS_AGENT)
                                                              │
                                                       INSTRUCTOR → 데이터 스코프 자동 필터링
                                                              │
                                                         응답 반환
```

### 역할 정의

| 역할 | 코드 | 설명 | 권한 범위 |
|------|------|------|----------|
| 슈퍼관리자 | `SUPER_ADMIN` | 플랫폼 전체를 운영하는 최고 권한자 | 전체 접근 + 계정/역할/승인 관리 |
| 강사 | `INSTRUCTOR` | 본인 강의를 제작·관리하고 수강생과 소통하는 역할 | 본인 강의 CRUD + 수강생/Q&A/수강평/매출·정산 |
| CS 담당 | `CS_AGENT` | 고객 문의를 처리하고 공지/FAQ를 관리하는 역할 | 고객센터(문의/공지/FAQ) + 회원 조회(수정 불가) |

### 로그인 후 역할별 자동 리다이렉트

```
로그인 성공 → JWT의 role 확인 → 역할별 기본 페이지로 리다이렉트

  SUPER_ADMIN  → /dashboard          (전체 지표 대시보드)
  INSTRUCTOR   → /dashboard          (내 강의 지표 대시보드)
  CS_AGENT     → /support/tickets    (1:1 문의 목록)
```

> 대시보드 페이지(`/dashboard`)는 동일한 URL이지만, 역할에 따라 렌더링되는 위젯이 다르다.
> CS_AGENT는 대시보드 대신 바로 문의 목록으로 진입하여 업무 효율을 높인다.

### 역할별 접근 가능 라우트

| 라우트 | SUPER_ADMIN | INSTRUCTOR | CS_AGENT |
|--------|:-----------:|:----------:|:--------:|
| `/dashboard` | O | O | — |
| `/members/**` | O | — | O (읽기) |
| `/courses/**` | O | O (본인 강의) | — |
| `/instructor/**` | — | O | — |
| `/orders/**` | O | — | — |
| `/coupons/**` | O | — | — |
| `/community/**` | O | — | — |
| `/support/**` | O | — | O |
| `/content/**` | O | — | — |
| `/analytics/**` | O | O (내 강의 탭만) | — |
| `/settings/**` | O | — | — |

### 프론트 권한 처리 구현

1. **`middleware.ts`**: JWT 존재 여부 + 만료 체크 → 미인증 시 `/login` 리다이렉트.
   JWT에서 role을 디코딩하여 현재 라우트의 접근 허용 여부를 체크.
   비허용 시 역할별 기본 페이지로 리다이렉트 (403 대신 자연스러운 UX).

2. **`lib/permissions.ts`**: 역할별 접근 가능 라우트/기능 매핑.
   `canAccess(role, path)` — 라우트 접근 가능 여부.
   `canPerform(role, action)` — 특정 액션(삭제/승인/공개 등) 가능 여부.

3. **`data/permissionsData.json`**: 역할-라우트-기능 매핑 데이터.
   하드코딩 대신 data로 관리하여 역할 추가/변경 시 코드 수정 최소화.

4. **`components/common/RoleGuard.tsx`**: 페이지/섹션 단위 역할 체크 래퍼.
   미들웨어를 통과하더라도 클라이언트에서 이중 체크 (안전장치).

5. **`components/common/AdminSidebar.tsx`**: `sidebarData.json`의 `roles` 필드로 메뉴 필터링.

6. **페이지 내 조건부 렌더링**: 같은 페이지 내에서도 역할에 따라 버튼/컬럼을 숨김.
   예: 강의 목록에서 `INSTRUCTOR`는 "삭제"/"복제" 버튼이 보이지 않음.

### 보안 원칙

- **프론트 권한 체크는 UX 용도**. 실제 보안은 백엔드에서 JWT role + 리소스 소유자 검증으로 처리한다.
- 프론트에서 role을 변조해도 백엔드가 거부하므로, 프론트는 "보여줄지 말지"만 결정한다.
- `INSTRUCTOR`가 다른 강사의 강의 API를 호출하면 백엔드에서 403 반환.

---

## 7. 공유 요소 전략

기존 `lecture_frontend`와 admin 프로젝트 간 코드 공유 방안:

| 공유 대상 | 방법 | 비고 |
|-----------|------|------|
| **TypeScript 타입** | 공유 패키지 (`@lms/types`) 또는 초기에는 복사 | 엔티티 타입(Course, User, Order 등)은 동일 |
| **API 래퍼** | 패턴만 공유, 구현은 각각 | admin은 `/api/admin/` prefix 사용 |
| **스타일** | 완전 분리 | `lecture_frontend`는 SCSS + 자체 토큰, admin은 Tailwind + shadcn/ui |
| **UI 컴포넌트** | 완전 분리 | `lecture_frontend`는 자체 UI, admin은 shadcn/ui. 스타일 시스템이 달라 공유 불가 |

> **초기 권장**: 모노레포 없이 독립 레포로 시작하고, 공유가 필요해지면 타입 패키지부터 추출한다.
> 스타일/UI 컴포넌트는 두 프로젝트의 스타일 시스템이 다르므로 공유 대상에서 제외한다.

---

## 8. 사이드바 메뉴 구조 (역할별 필터링)

> `sidebarData.json`에서 각 메뉴 항목에 `roles` 배열을 지정하여 역할별로 필터링한다.
> `AdminSidebar.tsx`는 현재 사용자의 role에 따라 해당 메뉴만 렌더링한다.

### SUPER_ADMIN이 보는 메뉴 (전체)

```
📊 대시보드
👥 회원 관리
   ├─ 회원 목록
📚 강의 관리
   ├─ 강의 목록
   ├─ 강의 등록
💰 주문/결제
   ├─ 주문 목록
   ├─ 매출 통계
🎟️ 쿠폰/포인트
   ├─ 쿠폰 관리
   ├─ 포인트 정책
💬 커뮤니티
   ├─ 게시글 관리
   ├─ 신고 관리
   ├─ 카테고리/태그
📞 고객센터
   ├─ 1:1 문의
   ├─ 공지사항
   ├─ FAQ 관리
🖼️ 콘텐츠
   ├─ 배너 관리
   ├─ 팝업 관리
   ├─ 약관 관리
📈 통계/분석
   ├─ 가입 통계
   ├─ 수강 통계
   ├─ 매출 분석
⚙️ 설정
   ├─ 관리자/강사 계정
   ├─ 역할/권한
   ├─ 공개 승인 대기
   └─ 활동 로그
```

### INSTRUCTOR가 보는 메뉴

```
📊 대시보드                ← 내 강의 지표
📚 내 강의 관리
   ├─ 강의 목록            ← 본인 강의만
   ├─ 강의 등록
🎓 강사 메뉴
   ├─ 내 수강생
   ├─ Q&A 관리
   ├─ 수강평 관리
   ├─ 매출/정산
   ├─ 공개 요청 현황
   └─ 내 프로필 수정
📈 내 통계
   ├─ 수강 현황
   └─ 매출 분석
```

### CS_AGENT가 보는 메뉴

```
📞 고객센터              ← 기본 진입 페이지
   ├─ 1:1 문의
   ├─ 공지사항
   ├─ FAQ 관리
👥 회원 조회
   └─ 회원 목록 (읽기 전용)
```

### sidebarData.json 구조 예시

```jsonc
{
  "menu": [
    {
      "key": "dashboard",
      "label": "대시보드",
      "path": "/dashboard",
      "icon": "dashboard",
      "roles": ["SUPER_ADMIN", "INSTRUCTOR"]
    },
    {
      "key": "members",
      "label": "회원 관리",
      "icon": "users",
      "roles": ["SUPER_ADMIN", "CS_AGENT"],
      "children": [
        { "key": "members-list", "label": "회원 목록", "path": "/members" }
      ]
    },
    {
      "key": "courses",
      "label": "강의 관리",
      "icon": "book",
      "roles": ["SUPER_ADMIN", "INSTRUCTOR"],
      "children": [
        { "key": "courses-list", "label": "강의 목록", "path": "/courses" },
        { "key": "courses-new", "label": "강의 등록", "path": "/courses/new" }
      ]
    },
    {
      "key": "instructor",
      "label": "강사 메뉴",
      "icon": "graduation",
      "roles": ["INSTRUCTOR"],
      "children": [
        { "key": "inst-students", "label": "내 수강생", "path": "/instructor/students" },
        { "key": "inst-qna", "label": "Q&A 관리", "path": "/instructor/qna" },
        { "key": "inst-reviews", "label": "수강평 관리", "path": "/instructor/reviews" },
        { "key": "inst-revenue", "label": "매출/정산", "path": "/instructor/revenue" },
        { "key": "inst-requests", "label": "공개 요청 현황", "path": "/instructor/requests" },
        { "key": "inst-profile", "label": "내 프로필 수정", "path": "/instructor/profile" }
      ]
    },
    {
      "key": "orders",
      "label": "주문/결제",
      "icon": "wallet",
      "roles": ["SUPER_ADMIN"],
      "children": [
        { "key": "orders-list", "label": "주문 목록", "path": "/orders" }
      ]
    },
    {
      "key": "coupons",
      "label": "쿠폰/포인트",
      "icon": "ticket",
      "roles": ["SUPER_ADMIN"],
      "children": [
        { "key": "coupons-list", "label": "쿠폰 관리", "path": "/coupons" }
      ]
    },
    {
      "key": "community",
      "label": "커뮤니티",
      "icon": "message",
      "roles": ["SUPER_ADMIN"],
      "children": [
        { "key": "community-posts", "label": "게시글 관리", "path": "/community" },
        { "key": "community-reports", "label": "신고 관리", "path": "/community/reports" },
        { "key": "community-categories", "label": "카테고리/태그", "path": "/community/categories" }
      ]
    },
    {
      "key": "support",
      "label": "고객센터",
      "icon": "headset",
      "roles": ["SUPER_ADMIN", "CS_AGENT"],
      "children": [
        { "key": "support-tickets", "label": "1:1 문의", "path": "/support/tickets" },
        { "key": "support-notices", "label": "공지사항", "path": "/support/notices" },
        { "key": "support-faq", "label": "FAQ 관리", "path": "/support/faq" }
      ]
    },
    {
      "key": "content",
      "label": "콘텐츠",
      "icon": "image",
      "roles": ["SUPER_ADMIN"],
      "children": [
        { "key": "content-banners", "label": "배너 관리", "path": "/content/banners" },
        { "key": "content-popups", "label": "팝업 관리", "path": "/content/popups" },
        { "key": "content-terms", "label": "약관 관리", "path": "/content/terms" }
      ]
    },
    {
      "key": "analytics",
      "label": "통계/분석",
      "icon": "chart",
      "roles": ["SUPER_ADMIN", "INSTRUCTOR"],
      "children": [
        { "key": "analytics-signups", "label": "가입 통계", "path": "/analytics/members", "roles": ["SUPER_ADMIN"] },
        { "key": "analytics-courses", "label": "수강 통계", "path": "/analytics/courses" },
        { "key": "analytics-revenue", "label": "매출 분석", "path": "/analytics" }
      ]
    },
    {
      "key": "settings",
      "label": "설정",
      "icon": "settings",
      "roles": ["SUPER_ADMIN"],
      "children": [
        { "key": "settings-admins", "label": "관리자/강사 계정", "path": "/settings/admins" },
        { "key": "settings-roles", "label": "역할/권한", "path": "/settings/roles" },
        { "key": "settings-approvals", "label": "공개 승인 대기", "path": "/settings/approvals" },
        { "key": "settings-logs", "label": "활동 로그", "path": "/settings/logs" }
      ]
    }
  ]
}
```

---

## 9. 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│  AdminHeader (로고 · 검색 · 알림 · 프로필)            │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  Admin   │  AdminBreadcrumb                         │
│  Sidebar │  ─────────────────                       │
│          │                                          │
│  (메뉴)  │  페이지 콘텐츠                             │
│          │  (테이블 / 폼 / 차트 / 카드)               │
│          │                                          │
│          │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  (푸터 없음 — admin은 사이드바 고정 레이아웃)           │
└─────────────────────────────────────────────────────┘
```

- 사이드바: 접기/펼치기 지원 (아이콘 모드 ↔ 풀 모드)
- 헤더: 고정 (sticky)
- 메인 영역: 스크롤 독립

---

## 10. 구현 우선순위 (Phase)

### Phase 1 — 기반 + 핵심 (MVP)

> 가장 먼저 운영에 필요한 최소 기능. 역할 기반 라우팅/사이드바를 초기부터 구축.

| 순서 | 항목 | 주요 작업 |
|------|------|----------|
| 1 | 프로젝트 초기화 | Next.js 16 세팅, Tailwind CSS + shadcn/ui 초기화, 폴더 구조, ESLint, config |
| 2 | 인증 + 역할 라우팅 | 통합 로그인 페이지, JWT 미들웨어, **역할별 라우트 보호**, 역할별 리다이렉트, 토큰 갱신, 로그아웃 |
| 3 | 레이아웃 + 역할 사이드바 | 사이드바(**역할별 메뉴 필터링**) + 헤더 + 브레드크럼 + RoleGuard + 반응형 |
| 4 | 공통 UI (shadcn/ui) | shadcn/ui 컴포넌트 설치 (Button/Input/Dialog/Toast/Table/Badge/Tabs 등) + DataTable 조합 컴포넌트 |
| 5 | 대시보드 (역할별 위젯) | SUPER_ADMIN 전체 지표 + **INSTRUCTOR 내 강의 지표** + CS_AGENT 문의 지표 |
| 6 | 강의 관리 (역할별 스코프) | 목록(역할별 데이터 스코프) + 생성/수정 폼 + 커리큘럼 편집 + 영상 업로드 |
| 7 | 회원 관리 | 목록 + 상세 + 등급/상태 변경 (CS_AGENT 읽기 전용) |

### Phase 2 — 강사 전용 + 운영 확장

| 순서 | 항목 | 주요 작업 |
|------|------|----------|
| 8 | **강사 전용 — 수강생/Q&A** | 내 수강생 현황 + Q&A 목록/답변 + 수강평 관리 |
| 9 | **강사 전용 — 매출/정산** | 내 매출 추이 + 월별 정산 내역 + 공개 요청 현황 |
| 10 | **강의 공개 승인 플로우** | INSTRUCTOR 공개 요청 → SUPER_ADMIN 승인/반려 + 승인 대기 큐 |
| 11 | 주문/결제 | 주문 목록 + 상세 + 환불 처리 |
| 12 | 쿠폰/포인트 | 쿠폰 CRUD + 대량 발급 + 포인트 지급 |
| 13 | 고객센터 | 문의 답변 + 공지사항 CRUD + FAQ CRUD |

### Phase 3 — 콘텐츠 + 분석

| 순서 | 항목 | 주요 작업 |
|------|------|----------|
| 14 | 커뮤니티 관리 | 게시글/댓글 관리 + 신고 처리 + 카테고리 관리 |
| 15 | 콘텐츠 관리 | 배너 + 팝업 + 약관 |
| 16 | 통계/분석 (역할별 탭) | 가입/수강/매출 차트 + 강의 순위 (INSTRUCTOR는 내 강의 탭) |
| 17 | 강사 프로필 수정 | 강사 소개/이미지/SNS 링크 편집 |

### Phase 4 — 시스템 고도화

| 순서 | 항목 | 주요 작업 |
|------|------|----------|
| 18 | 관리자/강사 계정 | 계정 CRUD + 역할/권한 매트릭스 |
| 19 | 활동 로그 | 관리자·강사 작업 이력 조회 |
| 20 | 고도화 | 대량 작업(일괄 상태 변경), 엑셀 내보내기, 실시간 알림 |

---

## 11. 기존 프로젝트 정리

Admin 프로젝트 분리 후 기존 `lecture_frontend`에서 제거할 항목:

| 제거 대상 | 경로 |
|-----------|------|
| Admin 레이아웃 | `app/(admin)/layout.tsx` |
| 강의 편집 페이지 | `app/(admin)/admin/courses/[id]/page.tsx` |
| Admin 컨테이너 | `components/admin/AdminCourseEditContainer.tsx` |
| 영상 업로드 입력 | `components/admin/VideoUploadInput.tsx` |
| 업로드 진행률 | `components/admin/UploadProgress.tsx` |
| Admin 스타일 | `assets/styles/components/_admin-layout.scss` |
| Admin 스타일 | `assets/styles/components/_upload-progress.scss` |
| Admin 스타일 | `assets/styles/components/_video-upload.scss` |
| pagesData 중 admin 섹션 | `data/pagesData.json`의 `admin` 키 |

> `useUploadStore`, `lib/upload.ts`, 업로드 관련 타입은 admin에서만 사용하게 되면 함께 제거한다.

---

## 12. 환경 변수

```env
# .env.local
NEXT_PUBLIC_API_BASE=/api
BACKEND_API_BASE=http://localhost:8080
NEXT_PUBLIC_SITE_NAME=LMS Admin
NEXT_PUBLIC_ADMIN_DOMAIN=admin.example.com
```

---

## 13. 배포 구조 (권장)

```
사용자 사이트:  https://example.com        → lecture_frontend (Vercel/서버)
관리자 사이트:  https://admin.example.com   → lecture_admin (별도 Vercel/서버)
백엔드 API:    https://api.example.com     → Spring Boot (공유)
```

- 관리자 도메인은 IP 제한 또는 VPN 뒤에 배치 권장
- CORS 설정에 admin 도메인 추가 필요

---

## 14. 개발 원칙

> 기존 `lecture_frontend` 원칙을 계승하되, 스타일 시스템만 Tailwind + shadcn/ui로 변경.

1. **구조 = 코드, 내용 = data, 스타일 = Tailwind CSS + shadcn/ui** 분리 유지
2. **UI 텍스트 하드코딩 금지** — `data/*.json`에서 관리
3. **스타일은 Tailwind 유틸리티 클래스 사용** — inline style 금지, 임의의 CSS 파일 생성 금지
4. **shadcn/ui 우선 사용** — UI 컴포넌트가 필요하면 먼저 shadcn/ui에서 찾고, 없을 때만 직접 구현
5. **커스터마이징은 CSS 변수(`globals.css`)로** — shadcn/ui 테마 변경은 CSS 변수 수정으로 처리
6. **`cn()` 유틸 사용** — 조건부 클래스 조합 시 항상 `cn()` (clsx + tailwind-merge) 사용
7. **TypeScript strict mode** — `any` 금지
8. **과설계 금지** — 필요한 만큼만 구현
9. **접근성 기본 준수** — shadcn/ui가 Radix UI 기반이라 기본 a11y가 내장되어 있으나, aria-label 등 추가 속성은 data 기반으로 관리
10. **보안** — XSS/CSRF/인젝션 방지, 토큰 콘솔 노출 금지

### lecture_frontend과의 스타일 차이 정리

| | lecture_frontend (사용자 사이트) | lecture_admin (관리자) |
|---|---|---|
| **스타일 시스템** | SCSS + 자체 Design Token | Tailwind CSS 4 + CSS 변수 |
| **UI 컴포넌트** | 자체 구현 (components/ui/) | shadcn/ui (Radix UI 기반) |
| **테마 커스터마이징** | `_colors.scss` 등 토큰 파일 수정 | `globals.css`의 CSS 변수 수정 |
| **클래스 네이밍** | BEM/kebab-case | Tailwind 유틸리티 클래스 |
| **다크 모드** | `_dark.scss` 테마 파일 | Tailwind `dark:` + shadcn/ui 내장 |

> 두 프로젝트는 스타일 시스템이 다르므로, 스타일/UI 컴포넌트는 공유하지 않는다.
> Admin에서 shadcn/ui를 선택한 이유: 대시보드에 필요한 Table/Form/Dialog/Chart 등 복잡한 컴포넌트가 사전 구축되어 있어 개발 속도가 빠르다.
