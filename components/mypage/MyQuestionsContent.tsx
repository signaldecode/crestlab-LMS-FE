/**
 * 내 Q&A 목록 (MyQuestionsContent)
 * - 백엔드: GET /v1/my/questions?page&size (2026-04-16 추가)
 * - 최신순 페이징, 클릭 시 해당 질문 상세 페이지로 이동
 */

'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyQuestions, type QuestionPageResponse } from '@/lib/userApi';
import Pagination from '@/components/ui/Pagination';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.questionsPage;
const SK = 'mypage-classroom';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ko-KR');
}

export default function MyQuestionsContent(): JSX.Element {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useAdminQuery<QuestionPageResponse>(
    () => fetchMyQuestions({ page, size: pageData.pageSize }),
    [page],
  );

  const rows = data?.content ?? [];

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{pageData.title}</h2>
        <p className={`${SK}__menu-subtitle`}>{pageData.subtitle}</p>

        {loading ? (
          <div className={`${SK}__empty`}><p>{pageData.loadingText}</p></div>
        ) : error ? (
          <div className={`${SK}__empty`}><p role="alert">{pageData.errorText}</p></div>
        ) : rows.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{pageData.emptyText}</p>
          </div>
        ) : (
          <>
            <ul className={`${SK}__question-list`}>
              {rows.map((item) => (
                <li key={item.id} className={`${SK}__question-item`}>
                  <Link href={`/courses/${item.courseId}/questions/${item.id}`} className={`${SK}__question-card`}>
                    <div className={`${SK}__question-head`}>
                      <span className={`${SK}__question-course`}>{item.courseTitle}</span>
                      <span
                        className={`${SK}__question-status ${SK}__question-status--${item.status === 'ANSWERED' ? 'answered' : 'waiting'}`}
                      >
                        {pageData.statusLabels[item.status]}
                      </span>
                    </div>
                    <p className={`${SK}__question-title`}>{item.title}</p>
                    <span className={`${SK}__question-date`}>{formatDate(item.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
                copy={pageData.pagination}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
