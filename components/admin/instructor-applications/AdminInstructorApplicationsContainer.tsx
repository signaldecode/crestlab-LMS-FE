/**
 * 관리자 강사 지원 심사 컨테이너 (AdminInstructorApplicationsContainer)
 * - 백엔드: GET /v1/admin/instructor-applications, PATCH .../approve, PATCH .../reject
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  approveInstructorApplication,
  fetchAdminInstructorApplications,
  rejectInstructorApplication,
  type AdminInstructorAppStatus,
  type AdminInstructorApplicationItem,
} from '@/lib/adminApi';

const STATUS_VALUES: AdminInstructorAppStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
const STATUS_LABELS: Record<AdminInstructorAppStatus, string> = {
  PENDING: '심사 중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminInstructorApplicationsContainer(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<AdminInstructorAppStatus | 'ALL'>('PENDING');
  const [page, setPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState<AdminInstructorApplicationItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchAdminInstructorApplications({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      page,
      size: 10,
    }),
    [statusFilter, page],
  );

  const approveMutation = useAdminMutation(
    (id: number) => approveInstructorApplication(id),
    () => { setDetailTarget(null); refetch(); },
  );

  const rejectMutation = useAdminMutation(
    (args: { id: number; reason: string }) => rejectInstructorApplication(args.id, args.reason),
    () => { setDetailTarget(null); setShowRejectInput(false); setRejectReason(''); refetch(); },
  );

  const handleApprove = useCallback(() => {
    if (!detailTarget) return;
    void approveMutation.run(detailTarget.id);
  }, [detailTarget, approveMutation]);

  const handleReject = useCallback(() => {
    if (!detailTarget || !rejectReason.trim()) return;
    void rejectMutation.run({ id: detailTarget.id, reason: rejectReason.trim() });
  }, [detailTarget, rejectReason, rejectMutation]);

  if (loading && !data) return <AdminLoading label="불러오는 중…" />;
  if (error && !data) {
    return (
      <AdminError
        title="불러오기 실패"
        message={error.message}
        retryLabel="다시 시도"
        onRetry={refetch}
      />
    );
  }

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">강사 지원 심사</h1>
          <p className="admin-list__subtitle">강사로 지원한 사용자 신청을 검토하고 승인/반려합니다.</p>
        </div>
      </header>

      <section className="admin-list__filters">
        <label className="admin-list__filter">
          <span className="admin-list__filter-label">상태</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as AdminInstructorAppStatus | 'ALL'); setPage(1); }}
            className="admin-list__select"
          >
            <option value="ALL">전체</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
      </section>

      {items.length === 0 ? (
        <p className="admin-list__empty">조건에 맞는 지원이 없습니다.</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th className="admin-list__th admin-list__th--narrow">ID</th>
                <th className="admin-list__th">이름</th>
                <th className="admin-list__th">전문 분야</th>
                <th className="admin-list__th">상태</th>
                <th className="admin-list__th">지원일</th>
                <th className="admin-list__th admin-list__th--actions">액션</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td className="admin-list__td admin-list__td--narrow">{it.id}</td>
                  <td className="admin-list__td admin-list__td--strong">{it.name}</td>
                  <td className="admin-list__td">{it.specialty}</td>
                  <td className="admin-list__td">
                    <span
                      className={`admin-list__badge admin-list__badge--${
                        it.status === 'APPROVED' ? 'success' : it.status === 'REJECTED' ? 'error' : 'warning'
                      }`}
                    >
                      {STATUS_LABELS[it.status]}
                    </span>
                  </td>
                  <td className="admin-list__td">{formatDate(it.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <AdminActionButton
                      onClick={() => { setDetailTarget(it); setShowRejectInput(false); setRejectReason(''); }}
                    >
                      상세
                    </AdminActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="admin-list__pagination" aria-label="페이지 탐색">
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="admin-list__page-btn">이전</button>
        <span className="admin-list__page-info">{page} / {totalPages} 페이지</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="admin-list__page-btn">다음</button>
      </nav>

      <AdminModal
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        title={detailTarget ? `${detailTarget.name} 지원 상세` : ''}
        size="lg"
      >
        {detailTarget && (
          <>
            <dl className="admin-modal__info">
              <div className="admin-modal__info-row"><dt>이름</dt><dd>{detailTarget.name}</dd></div>
              <div className="admin-modal__info-row"><dt>휴대폰</dt><dd>{detailTarget.phone}</dd></div>
              <div className="admin-modal__info-row"><dt>전문 분야</dt><dd>{detailTarget.specialty}</dd></div>
              <div className="admin-modal__info-row"><dt>지원일</dt><dd>{formatDate(detailTarget.createdAt)}</dd></div>
              <div className="admin-modal__info-row"><dt>상태</dt><dd>{STATUS_LABELS[detailTarget.status]}</dd></div>
            </dl>

            <div>
              <strong>경력</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{detailTarget.career}</p>
            </div>

            <div>
              <strong>강의 계획</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{detailTarget.lecturePlan}</p>
            </div>

            {detailTarget.status === 'REJECTED' && detailTarget.rejectReason && (
              <div>
                <strong>반려 사유</strong>
                <p>{detailTarget.rejectReason}</p>
              </div>
            )}

            {showRejectInput && (
              <label className="admin-modal__field">
                <span className="admin-modal__field-label">반려 사유</span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="admin-modal__textarea"
                  placeholder="반려 사유를 입력하세요."
                />
              </label>
            )}

            {(approveMutation.error || rejectMutation.error) && (
              <p className="admin-modal__error">
                {approveMutation.error?.message ?? rejectMutation.error?.message}
              </p>
            )}

            {detailTarget.status === 'PENDING' && (
              <footer className="admin-modal__footer">
                <button type="button" onClick={() => setDetailTarget(null)} className="admin-modal__btn admin-modal__btn--ghost">
                  닫기
                </button>
                {!showRejectInput ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(true)}
                      className="admin-modal__btn admin-modal__btn--danger"
                    >
                      반려
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={approveMutation.submitting}
                      className="admin-modal__btn admin-modal__btn--primary"
                    >
                      승인
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="admin-modal__btn admin-modal__btn--ghost"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || rejectMutation.submitting}
                      className="admin-modal__btn admin-modal__btn--danger"
                    >
                      반려 확정
                    </button>
                  </>
                )}
              </footer>
            )}
          </>
        )}
      </AdminModal>
    </div>
  );
}
