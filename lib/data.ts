/**
 * 데이터 로드/조회 헬퍼 (data.ts)
 * - mainData.json을 로드하고, slug 기반 조회 등 데이터 접근 함수를 제공한다
 * - 컴포넌트/페이지에서 직접 JSON을 import하지 않고, 이 헬퍼를 통해 접근한다
 */

import mainData from '@/data';
import type { MainData, SiteData, NavData, Course, HomeSection, UpcomingCourse, BestCourse, BestChipCategory, FaqItem, Testimonial, FooterData, GeoData, OrderData, CertificateData, ConsultationData, ReviewData, ExpiredCouponData } from '@/types';

const data: MainData = mainData;

/** 전체 데이터 반환 */
export function getMainData(): MainData {
  return data;
}

/** 사이트 기본 정보 반환 */
export function getSiteData(): SiteData {
  return data.site;
}

/** 내비게이션 메뉴 반환 */
export function getNavData(): NavData {
  return data.nav;
}

/** 페이지별 SEO/콘텐츠 데이터 반환 */
export function getPageData(pageKey: string): unknown {
  return (data.pages as Record<string, unknown>)?.[pageKey] || null;
}

/** 전체 강의 목록 반환 */
export function getCourses(): Course[] {
  return data.courses || [];
}

/** slug로 강의 1건 조회 */
export function findCourseBySlug(slug: string): Course | null {
  return data.courses?.find((course) => course.slug === slug) || null;
}

/** 추천(featured) 강의 목록 반환 */
export function getFeaturedCourses(): Course[] {
  return data.courses?.filter((course) => course.featured) || [];
}

/** 홈 섹션 목록 반환 */
export function getHomeSections(): HomeSection[] {
  return data.homeSections || [];
}

/** 홈 섹션별 강의 목록 반환 */
export function getHomeSectionCourses(section: HomeSection): Course[] {
  const courses = data.courses || [];
  return section.slugs
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is Course => c != null);
}

/** 오픈예정 강의 목록 반환 */
export function getUpcomingCourses(): UpcomingCourse[] {
  return data.upcomingCourses || [];
}

/** 베스트 강의 칩 필터 카테고리 반환 */
export function getBestChipCategories(): BestChipCategory[] {
  return data.bestChipCategories || [];
}

/** 베스트 강의 목록 반환 */
export function getBestCourses(): BestCourse[] {
  return data.bestCourses || [];
}

/** 전역 FAQ 반환 */
export function getFaq(): FaqItem[] {
  return data.faq || [];
}

/** 후기/추천사 반환 */
export function getTestimonials(): Testimonial[] {
  return data.testimonials || [];
}

/** GEO 데이터 반환 */
export function getGeoData(): GeoData | null {
  return data.geo || null;
}

/** 푸터 데이터 반환 */
export function getFooterData(): FooterData | null {
  return data.footer || null;
}

/** 강의 상담 목록 반환 */
export function getConsultations(): ConsultationData[] {
  return data.consultations || [];
}

/** 후기 목록 반환 */
export function getReviews(): ReviewData[] {
  return data.reviews || [];
}

/** 수료증 목록 반환 */
export function getCertificates(): CertificateData[] {
  return data.certificates || [];
}

/** 주문 내역 반환 */
export function getOrders(): OrderData[] {
  return data.orders || [];
}

/** 만료된 쿠폰 목록 반환 */
export function getExpiredCoupons(): ExpiredCouponData[] {
  return data.expiredCoupons || [];
}

/* ── 커리큘럼 / 플레이어 헬퍼 ── */

/** 커리큘럼 레슨의 안정적 ID 생성 (섹션 인덱스 + 레슨 인덱스) */
export function generateLessonId(sectionIdx: number, lessonIdx: number): string {
  return `l-${sectionIdx}-${lessonIdx}`;
}

/** 사이드바용 커리큘럼 아이템 */
export interface SidebarCurriculumItem {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

/** 사이드바용 커리큘럼 섹션 */
export interface SidebarCurriculumSection {
  title: string;
  items: SidebarCurriculumItem[];
}

/** slug로 강의를 찾고 사이드바용 커리큘럼 데이터를 반환한다 */
export function getCurriculumForSidebar(courseSlug: string): SidebarCurriculumSection[] | null {
  const course = findCourseBySlug(courseSlug);
  if (!course) return null;

  return course.curriculum.map((section, sIdx) => ({
    title: section.title,
    items: section.lessons.map((lesson, lIdx) => ({
      id: generateLessonId(sIdx, lIdx),
      title: lesson.name,
      duration: lesson.duration,
      isCompleted: false,
    })),
  }));
}

/** 네비게이션용 레슨 정보 */
export interface LessonNavInfo {
  id: string;
  title: string;
}

/** 커리큘럼에서 현재/이전/다음 레슨 정보를 반환한다 */
export function findLessonNav(courseSlug: string, lectureId: string): {
  current: LessonNavInfo;
  prev: LessonNavInfo | null;
  next: LessonNavInfo | null;
} | null {
  const sections = getCurriculumForSidebar(courseSlug);
  if (!sections) return null;

  const allLessons = sections.flatMap((s) => s.items);
  const currentIdx = allLessons.findIndex((l) => l.id === lectureId);
  if (currentIdx === -1) return null;

  const current = allLessons[currentIdx];
  return {
    current: { id: current.id, title: current.title },
    prev: currentIdx > 0
      ? { id: allLessons[currentIdx - 1].id, title: allLessons[currentIdx - 1].title }
      : null,
    next: currentIdx < allLessons.length - 1
      ? { id: allLessons[currentIdx + 1].id, title: allLessons[currentIdx + 1].title }
      : null,
  };
}
