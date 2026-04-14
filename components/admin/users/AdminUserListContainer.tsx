/**
 * 관리자 사용자 목록 컨테이너 (AdminUserListContainer)
 * - 필터(역할/상태/키워드) + 테이블 + 페이지네이션
 * - 백엔드 GET /api/v1/admin/users 응답 형태의 mock 데이터를 클라이언트에서 필터링/페이징
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import type {
  AdminUserListItem,
  AdminUserLevel,
  AdminUserStatus,
  UserRole,
} from '@/types';

interface FiltersCopy {
  roleLabel: string;
  roleAllLabel: string;
  statusLabel: string;
  statusAllLabel: string;
  keywordLabel: string;
  keywordPlaceholder: string;
  keywordAriaLabel: string;
  resetLabel: string;
  resetAriaLabel: string;
}

interface ColumnsCopy {
  id: string;
  email: string;
  nickname: string;
  role: string;
  level: string;
  status: string;
  createdAt: string;
  actions: string;
}

interface ActionsCopy {
  viewLabel: string;
  viewAriaLabelTemplate: string;
}

interface PaginationCopy {
  previousLabel: string;
  previousAriaLabel: string;
  nextLabel: string;
  nextAriaLabel: string;
  pageInfoTemplate: string;
  pageSize: number;
}

export interface AdminUsersCopy {
  title: string;
  subtitle: string;
  filters: FiltersCopy;
  roleLabels: Record<UserRole, string>;
  statusLabels: Record<AdminUserStatus, string>;
  levelLabels: Record<AdminUserLevel, string>;
  columns: ColumnsCopy;
  actions: ActionsCopy;
  emptyText: string;
  pagination: PaginationCopy;
}

interface AdminUserListContainerProps {
  users: AdminUserListItem[];
  copy: AdminUsersCopy;
}

const ROLE_VALUES: UserRole[] = ['STUDENT', 'INSTRUCTOR', 'ADMIN'];
const STATUS_VALUES: AdminUserStatus[] = ['ACTIVE', 'SUSPENDED', 'WITHDRAWN'];

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

export default function AdminUserListContainer({
  users,
  copy,
}: AdminUserListContainerProps): JSX.Element {
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (normalizedKeyword) {
        const inNickname = u.nickname.toLowerCase().includes(normalizedKeyword);
        const inEmail = u.email.toLowerCase().includes(normalizedKeyword);
        if (!inNickname && !inEmail) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, normalizedKeyword]);

  const pageSize = copy.pagination.pageSize;
  const totalCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safePage, pageSize]);

  const handleRoleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value as UserRole | 'ALL');
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as AdminUserStatus | 'ALL');
    setPage(1);
  }, []);

  const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setKeyword('');
    setPage(1);
  }, []);

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  return (
    <div className="admin-users">
      <header className="admin-users__header">
        <h1 className="admin-users__title">{copy.title}</h1>
        <p className="admin-users__subtitle">{copy.subtitle}</p>
      </header>

      <section className="admin-users__filters" aria-label={copy.filters.keywordLabel}>
        <label className="admin-users__filter">
          <span className="admin-users__filter-label">{copy.filters.roleLabel}</span>
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="admin-users__select"
          >
            <option value="ALL">{copy.filters.roleAllLabel}</option>
            {ROLE_VALUES.map((r) => (
              <option key={r} value={r}>
                {copy.roleLabels[r]}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-users__filter">
          <span className="admin-users__filter-label">{copy.filters.statusLabel}</span>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="admin-users__select"
          >
            <option value="ALL">{copy.filters.statusAllLabel}</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {copy.statusLabels[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-users__filter admin-users__filter--grow">
          <span className="admin-users__filter-label">{copy.filters.keywordLabel}</span>
          <input
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder={copy.filters.keywordPlaceholder}
            aria-label={copy.filters.keywordAriaLabel}
            className="admin-users__input"
          />
        </label>

        <button
          type="button"
          onClick={handleReset}
          aria-label={copy.filters.resetAriaLabel}
          className="admin-users__reset-btn"
        >
          {copy.filters.resetLabel}
        </button>
      </section>

      {pagedUsers.length === 0 ? (
        <p className="admin-users__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-users__table-wrap">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th scope="col" className="admin-users__th admin-users__th--id">
                  {copy.columns.id}
                </th>
                <th scope="col" className="admin-users__th">{copy.columns.nickname}</th>
                <th scope="col" className="admin-users__th">{copy.columns.email}</th>
                <th scope="col" className="admin-users__th">{copy.columns.role}</th>
                <th scope="col" className="admin-users__th">{copy.columns.level}</th>
                <th scope="col" className="admin-users__th">{copy.columns.status}</th>
                <th scope="col" className="admin-users__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-users__th admin-users__th--actions">
                  {copy.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((u) => (
                <tr key={u.id}>
                  <td className="admin-users__td admin-users__td--id">{u.id}</td>
                  <td className="admin-users__td admin-users__td--nickname">{u.nickname}</td>
                  <td className="admin-users__td">{u.email}</td>
                  <td className="admin-users__td">
                    <span
                      className={`admin-users__role admin-users__role--${u.role.toLowerCase()}`}
                    >
                      {copy.roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="admin-users__td">{copy.levelLabels[u.level]}</td>
                  <td className="admin-users__td">
                    <span
                      className={`admin-users__status admin-users__status--${u.status.toLowerCase()}`}
                    >
                      {copy.statusLabels[u.status]}
                    </span>
                  </td>
                  <td className="admin-users__td">{formatDate(u.createdAt)}</td>
                  <td className="admin-users__td admin-users__td--actions">
                    <Link
                      href={`/admin/users/${u.id}`}
                      aria-label={fillTemplate(copy.actions.viewAriaLabelTemplate, {
                        nickname: u.nickname,
                      })}
                      className="admin-users__action-link"
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

      <nav className="admin-users__pagination" aria-label="페이지 탐색">
        <button
          type="button"
          onClick={goPrev}
          disabled={safePage <= 1}
          aria-label={copy.pagination.previousAriaLabel}
          className="admin-users__page-btn"
        >
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-users__page-info" aria-live="polite">
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
          className="admin-users__page-btn"
        >
          {copy.pagination.nextLabel}
        </button>
      </nav>
    </div>
  );
}
