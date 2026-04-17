/**
 * 공유 타입 정의
 * - 프로젝트 전체에서 사용하는 타입을 중앙 관리한다
 */

/* ── 사이트 / 네비게이션 ── */
export interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface SiteLogo {
  text: string;
  alt: string;
}

export interface SiteData {
  name: string;
  description: string;
  url: string;
  logo: SiteLogo;
  links: {
    header: NavItem[];
    footer: NavItem[];
    external: NavItem[];
  };
}

/* ── 강의 ── */
export interface CourseFaq {
  question: string;
  answer: string;
}

export interface CourseReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface CaptionTrack {
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

export interface LessonA11y {
  ariaLabel: string;
}

export interface CurriculumLesson {
  id?: string;
  slug?: string;
  name: string;
  duration: string;
  locked: boolean;
  preview?: boolean;
  captions?: CaptionTrack[];
  a11y?: LessonA11y;
}

export interface CurriculumSection {
  title: string;
  lessons: CurriculumLesson[];
}

export interface CourseCreator {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
}

export interface CourseDiscount {
  rate: number;
  label: string;
  couponValidDays: number;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: string;
  featured: boolean;
  badges: string[];
  tags: string[];
  learningPoints: string[];
  rating?: number;
  reviewCount?: number;
  favoriteCount?: number;
  enrollmentPeriod: string;
  faq: CourseFaq[];
  bestReviews: CourseReview[];
  allReviews: CourseReview[];
  curriculum: CurriculumSection[];
  creator: CourseCreator;
  discount?: CourseDiscount;
}

/* ── 오픈예정 강의 ── */
export interface UpcomingCourse {
  id: number;
  slug: string;
  title: string;
  thumbnail: string;
  thumbnailAlt: string;
  categoryLabel: string;
  instructor: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  openDate: string;
  featured: boolean;
}

/* ── 베스트 강의 ── */
export interface BestCourse {
  id: number;
  slug: string;
  title: string;
  thumbnail: string;
  thumbnailAlt: string;
  categoryLabel: string;
  instructor: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  category: string;
  badge?: string;
}

export interface BestChipCategory {
  value: string;
  label: string;
}

/* ── FAQ ── */
export interface FaqItem {
  question: string;
  answer: string;
}

export interface SupportFaqItem extends FaqItem {
  category: string;
}

export interface SupportFaqCategory {
  value: string;
  label: string;
}

export interface SupportFaqData {
  title: string;
  ariaLabel: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
  categoryLabels: Record<string, string>;
  chipAriaLabel: string;
  questionPrefix: string;
  answerPrefix: string;
}

/* ── 후기 ── */
export interface BestReviewStat {
  label: string;
  value: string;
  icon: string;
  ariaLabel: string;
}

export interface BestReviewSection {
  meta: {
    label: string;
    title: string;
    description: string;
    ariaLabel: string;
  };
  stats: BestReviewStat[];
}

/* ── 홈 카테고리 네비게이션 ── */
export interface HomeCategoryItem {
  icon: string;
  label: string;
  href: string;
  ariaLabel: string;
}

export interface HomeCategorySection {
  meta: { ariaLabel: string };
  items: HomeCategoryItem[];
}

/* ── 인기 강사 ── */
export interface HomeInstructorsSection {
  meta: {
    subtitle: string;
    title: string;
    description: string;
    ariaLabel: string;
  };
}

/* ── 홈 뉴스 섹션 ── */
export interface HomeNewsSection {
  meta: {
    label: string;
    title: string;
    ariaLabel: string;
    moreLabel?: string;
    moreHref?: string;
    moreAriaLabel?: string;
  };
}

/** @deprecated TestimonialsSection 으로 대체됨 */
export interface Testimonial {
  name: string;
  content: string;
  course: string;
}

/* ── 네비게이션 (구조화) ── */
export interface NavAuthData {
  loginLabel: string;
  loginHref: string;
  loginAriaLabel: string;
  signupLabel: string;
  signupHref: string;
  signupAriaLabel: string;
}

export interface CategoryMenuItem {
  label: string;
  href: string;
}

export interface CategoryMenuGroup {
  label: string;
  href: string;
  items: CategoryMenuItem[];
}

export interface CategoryMenu {
  ariaLabel: string;
  groups: CategoryMenuGroup[];
}

export interface NavSearchData {
  placeholder: string;
  ariaLabel: string;
}

export interface CourseDropdownData {
  label: string;
  href: string;
  ariaLabel: string;
}

export interface NavData {
  topBar: NavItem[];
  search: NavSearchData;
  main: NavItem[];
  courseDropdown: CourseDropdownData;
  user: NavItem[];
  auth: NavAuthData;
  categoryMenu: CategoryMenu;
}

/* ── 푸터 ── */
export interface FooterInquiryButton {
  label: string;
  href: string;
  ariaLabel: string;
}

export interface FooterData {
  copyright: string;
  inquiryButton: FooterInquiryButton;
  mainLinks: NavItem[];
  subLinks: NavItem[];
}

/* ── GEO ── */
export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface GeoData {
  countryCode: string;
  city: string;
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  businessHours: string;
  organization: {
    name: string;
    type: string;
    email: string;
  };
  social: SocialLink[];
}

/* ── 관리자 대시보드 ──
 * 백엔드 GET /api/v1/admin/dashboard 응답 구조와 1:1 매칭
 */
export interface AdminDailyRevenue {
  date: string;
  amount: number;
}

export interface AdminRevenueStats {
  todayRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  dailyRevenues: AdminDailyRevenue[];
}

export interface AdminDailyUserCount {
  date: string;
  count: number;
}

export interface AdminNewUserStats {
  todayCount: number;
  monthlyCount: number;
  totalCount: number;
  dailyCounts: AdminDailyUserCount[];
}

export interface AdminCourseEnrollmentStats {
  courseId: number;
  title: string;
  enrollmentCount: number;
  avgProgressPercent: number;
}

export interface AdminRecentReview {
  id: number;
  courseTitle: string;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface AdminReviewStats {
  overallAvgRating: number;
  totalReviewCount: number;
  monthlyReviewCount: number;
  recentReviews: AdminRecentReview[];
}

export interface AdminPaymentStats {
  todayOrderCount: number;
  todayRefundCount: number;
  monthlyOrderCount: number;
  monthlyRefundCount: number;
}

export interface AdminDashboardData {
  revenue: AdminRevenueStats;
  newUsers: AdminNewUserStats;
  courseEnrollments: AdminCourseEnrollmentStats[];
  reviews: AdminReviewStats;
  payments: AdminPaymentStats;
}

/* ── 관리자 강의 관리 ──
 * 백엔드 GET /api/v1/admin/courses 응답과 매칭
 */
export type AdminCourseStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'DELETED';
export type AdminCourseLevel = 'BEGINNER' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

/**
 * 관리자 강좌 목록 항목 (백엔드 `AdminCourseListResponse`).
 * - 목록은 요약만 제공 — 상세는 `fetchAdminCourse` → `AdminCourseDetail`
 */
export interface AdminCourseListItem {
  id: number;
  title: string;
  categoryName: string;
  instructorNames: string[];
  level: AdminCourseLevel;
  price: number;
  status: AdminCourseStatus;
  enrollmentCount: number;
  createdAt: string;
}

export interface AdminCourseCategory {
  id: number;
  name: string;
}

export interface AdminCoursesPage {
  items: AdminCourseListItem[];
  totalCount: number;
  page: number;
  size: number;
}

export interface AdminCoursesData {
  categories: AdminCourseCategory[];
  courses: AdminCourseListItem[];
}

/* ── 관리자 사용자 관리 ──
 * 백엔드 GET /api/v1/admin/users 응답과 매칭
 */
export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
export type AdminUserLevel = 'LV1' | 'LV2' | 'LV3' | 'LV4';

export interface AdminUserListItem {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
  level: AdminUserLevel;
  status: AdminUserStatus;
  createdAt: string;
}

export interface AdminUsersData {
  users: AdminUserListItem[];
}

/** 사용자 상세 — 수강 정보 */
export interface AdminUserEnrollmentInfo {
  enrollmentId: number;
  courseTitle: string;
  progressPercent: number;
  startedAt: string;
}

/** 사용자 상세 — 결제 정보 */
export interface AdminUserPaymentInfo {
  orderId: number;
  courseTitle: string;
  amount: number;
  status: string;
  paidAt: string;
}

export interface AdminUserDetail {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: UserRole;
  level: AdminUserLevel;
  status: AdminUserStatus;
  emailVerified: boolean;
  createdAt: string;
  enrollments: AdminUserEnrollmentInfo[];
  payments: AdminUserPaymentInfo[];
}

/* ── 관리자 결제 관리 ──
 * 백엔드 GET /api/v1/admin/payments 응답과 매칭
 */
export type AdminOrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';

export interface AdminOrderListItem {
  id: number;
  orderNumber: string;
  nickname: string;
  email: string;
  courseTitle: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: AdminOrderStatus;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface AdminPaymentsData {
  orders: AdminOrderListItem[];
}

/* ── 관리자 배너 ── */
export interface AdminBannerListItem {
  id: number;
  title: string;
  pcImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

/* ── 관리자 메인 섹션 ── */
export type AdminMainSectionType = 'NEW' | 'POPULAR' | 'LEVEL' | 'CUSTOM';
export interface AdminMainSectionListItem {
  id: number;
  title: string;
  type: AdminMainSectionType;
  filterValue: string | null;
  sortOrder: number;
  isActive: boolean;
}

/* ── 관리자 성공 사례 ── */
export interface AdminSuccessStoryListItem {
  id: number;
  title: string;
  authorName: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

/* ── 관리자 쿠폰 ── */
export type AdminCouponDiscountType = 'PERCENT' | 'FIXED';
export interface AdminCouponListItem {
  id: number;
  code: string;
  name: string;
  discountType: AdminCouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  totalQuantity: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

/* ── 관리자 FAQ ── */
export interface AdminFaqListItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  updatedAt: string;
}

/* ── 관리자 약관 ── */
export type AdminTermsType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'LEARNING_POLICY' | 'REFUND_POLICY';
export interface AdminTermsListItem {
  id: number;
  type: AdminTermsType;
  version: number;
  isCurrent: boolean;
  effectiveDate: string;
  createdAt: string;
}

/* ── 관리자 레벨 기준 ── */
export interface AdminLevelCriteriaItem {
  level: AdminUserLevel;
  minEnrollmentCount: number;
  minReviewCount: number;
  minTotalSpent: number;
}

/* ── 관리자 리뷰 ── */
export interface AdminReviewListItem {
  id: number;
  courseTitle: string;
  nickname: string;
  email: string;
  rating: number;
  content: string;
  likeCount: number;
  createdAt: string;
}

/* ── 관리자 추가 데이터 통합 ── */
export interface AdminExtraData {
  banners: AdminBannerListItem[];
  mainSections: AdminMainSectionListItem[];
  successStories: AdminSuccessStoryListItem[];
  coupons: AdminCouponListItem[];
  faqs: AdminFaqListItem[];
  terms: AdminTermsListItem[];
  levels: AdminLevelCriteriaItem[];
  reviews: AdminReviewListItem[];
}

/* ── 유저 ── */
/** 백엔드 UserRole enum과 매칭 (lecture-api: STUDENT/INSTRUCTOR/ADMIN) */
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  name: string;
  nickname?: string;
  bio?: string;
  email?: string;
  profileImage?: string;
  featuredPostIds?: string[];
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'none';
  joinDate?: string;
  grade?: string;
  role?: UserRole;
  socialAccounts?: SocialAccount[];
  marketingConsent?: MarketingConsent;
}

export interface SocialAccount {
  provider: string;
  connected: boolean;
}

export interface MarketingConsent {
  personalInfo: boolean;
  sms: boolean;
  email: boolean;
  nightAd: boolean;
}

/* ── 프로필 카드 ── */
export interface ProfileCardToggleLabels {
  profile: string;
  classroom: string;
  ariaLabel: string;
}

export interface CommunityLevelData {
  title: string;
  tooltipText: string;
  tooltipAriaLabel: string;
  steps: string[];
  currentStep: number;
  progressPercent: number;
}

export interface ProfileStatItem {
  key: string;
  label: string;
  value: number;
}

export interface ProfileModeData {
  roleLabel: string;
  communityLevel: CommunityLevelData;
  stats: ProfileStatItem[];
}

export interface ClassroomInfoRow {
  key: string;
  label: string;
  value: string;
  href?: string;
  type: 'badge' | 'link' | 'text';
}

export interface ClassroomModeData {
  affiliationPrefix: string;
  infoRows: ClassroomInfoRow[];
}

export interface OtherUserInfoRow {
  key: string;
  label: string;
}

export interface OtherUserModeData {
  shareAriaLabel: string;
  followLabel: string;
  followingLabel: string;
  followAriaLabel: string;
  infoRows: OtherUserInfoRow[];
}

export interface ProfileCardData {
  coverImageAlt: string;
  avatarAlt: string;
  verifiedBadge: { src: string; alt: string };
  toggleLabels: ProfileCardToggleLabels;
  profileMode: ProfileModeData;
  classroomMode: ClassroomModeData;
  otherUserMode: OtherUserModeData;
}

/* ── 공통 프로필 카드 (ProfileCard) ── */

/** ProfileCard에 표시할 유저 정보 */
export interface ProfileCardUser {
  nickname: string;
  profileImage?: string;
  verified?: boolean;
  role?: string;
  bio?: string;
  followerCount?: string;
}

/** ProfileCard 통계 아이템 (key-value 또는 key-statValues 매핑) */
export interface ProfileCardStat {
  key: string;
  label: string;
  value?: number | string;
}

/** ProfileCard에서 선택적으로 표시할 요소 옵션 */
export interface ProfileCardOptions {
  showCover?: boolean;
  showRole?: boolean;
  showFollowerCount?: boolean;
  showLevel?: boolean;
  showStats?: boolean;
}

/* ── 장바구니 / 주문 ── */
export interface CartItem extends Course {}

export interface Coupon {
  type: 'percent' | 'fixed';
  value: number;
  code: string;
}

/* ── 토스페이먼츠 결제 ── */

/** 토스페이먼츠 결제 수단 */
export type TossPaymentMethod =
  | 'CARD'
  | 'TRANSFER'
  | 'VIRTUAL_ACCOUNT'
  | 'MOBILE_PHONE'
  | 'TOSSPAY'
  | 'KAKAOPAY'
  | 'NAVERPAY';

/** 주문 생성 요청 (프론트 → 백엔드) */
export interface CreateOrderRequest {
  courseSlugs: string[];
  couponId?: string;
  pointAmount?: number;
  voucherAmount?: number;
}

/** 주문 생성 응답 (백엔드 → 프론트) */
export interface CreateOrderResponse {
  orderId: string;
  orderName: string;
  totalAmount: number;
  customerEmail: string;
  customerName: string;
}

/** 결제 승인 요청 (프론트 → 백엔드) */
export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/** 결제 승인 응답 (백엔드 → 프론트) */
export interface ConfirmPaymentResponse {
  orderId: string;
  status: TossPaymentStatus;
  totalAmount: number;
  method: string;
  approvedAt: string;
  receipt?: { url: string };
  courseAccess: { courseSlug: string; expiresAt: string }[];
}

/** 토스페이먼츠 결제 상태 */
export type TossPaymentStatus =
  | 'DONE'
  | 'CANCELED'
  | 'PARTIAL_CANCELED'
  | 'ABORTED'
  | 'EXPIRED';

/** 결제 실패 정보 */
export interface PaymentFailure {
  code: string;
  message: string;
  orderId?: string;
}

/** 주문 상태 */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CANCELED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'FAILED';


/* ── 알림 ── */
export type NotificationType = 'new_post' | 'activity' | 'news';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  profileImage?: string;
  isRead: boolean;
  createdAt: string;
  href?: string;
}

/* ── SEO ── */
export interface OgMeta {
  title: string;
  description: string;
  image?: string;
  images?: { url: string; alt: string }[];
}

export interface PageSeo {
  title: string;
  description: string;
  og?: OgMeta;
}

/* ── 메인 데이터 전체 ── */
export interface SortOption {
  value: string;
  label: string;
}

export interface MainData {
  site: SiteData;
  nav: NavData;
  ui: {
    common: Record<string, string>;
    toast: Record<string, string>;
    emptyState: Record<string, string>;
    notification: Record<string, unknown>;
  };
  pages: Record<string, unknown>;
  homeCategories: HomeCategorySection;
  upcomingCourses: UpcomingCourse[];
  bestCourses: BestCourse[];
  bestChipCategories: BestChipCategory[];
  bestReviews: BestReviewSection;
  homeInstructors: HomeInstructorsSection;
  homeNews: HomeNewsSection;
  footer: FooterData;
  a11y: Record<string, unknown>;
  geo: GeoData;
  seo: Record<string, unknown>;
  board: BoardData;
}

/* ── 게시판(공지사항) ── */
export interface BoardData {
  page: {
    title: string;
    subtitle: string;
    totalCountTemplate: string;
    loadingText: string;
    errorRetryLabel: string;
    columns: { number: string; title: string; date: string };
    seo: { title: string; description: string };
    categories: { value: string; label: string }[];
    sortOptions: { value: string; label: string }[];
    defaultCategory: string;
    filterLabel: string;
    sortLabel: string;
    emptyText: string;
    pinnedLabel: string;
    viewCountUnit: string;
    backLabel: string;
    breadcrumb: {
      ariaLabel: string;
      homeLabel: string;
      homeHref: string;
      boardLabel: string;
      boardHref: string;
    };
  };
}

/* ── Breadcrumb ── */
export interface BreadcrumbItem {
  name: string;
  href: string;
}

/* ── 지원 티켓 ── */
export interface Ticket {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

/* ── 영상 업로드 상태 ── */
export type UploadStatus = 'idle' | 'requesting' | 'uploading' | 'confirming' | 'success' | 'error';

export interface UploadError {
  errorKey: string;
  message?: string;
}

/* ── 스트리밍 세션 ── */
export type StreamingSessionType = 'PRESIGNED_URL' | 'SIGNED_COOKIE';

export interface StreamingSessionRequest {
  courseSlug: string;
  lessonSlug: string;
}

export interface StreamingSessionData {
  manifestUrl: string;
  expiresAt: string;
  type: StreamingSessionType;
}

export interface StreamingSessionResponse {
  data: StreamingSessionData;
}

export type StreamingErrorCode =
  | 'AUTH_REQUIRED'
  | 'NO_ENROLLMENT'
  | 'SESSION_EXPIRED'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_ERROR';

export interface StreamingError {
  code: StreamingErrorCode;
  status: number;
  message?: string;
}

/* ── 소셜 로그인 (OAuth) ── */
export type OAuthProvider = 'google' | 'kakao';

/** 소셜 로그인 콜백 → 백엔드 전송 요청 */
export interface SocialLoginRequest {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

/** 백엔드 소셜 로그인 응답 */
export interface SocialLoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    nickname?: string;
    profileImage?: string;
  };
  isNewUser: boolean;
}

/* ── 플레이어 ── */
export type PlayerErrorType =
  | 'STREAMING_AUTH'
  | 'STREAMING_FORBIDDEN'
  | 'STREAMING_EXPIRED'
  | 'STREAMING_RATE_LIMIT'
  | 'MEDIA_NETWORK'
  | 'MEDIA_DECODE'
  | 'MEDIA_NOT_SUPPORTED';

export interface PlayerError {
  type: PlayerErrorType;
  message: string;
  retryable: boolean;
}

/** 이어보기/진행률 서버 동기화용 */
export interface LectureProgress {
  courseSlug: string;
  lectureId: string;
  progress: number;
  lastPosition: number;
  isCompleted: boolean;
}
