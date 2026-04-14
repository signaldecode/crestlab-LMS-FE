/**
 * 관리자 수동 수강 등록 컨테이너 (AdminManualEnrollContainer)
 * - 사용자 검색(닉네임/이메일) + 강의 선택 + 요약 + 제출
 * - 백엔드: POST /api/v1/admin/payments/manual-enroll { userId, courseId }
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminCourses, fetchAdminUsers, manualEnrollAdmin } from '@/lib/adminApi';

interface Fields {
  userLabel: string; userPlaceholder: string; userAriaLabel: string; userNotFoundText: string;
  courseLabel: string; coursePlaceholder: string; courseAriaLabel: string;
}

interface Summary {
  title: string; userLabel: string; courseLabel: string; noSelectionText: string;
}

interface Actions {
  submitLabel: string; submitAriaLabel: string; cancelLabel: string;
}

interface Errors {
  userRequired: string; courseRequired: string;
}

export interface ManualEnrollCopy {
  title: string;
  subtitle: string;
  backLinkLabel: string;
  backLinkHref: string;
  fields: Fields;
  summary: Summary;
  actions: Actions;
  errors: Errors;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminManualEnrollContainerProps {
  copy: ManualEnrollCopy;
  common: CommonCopy;
}

export default function AdminManualEnrollContainer({
  copy,
  common,
}: AdminManualEnrollContainerProps): JSX.Element {
  const router = useRouter();

  const usersQuery = useAdminQuery(() => fetchAdminUsers({ status: 'ACTIVE', size: 500 }), []);
  const coursesQuery = useAdminQuery(() => fetchAdminCourses({ status: 'PUBLISHED', size: 500 }), []);

  const [userQuery, setUserQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 학생/강사만 대상. 관리자/정지/탈퇴 제외
  const enrollableUsers = useMemo(
    () => (usersQuery.data?.content ?? []).filter((u) => u.role !== 'ADMIN' && u.status === 'ACTIVE'),
    [usersQuery.data],
  );

  const publishedCourses = useMemo(
    () => (coursesQuery.data?.content ?? []).filter((c) => c.status === 'PUBLISHED'),
    [coursesQuery.data],
  );

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return enrollableUsers.slice(0, 10);
    return enrollableUsers
      .filter((u) => u.nickname.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 10);
  }, [enrollableUsers, userQuery]);

  const selectedUser = useMemo(
    () => (selectedUserId ? enrollableUsers.find((u) => u.id === selectedUserId) : null),
    [enrollableUsers, selectedUserId],
  );

  const selectedCourse = useMemo(
    () => (selectedCourseId ? publishedCourses.find((c) => c.id === selectedCourseId) : null),
    [publishedCourses, selectedCourseId],
  );

  const handleUserQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value);
    setSelectedUserId(null);
    setErrorMsg('');
  }, []);

  const mutation = useAdminMutation(
    (args: { userId: number; courseId: number }) => manualEnrollAdmin(args.userId, args.courseId),
    () => router.push('/admin/payments'),
  );

  const handleSubmit = useCallback(() => {
    if (!selectedUserId) {
      setErrorMsg(copy.errors.userRequired);
      return;
    }
    if (!selectedCourseId) {
      setErrorMsg(copy.errors.courseRequired);
      return;
    }
    setErrorMsg('');
    void mutation.run({ userId: selectedUserId, courseId: selectedCourseId });
  }, [selectedUserId, selectedCourseId, copy.errors, mutation]);

  const initialLoading = (usersQuery.loading && !usersQuery.data) || (coursesQuery.loading && !coursesQuery.data);
  const initialError = (usersQuery.error && !usersQuery.data) || (coursesQuery.error && !coursesQuery.data);

  if (initialLoading) return <AdminLoading label={common.loadingText} />;
  if (initialError) {
    return (
      <AdminError
        title={common.errorTitle}
        message={(usersQuery.error ?? coursesQuery.error)?.message ?? ''}
        retryLabel={common.errorRetryLabel}
        onRetry={() => { usersQuery.refetch(); coursesQuery.refetch(); }}
      />
    );
  }

  return (
    <div className="admin-form-page">
      <header className="admin-form-page__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">
          ← {copy.backLinkLabel}
        </Link>
        <h1 className="admin-form-page__title">{copy.title}</h1>
        <p className="admin-form-page__subtitle">{copy.subtitle}</p>
      </header>

      <div className="admin-form-page__grid">
        <div className="admin-form-page__field-group">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.userLabel}</span>
            <input
              type="search"
              value={selectedUser ? `${selectedUser.nickname} (${selectedUser.email})` : userQuery}
              onChange={handleUserQueryChange}
              placeholder={copy.fields.userPlaceholder}
              aria-label={copy.fields.userAriaLabel}
              className="admin-form-page__input"
              readOnly={!!selectedUser}
            />
          </label>

          {!selectedUser && userQuery.length > 0 && (
            <ul className="admin-form-page__suggest">
              {filteredUsers.length === 0 ? (
                <li className="admin-form-page__suggest-empty">{copy.fields.userNotFoundText}</li>
              ) : (
                filteredUsers.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setUserQuery('');
                      }}
                      className="admin-form-page__suggest-item"
                    >
                      <span className="admin-form-page__suggest-nickname">{u.nickname}</span>
                      <span className="admin-form-page__suggest-email">{u.email}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}

          {selectedUser && (
            <button
              type="button"
              onClick={() => {
                setSelectedUserId(null);
                setUserQuery('');
              }}
              className="admin-form-page__reset-link"
            >
              다시 선택
            </button>
          )}

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.courseLabel}</span>
            <select
              value={selectedCourseId ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedCourseId(v ? Number(v) : null);
                setErrorMsg('');
              }}
              aria-label={copy.fields.courseAriaLabel}
              className="admin-form-page__select"
            >
              <option value="">{copy.fields.coursePlaceholder}</option>
              {publishedCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.instructorNames.join(', ')}
                </option>
              ))}
            </select>
          </label>
        </div>

        <aside className="admin-form-page__summary">
          <h2 className="admin-form-page__summary-title">{copy.summary.title}</h2>
          {selectedUser && selectedCourse ? (
            <dl className="admin-form-page__summary-list">
              <div className="admin-form-page__summary-row">
                <dt>{copy.summary.userLabel}</dt>
                <dd>
                  {selectedUser.nickname}
                  <span className="admin-form-page__summary-sub">{selectedUser.email}</span>
                </dd>
              </div>
              <div className="admin-form-page__summary-row">
                <dt>{copy.summary.courseLabel}</dt>
                <dd>
                  {selectedCourse.title}
                  <span className="admin-form-page__summary-sub">{selectedCourse.instructorNames.join(', ')}</span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="admin-form-page__summary-empty">{copy.summary.noSelectionText}</p>
          )}
        </aside>
      </div>

      {errorMsg && <p className="admin-form-page__error" role="alert">{errorMsg}</p>}
      {mutation.error && <p className="admin-form-page__error" role="alert">{mutation.error.message}</p>}

      <footer className="admin-form-page__footer">
        <Link href={copy.backLinkHref} className="admin-modal__btn admin-modal__btn--ghost">
          {copy.actions.cancelLabel}
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          aria-label={copy.actions.submitAriaLabel}
          disabled={!selectedUser || !selectedCourse || mutation.submitting}
          className="admin-modal__btn admin-modal__btn--primary"
        >
          {copy.actions.submitLabel}
        </button>
      </footer>
    </div>
  );
}
