/**
 * 데이터 로드/조회 헬퍼 (data.ts)
 * - mainData.json을 로드하고, slug 기반 조회 등 데이터 접근 함수를 제공한다
 * - 컴포넌트/페이지에서 직접 JSON을 import하지 않고, 이 헬퍼를 통해 접근한다
 */

import mainData from '@/data';
import type { MainData, SiteData, NavData, Course, HomeSection, HomeSectionView, UpcomingCourse, BestCourse, BestChipCategory, FaqItem, BestReviewSection, FooterData, GeoData, PopularArticlesSection, HomeBestArticlesSection, HomePromoBannerSection, HomeCategorySection, LiveCounterSection, HomeInstructorsSection, HomeNewsSection, CtaBannerData, BoardNotice, BoardData } from '@/types';

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


/** 홈 섹션 목록 반환 (raw 데이터) */
export function getHomeSections(): HomeSection[] {
  return data.homeSections || [];
}

/**
 * 홈 섹션을 칩별로 미리 resolve된 뷰로 변환해 반환한다.
 * - 첫 칩은 항상 "전체"이며, 섹션 내 모든 카테고리 슬러그의 합집합(중복 제거)이다.
 * - 이후 칩은 데이터의 카테고리 순서를 그대로 따른다.
 * - 서버에서 한 번에 조립해 클라이언트로 내려보내기 위한 형태다.
 */
export function getHomeSectionViews(): HomeSectionView[] {
  const courses = data.courses || [];
  const findBySlug = (slug: string): Course | undefined =>
    courses.find((c) => c.slug === slug);
  const resolve = (slugs: string[]): Course[] =>
    slugs.map(findBySlug).filter((c): c is Course => Boolean(c));

  return getHomeSections().map((section) => {
    const allSlugs = Array.from(
      new Set(section.categories.flatMap((cat) => cat.slugs)),
    );
    return {
      title: section.title,
      subtitle: section.subtitle,
      chips: [
        { label: '전체', courses: resolve(allSlugs) },
        ...section.categories.map((cat) => ({
          label: cat.label,
          courses: resolve(cat.slugs),
        })),
      ],
    };
  });
}

/** 홈 탭 섹션 뷰 반환 (베스트 후기 아래 탭 필터 강의 섹션) */
export function getHomeTabbedViews(): HomeSectionView[] {
  const courses = data.courses || [];
  const findBySlug = (slug: string): Course | undefined =>
    courses.find((c) => c.slug === slug);
  const resolve = (slugs: string[]): Course[] =>
    slugs.map(findBySlug).filter((c): c is Course => Boolean(c));

  return (data.homeTabbedSections || []).map((section) => ({
    title: section.title,
    subtitle: section.subtitle,
    chips: section.categories.map((cat) => ({
      label: cat.label,
      courses: resolve(cat.slugs),
    })),
  }));
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

/** 베스트 후기 섹션 반환 */
export function getBestReviews(): BestReviewSection {
  return data.bestReviews;
}

/** 실시간 인기 아티클 섹션 반환 */
export function getPopularArticles(): PopularArticlesSection {
  return data.popularArticles;
}

/** 이주의 베스트 인기글 섹션 반환 */
export function getHomeBestArticles(): HomeBestArticlesSection {
  return data.homeBestArticles;
}

/** 홈 카테고리 네비게이션 반환 */
export function getHomeCategories(): HomeCategorySection {
  return data.homeCategories;
}

/** 실시간 카운터 섹션 반환 */
export function getLiveCounter(): LiveCounterSection {
  return data.liveCounter;
}

/** 인기 강사 섹션 반환 */
export function getHomeInstructors(): HomeInstructorsSection {
  return data.homeInstructors;
}

/** 홈 뉴스 섹션 반환 */
export function getHomeNews(): HomeNewsSection {
  return data.homeNews;
}

/** CTA 배너 데이터 반환 */
export function getCtaBanner(): CtaBannerData {
  return data.ctaBanner;
}

/** 홈 프로모 배너 섹션 반환 */
export function getHomePromoBanners(): HomePromoBannerSection {
  return data.homePromoBanners;
}

/** GEO 데이터 반환 */
export function getGeoData(): GeoData | null {
  return data.geo || null;
}

/** 푸터 데이터 반환 */
export function getFooterData(): FooterData | null {
  return data.footer || null;
}

/* ── 게시판(공지사항) ── */

/** 게시판 페이지 데이터 반환 */
export function getBoardData(): BoardData {
  return data.board;
}

/** 전체 공지 목록 반환 */
export function getBoardNotices(): BoardNotice[] {
  return data.board?.notices || [];
}

/** slug로 공지 1건 조회 */
export function findNoticeBySlug(slug: string): BoardNotice | null {
  return data.board?.notices?.find((n) => n.slug === slug) || null;
}
