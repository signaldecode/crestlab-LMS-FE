/**
 * 내 강의실 컨테이너 (LearnDashboardContainer)
 * - 구매한 강의 목록, 진행률, 이어보기 버튼 등을 조립한다
 * - usePlayerStore에서 진행률 상태를 가져온다
 * - 수강 중인 강의와 완료된 강의를 구분하여 보여준다
 */

import type { JSX } from 'react';

export default function LearnDashboardContainer(): JSX.Element {
  return (
    <section className="learn-dashboard-container">
      {/* 수강 중 강의 카드 + 진행률 바 + 이어보기 CTA가 렌더링된다 */}
    </section>
  );
}
