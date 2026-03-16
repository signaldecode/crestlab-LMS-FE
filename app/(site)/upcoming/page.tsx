/**
 * 오픈예정 강의 페이지
 * - 오픈 예정인 강의들을 카드 리스트 형식으로 보여준다
 * - 인기 오픈 예정 + 전체 오픈 예정 그리드로 구성된다
 */

import type { Metadata } from 'next';
import { getPageData } from '@/lib/data';
import UpcomingCoursesContainer from '@/components/containers/UpcomingCoursesContainer';

const upcomingPageData = getPageData('upcoming') as { seo: { title: string; description: string } } | null;

export const metadata: Metadata = {
  title: upcomingPageData?.seo?.title,
  description: upcomingPageData?.seo?.description,
};

export default function UpcomingPage() {
  return (
    <section className="upcoming-page-wrapper">
      <UpcomingCoursesContainer />
    </section>
  );
}
