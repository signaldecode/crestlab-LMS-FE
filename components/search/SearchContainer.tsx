/**
 * 통합 검색 컨테이너 (SearchContainer)
 * - 백엔드: GET /api/v1/search?keyword=
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { JSX, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchAll, UserApiError } from '@/lib/userApi';
import type { SearchAllResult } from '@/lib/userApi';

export interface SearchCopy {
  pageTitle: string;
  pageSubtitlePrefix: string;
  pageSubtitleSuffix: string;
  formAriaLabel: string;
  keywordPlaceholder: string;
  submitLabel: string;
  submitAriaLabel: string;
  emptyKeywordText: string;
  noResultsText: string;
  loadingText: string;
  errorText: string;
  sections: {
    coursesTitle: string;
    usersTitle: string;
    countTemplate: string;
    moreLabelTemplate: string;
    viewAllCoursesHrefTemplate: string;
    viewAllUsersHrefTemplate: string;
  };
  courseCard: {
    freeBadge: string;
    instructorSeparator: string;
    priceUnit: string;
    ratingUnit: string;
    reviewUnit: string;
  };
  emptyCoursesText: string;
  emptyUsersText: string;
}

interface Props { copy: SearchCopy; }

export default function SearchContainer({ copy }: Props): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = (searchParams.get('q') ?? '').trim();
  const [input, setInput] = useState(keyword);
  const [data, setData] = useState<SearchAllResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInput(keyword);
  }, [keyword]);

  useEffect(() => {
    if (!keyword) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const result = await searchAll(keyword);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof UserApiError ? err.message : copy.errorText;
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [keyword, copy.errorText]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [input, router]);

  const totalHits =
    (data?.courses.totalCount ?? 0) + (data?.users.totalCount ?? 0);

  return (
    <main className="search-page">
      <header className="search-page__header">
        <h1 className="search-page__title">{copy.pageTitle}</h1>
        {keyword && (
          <p className="search-page__subtitle">
            {copy.pageSubtitlePrefix}{keyword}{copy.pageSubtitleSuffix}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="search-page__form" aria-label={copy.formAriaLabel}>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={copy.keywordPlaceholder}
          className="search-page__input"
        />
        <button
          type="submit"
          aria-label={copy.submitAriaLabel}
          className="search-page__submit"
        >
          {copy.submitLabel}
        </button>
      </form>

      {!keyword && <p className="search-page__empty-state">{copy.emptyKeywordText}</p>}
      {keyword && loading && <p className="search-page__loading">{copy.loadingText}</p>}
      {keyword && !loading && error && (
        <p className="search-page__error" role="alert">{error}</p>
      )}

      {keyword && !loading && !error && data && totalHits === 0 && (
        <p className="search-page__empty-state">
          {copy.noResultsText.replaceAll('{keyword}', keyword)}
        </p>
      )}

      {keyword && !loading && !error && data && totalHits > 0 && (
        <>
          <section className="search-page__section">
            <header className="search-page__section-header">
              <h2 className="search-page__section-title">
                {copy.sections.coursesTitle}
                <span className="search-page__section-count">
                  {' '}{copy.sections.countTemplate.replaceAll('{count}', String(data.courses.totalCount))}
                </span>
              </h2>
              {data.courses.totalCount > data.courses.items.length && (
                <Link
                  href={copy.sections.viewAllCoursesHrefTemplate.replaceAll('{keyword}', encodeURIComponent(keyword))}
                  className="search-page__more"
                >
                  {copy.sections.moreLabelTemplate}
                </Link>
              )}
            </header>
            {data.courses.items.length === 0 ? (
              <p className="search-page__section-empty">{copy.emptyCoursesText}</p>
            ) : (
              <ul className="search-page__course-list">
                {data.courses.items.map((course) => (
                  <li key={course.id} className="search-page__course-item">
                    <Link href={`/courses/${course.id}`} className="search-page__course-link">
                      {course.thumbnailUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnailUrl}
                          alt=""
                          className="search-page__course-thumb"
                        />
                      )}
                      <div className="search-page__course-meta">
                        <h3 className="search-page__course-title">{course.title}</h3>
                        <p className="search-page__course-instructors">
                          {course.instructorNames.join(copy.courseCard.instructorSeparator)}
                        </p>
                        <p className="search-page__course-rating">
                          {course.averageRating}{copy.courseCard.ratingUnit} · {course.reviewCount}{copy.courseCard.reviewUnit}
                        </p>
                        <p className="search-page__course-price">
                          {course.price === 0
                            ? copy.courseCard.freeBadge
                            : `${course.price.toLocaleString('ko-KR')}${copy.courseCard.priceUnit}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="search-page__section">
            <header className="search-page__section-header">
              <h2 className="search-page__section-title">
                {copy.sections.usersTitle}
                <span className="search-page__section-count">
                  {' '}{copy.sections.countTemplate.replaceAll('{count}', String(data.users.totalCount))}
                </span>
              </h2>
            </header>
            {data.users.items.length === 0 ? (
              <p className="search-page__section-empty">{copy.emptyUsersText}</p>
            ) : (
              <ul className="search-page__user-list">
                {data.users.items.map((user) => (
                  <li key={user.id} className="search-page__user-item">
                    {user.profileImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="search-page__user-thumb"
                      />
                    )}
                    <span className="search-page__user-name">{user.nickname}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
