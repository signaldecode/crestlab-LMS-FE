/**
 * 상품권 콘텐츠 (GiftcardContent)
 * - /mypage/giftcards 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import accountData from '@/data/accountData.json';

const giftcardsData = accountData.mypage.giftcardsPage;
const SK = 'mypage-classroom';

export default function GiftcardContent(): JSX.Element {
  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{giftcardsData.title}</h2>

        {/* 총 사용가능 금액 */}
        <div className={`${SK}__giftcard-summary`}>
          <span className={`${SK}__giftcard-summary-label`}>{giftcardsData.totalLabel}</span>
          <span className={`${SK}__giftcard-summary-value`}>{giftcardsData.defaultValue}</span>
        </div>

        {/* 보유 상품권 */}
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{giftcardsData.emptyText}</p>
        </div>

        {/* 이용내역 */}
        <div className={`${SK}__giftcard-history`}>
          <h3 className={`${SK}__giftcard-history-title`}>{giftcardsData.historyTitle}</h3>
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{giftcardsData.historyEmptyText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
