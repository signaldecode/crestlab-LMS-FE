/**
 * 베스트 강의 페이지
 * - 칩 필터로 카테고리별 베스트 강의를 탐색한다
 * - 카테고리별 최근 7일간 인기도 기반으로 추천한다
 */

import type { Metadata } from 'next';
import BestCoursesContainer from '@/components/containers/BestCoursesContainer';

export const metadata: Metadata = {
  title: '베스트 강의 — 강의 플랫폼',
  description: '가장 인기있는 베스트 강의를 카테고리별로 확인하세요.',
};

export default function BestPage() {
  return (
    <section className="best-page-wrapper">
      <BestCoursesContainer />
    </section>
  );
}
