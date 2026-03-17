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
  src: string;
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
  rating?: number;
  reviewCount?: number;
  enrollmentPeriod: string;
  faq: CourseFaq[];
  bestReviews: CourseReview[];
  allReviews: CourseReview[];
  curriculum: CurriculumSection[];
  creator: CourseCreator;
  discount: CourseDiscount;
}

export interface HomeSection {
  title: string;
  slugs: string[];
}

/* ── 오픈예정 강의 ── */
export interface UpcomingCourse {
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

/* ── 후기 ── */
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

export interface NavData {
  topBar: NavItem[];
  search: NavSearchData;
  main: NavItem[];
  user: NavItem[];
  auth: NavAuthData;
  categoryMenu: CategoryMenu;
}

/* ── 푸터 ── */
export interface FooterBusiness {
  companyName: string;
  ceo: string;
  ceoLabel: string;
  registrationNumber: string;
  registrationLabel: string;
  ecommerceRegistration: string;
  ecommerceLabel: string;
  label: string;
}

export interface FooterData {
  copyright: string;
  links: NavItem[];
  business: FooterBusiness;
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

/* ── 커뮤니티 ── */
export interface CategoryOption {
  value: string;
  label: string;
}

/** 사이드바 네비게이션 하위 아이템 */
export interface SidebarNavItem {
  id: string;
  label: string;
}

/** 사이드바 네비게이션 섹션 (상위 탭) */
export interface SidebarNavSection {
  id: string;
  icon: string;
  title: string;
  href?: string;
  collapsible?: boolean;
  items: SidebarNavItem[];
}

/** 피드 탭 */
export interface FeedTabItem {
  id: string;
  label: string;
}

/** 피드 섹션 (인기글, 시리즈, 전문가칼럼, Q&A 등) */
export interface FeedSection {
  id: string;
  title: string;
  type: 'popular' | 'article' | 'series' | 'qna';
  itemCount: number;
  showMore?: boolean;
  moreLabel?: string;
}

/** Aside 섹션 stat 라벨 */
export interface AsideStatLabel {
  key: string;
  label: string;
}

/** Aside 섹션 (추천프로필, 댓글 랭킹 등) */
export interface AsideSection {
  id: string;
  title: string;
  type: 'profile' | 'ranking';
  itemCount: number;
  showRank: boolean;
  showFollowerCount?: boolean;
  statLabels?: AsideStatLabel[];
}

/** 검색 필터 UI 텍스트 */
export interface SearchFilters {
  categoryLabel: string;
  categoryDefault: string;
  scopeLabel: string;
  scopeDefault: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  searchButtonAriaLabel?: string;
}

/** 사이드바 프로필 stat 아이템 */
export interface SidebarProfileStat {
  key: string;
  label: string;
}

/** 인증 뱃지 이미지 */
export interface VerifiedBadgeData {
  src: string;
  alt: string;
}

/** 사이드바 프로필 더미 유저 */
export interface DummySidebarUser {
  nickname: string;
  verified: boolean;
  followerCount: string;
  statValues: Record<string, string>;
}

/** 사이드바 프로필 UI 텍스트 */
export interface SidebarProfileData {
  loginLabel: string;
  profileAriaLabel: string;
  myPostsLabel: string;
  stats: SidebarProfileStat[];
  dummyUser?: DummySidebarUser;
}

/** 공지 배너 UI 텍스트 */
export interface NoticeBannerData {
  badgeLabel: string;
  ariaLabel: string;
  dummyText?: string;
}

/** Q&A 라벨 */
export interface QnaLabels {
  answeredBadge: string;
  answeredSuffix: string;
}

/** 더미 인기글 */
export interface DummyPopularPost {
  id: string;
  title: string;
  authorNickname: string;
  category: string;
  date: string;
  viewCount: number;
}

/** 더미 시리즈 카드 */
export interface DummySeriesCard {
  id: string;
  thumbnail: string;
  thumbnailAlt: string;
  title: string;
  description: string;
  tags: string[];
}

/** 더미 전문가 칼럼 */
export interface DummyArticle {
  id: string;
  authorNickname: string;
  authorVerified: boolean;
  date: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  likeCount: number;
  commentCount: number;
}

/** 더미 Q&A 게시글 */
export interface DummyQnaPost {
  id: string;
  title: string;
  answererNickname: string;
  answererVerified: boolean;
}

/** 더미 추천 프로필 */
export interface DummyProfile {
  id: string;
  nickname: string;
  verified: boolean;
  followerCount: string;
}

/** 더미 댓글 랭킹 */
export interface DummyRankingUser {
  id: string;
  nickname: string;
  verified: boolean;
  commentCount: number;
  likeCount: number;
}

export interface CommunityData {
  verifiedBadge: VerifiedBadgeData;
  sidebarProfile: SidebarProfileData;
  sidebarNav: SidebarNavSection[];
  feedTabs: FeedTabItem[];
  feedSections: FeedSection[];
  asideSections: AsideSection[];
  searchFilters: SearchFilters;
  noticeBanner: NoticeBannerData;
  qnaLabels: QnaLabels;
  categories: CategoryOption[];
  reportReasons: CategoryOption[];
  writeButtonLabel: string;
  writeButtonAriaLabel: string;
  dummyPopularPosts?: DummyPopularPost[];
  dummySeriesCards?: DummySeriesCard[];
  dummyArticles?: DummyArticle[];
  dummyQnaPosts?: DummyQnaPost[];
  dummyRecommendedProfiles?: DummyProfile[];
  dummyCommentRanking?: DummyRankingUser[];
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: User;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

/* ── 유저 ── */
export interface User {
  id: string;
  name: string;
  nickname?: string;
  bio?: string;
  email: string;
  profileImage?: string;
  featuredPostIds?: string[];
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female';
  joinDate?: string;
  grade?: string;
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
  verifiedBadgeAlt: string;
  toggleLabels: ProfileCardToggleLabels;
  profileMode: ProfileModeData;
  classroomMode: ClassroomModeData;
  otherUserMode: OtherUserModeData;
}

/* ── 마이페이지 섹션 ── */
export type MyPageTab = 'classroom' | 'profile';

export type MyPageSection =
  | 'classroom'
  | 'profile'
  | 'wishlist'
  | 'orders'
  | 'coupons'
  | 'points'
  | 'giftcards'
  | 'reviews'
  | 'certificates'
  | 'consultations'
  | 'profileEdit';

/* ── 장바구니 / 주문 ── */
export interface CartItem extends Course {}

export interface Coupon {
  type: 'percent' | 'fixed';
  value: number;
  code: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderData {
  id: string;
  courseSlugs: string[];
  totalAmount: number;
  status: string;
  createdAt: string;
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

export interface ExpiredCouponData {
  id: string;
  amount: number;
  description: string;
  validFrom: string;
  validTo: string;
  status: string;
}

export interface CertificateData {
  id: string;
  courseSlug: string;
  status: string;
  issuedAt: string | null;
  completedAt: string | null;
}

export interface ConsultationData {
  id: string;
  courseSlug: string;
  status: string;
  question: string;
  createdAt: string;
}

export interface ReviewData {
  id: string;
  courseSlug: string;
  rating: number;
  content: string;
  createdAt: string;
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
  };
  pages: Record<string, unknown>;
  courses: Course[];
  homeSections: HomeSection[];
  upcomingCourses: UpcomingCourse[];
  bestCourses: BestCourse[];
  bestChipCategories: BestChipCategory[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  footer: FooterData;
  a11y: Record<string, unknown>;
  geo: GeoData;
  seo: Record<string, unknown>;
  community: CommunityData;
  consultations: ConsultationData[];
  reviews: ReviewData[];
  certificates: CertificateData[];
  orders: OrderData[];
  expiredCoupons: ExpiredCouponData[];
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

/* ── 영상 업로드 (Presigned URL) ── */
export interface PresignedUrlRequest {
  courseId: string;
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
}

export interface UploadConfirmRequest {
  courseId: string;
  fileKey: string;
  fileName: string;
}

export interface UploadConfirmResponse {
  success: boolean;
  videoUrl: string;
}

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
