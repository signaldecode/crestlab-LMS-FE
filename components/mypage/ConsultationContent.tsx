/**
 * 강의 상담 콘텐츠 (ConsultationContent)
 * - 백엔드 상담 API 미구현 — 빈 상태 표시만 유지 (향후 API 추가 시 연동)
 */

'use client';

import type { JSX } from 'react';
import accountData from '@/data/accountData.json';

const consultsPageData = accountData.mypage.consultationsPage;
const SK = 'mypage-classroom';

export default function ConsultationContent(): JSX.Element {
  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{consultsPageData.title}</h2>
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{consultsPageData.emptyText}</p>
        </div>
      </div>
    </div>
  );
}
