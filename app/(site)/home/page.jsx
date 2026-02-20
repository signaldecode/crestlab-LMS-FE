/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점
 * - Hero, 추천 강의, 후기, FAQ 등 주요 섹션을 컨테이너로 조립한다
 * - SEO 메타데이터는 data 기반으로 생성한다
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import FeaturedCoursesContainer from '@/components/containers/FeaturedCoursesContainer';
import TestimonialsContainer from '@/components/containers/TestimonialsContainer';
import FaqContainer from '@/components/containers/FaqContainer';

export default function HomePage() {
  return (
    <>
      <HomeHeroContainer />
      <FeaturedCoursesContainer />
      <TestimonialsContainer />
      <FaqContainer />
    </>
  );
}
