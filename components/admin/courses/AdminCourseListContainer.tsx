/**
 * 관리자 강의 목록 컨테이너 (AdminCourseListContainer)
 * - 필터(상태/카테고리/키워드) + 테이블 + 페이지네이션
 * - 백엔드 GET /api/v1/admin/courses 응답 형태의 mock 데이터를 클라이언트에서 필터링/페이징
 * - 추후 백엔드 연동 시 필터/페이징 파라미터를 그대로 query string으로 전달
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import type {
  AdminCourseCategory,
  AdminCourseListItem,
  AdminCourseLevel,
  AdminCourseStatus,
} from '@/types';

interface FiltersCopy {
  statusLabel: string;
  statusAllLabel: string;
  categoryLabel: string;
  categoryAllLabel: string;
  keywordLabel: string;
  keywordPlaceholder: string;
  keywordAriaLabel: string;
  resetLabel: string;
  resetAriaLabel: string;
}

interface ColumnsCopy {
  id: string;
  title: string;
  category: string;
  instructor: string;
  level: string;
  price: string;
  status: string;
  enrollment: string;
  createdAt: string;
  actions: string;
}

interface ActionsCopy {
  viewLabel: string;
  viewAriaLabelTemplate: string;
  statusChangeLabel: string;
  statusChangeAriaLabelTemplate: string;
}

interface PaginationCopy {
  previousLabel: string;
  previousAriaLabel: string;
  nextLabel: string;
  nextAriaLabel: string;
  pageInfoTemplate: string;
  pageSize: number;
}

export interface AdminCoursesCopy {
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonAriaLabel: string;
  createButtonHref: string;
  filters: FiltersCopy;
  statusLabels: Record<AdminCourseStatus, string>;
  levelLabels: Record<AdminCourseLevel, string>;
  columns: ColumnsCopy;
  actions: ActionsCopy;
  currencyUnit: string;
  personUnit: string;
  emptyText: string;
  pagination: PaginationCopy;
}

interface AdminCourseListContainerProps {
  courses: AdminCourseListItem[];
  categories: AdminCourseCategory[];
  copy: AdminCoursesCopy;
}

const STATUS_VALUES: AdminCourseStatus[] = ['DRAFT', 'PUBLISHED', 'HIDDEN', 'DELETED'];

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const fillTemplate = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );

export default function AdminCourseListContainer({
  courses,
  categories,
  copy,
}: AdminCourseListContainerProps): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<AdminCourseStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && c.categoryId !== categoryFilter) return false;
      if (normalizedKeyword) {
        const inTitle = c.title.toLowerCase().includes(normalizedKeyword);
        const inInstructor = c.instructorNames.some((n) =>
          n.toLowerCase().includes(normalizedKeyword),
        );
        if (!inTitle && !inInstructor) return false;
      }
      return true;
    });
  }, [courses, statusFilter, categoryFilter, normalizedKeyword]);

  const pageSize = copy.pagination.pageSize;
  const totalCount = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedCourses = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, safePage, pageSize]);

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as AdminCourseStatus | 'ALL');
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setCategoryFilter(v === 'ALL' ? 'ALL' : Number(v));
    setPage(1);
  }, []);

  const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setKeyword('');
    setPage(1);
  }, []);

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  return (
    <div className="admin-courses">
      <header className="admin-courses__header">
        <div>
          <h1 className="admin-courses__title">{copy.title}</h1>
          <p className="admin-courses__subtitle">{copy.subtitle}</p>
        </div>
        <Link
          href={copy.createButtonHref}
          aria-label={copy.createButtonAriaLabel}
          className="admin-courses__create-btn"
        >
          {copy.createButtonLabel}
        </Link>
      </header>

      <section className="admin-courses__filters" aria-label={copy.filters.keywordLabel}>
        <label className="admin-courses__filter">
          <span className="admin-courses__filter-label">{copy.filters.statusLabel}</span>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="admin-courses__select"
          >
            <option value="ALL">{copy.filters.statusAllLabel}</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {copy.statusLabels[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-courses__filter">
          <span className="admin-courses__filter-label">{copy.filters.categoryLabel}</span>
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="admin-courses__select"
          >
            <option value="ALL">{copy.filters.categoryAllLabel}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-courses__filter admin-courses__filter--grow">
          <span className="admin-courses__filter-label">{copy.filters.keywordLabel}</span>
          <input
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder={copy.filters.keywordPlaceholder}
            aria-label={copy.filters.keywordAriaLabel}
            className="admin-courses__input"
          />
        </label>

        <button
          type="button"
          onClick={handleReset}
          aria-label={copy.filters.resetAriaLabel}
          className="admin-courses__reset-btn"
        >
          {copy.filters.resetLabel}
        </button>
      </section>

      {pagedCourses.length === 0 ? (
        <p className="admin-courses__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-courses__table-wrap">
          <table className="admin-courses__table">
            <thead>
              <tr>
                <th scope="col" className="admin-courses__th admin-courses__th--id">
                  {copy.columns.id}
                </th>
                <th scope="col" className="admin-courses__th">{copy.columns.title}</th>
                <th scope="col" className="admin-courses__th">{copy.columns.category}</th>
                <th scope="col" className="admin-courses__th">{copy.columns.instructor}</th>
                <th scope="col" className="admin-courses__th">{copy.columns.level}</th>
                <th scope="col" className="admin-courses__th admin-courses__th--num">
                  {copy.columns.price}
                </th>
                <th scope="col" className="admin-courses__th">{copy.columns.status}</th>
                <th scope="col" className="admin-courses__th admin-courses__th--num">
                  {copy.columns.enrollment}
                </th>
                <th scope="col" className="admin-courses__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-courses__th admin-courses__th--actions">
                  {copy.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedCourses.map((c) => (
                <tr key={c.id}>
                  <td className="admin-courses__td admin-courses__td--id">{c.id}</td>
                  <td className="admin-courses__td admin-courses__td--title">{c.title}</td>
                  <td className="admin-courses__td">{c.categoryName}</td>
                  <td className="admin-courses__td">{c.instructorNames.join(', ')}</td>
                  <td className="admin-courses__td">{copy.levelLabels[c.level]}</td>
                  <td className="admin-courses__td admin-courses__td--num">
                    {formatNumber(c.price)}
                    {copy.currencyUnit}
                  </td>
                  <td className="admin-courses__td">
                    <span
                      className={`admin-courses__status admin-courses__status--${c.status.toLowerCase()}`}
                    >
                      {copy.statusLabels[c.status]}
                    </span>
                  </td>
                  <td className="admin-courses__td admin-courses__td--num">
                    {formatNumber(c.enrollmentCount)}
                    {copy.personUnit}
                  </td>
                  <td className="admin-courses__td">{formatDate(c.createdAt)}</td>
                  <td className="admin-courses__td admin-courses__td--actions">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      aria-label={fillTemplate(copy.actions.viewAriaLabelTemplate, {
                        title: c.title,
                      })}
                      className="admin-courses__action-link"
                    >
                      {copy.actions.viewLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="admin-courses__pagination" aria-label="페이지 탐색">
        <button
          type="button"
          onClick={goPrev}
          disabled={safePage <= 1}
          aria-label={copy.pagination.previousAriaLabel}
          className="admin-courses__page-btn"
        >
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-courses__page-info" aria-live="polite">
          {fillTemplate(copy.pagination.pageInfoTemplate, {
            current: safePage,
            total: totalPages,
            totalCount,
          })}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={safePage >= totalPages}
          aria-label={copy.pagination.nextAriaLabel}
          className="admin-courses__page-btn"
        >
          {copy.pagination.nextLabel}
        </button>
      </nav>
    </div>
  );
}
