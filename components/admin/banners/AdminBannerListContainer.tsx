/**
 * 관리자 배너 목록 컨테이너 — 백엔드 GET /api/v1/admin/banners 연동
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminBanners } from '@/lib/adminApi';

export interface BannersCopy {
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

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface Props { copy: BannersCopy; common: CommonCopy; }

export default function AdminBannerListContainer({ copy, common }: Props): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminBanners, []);

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
                    <AdminActionButton href={`/admin/banners/${b.id}/edit`}>
                      {copy.actionLabels.edit}
                    </AdminActionButton>
                    <AdminDeleteAction
                      targetId={b.id}
                      resource="banner"
                      onDeleted={refetch}
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
