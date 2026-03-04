/**
 * 포인트 콘텐츠 (PointContent)
 * - /mypage/points 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';

const SK = 'mypage-classroom';

export default function PointContent(): JSX.Element {
  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>포인트</h2>

        {/* 포인트 요약 */}
        <div className={`${SK}__point-summary`}>
          <span className={`${SK}__point-summary-value`}>0P</span>
          <span className={`${SK}__point-summary-expire`}>30일 이내 소멸 예정 <strong>0P</strong></span>
        </div>

        {/* 포인트 이력 */}
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>포인트 이력이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
