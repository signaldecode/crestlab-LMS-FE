/**
 * 관리자 레벨 기준 관리 페이지 (/admin/levels)
 * - 레벨별 승급 기준 표시 + 수동 갱신 진입점
 * - 자동 갱신: 매일 새벽 3시
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { getAdminExtraData, getPageData } from '@/lib/data';

interface LevelsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  refreshButtonLabel: string;
  refreshButtonAriaLabel: string;
  refreshHelpText: string;
  columns: { level: string; minEnrollmentCount: string; minReviewCount: string; minTotalSpent: string; actions: string };
  actionLabels: { edit: string };
  currencyUnit: string;
  courseUnit: string;
  reviewUnit: string;
}

function getCopy(): LevelsCopy | null {
  const adminPage = getPageData('admin') as { levels?: LevelsCopy } | null;
  return adminPage?.levels ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '레벨 기준 관리' };
}

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');

export default function AdminLevelsPage(): JSX.Element {
  const copy = getCopy();
  const levels = getAdminExtraData().levels;
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <div>
          <button type="button" aria-label={copy.refreshButtonAriaLabel} className="admin-list__cta-btn">
            {copy.refreshButtonLabel}
          </button>
          <p className="admin-list__refresh-help">{copy.refreshHelpText}</p>
        </div>
      </header>

      <div className="admin-list__table-wrap">
        <table className="admin-list__table">
          <thead>
            <tr>
              <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.level}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minEnrollmentCount}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minReviewCount}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minTotalSpent}</th>
              <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level}>
                <td className="admin-list__td admin-list__td--strong">{l.level}</td>
                <td className="admin-list__td admin-list__td--num">{l.minEnrollmentCount}{copy.courseUnit}</td>
                <td className="admin-list__td admin-list__td--num">{l.minReviewCount}{copy.reviewUnit}</td>
                <td className="admin-list__td admin-list__td--num">{formatNumber(l.minTotalSpent)}{copy.currencyUnit}</td>
                <td className="admin-list__td admin-list__td--actions">
                  <button type="button" className="admin-list__action-btn">{copy.actionLabels.edit}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
