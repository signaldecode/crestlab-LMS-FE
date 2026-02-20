/**
 * 데이터 로드/조회 헬퍼 (data.js)
 * - mainData.json을 로드하고, slug 기반 조회 등 데이터 접근 함수를 제공한다
 * - 컴포넌트/페이지에서 직접 JSON을 import하지 않고, 이 헬퍼를 통해 접근한다
 */

import mainData from '@/data/mainData.json';

/** 전체 데이터 반환 */
export function getMainData() {
  return mainData;
}

/** 사이트 기본 정보 반환 */
export function getSiteData() {
  return mainData.site;
}

/** 내비게이션 메뉴 반환 */
export function getNavData() {
  return mainData.nav;
}

/** 페이지별 SEO/콘텐츠 데이터 반환 */
export function getPageData(pageKey) {
  return mainData.pages?.[pageKey] || null;
}

/** 전체 강의 목록 반환 */
export function getCourses() {
  return mainData.courses || [];
}

/** slug로 강의 1건 조회 */
export function findCourseBySlug(slug) {
  return mainData.courses?.find((course) => course.slug === slug) || null;
}

/** 추천(featured) 강의 목록 반환 */
export function getFeaturedCourses() {
  return mainData.courses?.filter((course) => course.featured) || [];
}

/** 전역 FAQ 반환 */
export function getFaq() {
  return mainData.faq || [];
}

/** 후기/추천사 반환 */
export function getTestimonials() {
  return mainData.testimonials || [];
}

/** GEO 데이터 반환 */
export function getGeoData() {
  return mainData.geo || null;
}

/** 푸터 데이터 반환 */
export function getFooterData() {
  return mainData.footer || null;
}
