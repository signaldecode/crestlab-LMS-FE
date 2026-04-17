# Backend API Contract (lecture-api)

> **Last synced**: 2026-04-16 (백엔드 커밋: `6df4674`)
> **Base URL**: `http://13.124.163.110:8083`
> **Proxy**: 프론트 `/api/proxy/v1/*` → 백엔드 `/api/v1/*`

---

## Changelog

| 날짜 | 변경 내용 | 백엔드 커밋 | 프론트 연동 |
|---|---|---|---|
| 2026-04-16 | 강좌 태그 관리 (`/tags`, `/admin/tags`) + `CourseCreate/UpdateRequest.tagIds` + `AdminCourseResponse.tags` | `6df4674` | O |
| 2026-04-16 | AWS MediaConvert 기반 HLS 인코딩 파이프라인 전환 + 관리자 미리보기 Signed URL (`GET /admin/videos/{videoId}/preview-url`) | `3ce423a` | O |
| 2026-04-16 | 내가 작성한 Q&A 목록 조회 (`GET /my/questions`) | `73f96ae` | O |
| 2026-04-16 | 내 후기 응답에 `courseThumbnailUrl` 필드 추가 + 메인 페이지(`/main/**`) 비로그인 공개 | `099274b` | O |
| 2026-04-16 | **[FE]** 관리자 회원 상세 — 포인트 잔액/내역 + 쿠폰 목록 3탭 연동 (/admin/users/{id}/points/summary, /history, /coupons) | - | O |
| 2026-04-16 | **[FE]** 메인 페이지 통합 API 연동 — banners/bestCourses/recommendedCourses/newCourses/instructors/topReviews | - | O |
| 2026-04-16 | **[FE]** 내 쿠폰 `isUsable` 필드 추가 + 보유중/사용불가/사용완료 3탭 분류 | - | O |
| 2026-04-15 | 메인 페이지 통합 API (`GET /main`) + BEST/RECOMMEND 큐레이션 | `9c9ba81` | O |
| 2026-04-15 | 1:1 문의(Inquiry) CRUD | `75557d1` | O |
| 2026-04-15 | Presigned URL 응답에 `publicUrl` 필드 추가 | `4f4cb61` | O |
| 2026-04-15 | 관리자 회원 상세 보강 + 포인트/쿠폰 조회 API | `62cf163` | O |
| 2026-04-15 | 강사 강좌 편집 권한 + 관리자 강사 배정 | `9992bb2` | O |
| 2026-04-15 | 관리자 커리큘럼 조회 API | `74e2f42` | O |
| 2026-04-15 | 관리자 쿠폰/포인트 관리 | `3b3b55e` | O |
| 2026-04-15 | 내 쿠폰 `isUsable` 필드 추가 | `be582c3` | O |
| 2026-04-14 | 회원가입 필드 확장 (name, gender, phone 필수) | `e6ef26f` | O |
| 2026-04-14 | 관리자 공지사항 CRUD | `48485ff` | O |
| 2026-04-14 | 공지 이미지 업로드 타입(NOTICE_IMAGE) 추가 | `051b789` | O |
| 2026-04-14 | 강사 소개 페이지 API | `a9a1fa7` | O |
| 2026-04-13 | 강사 지원하기 기능 | `e3e4e94` | O |
| 2026-04-13 | 강의 Q&A 질문/답변 | `b7f1243` | O |
| 2026-04-13 | 뉴스 RSS 자동 수집 | `3562e2a` | O |
| 2026-04-13 | SMS 휴대폰 인증으로 전환 (이메일 인증 제거) | `c1009fd` | O |

---

## 1. Auth (`/api/v1/auth`)

| Method | Path | 설명 | Request | Response |
|---|---|---|---|---|
| POST | `/sms/send` | SMS 인증코드 발송 | `{ phone, purpose }` | `{ code? }` (dev only) |
| POST | `/sms/verify` | SMS 코드 검증 | `{ phone, code, purpose }` | void |
| GET | `/email-check` | 이메일 중복확인 | `?email=` | `{ available }` |
| GET | `/nickname-check` | 닉네임 중복확인 | `?nickname=` | `{ available }` |
| POST | `/signup` | 회원가입 | SignupRequest | void |
| POST | `/login` | 로그인 (JWT 쿠키) | `{ email, password }` | LoginResponse |
| POST | `/refresh` | 토큰 재발급 (쿠키) | - | void |
| POST | `/logout` | 로그아웃 | - | void |
| POST | `/password-reset` | 비밀번호 재설정 | PasswordResetRequest | void |
| POST | `/find-email` | 이메일 찾기 | `{ name, phone }` | `{ maskedEmail }` |

### SmsPurpose
`SIGNUP` | `FIND_LOGIN_ID` | `RESET_PASSWORD`

### SignupRequest
```
email: string (필수, 이메일 형식, max 255)
password: string (필수, 8-20자, 영문+숫자+특수문자[@$!%*#?&])
nickname: string (필수, 2-30자, 한글/영문/숫자)
name: string (필수, 2-30자)
gender: 'MALE' | 'FEMALE' | 'NONE' (필수)
phone: string (필수, 01[016789]XXXXXXXX 형식)
```

### PasswordResetRequest
```
email: string
name: string
phone: string
newPassword: string
```

---

## 2. User Profile (`/api/v1/users`)

| Method | Path | 설명 | Request | Response |
|---|---|---|---|---|
| GET | `/me` | 내 프로필 | - | MyUserProfile |
| PUT | `/me/profile` | 프로필 수정 | UpdateMyProfileRequest | void |
| POST | `/me/verify-password` | 비밀번호 확인 | `{ password }` | void |
| GET | `/me/info` | 회원정보 조회 | - | MyUserInfo |
| PATCH | `/me/info` | 회원정보 수정 | UpdateMyInfoRequest | void |
| POST | `/me/withdraw` | 회원 탈퇴 | `{ password, withdrawalReason? }` | void |

### MyUserProfile
```
id: number
email: string
nickname: string
name: string
role: UserRole
phone: string | null
profileImageUrl: string | null
```

### MyUserInfo
```
nickname, name, email: string
gender: 'MALE' | 'FEMALE' | 'NONE' | null
createdAt, level: string
phone, birthDate: string | null
linkedSocialProviders: string[]
consent: { privacyAgreed, marketingEmailAgreed, marketingSmsAgreed: boolean }
```

### UpdateMyProfileRequest
```
nickname: string
bio?: string
profileImageUrl?: string
backgroundImageUrl?: string
featuredPostIds?: number[]
```

### UpdateMyInfoRequest
```
currentPassword?: string
newPassword?: string
gender?: Gender
phone?: string
birthDate?: string
marketingEmailAgreed: boolean
marketingSmsAgreed: boolean
```

---

## 3. Courses (`/api/v1/courses`)

| Method | Path | 설명 | Request | Response |
|---|---|---|---|---|
| GET | `/` | 강좌 목록 | `?categoryId&sort&page&size` | PageResponse\<CourseListItem\> |
| GET | `/{id}` | 강좌 상세 | - | CourseDetail |

### CourseSortType
`LATEST` | `POPULAR` | `PRICE_LOW` | `PRICE_HIGH` | `RATING`

### CourseListItem
```
id, enrollmentCount, reviewCount: number
title, thumbnailUrl: string
instructorNames: string[]
instructorProfileImageUrl: string | null
averageRating: number
tags: string[]
isFavorited: boolean
```

### CourseDetail (중첩 구조)
```
courseInfo: {
  id, price, enrollmentCount, maxEnrollmentCount?, reviewCount,
  totalLectureCount, totalDurationSeconds, favoriteCount: number
  title, description, thumbnailUrl, level: string
  detailContent, categoryName, saleStartAt, saleEndAt, publishedAt: string | null
  categoryId: number | null
  discountPrice, monthPlan: number | null
  averageRating: number
  isEnrollmentFull, isFavorited: boolean
  tags: string[]
}
instructors: [{
  id: number, name: string, profileImageUrl?: string,
  specialty?: string, isFollowing: boolean
}]
curriculum: {
  sections: [{ id, title, lectures: [{ id, title, durationSeconds, isPreview }] }]
  totalLectureCount, totalDurationSeconds: number
}
bestReviews: CourseReviewItem[]
reviews: PageResponse<CourseReviewItem>
recommendedCourses: [{ id, title, thumbnailUrl, instructorName?, averageRating, reviewCount }]
learningPolicy, refundPolicy: string | null
```

---

## 4. Categories (`/api/v1/categories`)

| Method | Path | 설명 | Response |
|---|---|---|---|
| GET | `/` | 카테고리 트리 | `[{ id, name, children: [...] }]` |

---

## 4-b. Tags (`/api/v1/tags`)

공개 조회(비로그인 허용). 강좌 등록/수정 화면의 태그 선택 드롭다운 용. 백엔드는 이름 오름차순으로 반환.

| Method | Path | 설명 | Response |
|---|---|---|---|
| GET | `/` | 태그 전체 목록 | `TagResponse[]` |

### TagResponse
```
id: number
name: string
```

---

## 5. Reviews (`/api/v1`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/courses/{courseId}/reviews` | 강좌 수강후기 목록 (`?sort&page&size`) |
| POST | `/courses/{courseId}/reviews` | 후기 작성 (진도 10% 이상) |
| PUT | `/reviews/{id}` | 후기 수정 |
| DELETE | `/reviews` | 후기 삭제 (body: `number[]`) |
| POST | `/reviews/{id}/like` | 좋아요 토글 |
| GET | `/enrollments/reviews` | 내가 쓴 후기 (`?page&size`) |

### CourseReviewItem
```
id, rating: number
content, nickname, createdAt: string
userId?, likeCount?: number
profileImageUrl?: string | null
```

### MyReviewResponse (GET /enrollments/reviews)
```
id, courseId, rating: number
courseTitle: string
courseThumbnailUrl: string    ← 2026-04-16 추가
content: string               ← 50자 초과 시 말줄임
createdAt: string
```

### CreateReviewRequest
```
rating: number
content: string
```

---

## 6. Enrollments (`/api/v1`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/enrollments` | 내 수강 목록 |
| GET | `/enrollments/{id}` | 수강 상세 (진도 포함) |
| POST | `/courses/{courseId}/enroll` | 무료 강좌 수강 신청 |
| POST | `/enrollments/{enrollmentId}/progresses/{lectureId}` | 강의 완료 처리 |
| GET | `/enrollments/{enrollmentId}/period` | 수강 기간 조회 |

### EnrollmentStatus
`ACTIVE` | `COMPLETED` | `EXPIRED` | `CANCELED`

### EnrollmentDetail
```
id, courseId, progressPercent, totalLectureCount, completedLectureCount: number
courseTitle, thumbnailUrl, status, startedAt: string
instructorNames: string[]
categoryName, expiresAt, completedAt: string | null
progresses: [{
  lectureId: number, lectureTitle: string,
  isCompleted: boolean, lastPositionSeconds: number,
  completedAt: string | null
}]
```

### EnrollmentPeriod
```
id: number
status: EnrollmentStatus
startedAt: string
expiresAt: string | null
remainingDays: number | null
```

---

## 7. Favorites (`/api/v1`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/favorites` | 내 즐겨찾기 (`?page&size`) |
| POST | `/courses/{courseId}/favorite` | 즐겨찾기 토글 |

---

## 8. Coupons / Points (`/api/v1`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/coupons` | 내 쿠폰 목록 |
| POST | `/coupons/register` | 쿠폰 코드 등록 (`{ code }`) |
| GET | `/points` | 포인트 요약 |
| GET | `/points/histories` | 포인트 내역 (`?type&page&size`) |

### UserCoupon
```
userCouponId, couponId: number
couponName, discountInfo, startsAt, expiresAt: string
isUsed: boolean
isUsable: boolean     ← 2026-04-15 추가 (활성/만료/수량/사용 종합 판단)
```

### PointSummary
```
totalPoints: number
expiringPoints: number
```

### PointHistory
```
id, amount: number
type: 'EARN' | 'USE' | 'EXPIRE'
description, createdAt: string
```

---

## 9. Payments (`/api/v1/payments`)

| Method | Path | 설명 |
|---|---|---|
| POST | `/orders` | 주문 생성 |
| POST | `/confirm` | 결제 승인 (Toss) |
| GET | `/history` | 결제 내역 |
| GET | `/orders/{orderId}` | 주문 상세 |
| POST | `/refund` | 환불 요청 (7일/10% 제한) |

### CreateOrderRequest / Response
```
Request:  { courseId, userCouponId?, usePoints? }
Response: { orderId, orderNumber, courseName,
            originalAmount, discountAmount, couponDiscountAmount,
            pointAmount, finalAmount }
```

### ConfirmPaymentRequest / Response
```
Request:  { paymentKey, orderId, amount }
Response: { orderId, orderNumber, paymentKey, amount, method, status, approvedAt }
```

### RefundRequest / Response
```
Request:  { orderNumber, reason }
Response: { orderId, orderNumber, refundAmount, refundReason, refundedAt }
```

---

## 10. Streaming (`/api/v1/streaming`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/lectures/{lectureId}/signed-url` | CloudFront 서명 URL 발급 (HLS Wildcard Signed URL) |
| GET | `/lectures/{lectureId}/playback-position` | 마지막 재생 위치 |
| POST | `/lectures/{lectureId}/playback-position` | 재생 위치 저장 (`{ positionSeconds }`) |

### SignedUrlResponse
```
signedUrl: string
expiresIn: number
```

> **2026-04-16 인코딩 파이프라인 변경**: 기존 Mock 인코딩이 AWS MediaConvert로 전환됨.
> Job 등록 후 `EncodingStatusPollingScheduler`가 주기적으로 상태를 갱신하므로,
> `POST /admin/videos/{videoId}/encode` 호출 직후 `encodingStatus`는 `PROCESSING`이며
> 실제 완료(`COMPLETED`)까지는 수 분 소요될 수 있음 → 프론트는 `/encoding-status` 폴링 필요.
> 응답 계약은 변경 없음.

### PlaybackPosition
```
lastPositionSeconds: number
durationSeconds: number
isCompleted: boolean
```

---

## 11. News (`/api/v1/news`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | 뉴스 목록 (`?category&page&size`) |

### NewsCategory
`STOCKS` | `CRYPTO` | `REAL_ESTATE`

### NewsItem
```
id: number
title, summary, thumbnailUrl, sourceUrl, source, publishedAt: string
category: NewsCategory
```

---

## 12. Q&A (`/api/v1`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/courses/{courseId}/questions` | 강좌 Q&A 목록 (`?page&size`) |
| GET | `/questions/{id}` | Q&A 상세 (답변 포함) |
| POST | `/courses/{courseId}/questions` | 질문 작성 |
| PUT | `/questions/{id}` | 질문 수정 |
| DELETE | `/questions/{id}` | 질문 삭제 |
| POST | `/questions/{id}/answers` | 답변 작성 |
| PUT | `/questions/{id}/answers/{answerId}` | 답변 수정 |
| DELETE | `/questions/{id}/answers/{answerId}` | 답변 삭제 |
| GET | `/my/questions` | 내가 작성한 Q&A 목록 (`?page&size`, 최신순) — 2026-04-16 추가 |

### QuestionStatus
`WAITING` | `ANSWERED`

### QuestionResponse
```
id, courseId, viewCount: number
courseTitle, nickname, title, createdAt: string
status: QuestionStatus
```

---

## 13. Instructors (`/api/v1/instructors`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | 강사 목록 (`?category&page&size`) |
| GET | `/{id}` | 강사 상세 |

### InstructorListItem
```
instructorId: number
name, specialty?, career?: string
profileImageUrl: string | null
mainCourses: [{ courseId, title, thumbnailUrl }]
```

### InstructorDetail
```
instructorId, followerCount: number
name, specialty?, career?, description?: string
mainAchievements?: string         // 주요이력 — 줄바꿈/세미콜론 구분 (선택)
cumulativeIncome?: number         // 누적 수익(원) — stat 칩 노출 (선택)
profileImageUrl: string | null
isFollowing: boolean
representativeCourses: [{
  courseId, price, reviewCount, enrollmentCount: number
  title, thumbnailUrl, level?: string, categoryName?: string
  discountPrice?: number, averageRating: number
}]
```

---

## 14. Instructor Applications (`/api/v1/instructor-applications`)

| Method | Path | 설명 |
|---|---|---|
| POST | `/` | 강사 지원 |
| GET | `/me` | 내 지원 상태 |

### InstructorApplicationRequest
```
name, phone, specialty, career, lecturePlan: string
```

### InstructorApplicationStatus
`PENDING` | `APPROVED` | `REJECTED`

---

## 15. Notices (`/api/v1/notices`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | 공지 목록 (`?page&size`) |
| GET | `/{id}` | 공지 상세 |

---

## 16. FAQ (`/api/v1/faqs`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | FAQ 목록 (`?category`) |

---

## 17. Search (`/api/v1/search`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | 통합 검색 (`?keyword`) |
| GET | `/courses` | 강좌 검색 (`?keyword&page&size`) |
| GET | `/users` | 유저 검색 (`?keyword&page&size`) |

---

## 18. Inquiries - 1:1 문의 (`/api/v1/inquiries`)

| Method | Path | 설명 |
|---|---|---|
| POST | `/` | 문의 작성 |
| GET | `/my` | 내 문의 목록 (`?status&page&size`) |
| GET | `/{id}` | 문의 상세 |
| DELETE | `/{id}` | 문의 삭제 (WAITING만) |

### InquiryCategory
`COURSE` | `PAYMENT` | `INSTRUCTOR` | `SERVICE` | `ETC`

### InquiryStatus
`WAITING` | `ANSWERED`

### InquiryCreateRequest
```
category: InquiryCategory (필수)
title: string (필수, max 200)
content: string (필수)
attachmentUrls?: string[] (최대 3)
```

### InquiryDetail
```
id: number
category: InquiryCategory
title, content, createdAt, updatedAt: string
status: InquiryStatus
authorNickname: string | null
attachmentUrls: string[]
answer: {
  id: number
  adminNickname, content, createdAt, updatedAt: string
} | null
```

---

## 19. Main Page (`/api/v1/main`)

| Method | Path | 설명 |
|---|---|---|
| GET | `/` | 홈 통합 데이터 (Redis 5분 캐시) |

### 프론트 연동 (2026-04-16)
- `lib/userApi.ts` → `fetchMainPage()` (타입: `MainPageResponse`)
- `components/home/MainPageProvider.tsx` → React Context, `useMainPage()` 훅으로 자식 공유 (1번만 fetch)
- `app/(site)/page.tsx` → `<MainPageProvider>` 로 홈 전체 wrap
- 사용 컴포넌트:
  - `HomeHeroContainer` ← `banners` (PC/모바일 분기, linkUrl)
  - `HomeMainCurations` (`HomeBestCourses` / `HomeRecommendedCourses` / `HomeNewCourses`) ← `bestCourses` / `recommendedCourses` / `newCourses`
  - `HomeInstructors` ← `instructors` (메타는 정적)
  - `BestReviewContainer` ← `topReviews` (메타/통계는 정적)
- **사용하지 않는 필드**: `categories` (프론트는 정적 아이콘 매핑 필요), `latestNews` (sourceUrl 누락 → 별도 `/v1/news` 호출 유지)

### MainPageResponse
```
banners: [{
  id: number, title, pcImageUrl, mobileImageUrl, linkUrl: string
}]
categories: [{
  id: number, name: string
}]
bestCourses: CourseCard[]        ← 최대 9개, 관리자 큐레이션 우선 → fallback: 수강생수
recommendedCourses: CourseCard[] ← 최대 9개, 관리자 큐레이션 우선 → fallback: 평점
newCourses: CourseCard[]         ← 최대 9개, 발행일 DESC
topReviews: [{                   ← 최대 20개
  id, rating: number
  nickname, content, createdAt: string
}]
instructors: [{                  ← 최대 8명 (발행 강좌 1+ 보유)
  id: number
  name, profileImageUrl?, specialty?: string
}]
latestNews: [{                   ← 최대 8개
  id: number
  title, thumbnailUrl?, publishedAt: string
  category: NewsCategory
}]
```

### CourseCard (bestCourses / recommendedCourses / newCourses 공통)
```
courseId: number
thumbnailUrl, title: string
averageRating: number
reviewCount: number
instructorNames: string[]
tags: string[]
```

---

## 20. Uploads (`/api/v1/uploads`)

| Method | Path | 설명 |
|---|---|---|
| POST | `/presigned-url` | S3 업로드 URL 발급 |

### UploadType
`VIDEO` | `THUMBNAIL` | `PROFILE_IMAGE` | `BACKGROUND_IMAGE` | `NOTICE_IMAGE`

### PresignedUrlRequest
```
filename: string
contentType: string
uploadType: UploadType
```

### PresignedUrlResponse
```
presignedUrl: string
s3Key: string
publicUrl: string | null    ← 이미지만 값 있음, VIDEO는 null
expiresIn: number
```

---

---

# Admin API (`/api/v1/admin`)

> 모든 Admin API는 ADMIN 또는 INSTRUCTOR 권한 필요

## A1. Dashboard

| Method | Path | 설명 |
|---|---|---|
| GET | `/dashboard` | 대시보드 통계 |

---

## A2. Courses (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/courses` | 강좌 목록 (`?status&categoryId&keyword&page&size`) |
| GET | `/courses/{id}` | 강좌 상세 |
| POST | `/courses` | 강좌 생성 |
| PUT | `/courses/{id}` | 강좌 수정 |
| PUT | `/courses/{id}/status` | 상태 변경 (DRAFT→PUBLISHED→HIDDEN) |
| GET | `/courses/my` | 강사 본인 강좌 (INSTRUCTOR) |
| GET | `/courses/{courseId}/curriculum` | 커리큘럼 트리 |
| POST | `/courses/{courseId}/instructors` | 강사 배정 |
| DELETE | `/courses/{courseId}/instructors/{instructorId}` | 강사 해제 |

### AdminCourseStatus
`DRAFT` | `PUBLISHED` | `HIDDEN`

### AdminCourseLevel
`BEGINNER` | `INTERMEDIATE` | `ADVANCED`

### AdminCourseDetail
```
id, price, enrollmentCount, reviewCount,
totalDurationSeconds, totalLectureCount: number
title, categoryName, status, level, createdAt, updatedAt: string
categoryId: number
description, thumbnailUrl, publishedAt: string | null
instructorNames: string[]
tags: TagResponse[]               ← 2026-04-16 추가 ({id, name}[])
averageRating: number
```

### AdminCourseCreateRequest / AdminCourseUpdateRequest
`tagIds?: number[]` — 선택. 수정 시 전달하면 기존 태그 연결이 이 목록으로 교체된다. (2026-04-16 추가)

### AdminCurriculumResponse
```
courseId: number
courseTitle: string
sections: [{
  id, sortOrder: number
  title: string
  lectures: [{
    id, sortOrder, durationSeconds: number
    title: string
    isPreview: boolean
    video: {
      id, durationSeconds: number
      encodingStatus: string    ← PENDING | PROCESSING | COMPLETED | FAILED
      originalFilename: string
    } | null
  }]
}]
```

### AssignInstructorRequest
```
instructorId: number (필수)
sortOrder: number (필수, >= 0)
```

---

## A3. Sections CRUD

| Method | Path | 설명 |
|---|---|---|
| POST | `/courses/{courseId}/sections` | 섹션 생성 |
| PUT | `/courses/{courseId}/sections/{id}` | 섹션 수정 |
| DELETE | `/courses/{courseId}/sections/{id}` | 섹션 삭제 |
| PUT | `/courses/{courseId}/sections/order` | 섹션 순서 변경 |

---

## A4. Lectures CRUD

| Method | Path | 설명 |
|---|---|---|
| POST | `/sections/{sectionId}/lectures` | 강의 생성 |
| PUT | `/sections/{sectionId}/lectures/{id}` | 강의 수정 |
| DELETE | `/sections/{sectionId}/lectures/{id}` | 강의 삭제 |
| PUT | `/sections/{sectionId}/lectures/order` | 강의 순서 변경 |

---

## A5. Videos

| Method | Path | 설명 |
|---|---|---|
| POST | `/videos` | 비디오 등록 |
| POST | `/videos/{videoId}/encode` | 인코딩 시작 (MediaConvert Job 등록) |
| GET | `/videos/{videoId}/encoding-status` | 인코딩 상태 확인 (`PENDING`\|`PROCESSING`\|`COMPLETED`\|`FAILED`) |
| POST | `/videos/{videoId}/re-encode` | 재인코딩 |
| GET | `/videos/{videoId}/preview-url` | 관리자 미리보기 Signed URL — 2026-04-16 추가 (강의 연결/수강 무관, `COMPLETED`만) |
| PUT | `/lectures/{lectureId}/video` | 비디오-강의 연결 |

### 관리자 미리보기 (`GET /admin/videos/{videoId}/preview-url`)
- 응답: `SignedUrlResponse` (Section 10과 동일 스키마)
- 404: 영상이 없거나 인코딩 미완료(`COMPLETED` 아님, `hlsS3Path` null 포함)
- 용도: 업로드/인코딩 직후 강의 연결 전에 관리자/강사가 결과물 검증

---

## A6. Categories CRUD

| Method | Path | 설명 |
|---|---|---|
| GET | `/categories` | 카테고리 트리 |
| POST | `/categories` | 생성 |
| PUT | `/categories/{id}` | 수정 |
| DELETE | `/categories/{id}` | 삭제 |
| PUT | `/categories/order` | 순서 변경 |

---

## A6-b. Tags CRUD — 2026-04-16 추가

권한: ADMIN. 평면 구조(부모/자식 없음). 태그 삭제 시 `course_tags` 매핑은 함께 제거되며 강좌 자체는 유지된다.

| Method | Path | 설명 | Request | Response |
|---|---|---|---|---|
| GET | `/tags` | 태그 전체 목록 | - | `TagResponse[]` |
| POST | `/tags` | 태그 생성 (이름 중복 시 409 `TAG_002`) | `{ name }` | `TagResponse` (201) |
| PUT | `/tags/{id}` | 태그 이름 수정 (404 `TAG_001` / 409 `TAG_002`) | `{ name }` | `TagResponse` |
| DELETE | `/tags/{id}` | 태그 삭제 (404 `TAG_001`) | - | void (204) |

### TagRequest (create/update 공용)
```
name: string (필수, max 50)
```

### 에러 코드
- `TAG_001` — 태그 없음 (404)
- `TAG_002` — 이미 사용 중인 태그 이름 (409)

### 프론트 연동 (2026-04-16)
- `lib/adminApi.ts`: `fetchPublicTags`, `fetchAdminTags`, `createAdminTag`, `updateAdminTag`, `deleteAdminTag` + `AdminTagNode` 타입
- `components/admin/tags/AdminTagListContainer.tsx` — 목록/생성/수정/삭제 UI
- `app/(admin)/admin/tags/page.tsx` — `/admin/tags` 관리 페이지
- 강좌 폼(`AdminCourseFormContainer`)에 태그 체크박스 추가 — 강사도 공개 `/v1/tags` 로 조회

---

## A7. Users (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/users` | 회원 목록 (`?keyword&role&status&page&size`) |
| GET | `/users/{id}` | 회원 상세 (수강/결제 내역 포함) |
| PUT | `/users/{id}/role` | 역할 변경 |
| POST | `/users/{id}/deactivate` | 회원 비활성화 |
| GET | `/users/{id}/points/summary` | 회원 포인트 요약 |
| GET | `/users/{id}/points/history` | 회원 포인트 내역 (`?type&page&size`) |
| GET | `/users/{id}/coupons` | 회원 쿠폰 목록 |

### 프론트 연동 (2026-04-16)
- `lib/adminApi.ts`:
  - `fetchAdminUserPointSummary(userId)` → `{ totalPoints, expiringPoints }`
  - `fetchAdminUserPointHistory(userId, { type?, page?, size? })` → PageResponse
  - `fetchAdminUserCoupons(userId)` → `AdminUserCoupon[]` (isUsable 포함)
- 사용 컴포넌트:
  - `components/admin/points/AdminUserPointsPanel.tsx` — 포인트 탭 (잔액/소멸예정 + 적립/사용/소멸 내역 + 수동 조정)
  - `components/admin/users/AdminUserCouponsPanel.tsx` — 쿠폰 탭 (보유중/사용불가/사용완료 3탭)
- `AdminUserDetail` 타입에서 `pointBalance` 필드 제거 (summary API로 대체)

### AdminUserDetail (확장됨 - 2026-04-15)
```
id: number
email, nickname, name, phone: string
birthDate: string (LocalDate)
gender: Gender
profileImageUrl: string | null
role: UserRole, level: UserLevel, status: UserStatus
createdAt: string
enrollments: [{ enrollmentId, courseTitle, progressPercent, startedAt }]
payments: [{ orderId, courseTitle, amount, status, paidAt }]
```

### UserRole
`STUDENT` | `INSTRUCTOR` | `ADMIN`

### UserLevel
`Lv1` ~ `Lv10`

### UserStatus
`ACTIVE` | `WITHDRAWN` | `SUSPENDED`

---

## A8. Payments (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/payments` | 주문 목록 (`?status&userId&page&size`) |
| POST | `/payments/refund` | 환불 처리 |
| POST | `/payments/manual-enroll` | 수동 수강 등록 |

---

## A9. Banners

| Method | Path | 설명 |
|---|---|---|
| GET | `/banners` | 목록 |
| POST | `/banners` | 생성 |
| PUT | `/banners/{id}` | 수정 |
| DELETE | `/banners/{id}` | 삭제 |
| PUT | `/banners/order` | 순서 변경 |

---

## A10. Main Sections (홈 섹션)

| Method | Path | 설명 |
|---|---|---|
| GET | `/main-sections` | 목록 |
| POST | `/main-sections` | 생성 |
| PUT | `/main-sections/{id}` | 수정 |
| DELETE | `/main-sections/{id}` | 삭제 |

---

## A11. Success Stories

| Method | Path | 설명 |
|---|---|---|
| GET | `/success-stories` | 목록 |
| POST | `/success-stories` | 생성 |
| PUT | `/success-stories/{id}` | 수정 |
| DELETE | `/success-stories/{id}` | 삭제 |

---

## A12. Coupons (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/coupons` | 목록 |
| POST | `/coupons` | 생성 |
| PUT | `/coupons/{id}` | 수정 |
| DELETE | `/coupons/{id}` | 삭제 |
| POST | `/coupons/{id}/deactivate` | 비활성화 |
| POST | `/coupons/{id}/issue` | 유저에게 발급 (`{ userId }`) |

---

## A13. Points (관리자)

| Method | Path | 설명 |
|---|---|---|
| POST | `/points/adjust` | 포인트 수동 조정 (`{ userId, amount, reason }`) |

---

## A14. FAQ (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/faqs` | 목록 (`?category`) |
| GET | `/faqs/{id}` | 상세 |
| POST | `/faqs` | 생성 |
| PUT | `/faqs/{id}` | 수정 |
| DELETE | `/faqs/{id}` | 삭제 |

---

## A15. Terms (약관)

| Method | Path | 설명 |
|---|---|---|
| GET | `/terms/current` | 현재 약관 (`?type`) |
| GET | `/terms/history` | 약관 이력 (`?type`) |
| POST | `/terms` | 약관 버전 생성 |

### TermsType
`PRIVACY` | `SERVICE` | `MARKETING`

---

## A16. Levels (등급)

| Method | Path | 설명 |
|---|---|---|
| GET | `/levels` | 등급 기준 목록 |
| PUT | `/levels/{level}` | 등급 기준 수정 |
| POST | `/levels/refresh` | 전체 유저 등급 재계산 |

---

## A17. Reviews (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/reviews` | 목록 (`?courseId&userId&page&size`) |
| DELETE | `/reviews/{id}` | 삭제 |

---

## A18. Notices (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/notices` | 목록 (`?page&size`) |
| GET | `/notices/{id}` | 상세 |
| POST | `/notices` | 생성 |
| PUT | `/notices/{id}` | 수정 |
| DELETE | `/notices/{id}` | 삭제 |

---

## A19. Instructor Applications (관리자)

| Method | Path | 설명 |
|---|---|---|
| GET | `/instructor-applications` | 목록 (`?status&page&size`) |
| GET | `/instructor-applications/{id}` | 상세 |
| PATCH | `/instructor-applications/{id}/approve` | 승인 |
| PATCH | `/instructor-applications/{id}/reject` | 거절 (`{ reason }`) |

---

## A20. Instructor-User 연결

| Method | Path | 설명 |
|---|---|---|
| PUT | `/instructors/{instructorId}/user` | 유저 계정 연결 (`{ userId }`) |

---

## A21. News (관리자)

| Method | Path | 설명 |
|---|---|---|
| POST | `/news/rss/collect` | RSS 수동 수집 |

---

---

# 공통 응답 형식

### CommonResponse Wrapper
```json
{
  "success": true,
  "data": { ... },
  "message": "optional"
}
```

### PageResponse
```
content: T[]
page: number (1-based)
size: number
totalElements: number (snake_case: total_elements 도 호환)
totalPages: number
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사람이 읽을 수 있는 메시지"
  }
}
```

---

# 미연동 / 주의 사항

| 항목 | 상태 | 비고 |
|---|---|---|
| Notification API | 백엔드 명세 미정 | 백엔드 알림 엔드포인트 명세 확인 필요. 현재 프론트는 Zustand 스토어만 운영 (`stores/useNotificationStore.ts`) |
| Community API (`/community/*`) | 의도적 제외 | 기획 제외 — 연동/제안 금지 |
| `GET /api/v1/users/me/posts` | 의도적 제외 | 커뮤니티 제외 |
| `GET /api/v1/users/me/followers` | 의도적 제외 | 커뮤니티 제외 |
| `GET /api/v1/users/me/following` | 의도적 제외 | 커뮤니티 제외 |
| `MainPageResponse.categories` | 부분 사용 | 백엔드 데이터({id,name})에 아이콘/href 정보가 없어 정적 매핑 필요 |
| `MainPageResponse.latestNews` | 미사용 | sourceUrl/source 필드 없음 → 별도 `/v1/news` 호출 유지 |
