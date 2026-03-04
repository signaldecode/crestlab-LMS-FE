/**
 * 강의 상담 페이지 (/mypage/consultations)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import ConsultationContent from '@/components/mypage/ConsultationContent';

export default function ConsultationsPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <ConsultationContent />
        </div>
      </div>
    </section>
  );
}
