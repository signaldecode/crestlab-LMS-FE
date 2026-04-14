/**
 * 관리자 배너 관리 페이지 (/admin/banners)
 * - 골격 구현: 목록만 표시, 등록/수정/삭제는 후속 작업
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { getAdminExtraData, getPageData } from '@/lib/data';

interface BannersCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  columns: { sortOrder: string; title: string; linkUrl: string; period: string; isActive: string; actions: string };
  activeLabels: { true: string; false: string };
  actionLabels: { edit: string; delete: string };
  deleteModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
}

function getCopy(): BannersCopy | null {
  const adminPage = getPageData('admin') as { banners?: BannersCopy } | null;
  return adminPage?.banners ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '배너 관리' };
}

export default function AdminBannersPage(): JSX.Element {
  const copy = getCopy();
  const banners = getAdminExtraData().banners;
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  const sorted = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <Link href={copy.createButtonHref} aria-label={copy.createButtonAriaLabel} className="admin-list__cta-btn">
          {copy.createButtonLabel}
        </Link>
      </header>

      {sorted.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.sortOrder}</th>
                <th scope="col" className="admin-list__th">{copy.columns.title}</th>
                <th scope="col" className="admin-list__th">{copy.columns.linkUrl}</th>
                <th scope="col" className="admin-list__th">{copy.columns.period}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isActive}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.id}>
                  <td className="admin-list__td admin-list__td--narrow">{b.sortOrder}</td>
                  <td className="admin-list__td admin-list__td--strong">{b.title}</td>
                  <td className="admin-list__td admin-list__td--ellipsis">{b.linkUrl}</td>
                  <td className="admin-list__td">{b.startDate} ~ {b.endDate}</td>
                  <td className="admin-list__td">
                    <span className={`admin-list__badge admin-list__badge--${b.isActive ? 'success' : 'neutral'}`}>
                      {b.isActive ? copy.activeLabels.true : copy.activeLabels.false}
                    </span>
                  </td>
                  <td className="admin-list__td admin-list__td--actions">
                    <Link href={`/admin/banners/${b.id}/edit`} className="admin-list__action-link">
                      {copy.actionLabels.edit}
                    </Link>
                    <AdminDeleteAction
                      targetId={b.id}
                      buttonLabel={copy.actionLabels.delete}
                      modalTitle={copy.deleteModal.title}
                      modalDescription={copy.deleteModal.descriptionTemplate.replaceAll('{title}', b.title)}
                      confirmLabel={copy.deleteModal.confirmLabel}
                      cancelLabel={copy.deleteModal.cancelLabel}
                    />
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
