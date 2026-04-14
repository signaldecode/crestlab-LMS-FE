/**
 * 강의 상세 왼쪽 콘텐츠 (CourseDetailContent)
 * - 썸네일, 강의 소개, 앵커 탭(소개/질문·답변/커리큘럼/크리에이터/후기)
 * - ?tab= 쿼리 파라미터로 외부에서 탭 지정 가능
 * - 모든 텍스트/라벨은 data에서 로드한다
 */

'use client';

import { useState, useEffect, useRef, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CourseQuestionsTab from '@/components/courses/CourseQuestionsTab';
import type { Course } from '@/types';
import pagesData from '@/data/pagesData.json';

const detail = (pagesData as unknown as Record<string, Record<string, unknown>>).courses
  .detail as Record<string, unknown>;
const TABS = detail.tabs as string[];
const CATEGORY_LABELS = detail.categoryLabels as Record<string, string>;
const LEVEL_LABELS = detail.levelLabels as Record<string, string>;
const INFO_LABELS = detail.infoLabels as Record<string, string>;
const SECTION_TITLES = detail.sectionTitles as Record<string, string>;
const BUTTONS = detail.buttons as Record<string, string>;
const EMPTY_STATES = detail.emptyStates as Record<string, string>;
const BREADCRUMB = detail.breadcrumb as Record<string, string>;
const REVIEW_UNIT = detail.reviewUnit as string;
const REVIEW_SCORE_SUFFIX = detail.reviewScoreSuffix as string;

function getBadgeVariant(badge: string): string {
  if (badge === 'ORIGINAL') return 'original';
  if (badge === 'BEST') return 'best';
  if (badge === 'NEW' || badge.includes('신규')) return 'new';
  if (badge.includes('선착순') || badge.includes('마감')) return 'urgent';
  if (badge.startsWith('LV.')) return 'level';
  return 'default';
}

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

function getLevelLabel(level: string): string {
  return LEVEL_LABELS[level] || level;
}

interface CourseDetailContentProps {
  course: Course;
}

export default function CourseDetailContent({ course }: CourseDetailContentProps): JSX.Element {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabsRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState(TABS[0]);

  useEffect(() => {
    if (tabParam) {
      const matched = TABS.find((t) => t.replace(/\s/g, '') === tabParam.replace(/\s/g, ''));
      if (matched) {
        setActiveTab(matched);
        requestAnimationFrame(() => {
          tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [tabParam]);

  return (
    <div className="course-detail-content">
      {/* 브레드크럼 */}
      <nav className="course-detail-content__breadcrumb" aria-label={BREADCRUMB.ariaLabel}>
        <Link href={BREADCRUMB.homeHref} className="course-detail-content__breadcrumb-link">
          {BREADCRUMB.homeLabel}
        </Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <Link href={BREADCRUMB.coursesHref} className="course-detail-content__breadcrumb-link">
          {BREADCRUMB.coursesLabel}
        </Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <Link href={`/courses?category=${course.category}`} className="course-detail-content__breadcrumb-link">
          {getCategoryLabel(course.category)}
        </Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <span className="course-detail-content__breadcrumb-current">{course.title}</span>
      </nav>

      {/* 베스트 수강 후기 */}
      {course.bestReviews.length > 0 && (
        <div className="course-detail-content__reviews-section">
          <h3 className="course-detail-content__section-title">
            {SECTION_TITLES.bestReviews}
            {course.reviewCount != null && (
              <span className="course-detail-content__review-total">
                ({formatReviewCount(course.reviewCount)}{REVIEW_UNIT})
              </span>
            )}
          </h3>
          <div className="course-detail-content__reviews-grid">
            {course.bestReviews.map((review, i) => (
              <div key={i} className="course-detail-content__review-card">
                <div className="course-detail-content__review-header">
                  <div className="course-detail-content__review-avatar">
                    <span className="course-detail-content__review-avatar-text">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div className="course-detail-content__review-meta">
                    <span className="course-detail-content__review-name">
                      {review.name}
                    </span>
                    <span className="course-detail-content__review-stars">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} {review.rating}.0
                    </span>
                  </div>
                </div>
                <div className="course-detail-content__review-body">
                  <p className="course-detail-content__review-text">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="course-detail-content__reviews-all"
            aria-label={BUTTONS.allReviewsAriaLabel}
            onClick={() => {
              setActiveTab(TABS[4]);
              requestAnimationFrame(() => {
                tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
          >
            {BUTTONS.allReviews}
          </button>
        </div>
      )}

      {/* 앵커 탭 */}
      <div ref={tabsRef} className="course-detail-content__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`course-detail-content__tab${tab === activeTab ? ' course-detail-content__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="course-detail-content__tab-panel">
        {activeTab === TABS[0] && (
          <>
            <h3 className="course-detail-content__section-title">{SECTION_TITLES.courseInfo}</h3>
            <div className="course-detail-content__info-grid">
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">{INFO_LABELS.enrollmentPeriod}</span>
                <span className="course-detail-content__info-value">{course.enrollmentPeriod}</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">{INFO_LABELS.totalDuration}</span>
                <span className="course-detail-content__info-value">{course.duration}</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">{INFO_LABELS.level}</span>
                <span className="course-detail-content__info-value">{getLevelLabel(course.level)}</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">{INFO_LABELS.instructor}</span>
                <span className="course-detail-content__info-value">{course.instructor}</span>
              </div>
            </div>

            <h3 className="course-detail-content__section-title">{SECTION_TITLES.description}</h3>
            <div className="course-detail-content__description">
              <p>{course.description}</p>
            </div>

            {course.faq.length > 0 && (
              <>
                <h3 className="course-detail-content__section-title">{SECTION_TITLES.faq}</h3>
                <div className="course-detail-content__faq-list">
                  {course.faq.map((item, i) => (
                    <div key={i} className="course-detail-content__faq-item">
                      <div className="course-detail-content__faq-question">
                        <span className="course-detail-content__faq-icon">Q</span>
                        {item.question}
                      </div>
                      <div className="course-detail-content__faq-answer">
                        <span className="course-detail-content__faq-icon course-detail-content__faq-icon--answer">A</span>
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === TABS[1] && (
          <CourseQuestionsTab courseId={course.id} />
        )}

        {activeTab === TABS[2] && (
          <div className="course-detail-content__curriculum">
            <h3 className="course-detail-content__section-title">{SECTION_TITLES.curriculum}</h3>

            {course.curriculum.map((section, si) => (
              <div key={si} className="course-detail-content__curriculum-section">
                <div className="course-detail-content__curriculum-section-header">
                  <span className="course-detail-content__curriculum-section-title">{section.title}</span>
                  <span className="course-detail-content__curriculum-section-count">{section.lessons.length}강</span>
                </div>
                <ul className="course-detail-content__curriculum-list">
                  {section.lessons.map((lesson, li) => (
                    <li
                      key={li}
                      className={`course-detail-content__curriculum-item${lesson.locked ? ' course-detail-content__curriculum-item--locked' : ''}`}
                    >
                      {lesson.locked ? (
                        <>
                          <span className="course-detail-content__curriculum-lock">🔒</span>
                          <span className="course-detail-content__curriculum-name">{lesson.name}</span>
                          <span className="course-detail-content__curriculum-duration">{lesson.duration}</span>
                        </>
                      ) : (
                        <Link
                          href={`/learn/${course.slug}/${si * 10 + li + 1}`}
                          className="course-detail-content__curriculum-link"
                        >
                          <span className="course-detail-content__curriculum-play">▶</span>
                          <span className="course-detail-content__curriculum-name">{lesson.name}</span>
                          <span className="course-detail-content__curriculum-duration">{lesson.duration}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === TABS[3] && (
          <div className="course-detail-content__creator">
            <div className="course-detail-content__creator-profile">
              <div className="course-detail-content__creator-avatar">
                {course.creator.avatar ? (
                  <Image
                    src={course.creator.avatar}
                    alt={course.creator.name}
                    width={48}
                    height={48}
                    className="course-detail-content__creator-avatar-image"
                  />
                ) : (
                  <span className="course-detail-content__creator-avatar-text">
                    {course.creator.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="course-detail-content__creator-info">
                <h4 className="course-detail-content__creator-name">{course.creator.name}</h4>
                <p className="course-detail-content__creator-role">{course.creator.role}</p>
              </div>
            </div>
            <p className="course-detail-content__creator-bio">{course.creator.bio}</p>
          </div>
        )}

        {activeTab === TABS[4] && (
          <div className="course-detail-content__all-reviews">
            <div className="course-detail-content__reviews-summary">
              <div className="course-detail-content__reviews-score">
                <span className="course-detail-content__reviews-score-number">
                  {course.rating?.toFixed(2) ?? '-'}
                </span>
                <span className="course-detail-content__reviews-score-stars">
                  {'★'.repeat(Math.round(course.rating ?? 0))}
                </span>
                <span className="course-detail-content__reviews-score-count">
                  {formatReviewCount(course.reviewCount ?? 0)}{REVIEW_SCORE_SUFFIX}
                </span>
              </div>
            </div>

            {/* 베스트 후기 */}
            {course.bestReviews.length > 0 && (
              <>
                <h4 className="course-detail-content__section-title">{SECTION_TITLES.bestReviews}</h4>
                <div className="course-detail-content__reviews-grid">
                  {course.bestReviews.map((review, i) => (
                    <div key={`best-${i}`} className="course-detail-content__review-card">
                      <div className="course-detail-content__review-header">
                        <div className="course-detail-content__review-avatar">
                          <span className="course-detail-content__review-avatar-text">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="course-detail-content__review-meta">
                          <span className="course-detail-content__review-name">{review.name}</span>
                          <span className="course-detail-content__review-stars">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <div className="course-detail-content__review-body">
                        <p className="course-detail-content__review-text">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 전체 후기 */}
            {course.allReviews.length > 0 && (
              <>
                <h4 className="course-detail-content__section-title">{SECTION_TITLES.allReviews}</h4>
                <div className="course-detail-content__review-list">
                  {course.allReviews.map((review, i) => (
                    <div key={`all-${i}`} className="course-detail-content__review-item">
                      <div className="course-detail-content__review-header">
                        <div className="course-detail-content__review-avatar">
                          <span className="course-detail-content__review-avatar-text">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="course-detail-content__review-meta">
                          <span className="course-detail-content__review-name">{review.name}</span>
                          <span className="course-detail-content__review-stars">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} {review.rating}.0
                          </span>
                        </div>
                        <span className="course-detail-content__review-date">{review.date}</span>
                      </div>
                      <p className="course-detail-content__review-full-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
