/**
 * 후기 관리 콘텐츠 (ReviewContent)
 * - 백엔드: GET /v1/enrollments/reviews (페이징)
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyReviews, type MyReviewPageResponse } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import accountData from '@/data/accountData.json';

const reviewsPageData = accountData.mypage.reviewsPage;
const SK = 'mypage-classroom';

export default function ReviewContent(): JSX.Element {
  const { data, loading, error } = useAdminQuery<MyReviewPageResponse>(
    () => fetchMyReviews({ page: 1, size: 50 }),
    [],
  );

  const rows = data?.content ?? [];

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{reviewsPageData.title}</h2>
        {loading ? (
          <div className={`${SK}__empty`}><p>불러오는 중...</p></div>
        ) : error ? (
          <div className={`${SK}__empty`}><p>후기를 불러오지 못했습니다.</p></div>
        ) : rows.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{reviewsPageData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__review-list`}>
            {rows.map((item) => (
              <Link
                key={item.reviewId}
                href={`/mypage/reviews/${item.reviewId}`}
                className={`${SK}__review-card`}
              >
                <div className={`${SK}__review-thumb-link`}>
                  <Image
                    src={resolveThumb(item.courseThumbnailUrl)}
                    alt={item.courseTitle}
                    width={80}
                    height={80}
                    className={`${SK}__review-img`}
                  />
                </div>
                <div className={`${SK}__review-body`}>
                  <span className={`${SK}__review-course-name`}>{item.courseTitle}</span>
                  <div className={`${SK}__review-stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`${SK}__review-star${i < item.rating ? ` ${SK}__review-star--filled` : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className={`${SK}__review-content`}>{item.content}</p>
                  <span className={`${SK}__review-date`}>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
