/**
 * 상품권 콘텐츠 (GiftcardContent)
 * - /mypage/giftcards 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';

const SK = 'mypage-classroom';

export default function GiftcardContent(): JSX.Element {
  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>상품권</h2>

        {/* 총 사용가능 금액 */}
        <div className={`${SK}__giftcard-summary`}>
          <span className={`${SK}__giftcard-summary-label`}>총 사용가능</span>
          <span className={`${SK}__giftcard-summary-value`}>0원</span>
        </div>

        {/* 보유 상품권 */}
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>보유중인 상품권이 없습니다.</p>
        </div>

        {/* 이용내역 */}
        <div className={`${SK}__giftcard-history`}>
          <h3 className={`${SK}__giftcard-history-title`}>이용내역</h3>
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>최근 이용내역이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
