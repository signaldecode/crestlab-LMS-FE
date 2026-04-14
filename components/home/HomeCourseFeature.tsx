/**
 * 피처드 강의 레이아웃 (HomeCourseFeature)
 * - 왼쪽: 첫 번째 강의를 대형 카드로 (이미지 위 오버레이 + 제목/강사/뱃지)
 * - 오른쪽: 나머지 2개를 세로 스택
 * - 하단: 나머지 강의를 가로 스크롤
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types';
import CourseCard from '@/components/courses/CourseCard';
import { resolveThumb } from '@/lib/images';

interface HomeCourseFeatureProps {
  title: string;
  courses: Course[];
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export default function HomeCourseFeature({ title, courses }: HomeCourseFeatureProps): JSX.Element {
  if (courses.length === 0) return <></>;

  const featured = courses[0];
  const side = courses.slice(1, 3);
  const rest = courses.slice(3);

  return (
    <section className="home-course-feature">
      <h2 className="home-course-feature__title">{title}</h2>

      <div className="home-course-feature__grid">
        {/* 왼쪽 대형 카드 */}
        <Link href={`/courses/${featured.id}`} className="home-course-feature__hero" aria-label={featured.title}>
          <Image
            src={resolveThumb(featured.thumbnail)}
            alt={featured.thumbnailAlt}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            className="home-course-feature__hero-image"
          />
          <div className="home-course-feature__hero-overlay">
            {featured.badges.length > 0 && (
              <div className="home-course-feature__hero-badges">
                {featured.badges.map((b) => (
                  <span key={b} className="home-course-feature__hero-badge">{b}</span>
                ))}
              </div>
            )}
            <h3 className="home-course-feature__hero-title">{featured.title}</h3>
            <p className="home-course-feature__hero-meta">
              <span>{featured.instructor}</span>
              {featured.rating != null && (
                <span>★ {featured.rating.toFixed(2)}</span>
              )}
              <span>{formatPrice(featured.price)}</span>
            </p>
          </div>
        </Link>

        {/* 오른쪽 2개 스택 */}
        <div className="home-course-feature__side">
          {side.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="home-course-feature__side-card">
              <div className="home-course-feature__side-thumb">
                <Image
                  src={resolveThumb(course.thumbnail)}
                  alt={course.thumbnailAlt}
                  fill
                  sizes="(max-width: 767px) 50vw, 20vw"
                  className="home-course-feature__side-image"
                />
              </div>
              <div className="home-course-feature__side-info">
                <h3 className="home-course-feature__side-title">{course.title}</h3>
                <p className="home-course-feature__side-instructor">{course.instructor}</p>
                {course.rating != null && (
                  <span className="home-course-feature__side-rating">★ {course.rating.toFixed(2)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 하단 나머지 카드 */}
      {rest.length > 0 && (
        <div className="home-course-feature__rest">
          {rest.map((course) => (
            <div key={course.slug} className="home-course-feature__rest-item">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
