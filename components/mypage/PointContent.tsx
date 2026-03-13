/**
 * 포인트 콘텐츠 (PointContent)
 * - /mypage/points 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import accountData from '@/data/accountData.json';

const pointsData = accountData.mypage.pointsPage;
const SK = 'mypage-classroom';

export default function PointContent(): JSX.Element {
  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{pointsData.title}</h2>

        {/* 포인트 요약 */}
        <div className={`${SK}__point-summary`}>
          <span className={`${SK}__point-summary-value`}>0{pointsData.unit}</span>
          <span className={`${SK}__point-summary-expire`}>{pointsData.expireNotice} <strong>0{pointsData.unit}</strong></span>
        </div>

        {/* 포인트 이력 */}
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{pointsData.emptyText}</p>
        </div>
      </div>
    </div>
  );
}
