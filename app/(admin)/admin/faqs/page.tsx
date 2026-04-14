/**
 * 관리자 FAQ 관리 페이지 (/admin/faqs)
 * - 카테고리 필터 + 목록
 */

'use client';

import { useMemo, useState } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { getAdminExtraData, getPageData } from '@/lib/data';

interface FaqsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  filters: { categoryLabel: string; categoryAllLabel: string };
  columns: { sortOrder: string; category: string; question: string; updatedAt: string; actions: string };
  actionLabels: { edit: string; delete: string };
  deleteModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
}

function getCopy(): FaqsCopy | null {
  const adminPage = getPageData('admin') as { faqs?: FaqsCopy } | null;
  return adminPage?.faqs ?? null;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminFaqsPage(): JSX.Element {
  const copy = getCopy();
  const faqs = getAdminExtraData().faqs;
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const categories = useMemo(() => {
    return Array.from(new Set(faqs.map((f) => f.category)));
  }, [faqs]);

  const filtered = useMemo(() => {
    const list = categoryFilter === 'ALL' ? faqs : faqs.filter((f) => f.category === categoryFilter);
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [faqs, categoryFilter]);

  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

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

      <section className="admin-list__filters">
        <label className="admin-list__filter">
          <span className="admin-list__filter-label">{copy.filters.categoryLabel}</span>
          <select
            value={categoryFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
            className="admin-list__select"
          >
            <option value="ALL">{copy.filters.categoryAllLabel}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </section>

      {filtered.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.sortOrder}</th>
                <th scope="col" className="admin-list__th">{copy.columns.category}</th>
                <th scope="col" className="admin-list__th">{copy.columns.question}</th>
                <th scope="col" className="admin-list__th">{copy.columns.updatedAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td className="admin-list__td admin-list__td--narrow">{f.sortOrder}</td>
                  <td className="admin-list__td">
                    <span className="admin-list__badge admin-list__badge--info">{f.category}</span>
                  </td>
                  <td className="admin-list__td admin-list__td--strong">{f.question}</td>
                  <td className="admin-list__td">{formatDate(f.updatedAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <Link href={`/admin/faqs/${f.id}/edit`} className="admin-list__action-link">
                      {copy.actionLabels.edit}
                    </Link>
                    <AdminDeleteAction
                      targetId={f.id}
                      buttonLabel={copy.actionLabels.delete}
                      modalTitle={copy.deleteModal.title}
                      modalDescription={copy.deleteModal.descriptionTemplate.replaceAll('{question}', f.question)}
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
