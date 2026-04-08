/**
 * 홈 강의 리스트 섹션 (HomeCourseSection)
 * - 캐러셀: 한 번에 4개 카드 표시, 좌우 화살표로 슬라이드
 * - 마지막에 "나에게 맞는 강의" 추천 CTA 카드 포함
 */

'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import type { Course } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

interface HomeCourseSectionProps {
  title: string;
  courses: Course[];
}

const VISIBLE_COUNT = 4;

export default function HomeCourseSection({ title, courses }: HomeCourseSectionProps): JSX.Element {
  const totalItems = courses.length + 1; // +1 for CTA card
  const maxOffset = Math.max(0, totalItems - VISIBLE_COUNT);
  const [offset, setOffset] = useState(0);

  const handlePrev = () => setOffset((o) => Math.max(0, o - 1));
  const handleNext = () => setOffset((o) => Math.min(maxOffset, o + 1));

  // 1칸(25%)씩 이동
  const shiftPercent = offset * 25;

  return (
    <section className="home-course-section">
      <div className="home-course-section__inner">
        <div className="home-course-section__header">
          <h2 className="home-course-section__title">{title}</h2>
          <div className="home-course-section__controls">
            <button
              type="button"
              className={`home-course-section__arrow${offset === 0 ? ' home-course-section__arrow--disabled' : ''}`}
              onClick={handlePrev}
              disabled={offset === 0}
              aria-label="이전"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={`home-course-section__arrow${offset === maxOffset ? ' home-course-section__arrow--disabled' : ''}`}
              onClick={handleNext}
              disabled={offset === maxOffset}
              aria-label="다음"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="home-course-section__carousel">
          <div
            className="home-course-section__track"
            style={{ transform: `translateX(-${shiftPercent}%)` }}
          >
            {courses.map((course) => (
              <div key={course.slug} className="home-course-section__slide">
                <CourseCard course={course} />
              </div>
            ))}

            {/* 추천 CTA 카드 */}
            {/* <div className="home-course-section__slide">
              <div className="home-course-section__cta-card">
                <p className="home-course-section__cta-text">
                  나에게 맞는<br />
                  강의를 찾고 계신가요?<br />
                  관심사를 입력하면<br />
                  추천해드려요
                </p>
                <Link href="/curriculum" className="home-course-section__cta-btn">
                  지금 추천 받기 &gt;
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
