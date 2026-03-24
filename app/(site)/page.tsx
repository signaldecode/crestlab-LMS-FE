/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점 ("/")
 * - 배너 캐러셀, 카테고리 아이콘, 키워드별 강의 리스트 섹션을 조립한다
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import HomeCategoryNav from '@/components/home/HomeCategoryNav';
import HomeCourseSection from '@/components/home/HomeCourseSection';
import TestimonialsContainer from '@/components/containers/TestimonialsContainer';
import { getHomeSections, getHomeSectionCourses } from '@/lib/data';

export default function HomePage() {
  const sections = getHomeSections();

  return (
    <main className="home-page">
      <HomeHeroContainer />
      <HomeCategoryNav />
      {sections.map((section) => (
        <HomeCourseSection
          key={section.title}
          title={section.title}
          courses={getHomeSectionCourses(section)}
        />
      ))}
      <TestimonialsContainer />
    </main>
  );
}
