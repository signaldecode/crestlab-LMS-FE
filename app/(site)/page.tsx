/**
 * 홈(랜딩) 페이지
 * - 공개 사이트의 메인 진입점 ("/")
 * - 동적 데이터(배너/큐레이션 강의/강사/후기)는 백엔드 `GET /api/v1/main` 통합 API에서 가져온다
 *   - MainPageProvider 가 한 번 fetch → 자식 컴포넌트들이 useMainPage()로 공유
 *   - Redis 5분 캐시 (백엔드)
 * - 정적 메타(섹션 제목/aria/카테고리 아이콘 매핑)는 data/homeData.json 유지
 */

import HomeHeroContainer from '@/components/containers/HomeHeroContainer';
import HomeCategoryNav from '@/components/home/HomeCategoryNav';
import {
  HomeBestCourses,
  HomeRecommendedCourses,
  HomeNewCourses,
} from '@/components/home/HomeMainCurations';
import HomeInstructors from '@/components/home/HomeInstructors';
import BestReviewContainer from '@/components/containers/BestReviewContainer';
import HomeNewsContainer from '@/components/containers/HomeNewsContainer';
import { MainPageProvider } from '@/components/home/MainPageProvider';
import { getHomeCategories, getHomeInstructors, getHomeNews } from '@/lib/data';

export default function HomePage() {
  const categories = getHomeCategories();
  const instructors = getHomeInstructors();
  const homeNews = getHomeNews();

  return (
    <MainPageProvider>
      <main className="home-page">
        {/* 1. 히어로 배너 캐러셀 (백엔드 banners) */}
        <HomeHeroContainer />

        {/* 2. 카테고리 퀵메뉴 (정적 — 아이콘 매핑 필요) */}
        <HomeCategoryNav section={categories} />

        {/* 3. BEST 강의 큐레이션 */}
        <HomeBestCourses />

        {/* 4. RECOMMEND 강의 큐레이션 */}
        <HomeRecommendedCourses />

        {/* 5. NEW 강의 큐레이션 */}
        <HomeNewCourses />

        {/* 6. 인기 강사 소개 (백엔드 instructors + 정적 메타) */}
        <HomeInstructors section={instructors} />

        {/* 7. 수강생 베스트 후기 (백엔드 topReviews + 정적 메타) */}
        <BestReviewContainer />

        {/* 8. 이주의 추천 뉴스 (백엔드 /v1/news — sourceUrl 필요해 분리 호출) */}
        <HomeNewsContainer section={homeNews} />
      </main>
    </MainPageProvider>
  );
}
