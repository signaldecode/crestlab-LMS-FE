/**
 * 베스트 강의 페이지
 * - 칩 필터로 카테고리별 베스트 강의를 탐색한다
 * - 카테고리별 최근 7일간 인기도 기반으로 추천한다
 */

import type { Metadata } from 'next';
import { getPageData } from '@/lib/data';
import BestCoursesContainer from '@/components/containers/BestCoursesContainer';

const bestPageData = getPageData('best') as { seo: { title: string; description: string } } | null;

export const metadata: Metadata = {
  title: bestPageData?.seo?.title,
  description: bestPageData?.seo?.description,
};

export default function BestPage() {
  return (
    <section className="best-page-wrapper">
      <BestCoursesContainer />
    </section>
  );
}
