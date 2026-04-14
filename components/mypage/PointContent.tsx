/**
 * 포인트 콘텐츠 (PointContent)
 * - /mypage/points 페이지에서 사용
 * - 포인트 요약(백엔드 /v1/points) + 적립/사용 탭 필터 + 거래 내역 리스트(/v1/points/histories)
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyPointHistories, fetchMyPointSummary } from '@/lib/userApi';
import accountData from '@/data/accountData.json';

const pointsData = accountData.mypage.pointsPage;
const SK = 'mypage-classroom';

type PointTab = 'earn' | 'use';

export default function PointContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<PointTab>('earn');

  const summaryQuery = useAdminQuery(fetchMyPointSummary, []);
  const historyQuery = useAdminQuery(
    () => fetchMyPointHistories({ type: activeTab === 'earn' ? 'EARN' : 'USE', size: 50 }),
    [activeTab],
  );

  const totalPoints = summaryQuery.data?.totalPoints ?? 0;
  const expiringPoints = summaryQuery.data?.expiringPoints ?? 0;
  const items = historyQuery.data?.content ?? [];

  function formatAmount(amount: number): string {
    const prefix = amount > 0 ? '+' : '';
    return `${prefix}${amount.toLocaleString('ko-KR')}${pointsData.unit}`;
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{pointsData.title}</h2>
        <div className={`${SK}__point-summary`}>
          <span className={`${SK}__point-summary-value`}>
            {totalPoints.toLocaleString('ko-KR')}{pointsData.unit}
          </span>
          <span className={`${SK}__point-summary-expire`}>
            {pointsData.expireNotice} <strong>{expiringPoints.toLocaleString('ko-KR')}{pointsData.unit}</strong>
          </span>
        </div>

        <h3 className={`${SK}__point-history-title`}>{pointsData.historyTitle}</h3>

        <div className={`${SK}__point-tabs`} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'earn'}
            className={`${SK}__point-tab${activeTab === 'earn' ? ` ${SK}__point-tab--active` : ''}`}
            onClick={() => setActiveTab('earn')}
          >
            {pointsData.tabs.earn}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'use'}
            className={`${SK}__point-tab${activeTab === 'use' ? ` ${SK}__point-tab--active` : ''}`}
            onClick={() => setActiveTab('use')}
          >
            {pointsData.tabs.use}
          </button>
        </div>

        <div className={`${SK}__point-list`} role="tabpanel">
          {historyQuery.loading && !historyQuery.data ? (
            <div className={`${SK}__empty`}>
              <p className={`${SK}__empty-text`}>불러오는 중…</p>
            </div>
          ) : historyQuery.error && !historyQuery.data ? (
            <div className={`${SK}__empty`}>
              <p className={`${SK}__empty-text`}>{historyQuery.error.message}</p>
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className={`${SK}__point-item`}>
                <div className={`${SK}__point-item-info`}>
                  <p className={`${SK}__point-item-desc`}>{item.description}</p>
                  <span className={`${SK}__point-item-date`}>
                    {pointsData.dateLabel}  {formatDate(item.createdAt)}
                  </span>
                </div>
                <span
                  className={`${SK}__point-item-amount${
                    item.type === 'EARN' ? ` ${SK}__point-item-amount--earn` : ` ${SK}__point-item-amount--use`
                  }`}
                >
                  {formatAmount(item.type === 'EARN' ? item.amount : -item.amount)}
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
