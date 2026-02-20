/**
 * 내 강의실 페이지
 * - 구매한 강의 목록, 진행률, 이어보기를 보여주는 학습 대시보드
 * - LearnDashboardContainer로 조립한다
 */

import LearnDashboardContainer from '@/components/containers/LearnDashboardContainer';

export default function LearnPage() {
  return (
    <section className="learn-page">
      <LearnDashboardContainer />
    </section>
  );
}
