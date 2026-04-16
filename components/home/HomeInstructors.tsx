/**
 * 인기 강사 소개 캐러셀 (HomeInstructors)
 * - 데이터: useMainPage() → instructors (백엔드 큐레이션)
 * - 메타(서브타이틀/제목/설명/aria)는 정적 데이터(`HomeInstructorsSection.meta`)에서 받는다
 * - 좌우 화살표 캐러셀 (한 번에 4명씩 노출)
 * - 카드: 세로 포트레이트 이미지 + 좌하단 플로팅 흰색 이름 카드 (피그마 Component 53)
 * - profileImageUrl이 없으면 색상 기반 SVG 아바타로 대체
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HomeInstructorsSection } from '@/types';
import { useMainPage } from '@/components/home/MainPageProvider';
import type { MainInstructorCard } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';

interface HomeInstructorsProps {
  /** 정적 메타 (서브타이틀/제목/설명/aria) */
  section: HomeInstructorsSection;
}

/** id 기반 결정적 색상 — 동일 강사는 항상 같은 색 */
const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
function colorFromId(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function InstructorAvatarFallback({ color }: { color: string }): JSX.Element {
  return (
    <svg className="home-instructors__fallback" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="200" fill={color} opacity="0.14" />
      <circle cx="100" cy="80" r="36" fill={color} opacity="0.55" />
      <ellipse cx="100" cy="170" rx="62" ry="40" fill={color} opacity="0.55" />
    </svg>
  );
}

function InstructorCard({ instructor }: { instructor: MainInstructorCard }): JSX.Element {
  const ariaLabel = `${instructor.name}${instructor.specialty ? ` (${instructor.specialty})` : ''} 강사 상세 보기`;

  return (
    <Link href={`/instructors/${instructor.id}`} className="home-instructors__card" aria-label={ariaLabel}>
      <div className="home-instructors__media">
        {instructor.profileImageUrl ? (
          <Image
            src={resolveThumb(instructor.profileImageUrl)}
            alt=""
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="home-instructors__image"
          />
        ) : (
          <InstructorAvatarFallback color={colorFromId(instructor.id)} />
        )}
      </div>
      <div className="home-instructors__name-card">
        <span className="home-instructors__name">{instructor.name}</span>
        {instructor.specialty && (
          <span className="home-instructors__specialty">{instructor.specialty}</span>
        )}
      </div>
    </Link>
  );
}

const VISIBLE = 4;

export default function HomeInstructors({ section }: HomeInstructorsProps): JSX.Element {
  const { meta } = section;
  const { data, loading, error } = useMainPage();
  const instructors = data?.instructors ?? [];

  const maxOffset = Math.max(0, instructors.length - VISIBLE);
  const [offset, setOffset] = useState(0);

  return (
    <section className="home-instructors" aria-label={meta.ariaLabel}>
      <div className="home-instructors__header">
        <div className="home-instructors__header-left">
          <span className="home-instructors__subtitle">{meta.subtitle}</span>
          <h2 className="home-instructors__title">{meta.title}</h2>
          {meta.description && (
            <p className="home-instructors__desc">{meta.description}</p>
          )}
        </div>
        {instructors.length > VISIBLE && (
          <div className="home-instructors__controls">
            <button
              type="button"
              className={`home-instructors__arrow${offset === 0 ? ' home-instructors__arrow--disabled' : ''}`}
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              aria-label="이전 강사"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={`home-instructors__arrow${offset === maxOffset ? ' home-instructors__arrow--disabled' : ''}`}
              onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
              disabled={offset === maxOffset}
              aria-label="다음 강사"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {loading && instructors.length === 0 ? (
        <div className="home-instructors__status" role="status">불러오는 중…</div>
      ) : error && instructors.length === 0 ? (
        <div className="home-instructors__status" role="alert">{error}</div>
      ) : instructors.length === 0 ? (
        <div className="home-instructors__status">등록된 강사가 없습니다.</div>
      ) : (
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
      )}
    </section>
  );
}
