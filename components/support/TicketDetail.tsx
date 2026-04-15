/**
 * 1:1 문의 상세 (TicketDetail)
 * - 백엔드: GET /api/v1/inquiries/{id}, DELETE /api/v1/inquiries/{id}
 * - WAITING 상태에서만 삭제 가능 (백엔드도 409로 방어)
 */

'use client';

import { useCallback, type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  deleteMyInquiry,
  fetchMyInquiryDetail,
  UserApiError,
} from '@/lib/userApi';
import { supportData } from '@/data';

const detail = supportData.ticketDetail;

interface TicketDetailProps {
  ticketId: number;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

export default function TicketDetail({ ticketId }: TicketDetailProps): JSX.Element {
  const router = useRouter();

  const query = useAdminQuery(
    () => fetchMyInquiryDetail(ticketId),
    [ticketId],
  );

  const deleteMutation = useAdminMutation(
    () => deleteMyInquiry(ticketId),
    () => router.push(detail.backHref),
  );

  const handleDelete = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm(detail.deleteConfirmText)) return;
    void deleteMutation.run();
  }, [deleteMutation]);

  if (query.loading && !query.data) {
    return <div className="ticket-detail-wrap"><p className="ticket-detail-wrap__state">{detail.loadingText}</p></div>;
  }

  if (query.error) {
    const isNotFound = query.error instanceof UserApiError && query.error.status === 404;
    return (
      <div className="ticket-detail-wrap">
        <p className="ticket-detail-wrap__state" role="alert">
          {isNotFound ? detail.notFoundText : detail.errorText}
        </p>
        <Link href={detail.backHref} className="ticket-detail-wrap__back" aria-label={detail.backAriaLabel}>
          {detail.backLabel}
        </Link>
      </div>
    );
  }

  if (!query.data) return <></>;
  const inquiry = query.data;
  const canDelete = inquiry.status === 'WAITING';

  return (
    <article className="ticket-detail-wrap">
      <Link href={detail.backHref} className="ticket-detail-wrap__back" aria-label={detail.backAriaLabel}>
        {detail.backLabel}
      </Link>

      <header className="ticket-detail-wrap__header">
        <div className="ticket-detail-wrap__meta">
          <span className="ticket-detail-wrap__category">
            {detail.categoryLabels[inquiry.category]}
          </span>
          <span className={`ticket-detail-wrap__status ticket-detail-wrap__status--${inquiry.status.toLowerCase()}`}>
            {detail.statusLabels[inquiry.status]}
          </span>
        </div>
        <h1 className="ticket-detail-wrap__title">{inquiry.title}</h1>
        <p className="ticket-detail-wrap__date">
          <span className="ticket-detail-wrap__date-label">{detail.labels.createdAt}</span>
          <span>{formatDateTime(inquiry.createdAt)}</span>
        </p>
      </header>

      <section className="ticket-detail-wrap__body">
        <p className="ticket-detail-wrap__content">{inquiry.content}</p>

        {inquiry.attachmentUrls.length > 0 && (
          <div className="ticket-detail-wrap__attachments">
            <h2 className="ticket-detail-wrap__section-label">{detail.labels.attachments}</h2>
            <ul className="ticket-detail-wrap__attachments-list">
              {inquiry.attachmentUrls.map((url, i) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${detail.attachmentAlt} ${i + 1}`}
                      className="ticket-detail-wrap__attachment-image"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="ticket-detail-wrap__answer" aria-labelledby="ticket-detail-answer-title">
        <h2 id="ticket-detail-answer-title" className="ticket-detail-wrap__section-label">
          {detail.labels.answer}
        </h2>
        {inquiry.answer ? (
          <div className="ticket-detail-wrap__answer-card">
            <div className="ticket-detail-wrap__answer-meta">
              <span className="ticket-detail-wrap__answer-author">{inquiry.answer.adminNickname}</span>
              <span className="ticket-detail-wrap__answer-date">
                {detail.labels.answeredAt} {formatDateTime(inquiry.answer.createdAt)}
              </span>
            </div>
            <p className="ticket-detail-wrap__answer-content">{inquiry.answer.content}</p>
          </div>
        ) : (
          <p className="ticket-detail-wrap__answer-empty">{detail.labels.noAnswer}</p>
        )}
      </section>

      <footer className="ticket-detail-wrap__actions">
        {canDelete ? (
          <button
            type="button"
            className="ticket-detail-wrap__delete-btn"
            onClick={handleDelete}
            disabled={deleteMutation.submitting}
            aria-label={detail.deleteAriaLabel}
          >
            {detail.deleteLabel}
          </button>
        ) : (
          <p className="ticket-detail-wrap__delete-hint">{detail.deleteOnlyWaitingHint}</p>
        )}
        {deleteMutation.error && (
          <p className="ticket-detail-wrap__error" role="alert">{detail.deleteFailedText}</p>
        )}
      </footer>
    </article>
  );
}
