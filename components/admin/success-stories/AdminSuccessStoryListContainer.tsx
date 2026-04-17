'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useNavigableRow } from '@/hooks/useNavigableRow';
import { fetchAdminSuccessStories } from '@/lib/adminApi';

export interface SuccessStoriesCopy {
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  columns: { sortOrder: string; title: string; authorName: string; isActive: string; createdAt: string; actions?: string };
  activeLabels: { true: string; false: string };
  actionLabels: { edit?: string; delete: string };
  deleteModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props { copy: SuccessStoriesCopy; common: CommonCopy; }

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminSuccessStoryListContainer({ copy, common }: Props): JSX.Element {
  const navigableRow = useNavigableRow();
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminSuccessStories, []);

  if (loading && !data) return <AdminLoading label={common.loadingText} />;
  if (error && !data) {
    return (
      <AdminError
        title={common.errorTitle}
        message={error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={refetch}
      />
    );
  }

  const sorted = [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

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
                <tr
                  key={s.id}
                  className="is-clickable"
                  {...navigableRow(`/admin/success-stories/${s.id}/edit`, s.title)}
                >
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
                    <AdminDeleteAction
                      targetId={s.id}
                      resource="successStory"
                      onDeleted={refetch}
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
