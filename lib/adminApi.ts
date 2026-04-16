/**
 * 관리자 API 클라이언트 (adminApi.ts)
 * - 모든 /api/v1/admin/* 엔드포인트를 타입드 함수로 래핑한다
 * - 브라우저 → Next.js `/api/proxy/v1/...` → Spring `/api/v1/...` 흐름
 * - 토큰은 프록시가 httpOnly 쿠키에서 자동 주입하므로 클라이언트는 토큰을 몰라도 된다
 */

import type {
  AdminBannerListItem,
  AdminCouponListItem,
  AdminCourseCategory,
  AdminCourseLevel,
  AdminCourseListItem,
  AdminCourseStatus,
  AdminDashboardData,
  AdminFaqListItem,
  AdminLevelCriteriaItem,
  AdminMainSectionListItem,
  AdminOrderListItem,
  AdminOrderStatus,
  AdminReviewListItem,
  AdminSuccessStoryListItem,
  AdminTermsListItem,
  AdminTermsType,
  AdminUserDetail,
  AdminUserLevel,
  AdminUserListItem,
  UserRole,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export class AdminApiError extends Error {
  readonly status: number;
  readonly payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.payload = payload;
  }
}

/** 백엔드 CommonResponse 래퍼 형태 */
interface CommonResponseSuccess<T> { success: true; data: T; message?: string }
interface CommonResponseError { success: false; error: { code: string; message: string } }
type CommonResponse<T> = CommonResponseSuccess<T> | CommonResponseError;

/**
 * 공통 요청 래퍼 — 프록시 경로(`v1/...`)로 전달되며, 백엔드 CommonResponse 래퍼를 자동 unwrap
 */
async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, unknown> } = {},
): Promise<T> {
  const url = new URL(`${API_BASE}/proxy/${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
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
    const msg = wrapper.error?.message || `Admin API Error: ${res.status}`;
    throw new AdminApiError(msg, res.status, wrapper.error);
  }

  if (!res.ok) {
    throw new AdminApiError(`Admin API Error: ${res.status}`, res.status, payload);
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

/* ────────────────────────────────────────────
 *  Dashboard
 * ────────────────────────────────────────────*/
export function fetchAdminDashboard(): Promise<AdminDashboardData> {
  return request<AdminDashboardData>('v1/admin/dashboard');
}

/* ────────────────────────────────────────────
 *  Courses
 * ────────────────────────────────────────────*/
export interface AdminCourseListParams {
  status?: AdminCourseStatus;
  categoryId?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface AdminCoursePageResponse {
  content: AdminCourseListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function fetchAdminCourses(params: AdminCourseListParams = {}): Promise<AdminCoursePageResponse> {
  return request<AdminCoursePageResponse>('v1/admin/courses', { query: { ...params } });
}

/** 관리자 강좌 상세 (백엔드 `AdminCourseResponse`) — 목록과 다른 확장 필드 */
export interface AdminCourseDetail {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  description: string | null;
  instructorNames: string[];
  tags: AdminTagNode[];
  thumbnailUrl: string | null;
  level: AdminCourseLevel;
  price: number;
  status: AdminCourseStatus;
  enrollmentCount: number;
  averageRating: number;
  reviewCount: number;
  totalDurationSeconds: number;
  totalLectureCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fetchAdminCourse(id: number): Promise<AdminCourseDetail> {
  return request<AdminCourseDetail>(`v1/admin/courses/${id}`);
}

export interface AdminCourseCreateRequest {
  title: string;
  categoryId: number;
  description?: string;
  instructorIds: number[];
  level: AdminCourseLevel;
  price: number;
  thumbnailUrl?: string;
  /** 연결할 태그 ID 목록. 수정 시 전달하면 기존 연결이 이 목록으로 교체된다. */
  tagIds?: number[];
}

export function createAdminCourse(body: AdminCourseCreateRequest): Promise<AdminCourseDetail> {
  return request<AdminCourseDetail>('v1/admin/courses', { method: 'POST', body });
}

export function updateAdminCourse(id: number, body: AdminCourseCreateRequest): Promise<AdminCourseDetail> {
  return request<AdminCourseDetail>(`v1/admin/courses/${id}`, { method: 'PUT', body });
}

export function updateAdminCourseStatus(id: number, status: AdminCourseStatus): Promise<AdminCourseDetail> {
  return request<AdminCourseDetail>(`v1/admin/courses/${id}/status`, { method: 'PUT', body: { status } });
}

/* ────────────────────────────────────────────
 *  강사 전용 — 본인 담당 강좌 목록 (`/v1/admin/courses/my`)
 *  - 권한: INSTRUCTOR. DRAFT/PUBLISHED/HIDDEN 모두 포함
 * ────────────────────────────────────────────*/
export function fetchMyAdminCourses(): Promise<AdminCourseListItem[]> {
  return request<AdminCourseListItem[]>('v1/admin/courses/my');
}

/* ────────────────────────────────────────────
 *  강좌-강사 배정/해제 (`/v1/admin/courses/{id}/instructors`)
 *  - 권한: ADMIN. sortOrder 가 작을수록 먼저 표시
 *  - 마지막 강사 해제 시 409, 중복 배정 시 409
 * ────────────────────────────────────────────*/
export interface AssignCourseInstructorBody {
  instructorId: number;
  sortOrder: number;
}

export function assignCourseInstructor(courseId: number, body: AssignCourseInstructorBody): Promise<void> {
  return request<void>(`v1/admin/courses/${courseId}/instructors`, { method: 'POST', body });
}

export function unassignCourseInstructor(courseId: number, instructorId: number): Promise<void> {
  return request<void>(`v1/admin/courses/${courseId}/instructors/${instructorId}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  강사 프로필 ↔ 유저 계정 연결 (`/v1/admin/instructors/{id}/user`)
 *  - 권한: ADMIN. 연결 시 해당 유저의 role 이 INSTRUCTOR 로 변경됨
 * ────────────────────────────────────────────*/
export function linkInstructorUser(instructorId: number, userId: number): Promise<void> {
  return request<void>(`v1/admin/instructors/${instructorId}/user`, { method: 'PUT', body: { userId } });
}

export function fetchAdminCourseCategories(): Promise<AdminCourseCategory[]> {
  return request<AdminCourseCategory[]>('v1/categories');
}

/* ────────────────────────────────────────────
 *  Admin Categories CRUD (`/v1/admin/categories`)
 * ────────────────────────────────────────────*/
export interface AdminCategoryNode {
  id: number;
  name: string;
  sortOrder: number;
  courseCount: number;
  children?: AdminCategoryNode[] | null;
}

export interface AdminCategoryCreateRequest {
  name: string;
  parentId?: number;
  sortOrder: number;
}

export interface AdminCategoryUpdateRequest {
  name: string;
  sortOrder: number;
}

export interface AdminCategoryOrderRequest {
  categoryOrders: { id: number; sortOrder: number }[];
}

export function fetchAdminCategoryTree(): Promise<AdminCategoryNode[]> {
  return request<AdminCategoryNode[]>('v1/admin/categories');
}

export function createAdminCategory(body: AdminCategoryCreateRequest): Promise<AdminCategoryNode> {
  return request<AdminCategoryNode>('v1/admin/categories', { method: 'POST', body });
}

export function updateAdminCategory(id: number, body: AdminCategoryUpdateRequest): Promise<AdminCategoryNode> {
  return request<AdminCategoryNode>(`v1/admin/categories/${id}`, { method: 'PUT', body });
}

export function deleteAdminCategory(id: number): Promise<void> {
  return request<void>(`v1/admin/categories/${id}`, { method: 'DELETE' });
}

export function reorderAdminCategories(body: AdminCategoryOrderRequest): Promise<void> {
  return request<void>('v1/admin/categories/order', { method: 'PUT', body });
}

/* ────────────────────────────────────────────
 *  Tags (`/v1/tags` 공개 조회 · `/v1/admin/tags` 관리자 CRUD)
 *  - 백엔드 커밋 6df4674 (2026-04-16)
 *  - 태그는 평면 구조(부모/자식 없음). 이름 기준 정렬로 반환됨.
 * ────────────────────────────────────────────*/
export interface AdminTagNode {
  id: number;
  name: string;
}

export interface AdminTagCreateRequest { name: string }
export type AdminTagUpdateRequest = AdminTagCreateRequest;

/** 공개 태그 조회 — 강좌 폼 드롭다운/체크박스에 사용 (비로그인 접근 가능) */
export function fetchPublicTags(): Promise<AdminTagNode[]> {
  return request<AdminTagNode[]>('v1/tags');
}

export function fetchAdminTags(): Promise<AdminTagNode[]> {
  return request<AdminTagNode[]>('v1/admin/tags');
}

export function createAdminTag(body: AdminTagCreateRequest): Promise<AdminTagNode> {
  return request<AdminTagNode>('v1/admin/tags', { method: 'POST', body });
}

export function updateAdminTag(id: number, body: AdminTagUpdateRequest): Promise<AdminTagNode> {
  return request<AdminTagNode>(`v1/admin/tags/${id}`, { method: 'PUT', body });
}

export function deleteAdminTag(id: number): Promise<void> {
  return request<void>(`v1/admin/tags/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Admin Sections CRUD (`/v1/admin/courses/{courseId}/sections`)
 * ────────────────────────────────────────────*/
export interface AdminSection {
  id: number;
  courseId: number;
  title: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function createAdminSection(courseId: number, body: { title: string; sortOrder: number }): Promise<AdminSection> {
  return request<AdminSection>(`v1/admin/courses/${courseId}/sections`, { method: 'POST', body });
}

export function updateAdminSection(courseId: number, id: number, body: { title: string }): Promise<AdminSection> {
  return request<AdminSection>(`v1/admin/courses/${courseId}/sections/${id}`, { method: 'PUT', body });
}

export function deleteAdminSection(courseId: number, id: number): Promise<void> {
  return request<void>(`v1/admin/courses/${courseId}/sections/${id}`, { method: 'DELETE' });
}

export function reorderAdminSections(
  courseId: number,
  body: { sectionOrders: { id: number; sortOrder: number }[] },
): Promise<void> {
  return request<void>(`v1/admin/courses/${courseId}/sections/order`, { method: 'PUT', body });
}

/**
 * 관리자 커리큘럼 조회 — 섹션 + 중첩된 강의 목록
 * 백엔드: GET /api/v1/admin/courses/{courseId}/curriculum → AdminCurriculumResponse
 */
export interface AdminSectionWithLectures extends AdminSection {
  lectures: AdminLecture[];
}

interface AdminCurriculumVideoItem {
  id: number;
  encodingStatus: string;
  originalFilename: string;
  durationSeconds: number;
}

interface AdminCurriculumLectureItem {
  id: number;
  title: string;
  sortOrder: number;
  isPreview: boolean;
  durationSeconds: number;
  video: AdminCurriculumVideoItem | null;
}

interface AdminCurriculumSectionItem {
  id: number;
  title: string;
  sortOrder: number;
  lectures: AdminCurriculumLectureItem[];
}

interface AdminCurriculumResponseRaw {
  courseId: number;
  courseTitle: string;
  sections: AdminCurriculumSectionItem[];
}

export async function fetchAdminCourseCurriculum(courseId: number): Promise<AdminSectionWithLectures[]> {
  const raw = await request<AdminCurriculumResponseRaw>(`v1/admin/courses/${courseId}/curriculum`);
  return (raw.sections ?? []).map((section) => ({
    id: section.id,
    courseId: raw.courseId,
    title: section.title,
    sortOrder: section.sortOrder,
    createdAt: '',
    updatedAt: '',
    lectures: (section.lectures ?? []).map((lecture) => ({
      id: lecture.id,
      sectionId: section.id,
      title: lecture.title,
      sortOrder: lecture.sortOrder,
      isPreview: lecture.isPreview,
      durationSeconds: lecture.durationSeconds,
      videoId: lecture.video?.id ?? null,
      createdAt: '',
      updatedAt: '',
    })),
  }));
}

/* ────────────────────────────────────────────
 *  Admin Lectures CRUD (`/v1/admin/sections/{sectionId}/lectures`)
 * ────────────────────────────────────────────*/
export interface AdminLecture {
  id: number;
  sectionId: number;
  title: string;
  sortOrder: number;
  isPreview: boolean;
  durationSeconds: number;
  videoId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLectureCreateRequest {
  title: string;
  sortOrder: number;
  isPreview: boolean;
  durationSeconds: number;
}

export interface AdminLectureUpdateRequest {
  title: string;
  isPreview: boolean;
}

export function createAdminLecture(sectionId: number, body: AdminLectureCreateRequest): Promise<AdminLecture> {
  return request<AdminLecture>(`v1/admin/sections/${sectionId}/lectures`, { method: 'POST', body });
}

export function updateAdminLecture(sectionId: number, id: number, body: AdminLectureUpdateRequest): Promise<AdminLecture> {
  return request<AdminLecture>(`v1/admin/sections/${sectionId}/lectures/${id}`, { method: 'PUT', body });
}

export function deleteAdminLecture(sectionId: number, id: number): Promise<void> {
  return request<void>(`v1/admin/sections/${sectionId}/lectures/${id}`, { method: 'DELETE' });
}

export function reorderAdminLectures(
  sectionId: number,
  body: { lectureOrders: { id: number; sortOrder: number }[] },
): Promise<void> {
  return request<void>(`v1/admin/sections/${sectionId}/lectures/order`, { method: 'PUT', body });
}

/* ────────────────────────────────────────────
 *  Admin Videos (`/v1/admin/videos`, `/v1/admin/lectures/{id}/video`)
 * ────────────────────────────────────────────*/
export type EncodingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface VideoMetadata {
  videoId: number;
  encodingStatus: EncodingStatus;
}

export interface VideoCallbackRequest {
  originalFilename: string;
  s3Key: string;
  fileSize: number;
  contentType: string;
}

export interface EncodingStatusJob {
  resolution: string;
  status: EncodingStatus;
  progressPercent: number;
  errorMessage: string | null;
}

export interface EncodingStatusResult {
  videoId: number;
  encodingStatus: EncodingStatus;
  jobs: EncodingStatusJob[];
}

export function registerVideoUpload(body: VideoCallbackRequest): Promise<VideoMetadata> {
  return request<VideoMetadata>('v1/admin/videos', { method: 'POST', body });
}

export function startVideoEncode(videoId: number): Promise<void> {
  return request<void>(`v1/admin/videos/${videoId}/encode`, { method: 'POST' });
}

export function fetchVideoEncodingStatus(videoId: number): Promise<EncodingStatusResult> {
  return request<EncodingStatusResult>(`v1/admin/videos/${videoId}/encoding-status`);
}

export function reEncodeVideo(videoId: number): Promise<void> {
  return request<void>(`v1/admin/videos/${videoId}/re-encode`, { method: 'POST' });
}

/** 관리자 미리보기 Signed URL — 2026-04-16 추가 */
export interface AdminSignedUrlResponse {
  signedUrl: string;
  expiresIn: number;
}

export function fetchAdminVideoPreviewUrl(videoId: number): Promise<AdminSignedUrlResponse> {
  return request<AdminSignedUrlResponse>(`v1/admin/videos/${videoId}/preview-url`);
}

export function linkLectureVideo(lectureId: number, videoId: number): Promise<void> {
  return request<void>(`v1/admin/lectures/${lectureId}/video`, { method: 'PUT', body: { videoId } });
}

/* ────────────────────────────────────────────
 *  Presigned URL 발급 (`/v1/uploads/presigned-url`) — S3 직접 업로드용
 * ────────────────────────────────────────────*/
export type UploadType = 'VIDEO' | 'THUMBNAIL' | 'PROFILE_IMAGE' | 'BACKGROUND_IMAGE' | 'NOTICE_IMAGE';

export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  uploadType: UploadType;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
  /** CloudFront 공개 URL — 이미지 타입만 채워지고 VIDEO 는 null. DB 저장/이미지 src 용. */
  publicUrl: string | null;
  expiresIn: number;
}

export function issuePresignedUrl(body: PresignedUrlRequest): Promise<PresignedUrlResponse> {
  return request<PresignedUrlResponse>('v1/uploads/presigned-url', { method: 'POST', body });
}

/* ────────────────────────────────────────────
 *  Users
 * ────────────────────────────────────────────*/
export interface AdminUserListParams {
  keyword?: string;
  role?: UserRole;
  status?: string;
  page?: number;
  size?: number;
}

export interface AdminUserPageResponse {
  content: AdminUserListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function fetchAdminUsers(params: AdminUserListParams = {}): Promise<AdminUserPageResponse> {
  return request<AdminUserPageResponse>('v1/admin/users', { query: { ...params } });
}

export function fetchAdminUserDetail(id: number): Promise<AdminUserDetail> {
  return request<AdminUserDetail>(`v1/admin/users/${id}`);
}

export function updateAdminUserRole(id: number, role: UserRole): Promise<void> {
  return request<void>(`v1/admin/users/${id}/role`, { method: 'PUT', body: { role } });
}

export function deactivateAdminUser(id: number): Promise<void> {
  return request<void>(`v1/admin/users/${id}/deactivate`, { method: 'POST' });
}

/* ────────────────────────────────────────────
 *  관리자 — 회원별 포인트/쿠폰 조회
 * ────────────────────────────────────────────*/
/** `GET /admin/users/{id}/points/summary` — 현재 잔액 + 30일내 소멸예정 */
export interface AdminUserPointSummary {
  totalPoints: number;
  expiringPoints: number;
}

export function fetchAdminUserPointSummary(userId: number): Promise<AdminUserPointSummary> {
  return request<AdminUserPointSummary>(`v1/admin/users/${userId}/points/summary`);
}

/** `GET /admin/users/{id}/points/history` — 적립/사용/소멸 내역 (페이지네이션) */
export type AdminPointHistoryType = 'EARN' | 'USE' | 'EXPIRE';

export interface AdminUserPointHistoryItem {
  id: number;
  type: AdminPointHistoryType;
  amount: number;
  description: string;
  createdAt: string;
}

export interface AdminUserPointHistoryPage {
  content: AdminUserPointHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminUserPointHistoryParams {
  /** 'all' 은 전달하지 않음 (백엔드 기본값). EARN/USE/EXPIRE */
  type?: AdminPointHistoryType;
  page?: number;
  size?: number;
}

export function fetchAdminUserPointHistory(
  userId: number,
  params: AdminUserPointHistoryParams = {},
): Promise<AdminUserPointHistoryPage> {
  return request<AdminUserPointHistoryPage>(`v1/admin/users/${userId}/points/history`, {
    query: { ...params },
  });
}

/**
 * `GET /admin/users/{id}/coupons` — 회원이 보유한 쿠폰 전체 (isUsable 포함)
 * - 유저 API 의 `UserCouponResponse` 와 동일 스펙
 */
export interface AdminUserCoupon {
  userCouponId: number;
  couponId: number;
  couponName: string;
  discountInfo: string;
  startsAt: string;
  expiresAt: string;
  isUsed: boolean;
  isUsable: boolean;
}

export function fetchAdminUserCoupons(userId: number): Promise<AdminUserCoupon[]> {
  return request<AdminUserCoupon[]>(`v1/admin/users/${userId}/coupons`);
}

/* ────────────────────────────────────────────
 *  Payments
 * ────────────────────────────────────────────*/
export interface AdminPaymentListParams {
  status?: AdminOrderStatus;
  userId?: number;
  page?: number;
  size?: number;
}

export interface AdminPaymentPageResponse {
  content: AdminOrderListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function fetchAdminPayments(params: AdminPaymentListParams = {}): Promise<AdminPaymentPageResponse> {
  return request<AdminPaymentPageResponse>('v1/admin/payments', { query: { ...params } });
}

export function refundAdminPayment(orderNumber: string, reason: string): Promise<void> {
  return request<void>('v1/admin/payments/refund', { method: 'POST', body: { orderNumber, reason } });
}

export function manualEnrollAdmin(userId: number, courseId: number): Promise<void> {
  return request<void>('v1/admin/payments/manual-enroll', { method: 'POST', body: { userId, courseId } });
}

/* ────────────────────────────────────────────
 *  Banners
 * ────────────────────────────────────────────*/
export function fetchAdminBanners(): Promise<AdminBannerListItem[]> {
  return request<AdminBannerListItem[]>('v1/admin/banners');
}

export interface AdminBannerRequest {
  title: string;
  pcImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export function createAdminBanner(body: AdminBannerRequest): Promise<AdminBannerListItem> {
  return request<AdminBannerListItem>('v1/admin/banners', { method: 'POST', body });
}

export function updateAdminBanner(id: number, body: AdminBannerRequest): Promise<AdminBannerListItem> {
  return request<AdminBannerListItem>(`v1/admin/banners/${id}`, { method: 'PUT', body });
}

export function deleteAdminBanner(id: number): Promise<void> {
  return request<void>(`v1/admin/banners/${id}`, { method: 'DELETE' });
}

export function reorderAdminBanners(order: { id: number; sortOrder: number }[]): Promise<void> {
  return request<void>('v1/admin/banners/order', { method: 'PUT', body: { order } });
}

/* ────────────────────────────────────────────
 *  Main Sections
 * ────────────────────────────────────────────*/
export function fetchAdminMainSections(): Promise<AdminMainSectionListItem[]> {
  return request<AdminMainSectionListItem[]>('v1/admin/main-sections');
}

export interface AdminMainSectionRequest {
  title: string;
  type: AdminMainSectionListItem['type'];
  filterValue: string | null;
  sortOrder: number;
  isActive: boolean;
}

export function createAdminMainSection(body: AdminMainSectionRequest): Promise<AdminMainSectionListItem> {
  return request<AdminMainSectionListItem>('v1/admin/main-sections', { method: 'POST', body });
}

export function updateAdminMainSection(id: number, body: AdminMainSectionRequest): Promise<AdminMainSectionListItem> {
  return request<AdminMainSectionListItem>(`v1/admin/main-sections/${id}`, { method: 'PUT', body });
}

export function deleteAdminMainSection(id: number): Promise<void> {
  return request<void>(`v1/admin/main-sections/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Success Stories
 * ────────────────────────────────────────────*/
export function fetchAdminSuccessStories(): Promise<AdminSuccessStoryListItem[]> {
  return request<AdminSuccessStoryListItem[]>('v1/admin/success-stories');
}

export interface AdminSuccessStoryRequest {
  title: string;
  content: string;
  imageUrl: string;
  authorName: string;
  sortOrder: number;
  isActive: boolean;
}

export function createAdminSuccessStory(body: AdminSuccessStoryRequest): Promise<AdminSuccessStoryListItem> {
  return request<AdminSuccessStoryListItem>('v1/admin/success-stories', { method: 'POST', body });
}

export function updateAdminSuccessStory(id: number, body: AdminSuccessStoryRequest): Promise<AdminSuccessStoryListItem> {
  return request<AdminSuccessStoryListItem>(`v1/admin/success-stories/${id}`, { method: 'PUT', body });
}

export function deleteAdminSuccessStory(id: number): Promise<void> {
  return request<void>(`v1/admin/success-stories/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Coupons
 * ────────────────────────────────────────────*/
export function fetchAdminCoupons(): Promise<AdminCouponListItem[]> {
  return request<AdminCouponListItem[]>('v1/admin/coupons');
}

export interface AdminCouponCreateRequest {
  code: string;
  name: string;
  discountType: AdminCouponListItem['discountType'];
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  totalQuantity: number;
  startsAt: string;
  expiresAt: string;
}

export function createAdminCoupon(body: AdminCouponCreateRequest): Promise<AdminCouponListItem> {
  return request<AdminCouponListItem>('v1/admin/coupons', { method: 'POST', body });
}

export function deactivateAdminCoupon(id: number): Promise<void> {
  return request<void>(`v1/admin/coupons/${id}/deactivate`, { method: 'POST' });
}

export interface AdminCouponUpdateRequest {
  name: string;
  discountType: AdminCouponListItem['discountType'];
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  totalQuantity: number;
  startsAt: string;
  expiresAt: string;
}

export function updateAdminCoupon(id: number, body: AdminCouponUpdateRequest): Promise<AdminCouponListItem> {
  return request<AdminCouponListItem>(`v1/admin/coupons/${id}`, { method: 'PUT', body });
}

export function deleteAdminCoupon(id: number): Promise<void> {
  return request<void>(`v1/admin/coupons/${id}`, { method: 'DELETE' });
}

export interface AdminCouponIssueRequest {
  userId: number;
}

export function issueAdminCoupon(id: number, body: AdminCouponIssueRequest): Promise<void> {
  return request<void>(`v1/admin/coupons/${id}/issue`, { method: 'POST', body });
}

/* ────────────────────────────────────────────
 *  Admin Points (수동 조절)
 * ────────────────────────────────────────────*/
export interface AdminPointAdjustRequest {
  userId: number;
  /** 양수=적립, 음수=차감, 0 불가 */
  amount: number;
  reason: string;
}

export function adjustAdminPoints(body: AdminPointAdjustRequest): Promise<void> {
  return request<void>('v1/admin/points/adjust', { method: 'POST', body });
}

/* ────────────────────────────────────────────
 *  FAQs
 * ────────────────────────────────────────────*/
export function fetchAdminFaqs(category?: string): Promise<AdminFaqListItem[]> {
  return request<AdminFaqListItem[]>('v1/admin/faqs', { query: { category } });
}

export function fetchAdminFaq(id: number): Promise<AdminFaqListItem> {
  return request<AdminFaqListItem>(`v1/admin/faqs/${id}`);
}

export interface AdminFaqRequest {
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export function createAdminFaq(body: AdminFaqRequest): Promise<AdminFaqListItem> {
  return request<AdminFaqListItem>('v1/admin/faqs', { method: 'POST', body });
}

export function updateAdminFaq(id: number, body: AdminFaqRequest): Promise<AdminFaqListItem> {
  return request<AdminFaqListItem>(`v1/admin/faqs/${id}`, { method: 'PUT', body });
}

export function deleteAdminFaq(id: number): Promise<void> {
  return request<void>(`v1/admin/faqs/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Terms
 * ────────────────────────────────────────────*/
export interface AdminTermsDetail extends AdminTermsListItem {
  content: string;
}

export function fetchAdminTermsCurrent(type: AdminTermsType): Promise<AdminTermsDetail> {
  return request<AdminTermsDetail>('v1/admin/terms/current', { query: { type } });
}

export function fetchAdminTermsHistory(type: AdminTermsType): Promise<AdminTermsListItem[]> {
  return request<AdminTermsListItem[]>('v1/admin/terms/history', { query: { type } });
}

export function createAdminTerms(type: AdminTermsType, content: string, effectiveDate: string): Promise<AdminTermsListItem> {
  return request<AdminTermsListItem>('v1/admin/terms', { method: 'POST', body: { type, content, effectiveDate } });
}

/* ────────────────────────────────────────────
 *  Levels
 * ────────────────────────────────────────────*/
export function fetchAdminLevels(): Promise<AdminLevelCriteriaItem[]> {
  return request<AdminLevelCriteriaItem[]>('v1/admin/levels');
}

export interface AdminLevelUpdateRequest {
  minEnrollmentCount: number;
  minReviewCount: number;
  minTotalSpent: number;
}

export function updateAdminLevel(level: AdminUserLevel, body: AdminLevelUpdateRequest): Promise<AdminLevelCriteriaItem> {
  return request<AdminLevelCriteriaItem>(`v1/admin/levels/${level}`, { method: 'PUT', body });
}

export function refreshAdminLevels(): Promise<void> {
  return request<void>('v1/admin/levels/refresh', { method: 'POST' });
}

/* ────────────────────────────────────────────
 *  Reviews
 * ────────────────────────────────────────────*/
export interface AdminReviewListParams {
  courseId?: number;
  userId?: number;
  page?: number;
  size?: number;
}

export interface AdminReviewPageResponse {
  content: AdminReviewListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function fetchAdminReviews(params: AdminReviewListParams = {}): Promise<AdminReviewPageResponse> {
  return request<AdminReviewPageResponse>('v1/admin/reviews', { query: { ...params } });
}

export function deleteAdminReview(id: number): Promise<void> {
  return request<void>(`v1/admin/reviews/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Community Moderation
 *  — 프론트 커뮤니티 제거에 따라 지원하지 않음.
 * ────────────────────────────────────────────*/

/* ────────────────────────────────────────────
 *  Notices (공지사항 - 관리자)
 * ────────────────────────────────────────────*/
export interface AdminNoticeSummary {
  id: number;
  title: string;
  pinned: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AdminNoticeDetail extends AdminNoticeSummary {
  content: string;
  updatedAt: string;
}

export interface AdminNoticePageResponse {
  content: AdminNoticeSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminNoticeListParams {
  page?: number;
  size?: number;
}

export function fetchAdminNotices(params: AdminNoticeListParams = {}): Promise<AdminNoticePageResponse> {
  return request<AdminNoticePageResponse>('v1/admin/notices', { query: { ...params } });
}

export function fetchAdminNoticeById(id: number): Promise<AdminNoticeDetail> {
  return request<AdminNoticeDetail>(`v1/admin/notices/${id}`);
}

export interface AdminNoticeCreateRequest {
  title: string;
  content: string;
  pinned?: boolean;
  isActive?: boolean;
}

export function createAdminNotice(body: AdminNoticeCreateRequest): Promise<AdminNoticeDetail> {
  return request<AdminNoticeDetail>('v1/admin/notices', { method: 'POST', body });
}

export function updateAdminNotice(id: number, body: AdminNoticeCreateRequest): Promise<AdminNoticeDetail> {
  return request<AdminNoticeDetail>(`v1/admin/notices/${id}`, { method: 'PUT', body });
}

export function deleteAdminNotice(id: number): Promise<void> {
  return request<void>(`v1/admin/notices/${id}`, { method: 'DELETE' });
}

/* ────────────────────────────────────────────
 *  Instructor Applications (관리자)
 * ────────────────────────────────────────────*/
export type AdminInstructorAppStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminInstructorApplicationItem {
  id: number;
  name: string;
  phone: string;
  specialty: string;
  career: string;
  lecturePlan: string;
  status: AdminInstructorAppStatus;
  rejectReason: string | null;
  createdAt: string;
}

export interface AdminInstructorApplicationPage {
  content: AdminInstructorApplicationItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminInstructorAppListParams {
  status?: AdminInstructorAppStatus;
  page?: number;
  size?: number;
}

export function fetchAdminInstructorApplications(
  params: AdminInstructorAppListParams = {},
): Promise<AdminInstructorApplicationPage> {
  return request<AdminInstructorApplicationPage>('v1/admin/instructor-applications', { query: { ...params } });
}

export function fetchAdminInstructorApplication(id: number): Promise<AdminInstructorApplicationItem> {
  return request<AdminInstructorApplicationItem>(`v1/admin/instructor-applications/${id}`);
}

export function approveInstructorApplication(id: number): Promise<AdminInstructorApplicationItem> {
  return request<AdminInstructorApplicationItem>(
    `v1/admin/instructor-applications/${id}/approve`,
    { method: 'PATCH' },
  );
}

export function rejectInstructorApplication(id: number, reason: string): Promise<AdminInstructorApplicationItem> {
  return request<AdminInstructorApplicationItem>(
    `v1/admin/instructor-applications/${id}/reject`,
    { method: 'PATCH', body: { reason } },
  );
}

/* ────────────────────────────────────────────
 *  News (관리자 - RSS 수동 수집)
 * ────────────────────────────────────────────*/
export function triggerNewsRssCollect(): Promise<{ collected: number }> {
  return request<{ collected: number }>('v1/admin/news/rss/collect', { method: 'POST' });
}
