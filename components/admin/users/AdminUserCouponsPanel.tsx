/**
 * 관리자 사용자 쿠폰 패널 (AdminUserCouponsPanel)
 * - 사용자 상세 내 "쿠폰" 탭
 * - GET /admin/users/{id}/coupons → 유저가 보유한 모든 쿠폰 (isUsable 포함)
 * - 보유중 / 사용불가 / 사용완료 3탭 분류 (mypage 쿠폰 로직과 동일)
 */

'use client';

import { useState, useMemo } from 'react';
import type { JSX } from 'react';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminUserCoupons, type AdminUserCoupon } from '@/lib/adminApi';

type CouponTab = 'active' | 'unavailable' | 'used';

export interface AdminUserCouponsPanelCopy {
  tabActive: string;
  tabUnavailable: string;
  tabUsed: string;
  emptyActive: string;
  emptyUnavailable: string;
  emptyUsed: string;
  columns: {
    couponName: string;
    discount: string;
    period: string;
    status: string;
  };
  statusUsable: string;
  statusUnusable: string;
  statusUsed: string;
}

interface Props {
  userId: number;
  copy: AdminUserCouponsPanelCopy;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

function classify(coupons: AdminUserCoupon[]) {
  return {
    active: coupons.filter((c) => !c.isUsed && c.isUsable),
    unavailable: coupons.filter((c) => !c.isUsed && !c.isUsable),
    used: coupons.filter((c) => c.isUsed),
  };
}

export default function AdminUserCouponsPanel({ userId, copy }: Props): JSX.Element {
  const { data, loading, error } = useAdminQuery(() => fetchAdminUserCoupons(userId), [userId]);
  const coupons = data ?? [];

  const { active, unavailable, used } = useMemo(() => classify(coupons), [coupons]);
  const [tab, setTab] = useState<CouponTab>('active');

  const current = tab === 'active' ? active : tab === 'unavailable' ? unavailable : used;
  const emptyText = tab === 'active' ? copy.emptyActive : tab === 'unavailable' ? copy.emptyUnavailable : copy.emptyUsed;

  return (
    <div className="admin-user-coupons">
      <div className="admin-user-coupons__tabs" role="tablist">
        {([
          { key: 'active' as const, label: copy.tabActive, count: active.length },
          { key: 'unavailable' as const, label: copy.tabUnavailable, count: unavailable.length },
          { key: 'used' as const, label: copy.tabUsed, count: used.length },
        ]).map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`admin-user-coupons__tab${tab === key ? ' is-active' : ''}`}
          >
            {label} <span className="admin-user-coupons__tab-count">{count}</span>
          </button>
        ))}
      </div>

      {loading && coupons.length === 0 ? (
        <p className="admin-list__empty">...</p>
      ) : error ? (
        <p className="admin-list__empty">{error.message}</p>
      ) : current.length === 0 ? (
        <p className="admin-list__empty">{emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th">{copy.columns.couponName}</th>
                <th scope="col" className="admin-list__th">{copy.columns.discount}</th>
                <th scope="col" className="admin-list__th">{copy.columns.period}</th>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {current.map((c) => (
                <tr key={c.userCouponId}>
                  <td className="admin-list__td admin-list__td--strong">{c.couponName}</td>
                  <td className="admin-list__td">{c.discountInfo}</td>
                  <td className="admin-list__td">
                    {formatDate(c.startsAt)} ~ {formatDate(c.expiresAt)}
                  </td>
                  <td className="admin-list__td admin-list__td--narrow">
                    {c.isUsed
                      ? copy.statusUsed
                      : c.isUsable
                        ? copy.statusUsable
                        : copy.statusUnusable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
