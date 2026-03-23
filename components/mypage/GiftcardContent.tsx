/**
 * 상품권 콘텐츠 (GiftcardContent)
 * - /mypage/giftcards 페이지에서 사용
 * - 보유 상품권 목록 + 이용내역 표시
 */

'use client';

import { useMemo } from 'react';
import type { JSX } from 'react';
import { getGiftcards, getGiftcardHistory } from '@/lib/data';
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';

const giftcardsData = accountData.mypage.giftcardsPage;
const SK = 'mypage-classroom';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

export default function GiftcardContent(): JSX.Element {
  const giftcards = getGiftcards();
  const history = getGiftcardHistory();

  const totalBalance = useMemo(
    () => giftcards.filter((gc) => gc.status === 'active').reduce((sum, gc) => sum + gc.balance, 0),
    [giftcards],
  );

  const activeGiftcards = giftcards.filter((gc) => gc.status === 'active');
  const inactiveGiftcards = giftcards.filter((gc) => gc.status !== 'active');

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{giftcardsData.title}</h2>

        {/* 총 사용가능 금액 */}
        <div className={`${SK}__giftcard-summary`}>
          <span className={`${SK}__giftcard-summary-label`}>{giftcardsData.totalLabel}</span>
          <span className={`${SK}__giftcard-summary-value`}>{formatPrice(totalBalance)}</span>
        </div>

        {/* 보유 상품권 목록 */}
        {activeGiftcards.length === 0 && inactiveGiftcards.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{giftcardsData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__giftcard-list`}>
            {activeGiftcards.map((gc) => (
              <div key={gc.id} className={`${SK}__giftcard-item`}>
                <div className={`${SK}__giftcard-item-header`}>
                  <span className={`${SK}__giftcard-item-name`}>{gc.name}</span>
                  <span className={`${SK}__giftcard-item-status ${SK}__giftcard-item-status--active`}>
                    {giftcardsData.statusLabels.active}
                  </span>
                </div>
                <div className={`${SK}__giftcard-item-body`}>
                  <div className={`${SK}__giftcard-item-row`}>
                    <span className={`${SK}__giftcard-item-label`}>{giftcardsData.balanceLabel}</span>
                    <span className={`${SK}__giftcard-item-value`}>{formatPrice(gc.balance)}</span>
                  </div>
                  <div className={`${SK}__giftcard-item-row`}>
                    <span className={`${SK}__giftcard-item-label`}>{giftcardsData.expiryLabel}</span>
                    <span className={`${SK}__giftcard-item-date`}>{gc.validFrom} ~ {gc.validTo}</span>
                  </div>
                </div>
              </div>
            ))}
            {inactiveGiftcards.map((gc) => (
              <div key={gc.id} className={`${SK}__giftcard-item ${SK}__giftcard-item--inactive`}>
                <div className={`${SK}__giftcard-item-header`}>
                  <span className={`${SK}__giftcard-item-name`}>{gc.name}</span>
                  <span className={`${SK}__giftcard-item-status ${SK}__giftcard-item-status--${gc.status}`}>
                    {giftcardsData.statusLabels[gc.status as keyof typeof giftcardsData.statusLabels]}
                  </span>
                </div>
                <div className={`${SK}__giftcard-item-body`}>
                  <div className={`${SK}__giftcard-item-row`}>
                    <span className={`${SK}__giftcard-item-label`}>{giftcardsData.balanceLabel}</span>
                    <span className={`${SK}__giftcard-item-value`}>{formatPrice(gc.balance)}</span>
                  </div>
                  <div className={`${SK}__giftcard-item-row`}>
                    <span className={`${SK}__giftcard-item-label`}>{giftcardsData.expiryLabel}</span>
                    <span className={`${SK}__giftcard-item-date`}>{gc.validFrom} ~ {gc.validTo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 이용내역 */}
        <div className={`${SK}__giftcard-history`}>
          <h3 className={`${SK}__giftcard-history-title`}>{giftcardsData.historyTitle}</h3>
          {history.length === 0 ? (
            <div className={`${SK}__empty`}>
              <p className={`${SK}__empty-text`}>{giftcardsData.historyEmptyText}</p>
            </div>
          ) : (
            <div className={`${SK}__giftcard-history-list`}>
              {history.map((item) => (
                <div key={item.id} className={`${SK}__giftcard-history-row`}>
                  <span className={`${SK}__giftcard-history-date`}>{item.date}</span>
                  <span className={`${SK}__giftcard-history-desc`}>{item.description}</span>
                  <span className={`${SK}__giftcard-history-amount ${SK}__giftcard-history-amount--${item.type}`}>
                    {item.type === 'charge' ? '+' : ''}{formatPrice(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
