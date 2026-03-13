/**
 * 관심 클래스 콘텐츠 (WishlistContent)
 * - 찜한 강의를 CourseCard로 표시 (한 줄에 최대 3개)
 * - 최근 본 클래스 섹션
 */

'use client';

import { useState, useMemo } from 'react';
import type { JSX } from 'react';
import useWishlistStore from '@/stores/useWishlistStore';
import { getCourses } from '@/lib/data';
import CourseCard from '@/components/courses/CourseCard';
import accountData from '@/data/accountData.json';
import type { Course } from '@/types';

const wishlistData = accountData.mypage.wishlist;

function sortCourses(courses: Course[], sort: string): Course[] {
  const sorted = [...courses];
  switch (sort) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    default:
      return sorted;
  }
}

export default function WishlistContent(): JSX.Element {
  const [sort, setSort] = useState('recent');
  const slugs = useWishlistStore((s) => s.slugs);
  const recentSlugs = useWishlistStore((s) => s.recentSlugs);
  const allCourses = getCourses();

  const wishedCourses = useMemo(() => {
    const courses = slugs
      .map((slug) => allCourses.find((c) => c.slug === slug))
      .filter((c): c is Course => c != null);
    return sortCourses(courses, sort);
  }, [slugs, allCourses, sort]);

  const recentCourses = useMemo(() => {
    return recentSlugs
      .map((slug) => allCourses.find((c) => c.slug === slug))
      .filter((c): c is Course => c != null);
  }, [recentSlugs, allCourses]);

  return (
    <div className="wishlist">
      {/* 관심 클래스 */}
      <section className="wishlist__section">
        <div className="wishlist__header">
          <h2 className="wishlist__title">{wishlistData.title}</h2>
          <select
            className="wishlist__sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={wishlistData.sortAriaLabel}
          >
            {wishlistData.sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {wishedCourses.length > 0 ? (
          <div className="wishlist__grid">
            {wishedCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <p className="wishlist__empty">{wishlistData.emptyText}</p>
        )}
      </section>

      {/* 최근 본 클래스 */}
      <section className="wishlist__section">
        <h2 className="wishlist__title">{wishlistData.recentTitle}</h2>

        {recentCourses.length > 0 ? (
          <div className="wishlist__grid">
            {recentCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <p className="wishlist__empty">{wishlistData.recentEmptyText}</p>
        )}
      </section>
    </div>
  );
}
