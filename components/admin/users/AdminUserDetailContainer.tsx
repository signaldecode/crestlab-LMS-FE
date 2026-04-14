/**
 * 관리자 사용자 상세 컨테이너 (AdminUserDetailContainer)
 * - 기본 정보, 수강 현황, 결제 내역 표시
 * - 역할 변경 / 강제 탈퇴 모달 액션 제공 (mock: 실제 API 호출은 후속)
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { deactivateAdminUser, fetchAdminUserDetail, updateAdminUserRole } from '@/lib/adminApi';
import type {
  AdminUserLevel,
  AdminUserStatus,
  UserRole,
} from '@/types';

interface SectionTitles {
  basicTitle: string;
  enrollmentsTitle: string;
  paymentsTitle: string;
}

interface Labels {
  id: string; email: string; nickname: string; role: string; level: string;
  status: string; emailVerified: string; createdAt: string;
  verified: string; notVerified: string;
}

interface Actions {
  changeRoleLabel: string; changeRoleAriaLabel: string;
  deactivateLabel: string; deactivateAriaLabel: string;
  deactivateDisabledLabel: string;
}

interface EnrollmentColumns {
  courseTitle: string; progressPercent: string; startedAt: string;
}

interface PaymentColumns {
  orderId: string; courseTitle: string; amount: string; status: string; paidAt: string;
}

interface ChangeRoleModalCopy {
  title: string; description: string;
  currentRoleLabel: string; newRoleLabel: string;
  confirmLabel: string; cancelLabel: string; sameRoleError: string;
}

interface DeactivateModalCopy {
  title: string; description: string;
  confirmLabel: string; cancelLabel: string;
  confirmTextLabel: string; confirmTextMismatchError: string;
}

export interface UserDetailCopy {
  backLinkLabel: string;
  backLinkHref: string;
  sections: SectionTitles;
  labels: Labels;
  actions: Actions;
  enrollmentColumns: EnrollmentColumns;
  enrollmentEmpty: string;
  paymentColumns: PaymentColumns;
  paymentEmpty: string;
  changeRoleModal: ChangeRoleModalCopy;
  deactivateModal: DeactivateModalCopy;
  roleLabels: Record<UserRole, string>;
  statusLabels: Record<AdminUserStatus, string>;
  levelLabels: Record<AdminUserLevel, string>;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminUserDetailContainerProps {
  userId: number;
  copy: UserDetailCopy;
  common: CommonCopy;
  notFoundText: string;
}

const ROLE_VALUES: UserRole[] = ['STUDENT', 'INSTRUCTOR', 'ADMIN'];

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminUserDetailContainer({
  userId,
  copy,
  common,
  notFoundText,
}: AdminUserDetailContainerProps): JSX.Element {
  const { data: user, loading, error, refetch } = useAdminQuery(
    () => fetchAdminUserDetail(userId),
    [userId],
  );

  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [roleError, setRoleError] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [deactivateError, setDeactivateError] = useState('');

  const roleMutation = useAdminMutation(
    (role: UserRole) => updateAdminUserRole(userId, role),
    () => { setRoleModalOpen(false); refetch(); },
  );

  const deactivateMutation = useAdminMutation(
    () => deactivateAdminUser(userId),
    () => { setDeactivateModalOpen(false); refetch(); },
  );

  const openRoleModal = useCallback(() => {
    if (!user) return;
    setSelectedRole(user.role);
    setRoleError('');
    setRoleModalOpen(true);
  }, [user]);

  const openDeactivateModal = useCallback(() => {
    setConfirmText('');
    setDeactivateError('');
    setDeactivateModalOpen(true);
  }, []);

  const handleRoleSubmit = useCallback(() => {
    if (!user) return;
    if (selectedRole === user.role) {
      setRoleError(copy.changeRoleModal.sameRoleError);
      return;
    }
    void roleMutation.run(selectedRole);
  }, [selectedRole, user, copy.changeRoleModal.sameRoleError, roleMutation]);

  const handleDeactivateSubmit = useCallback(() => {
    if (!user) return;
    if (confirmText.trim() !== user.nickname) {
      setDeactivateError(copy.deactivateModal.confirmTextMismatchError);
      return;
    }
    void deactivateMutation.run();
  }, [confirmText, user, copy.deactivateModal.confirmTextMismatchError, deactivateMutation]);

  if (loading && !user) return <AdminLoading label={common.loadingText} />;
  if (error && !user) {
    return (
      <AdminError
        title={common.errorTitle}
        message={error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={refetch}
      />
    );
  }
  if (!user) return <p className="admin-list__empty">{notFoundText}</p>;

  const alreadyWithdrawn = user.status === 'WITHDRAWN';

  return (
    <div className="admin-user-detail">
      <header className="admin-user-detail__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">
          ← {copy.backLinkLabel}
        </Link>
        <h1 className="admin-user-detail__title">{user.nickname}</h1>
        <p className="admin-user-detail__email">{user.email}</p>
      </header>

      <section className="admin-user-detail__section" aria-labelledby="section-basic">
        <div className="admin-user-detail__section-head">
          <h2 id="section-basic" className="admin-user-detail__section-title">
            {copy.sections.basicTitle}
          </h2>
          <div className="admin-user-detail__actions">
            <button
              type="button"
              onClick={openRoleModal}
              aria-label={copy.actions.changeRoleAriaLabel}
              className="admin-user-detail__action-btn"
            >
              {copy.actions.changeRoleLabel}
            </button>
            <button
              type="button"
              onClick={openDeactivateModal}
              aria-label={copy.actions.deactivateAriaLabel}
              disabled={alreadyWithdrawn}
              className="admin-user-detail__action-btn admin-user-detail__action-btn--danger"
            >
              {alreadyWithdrawn ? copy.actions.deactivateDisabledLabel : copy.actions.deactivateLabel}
            </button>
          </div>
        </div>
        <dl className="admin-user-detail__info-list">
          <InfoRow label={copy.labels.id} value={String(user.id)} />
          <InfoRow label={copy.labels.email} value={user.email} />
          <InfoRow label={copy.labels.nickname} value={user.nickname} />
          <InfoRow label={copy.labels.role} value={copy.roleLabels[user.role]} />
          <InfoRow label={copy.labels.level} value={copy.levelLabels[user.level]} />
          <InfoRow label={copy.labels.status} value={copy.statusLabels[user.status]} />
          <InfoRow
            label={copy.labels.emailVerified}
            value={user.emailVerified ? copy.labels.verified : copy.labels.notVerified}
          />
          <InfoRow label={copy.labels.createdAt} value={formatDate(user.createdAt)} />
        </dl>
      </section>

      <section className="admin-user-detail__section" aria-labelledby="section-enrollments">
        <h2 id="section-enrollments" className="admin-user-detail__section-title">
          {copy.sections.enrollmentsTitle}
        </h2>
        {user.enrollments.length === 0 ? (
          <p className="admin-list__empty">{copy.enrollmentEmpty}</p>
        ) : (
          <div className="admin-list__table-wrap">
            <table className="admin-list__table">
              <thead>
                <tr>
                  <th scope="col" className="admin-list__th">{copy.enrollmentColumns.courseTitle}</th>
                  <th scope="col" className="admin-list__th admin-list__th--num">{copy.enrollmentColumns.progressPercent}</th>
                  <th scope="col" className="admin-list__th">{copy.enrollmentColumns.startedAt}</th>
                </tr>
              </thead>
              <tbody>
                {user.enrollments.map((e) => (
                  <tr key={e.enrollmentId}>
                    <td className="admin-list__td admin-list__td--strong">{e.courseTitle}</td>
                    <td className="admin-list__td admin-list__td--num">{e.progressPercent}%</td>
                    <td className="admin-list__td">{formatDate(e.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-user-detail__section" aria-labelledby="section-payments">
        <h2 id="section-payments" className="admin-user-detail__section-title">
          {copy.sections.paymentsTitle}
        </h2>
        {user.payments.length === 0 ? (
          <p className="admin-list__empty">{copy.paymentEmpty}</p>
        ) : (
          <div className="admin-list__table-wrap">
            <table className="admin-list__table">
              <thead>
                <tr>
                  <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.paymentColumns.orderId}</th>
                  <th scope="col" className="admin-list__th">{copy.paymentColumns.courseTitle}</th>
                  <th scope="col" className="admin-list__th admin-list__th--num">{copy.paymentColumns.amount}</th>
                  <th scope="col" className="admin-list__th">{copy.paymentColumns.status}</th>
                  <th scope="col" className="admin-list__th">{copy.paymentColumns.paidAt}</th>
                </tr>
              </thead>
              <tbody>
                {user.payments.map((p) => (
                  <tr key={p.orderId}>
                    <td className="admin-list__td admin-list__td--narrow">{p.orderId}</td>
                    <td className="admin-list__td">{p.courseTitle}</td>
                    <td className="admin-list__td admin-list__td--num">{formatNumber(p.amount)}원</td>
                    <td className="admin-list__td">{p.status}</td>
                    <td className="admin-list__td">{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 역할 변경 모달 */}
      <AdminModal
        isOpen={isRoleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={copy.changeRoleModal.title}
        description={copy.changeRoleModal.description}
      >
        <dl className="admin-modal__info">
          <div className="admin-modal__info-row">
            <dt>{copy.changeRoleModal.currentRoleLabel}</dt>
            <dd>{copy.roleLabels[user.role]}</dd>
          </div>
        </dl>
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.changeRoleModal.newRoleLabel}</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="admin-modal__select"
          >
            {ROLE_VALUES.map((r) => (
              <option key={r} value={r}>{copy.roleLabels[r]}</option>
            ))}
          </select>
        </label>
        {roleError && <p className="admin-modal__error" role="alert">{roleError}</p>}
        {roleMutation.error && <p className="admin-modal__error" role="alert">{roleMutation.error.message}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setRoleModalOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.changeRoleModal.cancelLabel}
          </button>
          <button type="button" onClick={handleRoleSubmit} disabled={roleMutation.submitting} className="admin-modal__btn admin-modal__btn--primary">
            {roleMutation.submitting ? common.loadingText : copy.changeRoleModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>

      {/* 강제 탈퇴 모달 */}
      <AdminModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title={copy.deactivateModal.title}
        description={copy.deactivateModal.description}
      >
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">
            {copy.deactivateModal.confirmTextLabel}: <strong>{user.nickname}</strong>
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="admin-modal__input"
          />
        </label>
        {deactivateError && <p className="admin-modal__error" role="alert">{deactivateError}</p>}
        {deactivateMutation.error && <p className="admin-modal__error" role="alert">{deactivateMutation.error.message}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setDeactivateModalOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.deactivateModal.cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleDeactivateSubmit}
            disabled={confirmText.trim() !== user.nickname || deactivateMutation.submitting}
            className="admin-modal__btn admin-modal__btn--danger"
          >
            {deactivateMutation.submitting ? common.loadingText : copy.deactivateModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="admin-user-detail__info-row">
      <dt className="admin-user-detail__info-label">{label}</dt>
      <dd className="admin-user-detail__info-value">{value}</dd>
    </div>
  );
}
