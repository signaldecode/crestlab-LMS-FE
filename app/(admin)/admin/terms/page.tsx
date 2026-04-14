/**
 * 관리자 약관 관리 페이지 (/admin/terms)
 * - 약관 종류별 탭 + 버전 이력 테이블 + "새 버전 등록" 진입점
 */

'use client';

import { useState, useMemo } from 'react';
import type { JSX } from 'react';
import { getAdminExtraData, getPageData } from '@/lib/data';
import type { AdminTermsType } from '@/types';

interface TermsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonAriaLabel: string;
  typeLabels: Record<AdminTermsType, string>;
  columns: { version: string; effectiveDate: string; isCurrent: string; createdAt: string; actions: string };
  currentBadgeLabel: string;
  actionLabels: { view: string };
  emptyText: string;
}

function getCopy(): TermsCopy | null {
  const adminPage = getPageData('admin') as { terms?: TermsCopy } | null;
  return adminPage?.terms ?? null;
}

const TYPE_VALUES: AdminTermsType[] = ['TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'LEARNING_POLICY', 'REFUND_POLICY'];

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminTermsPage(): JSX.Element {
  const copy = getCopy();
  const terms = getAdminExtraData().terms;
  const [activeType, setActiveType] = useState<AdminTermsType>('TERMS_OF_SERVICE');

  const filtered = useMemo(() => {
    return terms.filter((t) => t.type === activeType).sort((a, b) => b.version - a.version);
  }, [terms, activeType]);

  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <button type="button" aria-label={copy.createButtonAriaLabel} className="admin-list__cta-btn">
          {copy.createButtonLabel}
        </button>
      </header>

      <div className="admin-list__tabs" role="tablist">
        {TYPE_VALUES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={activeType === t}
            onClick={() => setActiveType(t)}
            className={`admin-list__tab${activeType === t ? ' is-active' : ''}`}
          >
            {copy.typeLabels[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.version}</th>
                <th scope="col" className="admin-list__th">{copy.columns.effectiveDate}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isCurrent}</th>
                <th scope="col" className="admin-list__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="admin-list__td admin-list__td--strong">v{t.version}</td>
                  <td className="admin-list__td">{t.effectiveDate}</td>
                  <td className="admin-list__td">
                    {t.isCurrent && (
                      <span className="admin-list__badge admin-list__badge--success">{copy.currentBadgeLabel}</span>
                    )}
                  </td>
                  <td className="admin-list__td">{formatDate(t.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <button type="button" className="admin-list__action-btn">
                      {copy.actionLabels.view}
                    </button>
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
