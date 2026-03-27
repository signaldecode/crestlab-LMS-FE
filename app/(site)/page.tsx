/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점 ("/")
 * - 강의 섹션 3가지 레이아웃 교차 배치:
 *   Feature(피처드) → Carousel(캐러셀) → Ranking(랭킹) → 반복
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import HomeCategoryNav from '@/components/home/HomeCategoryNav';
import HomeCourseFeature from '@/components/home/HomeCourseFeature';
import HomeCourseSection from '@/components/home/HomeCourseSection';
import HomeCourseRanking from '@/components/home/HomeCourseRanking';
import LiveCounterBar from '@/components/home/LiveCounterBar';
import TestimonialsContainer from '@/components/containers/TestimonialsContainer';
import HomeBestArticles from '@/components/home/HomeBestArticles';
import HomeInstructors from '@/components/home/HomeInstructors';
import HomePromoBanners from '@/components/home/HomePromoBanners';
import HomeCtaBanner from '@/components/home/HomeCtaBanner';
import HomeCommunity from '@/components/home/HomeCommunity';
import {
  getHomeSections,
  getHomeSectionCourses,
  getHomeCategories,
  getLiveCounter,
  getHomeBestArticles,
  getHomeInstructors,
  getHomePromoBanners,
  getCtaBanner,
} from '@/lib/data';

/** 레이아웃 패턴: Feature → Carousel → Ranking → 반복 */
const LAYOUT_CYCLE = ['feature', 'carousel', 'ranking'] as const;

export default function HomePage() {
  const sections = getHomeSections();
  const categories = getHomeCategories();
  const liveCounter = getLiveCounter();
  const bestArticles = getHomeBestArticles();
  const instructors = getHomeInstructors();
  const promoBanners = getHomePromoBanners();
  const ctaBanner = getCtaBanner();

  return (
    <main className="home-page">
      {/* 1. 히어로 배너 캐러셀 */}
      <HomeHeroContainer />

      {/* 2. 카테고리 아이콘 네비게이션 */}
      <HomeCategoryNav section={categories} />

      {/* 3. 강의 섹션 — 3가지 레이아웃 교차 배치 */}
      {sections.map((section, idx) => {
        const layout = LAYOUT_CYCLE[idx % LAYOUT_CYCLE.length];
        const courses = getHomeSectionCourses(section);

        switch (layout) {
          case 'feature':
            return <HomeCourseFeature key={section.title} title={section.title} courses={courses} />;
          case 'ranking':
            return <HomeCourseRanking key={section.title} title={section.title} courses={courses} />;
          default:
            return <HomeCourseSection key={section.title} title={section.title} courses={courses} />;
        }
      })}

      {/* 4. 실시간 수강 통계 카운터 */}
      <LiveCounterBar section={liveCounter} />

      {/* 5. 수강생 베스트 후기 */}
      <TestimonialsContainer />

      {/* 6. 이주의 베스트 인기글 */}
      <HomeBestArticles section={bestArticles} />

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
