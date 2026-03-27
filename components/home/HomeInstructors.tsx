/**
 * 인기 강사 소개 캐러셀 (HomeInstructors)
 * - SVG 아바타 + 이름/전문분야/강의수/수강평
 * - 좌우 화살표 캐러셀
 */

'use client';

import { useState, type JSX } from 'react';
import type { HomeInstructorsSection, HomeInstructor } from '@/types';

interface HomeInstructorsProps {
  section: HomeInstructorsSection;
}

function InstructorAvatar({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0);
  return (
    <svg className="home-instructors__avatar" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill={color} opacity="0.12" />
      <circle cx="40" cy="40" r="32" fill={color} opacity="0.2" />
      <circle cx="40" cy="30" r="12" fill={color} />
      <ellipse cx="40" cy="58" rx="18" ry="12" fill={color} />
      <text x="40" y="78" textAnchor="middle" fontSize="10" fill={color} fontWeight="700" opacity="0">{initial}</text>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="home-instructors__star" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1l2.06 4.18L15 5.82l-3.5 3.41.83 4.82L8 11.77l-4.33 2.28.83-4.82L1 5.82l4.94-.64L8 1z" fill="currentColor" />
    </svg>
  );
}

function InstructorCard({ instructor }: { instructor: HomeInstructor }) {
  return (
    <article className="home-instructors__card" aria-label={instructor.ariaLabel}>
      <InstructorAvatar name={instructor.name} color={instructor.color} />
      <h3 className="home-instructors__name">{instructor.name}</h3>
      <p className="home-instructors__specialty">{instructor.specialty}</p>
      <div className="home-instructors__stats">
        <span className="home-instructors__stat">
          <StarIcon />
          {instructor.rating}
        </span>
        <span className="home-instructors__divider" aria-hidden="true" />
        <span className="home-instructors__stat">
          {instructor.reviewCount.toLocaleString()}
        </span>
      </div>
      <span className="home-instructors__courses">
        {instructor.courseCount}
      </span>
    </article>
  );
}

const VISIBLE = 4;

export default function HomeInstructors({ section }: HomeInstructorsProps): JSX.Element {
  const { meta, instructors } = section;
  const maxOffset = Math.max(0, instructors.length - VISIBLE);
  const [offset, setOffset] = useState(0);

  return (
    <section className="home-instructors" aria-label={meta.ariaLabel}>
      <div className="home-instructors__header">
        <div>
          <h2 className="home-instructors__title">{meta.title}</h2>
          <p className="home-instructors__desc">{meta.description}</p>
        </div>
        <div className="home-instructors__controls">
          <button
            type="button"
            className={`home-instructors__arrow${offset === 0 ? ' home-instructors__arrow--disabled' : ''}`}
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="이전 강사"
          >&#8249;</button>
          <button
            type="button"
            className={`home-instructors__arrow${offset === maxOffset ? ' home-instructors__arrow--disabled' : ''}`}
            onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
            disabled={offset === maxOffset}
            aria-label="다음 강사"
          >&#8250;</button>
        </div>
      </div>

      <div className="home-instructors__carousel">
        <div
          className="home-instructors__track"
          style={{ transform: `translateX(-${offset * 25}%)` }}
        >
          {instructors.map((inst) => (
            <div key={inst.id} className="home-instructors__slide">
              <InstructorCard instructor={inst} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
