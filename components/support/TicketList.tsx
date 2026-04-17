/**
 * 내 문의 목록 (TicketList)
 * - 백엔드: GET /api/v1/inquiries/my?status&page&size (page 1-base)
 * - 상태(전체/대기/완료) 필터 + 페이지네이션 + 행 클릭 시 상세 페이지로 이동
 */

'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyInquiries, type InquiryStatus } from '@/lib/userApi';
import { supportData } from '@/data';
import Pagination from '@/components/ui/Pagination';

const list = supportData.ticketList;
type FilterValue = 'ALL' | InquiryStatus;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function TicketList(): JSX.Element {
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [page, setPage] = useState(1);

  const query = useAdminQuery(
    () => fetchMyInquiries({
      status: filter === 'ALL' ? undefined : filter,
      page,
      size: list.pageSize,
    }),
    [filter, page],
  );

  const handleFilter = (value: FilterValue) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="ticket-list-wrap">
      <header className="ticket-list-wrap__header">
        <div>
          <h1 className="ticket-list-wrap__title">{list.title}</h1>
          <p className="ticket-list-wrap__subtitle">{list.subtitle}</p>
        </div>
        <Link
          href={list.newTicketHref}
          className="ticket-list-wrap__new-btn"
          aria-label={list.newTicketAriaLabel}
        >
          {list.newTicketLabel}
        </Link>
      </header>

      <div className="ticket-list-wrap__filters" role="tablist" aria-label={list.filters.ariaLabel}>
        {list.filters.options.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              className={`ticket-list-wrap__filter${active ? ' ticket-list-wrap__filter--active' : ''}`}
              onClick={() => handleFilter(opt.value as FilterValue)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {query.loading && <p className="ticket-list-wrap__state">{list.loadingText}</p>}
      {query.error && <p className="ticket-list-wrap__state" role="alert">{list.errorText}</p>}

      {query.data && query.data.content.length === 0 && (
        <p className="ticket-list-wrap__state">{list.emptyText}</p>
      )}

      {query.data && query.data.content.length > 0 && (
        <>
          <table className="ticket-list-wrap__table">
            <thead>
              <tr>
                <th scope="col">{list.columns.category}</th>
                <th scope="col">{list.columns.title}</th>
                <th scope="col">{list.columns.status}</th>
                <th scope="col">{list.columns.createdAt}</th>
              </tr>
            </thead>
            <tbody>
              {query.data.content.map((item) => (
                <tr key={item.id}>
                  <td>{list.categoryLabels[item.category]}</td>
                  <td>
                    <Link href={`${list.detailHrefBase}/${item.id}`} className="ticket-list-wrap__title-link">
                      {item.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`ticket-list-wrap__status ticket-list-wrap__status--${item.status.toLowerCase()}`}>
                      {list.statusLabels[item.status]}
                    </span>
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {query.data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={query.data.totalPages}
              onPageChange={setPage}
              copy={list.pagination}
            />
          )}
        </>
      )}
    </div>
  );
}
