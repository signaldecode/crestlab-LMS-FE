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

export interface CurriculumLesson {
  name: string;
  duration: string;
  locked: boolean;
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
  registrationNumber: string;
  ecommerceRegistration: string;
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
  items: SidebarNavItem[];
}

/** 피드 탭 */
export interface FeedTabItem {
  id: string;
  label: string;
}

/** 피드 섹션 (인기글, 전문가칼럼 등) */
export interface FeedSection {
  id: string;
  title: string;
  type: 'popular' | 'article';
  itemCount: number;
  showMore?: boolean;
  moreLabel?: string;
}

/** Aside 섹션 (주목받는 멤버, 댓글 랭킹 등) */
export interface AsideSection {
  id: string;
  title: string;
  type: 'member';
  itemCount: number;
  showRank: boolean;
}

/** 검색 필터 UI 텍스트 */
export interface SearchFilters {
  categoryLabel: string;
  categoryDefault: string;
  scopeLabel: string;
  scopeDefault: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
}

/** 사이드바 UI 텍스트 */
export interface SidebarLabels {
  loginLabel: string;
  profileAriaLabel: string;
}

export interface CommunityData {
  sidebarNav: SidebarNavSection[];
  feedTabs: FeedTabItem[];
  feedSections: FeedSection[];
  asideSections: AsideSection[];
  searchFilters: SearchFilters;
  sidebar: SidebarLabels;
  categories: CategoryOption[];
  reportReasons: CategoryOption[];
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
