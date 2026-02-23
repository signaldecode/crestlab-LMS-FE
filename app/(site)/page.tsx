/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점 ("/")
 * - 배너 캐러셀, 카테고리 아이콘, 키워드별 강의 리스트 섹션을 조립한다
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import HomeCategoryNav from '@/components/home/HomeCategoryNav';
import HomeCourseSection from '@/components/home/HomeCourseSection';

const courseSections = [
  { title: '지금 가장 주목받는 강의' },
  { title: 'BEST 재테크 클래스' },
  { title: '이번 달 BEST' },
  { title: '요즘 뜨는 부동산 지역 분석 강의' },
  { title: '새로 나온 강의' },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <HomeHeroContainer />
      <HomeCategoryNav />
      {courseSections.map((section) => (
        <HomeCourseSection key={section.title} title={section.title} />
      ))}
    </main>
  );
}
