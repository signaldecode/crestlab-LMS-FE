/**
 * 오픈예정 강의 페이지
 * - 오픈 예정인 강의들을 카드 리스트 형식으로 보여준다
 * - 인기 오픈 예정 + 전체 오픈 예정 그리드로 구성된다
 */

import type { Metadata } from 'next';
import UpcomingCoursesContainer from '@/components/containers/UpcomingCoursesContainer';

export const metadata: Metadata = {
  title: '오픈예정 강의 — 강의 플랫폼',
  description: '곧 오픈되는 강의들을 미리 확인하고 알림을 신청하세요.',
};

export default function UpcomingPage() {
  return (
    <section className="upcoming-page-wrapper">
      <UpcomingCoursesContainer />
    </section>
  );
}
