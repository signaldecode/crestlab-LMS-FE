/**
 * 관리자 성공 사례 관리 페이지 (/admin/success-stories)
 * - 골격 구현
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { getAdminExtraData, getPageData } from '@/lib/data';

interface SuccessStoriesCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  columns: { sortOrder: string; title: string; authorName: string; isActive: string; createdAt: string; actions: string };
  activeLabels: { true: string; false: string };
  actionLabels: { edit: string; delete: string };
  deleteModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
}

function getCopy(): SuccessStoriesCopy | null {
  const adminPage = getPageData('admin') as { successStories?: SuccessStoriesCopy } | null;
  return adminPage?.successStories ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '성공 사례 관리' };
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminSuccessStoriesPage(): JSX.Element {
  const copy = getCopy();
  const stories = getAdminExtraData().successStories;
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  const sorted = [...stories].sort((a, b) => a.sortOrder - b.sortOrder);

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
                <th scope="col" className="admin-list__th">{copy.columns.authorName}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isActive}</th>
                <th scope="col" className="admin-list__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id}>
                  <td className="admin-list__td admin-list__td--narrow">{s.sortOrder}</td>
                  <td className="admin-list__td admin-list__td--strong">{s.title}</td>
                  <td className="admin-list__td">{s.authorName}</td>
                  <td className="admin-list__td">
                    <span className={`admin-list__badge admin-list__badge--${s.isActive ? 'success' : 'neutral'}`}>
                      {s.isActive ? copy.activeLabels.true : copy.activeLabels.false}
                    </span>
                  </td>
                  <td className="admin-list__td">{formatDate(s.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <Link href={`/admin/success-stories/${s.id}/edit`} className="admin-list__action-link">
                      {copy.actionLabels.edit}
                    </Link>
                    <AdminDeleteAction
                      targetId={s.id}
                      buttonLabel={copy.actionLabels.delete}
                      modalTitle={copy.deleteModal.title}
                      modalDescription={copy.deleteModal.descriptionTemplate.replaceAll('{title}', s.title)}
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
