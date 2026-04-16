/**
 * 강의 그리드 컨테이너 (CourseGridContainer)
 * - 백엔드 `GET /v1/courses` 실 API 기반 목록
 * - 서버 페이지네이션/정렬, 카테고리 slug→id 매핑은 `/v1/categories` 조회 후 적용
 */

'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import { useWishlistStoreBase } from '@/stores/useWishlistStore';
import { useSearchParams } from 'next/navigation';
import CourseListCard from '@/components/courses/CourseListCard';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  fetchUserCourses,
  fetchUserCategories,
  type CourseSortType,
  type UserCourseListItem,
  type UserCategory,
} from '@/lib/userApi';
import type { Course } from '@/types';

const ITEMS_PER_PAGE = 16;

const CATEGORY_LABELS: Record<string, string> = {
  stock: '주식',
  crypto: '가상자산',
  'real-estate': '부동산',
};

const SORT_OPTIONS: { value: string; label: string; api: CourseSortType }[] = [
  { value: 'popular', label: '인기순', api: 'POPULAR' },
  { value: 'latest', label: '최신순', api: 'LATEST' },
  { value: 'rating', label: '평점순', api: 'RATING' },
  { value: 'price-low', label: '가격 낮은순', api: 'PRICE_LOW' },
  { value: 'price-high', label: '가격 높은순', api: 'PRICE_HIGH' },
];

function findCategoryId(categories: UserCategory[] | null, label: string): number | undefined {
  if (!categories) return undefined;
  const walk = (list: UserCategory[]): UserCategory | undefined => {
    for (const c of list) {
      if (c.name === label) return c;
      const found = walk(c.children ?? []);
      if (found) return found;
    }
    return undefined;
  };
  return walk(categories)?.id;
}

function adaptCourse(item: UserCourseListItem): Course {
  const instructor = item.instructorNames[0] ?? '';
  return {
    id: item.id,
    slug: String(item.id),
    title: item.title,
    summary: '',
    description: '',
    thumbnail: item.thumbnailUrl,
    thumbnailAlt: item.title,
    category: '',
    level: '',
    duration: '',
    price: 0,
    instructor,
    featured: false,
    badges: item.tags ?? [],
    tags: item.tags ?? [],
    learningPoints: [],
    rating: item.averageRating,
    reviewCount: item.reviewCount,
    enrollmentPeriod: '',
    faq: [],
    bestReviews: [],
    allReviews: [],
    curriculum: [],
    creator: { name: instructor, role: '', bio: '' },
  };
}

export default function CourseGridContainer(): JSX.Element {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const categoryIdParam = searchParams.get('categoryId') ?? '';
  const [sort, setSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  // 카테고리 목록은 slug→id 매핑용으로 1회 조회 (categoryId 직접 전달 시에는 매핑 불필요)
  const { data: categories } = useAdminQuery<UserCategory[]>(
    () => fetchUserCategories(),
    [],
  );

  const categoryId = useMemo(() => {
    // 신규 네비 메가메뉴는 `?categoryId=` 를 직접 전달한다 — 매핑 없이 사용
    if (categoryIdParam) {
      const n = Number(categoryIdParam);
      return Number.isInteger(n) && n > 0 ? n : undefined;
    }
    // 레거시 `?category=stock` slug 링크 호환: slug→한글명→id 매핑
    if (!category) return undefined;
    const label = CATEGORY_LABELS[category] ?? category;
    return findCategoryId(categories, label);
  }, [categories, category, categoryIdParam]);

  const sortApi = SORT_OPTIONS.find((o) => o.value === sort)?.api ?? 'POPULAR';

  // 필터(카테고리/정렬) 변경 시 1페이지로 리셋 — 이전값 비교 패턴
  const filterKey = `${category}|${categoryIdParam}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const { data, loading, error } = useAdminQuery(
    () => fetchUserCourses({
      categoryId,
      sort: sortApi,
      page: currentPage,
      size: ITEMS_PER_PAGE,
    }),
    [categoryId, sortApi, currentPage],
  );

  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const pageCourses = (data?.content ?? []).map(adaptCourse);

  // 백엔드가 내려주는 isFavorited 를 로컬 찜 스토어에 반영 (페이지에 있는 항목만 병합)
  useEffect(() => {
    const items = data?.content ?? [];
    if (items.length === 0) return;
    const store = useWishlistStoreBase.getState();
    const current = new Set(store.slugs);
    for (const item of items) {
      const slug = String(item.id);
      if (item.isFavorited) current.add(slug);
      else current.delete(slug);
    }
    store.setWishSlugs([...current]);
  }, [data]);

  const pageTitle = category
    ? `${CATEGORY_LABELS[category] ?? category} 강의`
    : '전체 강의';

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="courses-page">
      <h1 className="courses-page__title">{pageTitle}</h1>

      <div className="courses-page__toolbar">
        <span className="courses-page__count">
          전체 <strong>{totalElements}</strong>개
        </span>

        <div
          className="courses-page__sort-pills"
          role="tablist"
          aria-label="정렬 기준"
        >
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === sort;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={active}
                className={`courses-page__sort-pill${active ? ' courses-page__sort-pill--active' : ''}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="courses-page__empty">강의를 불러오는 중입니다...</div>
      ) : error ? (
        <div className="courses-page__empty">강의를 불러오지 못했습니다.</div>
      ) : pageCourses.length > 0 ? (
        <div className="courses-page__grid">
          {pageCourses.map((course) => (
            <CourseListCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="courses-page__empty">
          해당 카테고리에 강의가 없습니다.
        </div>
      )}

      {totalPages > 1 && (
        <nav className="courses-page__pagination" aria-label="강의 목록 페이지 네비게이션">
          <button
            type="button"
            className="courses-page__page-btn courses-page__page-btn--arrow"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`courses-page__page-btn${page === currentPage ? ' courses-page__page-btn--active' : ''}`}
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`${page} 페이지`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="courses-page__page-btn courses-page__page-btn--arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </section>
  );
}
