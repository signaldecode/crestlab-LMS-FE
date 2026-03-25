/**
 * 후기 관리 콘텐츠 (ReviewContent)
 * - /mypage/reviews 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getReviews, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';

const reviewsPageData = accountData.mypage.reviewsPage;
const SK = 'mypage-classroom';

export default function ReviewContent(): JSX.Element {
  const reviews = getReviews();
  const allCourses = getCourses();

  const reviewsWithCourse = useMemo(() => {
    return reviews.map((r) => ({
      ...r,
      course: allCourses.find((c) => c.slug === r.courseSlug) ?? null,
    }));
  }, [reviews, allCourses]);

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{reviewsPageData.title}</h2>
        {reviewsWithCourse.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{reviewsPageData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__review-list`}>
            {reviewsWithCourse.map((item) => (
              <Link key={item.id} href={`/courses/${item.courseSlug}/reviews`} className={`${SK}__review-card`}>
                {item.course ? (
                  <div className={`${SK}__review-thumb-link`}>
                    <Image
                      src={item.course.thumbnail}
                      alt={item.course.thumbnailAlt}
                      width={80}
                      height={80}
                      className={`${SK}__review-img`}
                    />
                  </div>
                ) : (
                  <div className={`${SK}__review-thumb`} />
                )}
                <div className={`${SK}__review-body`}>
                  <span className={`${SK}__review-course-name`}>{item.course?.title}</span>
                  <div className={`${SK}__review-stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`${SK}__review-star${i < item.rating ? ` ${SK}__review-star--filled` : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className={`${SK}__review-content`}>{item.content}</p>
                  <span className={`${SK}__review-date`}>{item.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
