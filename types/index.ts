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
  faq: CourseFaq[];
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

export interface CommunityData {
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
  email: string;
  profileImage?: string;
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
  testimonials: Testimonial[];
  faq: FaqItem[];
  footer: FooterData;
  a11y: Record<string, unknown>;
  geo: GeoData;
  seo: Record<string, unknown>;
  community: CommunityData;
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
