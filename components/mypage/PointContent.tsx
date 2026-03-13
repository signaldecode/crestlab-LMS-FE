/**
 * 포인트 콘텐츠 (PointContent)
 * - /mypage/points 페이지에서 사용
 * - 포인트 요약 + 적립/사용 탭 필터 + 거래 내역 리스트
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import accountData from '@/data/accountData.json';

const pointsData = accountData.mypage.pointsPage;
const SK = 'mypage-classroom';

type PointTab = 'earn' | 'use';

interface PointHistory {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
}

export default function PointContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<PointTab>('earn');

  const history = pointsData.mockHistory as PointHistory[];

  const earnItems = useMemo(() => history.filter((item) => item.type === 'earn'), [history]);
  const useItems = useMemo(() => history.filter((item) => item.type === 'use'), [history]);

  const filteredItems = activeTab === 'earn' ? earnItems : useItems;

  const totalPoints = useMemo(
    () => history.reduce((sum, item) => sum + item.amount, 0),
    [history],
  );

  function formatAmount(amount: number): string {
    const prefix = amount > 0 ? '+' : '';
    return `${prefix}${amount}${pointsData.unit}`;
  }

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        {/* 포인트 요약 */}
        <h2 className={`${SK}__menu-title`}>{pointsData.title}</h2>
        <div className={`${SK}__point-summary`}>
          <span className={`${SK}__point-summary-value`}>
            {totalPoints}{pointsData.unit}
          </span>
          <span className={`${SK}__point-summary-expire`}>
            {pointsData.expireNotice} <strong>0{pointsData.unit}</strong>
          </span>
        </div>

        {/* 포인트 사용 내역 */}
        <h3 className={`${SK}__point-history-title`}>{pointsData.historyTitle}</h3>

        {/* 탭 필터 */}
        <div className={`${SK}__point-tabs`} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'earn'}
            className={`${SK}__point-tab${activeTab === 'earn' ? ` ${SK}__point-tab--active` : ''}`}
            onClick={() => setActiveTab('earn')}
          >
            {pointsData.tabs.earn}
            <span className={`${SK}__point-tab-count`}>{earnItems.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'use'}
            className={`${SK}__point-tab${activeTab === 'use' ? ` ${SK}__point-tab--active` : ''}`}
            onClick={() => setActiveTab('use')}
          >
            {pointsData.tabs.use}
            <span className={`${SK}__point-tab-count`}>{useItems.length}</span>
          </button>
        </div>

        {/* 거래 내역 리스트 */}
        <div className={`${SK}__point-list`} role="tabpanel">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className={`${SK}__point-item`}>
                <div className={`${SK}__point-item-info`}>
                  <p className={`${SK}__point-item-desc`}>{item.description}</p>
                  <span className={`${SK}__point-item-date`}>
                    {pointsData.dateLabel}  {item.date}
                  </span>
                </div>
                <span
                  className={`${SK}__point-item-amount${
                    item.amount > 0 ? ` ${SK}__point-item-amount--earn` : ` ${SK}__point-item-amount--use`
                  }`}
                >
                  {formatAmount(item.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className={`${SK}__empty`}>
              <p className={`${SK}__empty-text`}>{pointsData.emptyText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
