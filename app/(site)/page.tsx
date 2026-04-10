/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점 ("/")
 * - 강의 섹션은 카테고리 칩으로 필터링되는 캐러셀 2개로 구성된다
 *   (이주의 추천 프로그램, 이달의 추천 프로그램)
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import HomeCategoryNav from '@/components/home/HomeCategoryNav';
import HomeCourseSection from '@/components/home/HomeCourseSection';
import LiveCounterBar from '@/components/home/LiveCounterBar';
import TestimonialsContainer from '@/components/containers/TestimonialsContainer';
import HomeBestArticles from '@/components/home/HomeBestArticles';
import HomeInstructors from '@/components/home/HomeInstructors';
import HomePromoBanners from '@/components/home/HomePromoBanners';
import HomeCtaBanner from '@/components/home/HomeCtaBanner';
import HomeCommunity from '@/components/home/HomeCommunity';
import {
  getHomeCategories,
  getHomeSectionViews,
  getLiveCounter,
  getHomeBestArticles,
  getHomeInstructors,
  getHomePromoBanners,
  getCtaBanner,
} from '@/lib/data';

export default function HomePage() {
  const categories = getHomeCategories();
  const sectionViews = getHomeSectionViews();
  const liveCounter = getLiveCounter();
  const bestArticles = getHomeBestArticles();
  const instructors = getHomeInstructors();
  const promoBanners = getHomePromoBanners();
  const ctaBanner = getCtaBanner();

  return (
    <main className="home-page">
      {/* 1. 히어로 배너 캐러셀 */}
      <HomeHeroContainer />

      {/* 2. 카테고리 퀵메뉴 */}
      <HomeCategoryNav section={categories} />

      {/* 3. 강의 섹션 — 카테고리 칩 캐러셀 (이주/이달의 추천) */}
      {sectionViews.map((view) => (
        <HomeCourseSection key={view.title} view={view} />
      ))}

      
      {/* 4. 수강생 베스트 후기 */}
      <TestimonialsContainer />

      {/* 5. 실시간 수강 통계 카운터 */}
      <LiveCounterBar section={liveCounter} />

      {/* 6. 이주의 베스트 인기글 */}
      {/* <HomeBestArticles section={bestArticles} /> */}

      {/* 7. 인기 강사 소개 */}
      <HomeInstructors section={instructors} />

      {/* 8. 프로모 배너 */}
      <HomePromoBanners section={promoBanners} />

      {/* 9. CTA 전환 배너 */}
      <HomeCtaBanner data={ctaBanner} />

      {/* 10. 커뮤니티 피드 */}
      <HomeCommunity />
    </main>
  );
}
