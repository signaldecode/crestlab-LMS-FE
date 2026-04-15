/**
 * 강사 상세 페이지 컨테이너 (InstructorDetailContainer)
 * - Figma: 좌측 portrait(342×454) + 우측 정보(이름/통계 칩/소개/이력 사이드바)
 *   + 하단 "대표강의" 3-카드 그리드 (BEST 뱃지, 평점, 키워드 칩, 바로가기)
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  fetchInstructor,
  type InstructorRepresentativeCourse,
} from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';

const SK = 'instructor-detail';
const BULLET_LIMIT = 4;

interface Props {
  instructorId: number;
}

/** career 문자열을 줄바꿈/세미콜론 기준으로 분리해 불릿 배열로 변환 */
function toBullets(text: string | null | undefined, limit: number): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|;|·/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, limit);
}

/** career 텍스트에서 "n년" 패턴을 추출 (없으면 null) */
function extractYears(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = text.match(/(\d+)\s*년/);
  return m ? `${m[1]}년` : null;
}

/** 평점 + 수강생 수 기반 BEST 강의 1개 선택 (가장 높은 평점 → 동률시 수강생 많은 쪽) */
function pickBestCourseId(courses: InstructorRepresentativeCourse[]): number | null {
  if (courses.length === 0) return null;
  const sorted = [...courses].sort((a, b) => {
    if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
    return b.enrollmentCount - a.enrollmentCount;
  });
  const top = sorted[0];
  return top.averageRating >= 4.5 ? top.courseId : null;
}

export default function InstructorDetailContainer({ instructorId }: Props): JSX.Element {
  const { data, loading, error } = useAdminQuery(
    () => fetchInstructor(instructorId),
    [instructorId],
  );

  if (loading && !data) return <main className={SK}><p className={`${SK}__state`}>불러오는 중…</p></main>;
  if (error && !data) return <main className={SK}><p className={`${SK}__state`}>{error.message}</p></main>;
  if (!data) return <main className={SK} />;

  const careerYears = extractYears(data.career);
  const careerBullets = toBullets(data.career, BULLET_LIMIT);
  const bestCourseId = pickBestCourseId(data.representativeCourses);

  return (
    <div className={SK}>
      <div className={`${SK}__inner`}>
        {/* 페이지 타이틀 */}
        <header className={`${SK}__page-header`}>
          <h1 className={`${SK}__page-title`}>
            {data.name} <span className={`${SK}__page-title-suffix`}>강사님</span>
          </h1>
        </header>

        {/* 메인 프로필 블록: portrait + info column + sidebar */}
        <section className={`${SK}__hero`}>
          <div className={`${SK}__portrait`}>
            {data.profileImageUrl ? (
              <Image
                src={data.profileImageUrl}
                alt={data.name}
                fill
                sizes="342px"
                className={`${SK}__portrait-img`}
              />
            ) : (
              <span className={`${SK}__portrait-placeholder`} aria-hidden="true" />
            )}
          </div>

          <div className={`${SK}__profile`}>
            <div className={`${SK}__name-row`}>
              <span className={`${SK}__name`}>{data.name}</span>
              <span className={`${SK}__name-suffix`}>강사님</span>
            </div>

            <dl className={`${SK}__stats`}>
              {data.specialty && (
                <StatChip label="전문분야" value={data.specialty} />
              )}
              {careerYears && (
                <StatChip label="경력" value={careerYears} />
              )}
              <StatChip label="팔로우" value={data.followerCount.toLocaleString('ko-KR')} />
            </dl>

            {data.description && (
              <p className={`${SK}__bio`}>{data.description}</p>
            )}
          </div>

          {careerBullets.length > 0 && (
            <aside className={`${SK}__sidebar`}>
              <div className={`${SK}__sidebar-block`}>
                <span className={`${SK}__sidebar-label`}>경력 및 학력</span>
                <ul className={`${SK}__sidebar-list`}>
                  {careerBullets.map((line, i) => (
                    <li key={i} className={`${SK}__sidebar-item`}>{line}</li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </section>

        {/* 대표 강의 */}
        {data.representativeCourses.length > 0 && (
          <section className={`${SK}__courses-section`}>
            <header className={`${SK}__courses-header`}>
              <h2 className={`${SK}__courses-title`}>대표강의</h2>
            </header>

            <ul className={`${SK}__courses`} role="list">
              {data.representativeCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  instructorName={data.name}
                  isBest={course.courseId === bestCourseId}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

interface StatChipProps { label: string; value: string }

function StatChip({ label, value }: StatChipProps): JSX.Element {
  return (
    <div className={`${SK}__stat`}>
      <dt className={`${SK}__stat-label`}>{label}</dt>
      <span className={`${SK}__stat-divider`} aria-hidden="true" />
      <dd className={`${SK}__stat-value`}>{value}</dd>
    </div>
  );
}

interface CourseCardProps {
  course: InstructorRepresentativeCourse;
  instructorName: string;
  isBest: boolean;
}

function CourseCard({ course, instructorName, isBest }: CourseCardProps): JSX.Element {
  const keywords: string[] = [];
  if (course.categoryName) keywords.push(`#${course.categoryName}`);
  if (course.level) keywords.push(`#${course.level}`);

  return (
    <li className={`${SK}__course`}>
      <Link href={`/courses/${course.courseId}`} className={`${SK}__course-thumb-link`}>
        <div className={`${SK}__course-thumb`}>
          {course.thumbnailUrl && (
            <Image
              src={resolveThumb(course.thumbnailUrl)}
              alt={course.title}
              fill
              sizes="(max-width: 1023px) 50vw, 33vw"
              className={`${SK}__course-thumb-img`}
            />
          )}
        </div>
      </Link>

      <div className={`${SK}__course-body`}>
        <div className={`${SK}__course-head`}>
          <h3 className={`${SK}__course-title`}>{course.title}</h3>
          <div className={`${SK}__course-meta`}>
            <span className={`${SK}__course-rating`}>
              <svg className={`${SK}__course-star`} width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.6 5.27 5.81.84-4.2 4.1.99 5.78L10 14.75l-5.2 2.74.99-5.78-4.2-4.1 5.81-.84L10 1.5z" />
              </svg>
              <span className={`${SK}__course-rating-value`}>{course.averageRating.toFixed(1)}</span>
              <span className={`${SK}__course-rating-count`}>({course.reviewCount.toLocaleString('ko-KR')})</span>
            </span>
            <span className={`${SK}__course-instructor`}>
              <svg className={`${SK}__course-person`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {instructorName}
            </span>
          </div>
        </div>

        {(isBest || keywords.length > 0) && (
          <div className={`${SK}__course-badges`}>
            {isBest && <span className={`${SK}__course-badge ${SK}__course-badge--best`}>BEST</span>}
            {keywords.map((kw) => (
              <span key={kw} className={`${SK}__course-badge ${SK}__course-badge--keyword`}>{kw}</span>
            ))}
          </div>
        )}

        <Link href={`/courses/${course.courseId}`} className={`${SK}__course-cta`}>
          바로가기
        </Link>
      </div>
    </li>
  );
}
