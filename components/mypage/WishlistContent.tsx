/**
 * 찜한 강의 콘텐츠 (WishlistContent)
 * - 백엔드 `GET /v1/favorites` 기반
 * - 정렬(최근 추가순/이름순) 지원, 찜 해제 → POST 재호출(토글)
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery, useAdminMutation } from '@/hooks/useAdminQuery';
import { fetchMyFavorites, removeFavorite, type FavoriteItem, type FavoritePageResponse } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import accountData from '@/data/accountData.json';

const wishlistPageData = accountData.mypage.wishlistPage;
const SK = 'mypage-wishlist';

export default function WishlistContent(): JSX.Element {
  const [sortBy, setSortBy] = useState(wishlistPageData.sortOptions[0].value);
  const { data, loading, error, refetch } = useAdminQuery<FavoritePageResponse>(
    () => fetchMyFavorites({ page: 1, size: 50 }),
    [],
  );

  const { run: removeRun } = useAdminMutation(
    async (courseId: number) => {
      await removeFavorite(courseId);
      return courseId;
    },
    () => { void refetch(); },
  );

  const items: FavoriteItem[] = useMemo(() => {
    const list = data?.content ?? [];
    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    }
    // 백엔드가 favoritedAt 을 제공하지 않으므로 id 역순(최신 추가가 큰 id) 으로 정렬
    return [...list].sort((a, b) => b.id - a.id);
  }, [data, sortBy]);

  return (
    <div className={SK}>
      <div className={`${SK}__header`}>
        <h2 className={`${SK}__title`}>
          {wishlistPageData.title}
          <span className={`${SK}__count`}>
            {items.length}{wishlistPageData.totalCountSuffix}
          </span>
        </h2>
        <select
          className={`${SK}__sort`}
          aria-label={wishlistPageData.sortAriaLabel}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {wishlistPageData.sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={`${SK}__empty`}><p>불러오는 중...</p></div>
      ) : error ? (
        <div className={`${SK}__empty`}><p>찜 목록을 불러오지 못했습니다.</p></div>
      ) : items.length === 0 ? (
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{wishlistPageData.emptyText}</p>
        </div>
      ) : (
        <div className={`${SK}__list`}>
          {items.map((item) => (
            <div key={item.courseId} className={`${SK}__card`}>
              <Link href={`/courses/${item.courseId}`} className={`${SK}__thumb-link`}>
                <Image
                  src={resolveThumb(item.thumbnailUrl)}
                  alt={item.courseTitle}
                  width={160}
                  height={100}
                  className={`${SK}__thumb`}
                />
              </Link>
              <div className={`${SK}__info`}>
                <Link href={`/courses/${item.courseId}`} className={`${SK}__course-title`}>
                  {item.courseTitle}
                </Link>
                {item.instructorName && (
                  <span className={`${SK}__instructor`}>{item.instructorName}</span>
                )}
                <div className={`${SK}__meta`}>
                  <span className={`${SK}__rating`}>
                    ★ {item.averageRating.toFixed(1)} ({item.reviewCount})
                  </span>
                  <span className={`${SK}__enroll-count`}>
                    수강생 {item.enrollmentCount.toLocaleString('ko-KR')}명
                  </span>
                </div>
              </div>
              <div className={`${SK}__actions`}>
                <Link href={`/courses/${item.courseId}`} className={`${SK}__view-btn`}>
                  {wishlistPageData.viewCourseLabel}
                </Link>
                <button
                  type="button"
                  className={`${SK}__remove-btn`}
                  aria-label={wishlistPageData.removeAriaLabel}
                  onClick={() => { void removeRun(item.courseId); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
