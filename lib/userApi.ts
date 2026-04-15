/**
 * 유저 API 클라이언트 (userApi.ts)
 * - /api/v1/* 유저쪽 엔드포인트 타입드 래퍼
 * - /api/proxy/v1/... 경로로 프록시되며 토큰은 자동 주입
 */

import type { UserRole } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export class UserApiError extends Error {
  readonly status: number;
  readonly payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'UserApiError';
    this.status = status;
    this.payload = payload;
  }
}

/** 백엔드 CommonResponse 래퍼 형태 */
interface CommonResponseSuccess<T> { success: true; data: T; message?: string }
interface CommonResponseError { success: false; error: { code: string; message: string } }
type CommonResponse<T> = CommonResponseSuccess<T> | CommonResponseError;

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, unknown> } = {},
): Promise<T> {
  const url = new URL(
    `${API_BASE}/proxy/${path}`,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
  );
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  const text = await res.text();
  const payload = text ? safeJson(text) : null;

  // 백엔드 CommonResponse 래퍼 unwrap
  if (payload && typeof payload === 'object' && 'success' in payload) {
    const wrapper = payload as CommonResponse<T>;
    if (wrapper.success) {
      return wrapper.data;
    }
    const msg = wrapper.error?.message || `User API Error: ${res.status}`;
    throw new UserApiError(msg, res.status, wrapper.error);
  }

  if (!res.ok) {
    throw new UserApiError(`User API Error: ${res.status}`, res.status, payload);
  }
  return payload as T;
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

/* ────────────────────────────────────────────
 *  Auth (SMS + Signup)
 * ────────────────────────────────────────────*/
export type SmsPurpose = 'SIGNUP' | 'FIND_LOGIN_ID' | 'RESET_PASSWORD';

export function sendSmsCode(phone: string, purpose: SmsPurpose): Promise<{ code?: string }> {
  return request<{ code?: string }>('v1/auth/sms/send', { method: 'POST', body: { phone, purpose } });
}

export function verifySmsCode(phone: string, code: string, purpose: SmsPurpose): Promise<void> {
  return request<void>('v1/auth/sms/verify', { method: 'POST', body: { phone, code, purpose } });
}

/** 회원가입 요청 — 백엔드 `SignupRequest`. name/gender 는 필수. */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'NONE';
  phone: string;
}

export function signup(body: SignupRequest): Promise<void> {
  return request<void>('v1/auth/signup', { method: 'POST', body });
}

/** 비밀번호 재설정 — 백엔드 `PasswordResetRequest`. SMS 인증 완료 후 호출. */
export interface PasswordResetRequest {
  email: string;
  name: string;
  phone: string;
  newPassword: string;
}

export function resetPassword(body: PasswordResetRequest): Promise<void> {
  return request<void>('v1/auth/password-reset', { method: 'POST', body });
}

/** 이메일 중복 확인 — `available: true` 면 사용 가능 */
export interface AvailabilityResult { available: boolean }

export function checkEmailAvailability(email: string): Promise<AvailabilityResult> {
  return request<AvailabilityResult>('v1/auth/email-check', { query: { email } });
}

export function checkNicknameAvailability(nickname: string): Promise<AvailabilityResult> {
  return request<AvailabilityResult>('v1/auth/nickname-check', { query: { nickname } });
}

/** 이메일 찾기 — 마스킹된 이메일 반환. SMS 인증(`purpose=FIND_LOGIN_ID`) 선행 필요 */
export function findEmail(body: { name: string; phone: string }): Promise<{ maskedEmail: string }> {
  return request<{ maskedEmail: string }>('v1/auth/find-email', { method: 'POST', body });
}

/** 토큰 재발급 (쿠키 기반 — body 없음) */
export function refreshToken(): Promise<void> {
  return request<void>('v1/auth/refresh', { method: 'POST' });
}

/** 로그아웃 (서버 쿠키 무효화) */
export function logoutApi(): Promise<void> {
  return request<void>('v1/auth/logout', { method: 'POST' });
}

/* ────────────────────────────────────────────
 *  Courses (public)
 * ────────────────────────────────────────────*/
export type CourseSortType = 'LATEST' | 'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING';

/**
 * 강좌 목록 카드 (백엔드 `CourseListResponse`)
 * - 카테고리/레벨/가격은 카드에서 제공하지 않음 (상세에만 존재). 카드는 평점/수강생수/태그 중심.
 */
export interface UserCourseListItem {
  id: number;
  title: string;
  instructorNames: string[];
  instructorProfileImageUrl: string | null;
  thumbnailUrl: string;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  tags: string[];
  isFavorited: boolean;
}

export interface UserCoursePageResponse {
  content: UserCourseListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserCourseListParams {
  categoryId?: number;
  sort?: CourseSortType;
  page?: number;
  size?: number;
}

export function fetchUserCourses(params: UserCourseListParams = {}): Promise<UserCoursePageResponse> {
  return request<UserCoursePageResponse>('v1/courses', { query: { ...params } });
}

/** 강좌 상세 — 백엔드 `CourseDetailResponse` (중첩 구조) */
export interface UserCourseInfo {
  id: number;
  title: string;
  description: string;
  detailContent: string | null;
  thumbnailUrl: string;
  categoryId: number | null;
  categoryName: string | null;
  level: string;
  price: number;
  discountPrice: number | null;
  saleStartAt: string | null;
  saleEndAt: string | null;
  monthPlan: number | null;
  enrollmentCount: number;
  maxEnrollmentCount: number | null;
  isEnrollmentFull: boolean;
  averageRating: number;
  reviewCount: number;
  totalLectureCount: number;
  totalDurationSeconds: number;
  favoriteCount: number;
  isFavorited: boolean;
  tags: string[];
  publishedAt: string | null;
}

export interface UserCourseInstructor {
  id: number;
  name: string;
  profileImageUrl: string | null;
  specialty: string | null;
  isFollowing: boolean;
}

export interface UserCourseCurriculumLecture {
  id: number;
  title: string;
  durationSeconds: number;
  isPreview: boolean;
}

export interface UserCourseCurriculumSection {
  id: number;
  title: string;
  lectures: UserCourseCurriculumLecture[];
}

export interface UserCourseCurriculum {
  sections: UserCourseCurriculumSection[];
  totalLectureCount: number;
  totalDurationSeconds: number;
}

export interface UserRecommendedCourse {
  id: number;
  title: string;
  thumbnailUrl: string;
  instructorName: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface UserCourseDetail {
  courseInfo: UserCourseInfo;
  instructors: UserCourseInstructor[];
  curriculum: UserCourseCurriculum;
  bestReviews: CourseReviewItem[];
  reviews: CourseReviewPageResponse;
  recommendedCourses: UserRecommendedCourse[];
  learningPolicy: string | null;
  refundPolicy: string | null;
}

export function fetchUserCourseById(id: number): Promise<UserCourseDetail> {
  return request<UserCourseDetail>(`v1/courses/${id}`);
}

/* ────────────────────────────────────────────
 *  Categories
 * ────────────────────────────────────────────*/
export interface UserCategory {
  id: number;
  name: string;
  children: UserCategory[];
}

export function fetchUserCategories(): Promise<UserCategory[]> {
  return request<UserCategory[]>('v1/categories');
}

/* ────────────────────────────────────────────
 *  Reviews
 * ────────────────────────────────────────────*/
export interface CourseReviewItem {
  id: number;
  userId?: number;
  rating: number;
  content: string;
  nickname: string;
  profileImageUrl?: string | null;
  likeCount?: number;
  createdAt: string;
}

export interface CourseReviewPageResponse {
  content: CourseReviewItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CourseReviewListParams {
  sort?: string;
  page?: number;
  size?: number;
}

export function fetchCourseReviews(
  courseId: number,
  params: CourseReviewListParams = {},
): Promise<CourseReviewPageResponse> {
  return request<CourseReviewPageResponse>(`v1/courses/${courseId}/reviews`, { query: { ...params } });
}

export interface CreateReviewRequest {
  rating: number;
  content: string;
}

export function createCourseReview(courseId: number, body: CreateReviewRequest): Promise<CourseReviewItem> {
  return request<CourseReviewItem>(`v1/courses/${courseId}/reviews`, { method: 'POST', body });
}

export function updateCourseReview(reviewId: number, body: CreateReviewRequest): Promise<CourseReviewItem> {
  return request<CourseReviewItem>(`v1/reviews/${reviewId}`, { method: 'PUT', body });
}

/** 리뷰 삭제 (일괄). 백엔드는 `DELETE /v1/reviews` body로 id 리스트를 받는다. */
export function deleteCourseReviews(reviewIds: number[]): Promise<void> {
  return request<void>('v1/reviews', { method: 'DELETE', body: reviewIds });
}

/** 단건 삭제 편의 래퍼 */
export function deleteCourseReview(reviewId: number): Promise<void> {
  return deleteCourseReviews([reviewId]);
}

/** 리뷰 좋아요 토글 */
export function toggleReviewLike(reviewId: number): Promise<void> {
  return request<void>(`v1/reviews/${reviewId}/like`, { method: 'POST' });
}

/* ────────────────────────────────────────────
 *  Enrollments
 * ────────────────────────────────────────────*/
/** 수강 목록 카드 (백엔드 `EnrollmentResponse`) — 진도율은 상세 엔드포인트에서 제공 */
export interface EnrollmentItem {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  instructorProfileImageUrl: string | null;
  instructorName: string | null;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  tags: string[];
}

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELED';

export interface EnrollmentProgressItem {
  lectureId: number;
  lectureTitle: string;
  isCompleted: boolean;
  lastPositionSeconds: number;
  completedAt: string | null;
}

/** 수강 상세 (`GET /v1/enrollments/{id}`) — 진도/상태 포함 */
export interface EnrollmentDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  instructorNames: string[];
  thumbnailUrl: string;
  categoryName: string | null;
  progressPercent: number;
  status: EnrollmentStatus;
  startedAt: string;
  expiresAt: string | null;
  completedAt: string | null;
  totalLectureCount: number;
  completedLectureCount: number;
  progresses: EnrollmentProgressItem[];
}

export function fetchMyEnrollments(): Promise<EnrollmentItem[]> {
  return request<EnrollmentItem[]>('v1/enrollments');
}

export function fetchEnrollmentDetail(enrollmentId: number): Promise<EnrollmentDetail> {
  return request<EnrollmentDetail>(`v1/enrollments/${enrollmentId}`);
}

export function enrollFreeCourse(courseId: number): Promise<EnrollmentItem> {
  return request<EnrollmentItem>(`v1/courses/${courseId}/enroll`, { method: 'POST' });
}

/**
 * 영상 수강 완료 처리 (백엔드: `POST /enrollments/{enrollmentId}/progresses/{lectureId}`, body 없음).
 * - 호출 시 해당 영상이 완료 처리되고 진도율이 재계산됨
 * - 재생 위치 저장은 `savePlaybackPosition` 사용
 */
export function markLectureCompleted(enrollmentId: number, lectureId: number): Promise<void> {
  return request<void>(
    `v1/enrollments/${enrollmentId}/progresses/${lectureId}`,
    { method: 'POST' },
  );
}

/** 레거시 호환 — progress 인자는 무시되고 완료 처리만 수행된다 */
export function markLectureProgress(enrollmentId: number, lectureId: number, _progress?: number): Promise<void> {
  return markLectureCompleted(enrollmentId, lectureId);
}

/* ────────────────────────────────────────────
 *  Favorites (Wishlist)
 * ────────────────────────────────────────────*/
/** 즐겨찾기 항목 (백엔드 `FavoriteResponse`) */
export interface FavoriteItem {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  instructorProfileImageUrl: string | null;
  instructorName: string | null;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  tags: string[];
}

export interface FavoritePageResponse {
  content: FavoriteItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function fetchMyFavorites(params: { page?: number; size?: number } = {}): Promise<FavoritePageResponse> {
  return request<FavoritePageResponse>('v1/favorites', { query: { ...params } });
}

/**
 * 즐겨찾기 토글 — 같은 POST 호출로 추가/해제가 결정된다 (백엔드 토글 방식).
 * 호환용으로 `addFavorite` / `removeFavorite` 도 제공하지만 모두 같은 POST 를 호출한다.
 */
export function toggleFavorite(courseId: number): Promise<void> {
  return request<void>(`v1/courses/${courseId}/favorite`, { method: 'POST' });
}

export const addFavorite = toggleFavorite;
export const removeFavorite = toggleFavorite;

/* ────────────────────────────────────────────
 *  Coupons / Points
 * ────────────────────────────────────────────*/
/**
 * 내 쿠폰 (백엔드 `UserCouponResponse`)
 * - 백엔드는 할인 정보를 단일 문자열(`discountInfo`, 예: "10% 할인")로 내려준다.
 */
export interface UserCoupon {
  userCouponId: number;
  couponId: number;
  couponName: string;
  discountInfo: string;
  startsAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export function fetchMyCoupons(): Promise<UserCoupon[]> {
  return request<UserCoupon[]>('v1/coupons');
}

export interface PointSummary {
  totalPoints: number;
  expiringPoints: number;
}

export function fetchMyPointSummary(): Promise<PointSummary> {
  return request<PointSummary>('v1/points');
}

export interface PointHistory {
  id: number;
  type: 'EARN' | 'USE' | 'EXPIRE';
  amount: number;
  description: string;
  createdAt: string;
}

export interface PointHistoryPageResponse {
  content: PointHistory[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function fetchMyPointHistories(
  params: { type?: string; page?: number; size?: number } = {},
): Promise<PointHistoryPageResponse> {
  return request<PointHistoryPageResponse>('v1/points/histories', { query: { ...params } });
}

/* ────────────────────────────────────────────
 *  Payments history
 * ────────────────────────────────────────────*/
/** 결제 내역 항목 (백엔드 `PaymentHistoryResponse`) */
export interface PaymentHistoryItem {
  orderId: number;
  orderNumber: string;
  courseName: string;
  courseThumbnailUrl: string | null;
  amount: number;
  status: string;
  method: string | null;
  paidAt: string;
}

export function fetchMyPayments(): Promise<PaymentHistoryItem[]> {
  return request<PaymentHistoryItem[]>('v1/payments/history');
}

export function fetchOrderDetail(orderId: number): Promise<PaymentHistoryItem> {
  return request<PaymentHistoryItem>(`v1/payments/orders/${orderId}`);
}

/* ── 주문/결제 생성·승인 ── */
export interface CreateOrderRequest {
  courseId: number;
  userCouponId?: number;
  usePoints?: number;
}

export interface CreateOrderResponse {
  orderId: number;
  orderNumber: string;
  courseName: string;
  originalAmount: number;
  discountAmount: number;
  couponDiscountAmount: number;
  pointAmount: number;
  finalAmount: number;
}

export function createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>('v1/payments/orders', { method: 'POST', body });
}

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  orderId: number;
  orderNumber: string;
  paymentKey: string;
  amount: number;
  method: string;
  status: string;
  approvedAt: string;
}

export function confirmPayment(body: ConfirmPaymentRequest): Promise<PaymentConfirmResponse> {
  return request<PaymentConfirmResponse>('v1/payments/confirm', { method: 'POST', body });
}

export interface RefundRequest {
  orderNumber: string;
  reason: string;
}

export interface RefundResponse {
  orderId: number;
  orderNumber: string;
  refundAmount: number;
  refundReason: string;
  refundedAt: string;
}

export function refundPayment(body: RefundRequest): Promise<RefundResponse> {
  return request<RefundResponse>('v1/payments/refund', { method: 'POST', body });
}

/* ────────────────────────────────────────────
 *  Streaming
 * ────────────────────────────────────────────*/
export interface SignedUrlResponse {
  signedUrl: string;
  expiresIn: number;
}

export function fetchLectureSignedUrl(lectureId: number): Promise<SignedUrlResponse> {
  return request<SignedUrlResponse>(`v1/streaming/lectures/${lectureId}/signed-url`);
}

/* ────────────────────────────────────────────
 *  News (RSS 수집)
 * ────────────────────────────────────────────*/
export type NewsCategory = 'STOCKS' | 'CRYPTO' | 'REAL_ESTATE';

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  sourceUrl: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
}

export interface NewsPageResponse {
  content: NewsItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface NewsListParams {
  category?: NewsCategory;
  page?: number;
  size?: number;
}

/**
 * 백엔드 PageResponse raw 포맷 (lecture-api/common/response/PageResponse.java)
 * - `total_elements` (snake_case, @JsonProperty), `totalPages` 없음
 * - 프론트 친화 포맷(totalElements + 파생 totalPages)으로 변환한다
 */
interface RawPageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total_elements?: number;
  totalElements?: number;
  totalPages?: number;
}

function normalizePage<T>(raw: RawPageResponse<T>): { content: T[]; page: number; size: number; totalElements: number; totalPages: number } {
  const totalElements = raw.totalElements ?? raw.total_elements ?? 0;
  const size = raw.size > 0 ? raw.size : 1;
  const totalPages = raw.totalPages ?? Math.max(1, Math.ceil(totalElements / size));
  return {
    content: raw.content ?? [],
    page: raw.page,
    size: raw.size,
    totalElements,
    totalPages,
  };
}

export async function fetchNews(params: NewsListParams = {}): Promise<NewsPageResponse> {
  const raw = await request<RawPageResponse<NewsItem>>('v1/news', { query: { ...params } });
  return normalizePage(raw);
}

/* ────────────────────────────────────────────
 *  Course Q&A
 * ────────────────────────────────────────────*/
export type QuestionStatus = 'PENDING' | 'ANSWERED';

export interface QuestionItem {
  id: number;
  courseId: number;
  courseTitle: string;
  nickname: string;
  title: string;
  status: QuestionStatus;
  viewCount: number;
  createdAt: string;
}

export interface AnswerItem {
  id: number;
  nickname: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  content: string;
  createdAt: string;
}

export interface QuestionDetail extends QuestionItem {
  content: string;
  answers: AnswerItem[];
}

export interface QuestionPageResponse {
  content: QuestionItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function fetchCourseQuestions(courseId: number, params: { page?: number; size?: number } = {}): Promise<QuestionPageResponse> {
  return request<QuestionPageResponse>(`v1/courses/${courseId}/questions`, { query: { ...params } });
}

export function fetchQuestion(questionId: number): Promise<QuestionDetail> {
  return request<QuestionDetail>(`v1/questions/${questionId}`);
}

export function createQuestion(courseId: number, body: { title: string; content: string }): Promise<QuestionItem> {
  return request<QuestionItem>(`v1/courses/${courseId}/questions`, { method: 'POST', body });
}

export function updateQuestion(questionId: number, body: { title: string; content: string }): Promise<QuestionItem> {
  return request<QuestionItem>(`v1/questions/${questionId}`, { method: 'PUT', body });
}

export function deleteQuestion(questionId: number): Promise<void> {
  return request<void>(`v1/questions/${questionId}`, { method: 'DELETE' });
}

export function createAnswer(questionId: number, body: { content: string }): Promise<AnswerItem> {
  return request<AnswerItem>(`v1/questions/${questionId}/answers`, { method: 'POST', body });
}

export function updateAnswer(questionId: number, answerId: number, body: { content: string }): Promise<AnswerItem> {
  return request<AnswerItem>(`v1/questions/${questionId}/answers/${answerId}`, { method: 'PUT', body });
}

export function deleteAnswer(questionId: number, answerId: number): Promise<void> {
  return request<void>(`v1/questions/${questionId}/answers/${answerId}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Instructors (소개)
 * ────────────────────────────────────────────*/
export type InstructorCategory = 'STOCKS' | 'CRYPTO' | 'REAL_ESTATE';

/** 강사 목록 카드의 주요 강의 요약 (백엔드 `InstructorMainCourse`) */
export interface InstructorMainCourse {
  courseId: number;
  title: string;
  thumbnailUrl: string;
}

/** 강사 상세의 대표 강의 (백엔드 `InstructorRepresentativeCourse`) */
export interface InstructorRepresentativeCourse {
  courseId: number;
  title: string;
  thumbnailUrl: string;
  categoryName: string | null;
  price: number;
  discountPrice: number | null;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  level: string | null;
}

/** 강사 목록 응답 (백엔드 `InstructorListResponse`) */
export interface InstructorListItem {
  instructorId: number;
  name: string;
  profileImageUrl: string | null;
  specialty: string | null;
  career: string | null;
  mainCourses: InstructorMainCourse[];
}

export interface InstructorPageResponse {
  content: InstructorListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function fetchInstructors(params: { category?: InstructorCategory; page?: number; size?: number } = {}): Promise<InstructorPageResponse> {
  return request<InstructorPageResponse>('v1/instructors', { query: { ...params } });
}

/** 강사 상세 (백엔드 `InstructorDetailResponse`) */
export interface InstructorDetail {
  instructorId: number;
  name: string;
  profileImageUrl: string | null;
  specialty: string | null;
  career: string | null;
  description: string | null;
  followerCount: number;
  isFollowing: boolean;
  representativeCourses: InstructorRepresentativeCourse[];
}

export function fetchInstructor(id: number): Promise<InstructorDetail> {
  return request<InstructorDetail>(`v1/instructors/${id}`);
}

/* ────────────────────────────────────────────
 *  Instructor Application (강사 지원)
 * ────────────────────────────────────────────*/
export type InstructorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InstructorApplication {
  id: number;
  name: string;
  phone: string;
  specialty: string;
  career: string;
  lecturePlan: string;
  status: InstructorApplicationStatus;
  rejectReason: string | null;
  createdAt: string;
}

export interface InstructorApplicationRequest {
  name: string;
  phone: string;
  specialty: string;
  career: string;
  lecturePlan: string;
}

export function applyInstructor(body: InstructorApplicationRequest): Promise<InstructorApplication> {
  return request<InstructorApplication>('v1/instructor-applications', { method: 'POST', body });
}

export function fetchMyInstructorApplication(): Promise<InstructorApplication | null> {
  return request<InstructorApplication | null>('v1/instructor-applications/me');
}

/* ────────────────────────────────────────────
 *  Notices (공지사항 - 유저용)
 * ────────────────────────────────────────────*/
export interface NoticeSummary {
  id: number;
  title: string;
  pinned: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface NoticeDetail extends NoticeSummary {
  content: string;
  updatedAt: string;
}

export interface NoticePageResponse {
  content: NoticeSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function fetchNotices(params: { page?: number; size?: number } = {}): Promise<NoticePageResponse> {
  const raw = await request<RawPageResponse<NoticeSummary>>('v1/notices', { query: { ...params } });
  return normalizePage(raw);
}

export function fetchNoticeById(id: number): Promise<NoticeDetail> {
  return request<NoticeDetail>(`v1/notices/${id}`);
}

/* ────────────────────────────────────────────
 *  공개 FAQ (/api/v1/faqs)
 * ────────────────────────────────────────────*/
export interface FaqApiItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  updatedAt: string;
}

export function fetchFaqs(category?: string): Promise<FaqApiItem[]> {
  return request<FaqApiItem[]>('v1/faqs', { query: category ? { category } : undefined });
}

/* ────────────────────────────────────────────
 *  User profile
 * ────────────────────────────────────────────*/
export interface MyUserProfile {
  id: number;
  email: string;
  nickname: string;
  name: string;
  role: UserRole;
  phone: string | null;
  profileImageUrl: string | null;
}

export function fetchMyProfile(): Promise<MyUserProfile> {
  return request<MyUserProfile>('v1/users/me');
}

/**
 * 프로필 통합 수정 (`PUT /v1/users/me/profile`).
 * - 닉네임/소개글/프로필·배경 이미지/대표글
 * - phone/gender/birthDate/수신동의는 `updateMyInfo` 로 분리되어 있음
 */
export interface UpdateMyProfileRequest {
  nickname: string;
  bio?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  featuredPostIds?: number[];
}

export function updateMyProfile(body: UpdateMyProfileRequest): Promise<void> {
  return request<void>('v1/users/me/profile', { method: 'PUT', body });
}

/** 회원정보 수정 진입 전 비밀번호 확인 */
export function verifyMyPassword(password: string): Promise<void> {
  return request<void>('v1/users/me/verify-password', { method: 'POST', body: { password } });
}

/** 회원정보 조회 (성별/생년월일/수신동의/SNS 연동 등) */
export type Gender = 'MALE' | 'FEMALE' | 'NONE';

export interface ConsentInfo {
  privacyAgreed: boolean;
  marketingEmailAgreed: boolean;
  marketingSmsAgreed: boolean;
}

export interface MyUserInfo {
  nickname: string;
  name: string;
  email: string;
  gender: Gender | null;
  createdAt: string;
  level: string;
  phone: string | null;
  birthDate: string | null;
  linkedSocialProviders: string[];
  consent: ConsentInfo;
}

export function fetchMyInfo(): Promise<MyUserInfo> {
  return request<MyUserInfo>('v1/users/me/info');
}

/** 회원정보 수정 — 비밀번호 변경 포함 가능 */
export interface UpdateMyInfoRequest {
  currentPassword?: string;
  newPassword?: string;
  gender?: Gender;
  phone?: string;
  birthDate?: string;
  marketingEmailAgreed: boolean;
  marketingSmsAgreed: boolean;
}

export function updateMyInfo(body: UpdateMyInfoRequest): Promise<void> {
  return request<void>('v1/users/me/info', { method: 'PATCH', body });
}

/** 회원 탈퇴 */
export function withdrawAccount(body: { password: string; withdrawalReason?: string }): Promise<void> {
  return request<void>('v1/users/me/withdraw', { method: 'POST', body });
}

/**
 * 레거시: 비밀번호 변경 단독 API는 백엔드에 없고 `updateMyInfo` 로 합쳐졌다.
 * 호환을 위해 유지하되 내부적으로 `updateMyInfo` 를 호출한다.
 */
export function changeMyPassword(body: { currentPassword: string; newPassword: string }): Promise<void> {
  return updateMyInfo({
    currentPassword: body.currentPassword,
    newPassword: body.newPassword,
    marketingEmailAgreed: false,
    marketingSmsAgreed: false,
  });
}

/* ────────────────────────────────────────────
 *  Playback position (영상 이어보기)
 * ────────────────────────────────────────────*/
export interface PlaybackPosition {
  lastPositionSeconds: number;
  durationSeconds: number;
  isCompleted: boolean;
}

export function fetchPlaybackPosition(lectureId: number): Promise<PlaybackPosition> {
  return request<PlaybackPosition>(`v1/streaming/lectures/${lectureId}/playback-position`);
}

export function savePlaybackPosition(lectureId: number, positionSeconds: number): Promise<void> {
  return request<void>(`v1/streaming/lectures/${lectureId}/playback-position`, {
    method: 'POST',
    body: { positionSeconds: Math.max(0, Math.floor(positionSeconds)) },
  });
}

/* ────────────────────────────────────────────
 *  Coupon 코드 등록
 * ────────────────────────────────────────────*/
/** 쿠폰 코드 등록 — 백엔드는 201 성공 시 body 없음 */
export function registerCouponCode(code: string): Promise<void> {
  return request<void>('v1/coupons/register', { method: 'POST', body: { code } });
}

/* ────────────────────────────────────────────
 *  My reviews (수강한 강의에 내가 쓴 후기)
 * ────────────────────────────────────────────*/
/** 내가 작성한 후기 목록 (백엔드 `MyReviewResponse`) — 썸네일 미포함 */
export interface MyReviewItem {
  reviewId: number;
  courseId: number;
  courseTitle: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface MyReviewPageResponse {
  content: MyReviewItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function fetchMyReviews(params: { page?: number; size?: number } = {}): Promise<MyReviewPageResponse> {
  return request<MyReviewPageResponse>('v1/enrollments/reviews', { query: { ...params } });
}

/* ────────────────────────────────────────────
 *  Enrollment period (수강 기간)
 * ────────────────────────────────────────────*/
export interface EnrollmentPeriod {
  id: number;
  status: EnrollmentStatus;
  startedAt: string;
  expiresAt: string | null;
  remainingDays: number | null;
}

export function fetchEnrollmentPeriod(enrollmentId: number): Promise<EnrollmentPeriod> {
  return request<EnrollmentPeriod>(`v1/enrollments/${enrollmentId}/period`);
}

/* ────────────────────────────────────────────
 *  통합 검색 (백엔드: GET /api/v1/search[/courses|/users])
 *  - 커뮤니티는 프론트에서 사용하지 않음
 * ────────────────────────────────────────────*/
export interface SearchCourseItem {
  id: number;
  title: string;
  instructorNames: string[];
  thumbnailUrl: string;
  level: string;
  price: number;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  tags: string[];
}

export interface SearchUserItem {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface SearchGroup<T> {
  items: T[];
  totalCount: number;
}

/** 백엔드 통합 검색 응답 — communities 필드는 사용하지 않음 */
export interface SearchAllResult {
  courses: SearchGroup<SearchCourseItem>;
  users: SearchGroup<SearchUserItem>;
}

export function searchAll(keyword: string): Promise<SearchAllResult> {
  return request<SearchAllResult>('v1/search', { query: { keyword } });
}

export interface PageParams { page?: number; size?: number }

export function searchCourses(
  keyword: string,
  params: PageParams = {},
): Promise<SearchGroup<SearchCourseItem>> {
  return request<SearchGroup<SearchCourseItem>>('v1/search/courses', { query: { keyword, ...params } });
}

export function searchUsers(
  keyword: string,
  params: PageParams = {},
): Promise<SearchGroup<SearchUserItem>> {
  return request<SearchGroup<SearchUserItem>>('v1/search/users', { query: { keyword, ...params } });
}

/* ────────────────────────────────────────────
 *  1:1 문의 (Inquiry) — /api/v1/inquiries
 * ────────────────────────────────────────────*/
export type InquiryCategory = 'COURSE' | 'PAYMENT' | 'INSTRUCTOR' | 'SERVICE' | 'ETC';
export type InquiryStatus = 'WAITING' | 'ANSWERED';

export interface InquiryCreateRequest {
  category: InquiryCategory;
  title: string;
  content: string;
  /** 첨부 이미지 publicUrl 목록 (최대 3장) */
  attachmentUrls?: string[];
}

export interface InquiryListItem {
  id: number;
  category: InquiryCategory;
  title: string;
  status: InquiryStatus;
  authorNickname: string | null;
  createdAt: string;
}

export interface InquiryAnswer {
  id: number;
  adminNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryDetail {
  id: number;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  authorNickname: string | null;
  attachmentUrls: string[];
  answer: InquiryAnswer | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryPageResponse {
  content: InquiryListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** 문의 작성 — 응답: 생성된 inquiryId */
export function createInquiry(body: InquiryCreateRequest): Promise<number> {
  return request<number>('v1/inquiries', { method: 'POST', body });
}

/** 내 문의 목록 — page 는 1-base */
export function fetchMyInquiries(params: {
  status?: InquiryStatus;
  page?: number;
  size?: number;
} = {}): Promise<InquiryPageResponse> {
  return request<InquiryPageResponse>('v1/inquiries/my', { query: { ...params } });
}

/** 내 문의 상세 */
export function fetchMyInquiryDetail(id: number): Promise<InquiryDetail> {
  return request<InquiryDetail>(`v1/inquiries/${id}`);
}

/** 내 문의 삭제 (WAITING 상태만 가능) */
export function deleteMyInquiry(id: number): Promise<void> {
  return request<void>(`v1/inquiries/${id}`, { method: 'DELETE' });
}
