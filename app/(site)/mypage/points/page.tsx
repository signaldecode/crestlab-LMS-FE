/**
 * 포인트 페이지 (/mypage/points)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import PointContent from '@/components/mypage/PointContent';

export default function PointsPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <PointContent />
        </div>
      </div>
    </section>
  );
}
