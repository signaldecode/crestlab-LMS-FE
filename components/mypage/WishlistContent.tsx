/**
 * 찜한 강의 콘텐츠 (WishlistContent)
 * - 찜한 강의 목록을 카드 형태로 표시
 * - 정렬(최신순/이름순) 지원
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';
import type { Course } from '@/types';

const wishlistPageData = accountData.mypage.wishlistPage;
const wishlistData = accountData.mypage.wishlist as { courseSlug: string; wishedAt: string }[];

interface WishlistItem {
  courseSlug: string;
  wishedAt: string;
  course: Course;
}

const SK = 'mypage-wishlist';

export default function WishlistContent(): JSX.Element {
  const [sortBy, setSortBy] = useState(wishlistPageData.sortOptions[0].value);
  const allCourses = getCourses();

  const wishlistItems: WishlistItem[] = useMemo(() => {
    const items = wishlistData
      .map((w) => {
        const course = allCourses.find((c) => c.slug === w.courseSlug);
        if (!course) return null;
        return { ...w, course };
      })
      .filter((item): item is WishlistItem => item != null);

    if (sortBy === 'title') {
      return [...items].sort((a, b) => a.course.title.localeCompare(b.course.title));
    }
    return [...items].sort((a, b) => new Date(b.wishedAt).getTime() - new Date(a.wishedAt).getTime());
  }, [allCourses, sortBy]);

  return (
    <div className={SK}>
      {/* 헤더 */}
      <div className={`${SK}__header`}>
        <h2 className={`${SK}__title`}>
          {wishlistPageData.title}
          <span className={`${SK}__count`}>
            {wishlistItems.length}{wishlistPageData.totalCountSuffix}
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

      {/* 목록 */}
      {wishlistItems.length === 0 ? (
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{wishlistPageData.emptyText}</p>
        </div>
      ) : (
        <div className={`${SK}__list`}>
          {wishlistItems.map((item) => (
            <div key={item.courseSlug} className={`${SK}__card`}>
              <Link href={`/courses/${item.course.slug}`} className={`${SK}__thumb-link`}>
                <Image
                  src={item.course.thumbnail}
                  alt={item.course.thumbnailAlt}
                  width={160}
                  height={100}
                  className={`${SK}__thumb`}
                />
              </Link>
              <div className={`${SK}__info`}>
                <Link href={`/courses/${item.course.slug}`} className={`${SK}__course-title`}>
                  {item.course.title}
                </Link>
                <span className={`${SK}__instructor`}>{item.course.instructor}</span>
                <div className={`${SK}__meta`}>
                  {item.course.rating != null && (
                    <span className={`${SK}__rating`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {item.course.rating}
                      {item.course.reviewCount != null && (
                        <span className={`${SK}__review-count`}>({item.course.reviewCount})</span>
                      )}
                    </span>
                  )}
                  <span className={`${SK}__level`}>{item.course.level}</span>
                </div>
                <div className={`${SK}__price-row`}>
                  {item.course.discount ? (
                    <>
                      <span className={`${SK}__price-original`}>
                        {item.course.price.toLocaleString()}
                      </span>
                      <span className={`${SK}__price`}>
                        {Math.round(item.course.price * (1 - item.course.discount.rate / 100)).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className={`${SK}__price`}>
                      {item.course.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className={`${SK}__actions`}>
                <Link href={`/courses/${item.course.slug}`} className={`${SK}__view-btn`}>
                  {wishlistPageData.viewCourseLabel}
                </Link>
                <button
                  type="button"
                  className={`${SK}__remove-btn`}
                  aria-label={wishlistPageData.removeAriaLabel}
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
