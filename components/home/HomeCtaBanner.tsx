/**
 * CTA 배너 (HomeCtaBanner)
 * - 풀 블리드 배경 + SVG 장식 + 타이틀/설명/CTA 버튼
 * - 전환율 향상을 위한 행동 유도 섹션
 */

import type { JSX } from 'react';
import Link from 'next/link';
import type { CtaBannerData } from '@/types';

interface HomeCtaBannerProps {
  data: CtaBannerData;
}

function DecorationLeft() {
  return (
    <svg className="home-cta__deco home-cta__deco--left" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="30" cy="160" r="60" fill="currentColor" opacity="0.08" />
      <circle cx="140" cy="40" r="30" fill="currentColor" opacity="0.06" />
      <rect x="10" y="60" width="16" height="16" rx="3" fill="currentColor" opacity="0.1" transform="rotate(25 18 68)" />
      <polygon points="160,140 175,115 190,140" fill="currentColor" opacity="0.07" />
      <circle cx="80" cy="20" r="5" fill="currentColor" opacity="0.12" />
      <circle cx="170" cy="170" r="8" fill="currentColor" opacity="0.09" />
    </svg>
  );
}

function DecorationRight() {
  return (
    <svg className="home-cta__deco home-cta__deco--right" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="170" cy="40" r="50" fill="currentColor" opacity="0.08" />
      <circle cx="60" cy="160" r="35" fill="currentColor" opacity="0.06" />
      <rect x="140" y="150" width="20" height="20" rx="4" fill="currentColor" opacity="0.1" transform="rotate(-15 150 160)" />
      <polygon points="40,50 55,25 70,50" fill="currentColor" opacity="0.07" />
      <circle cx="120" cy="180" r="6" fill="currentColor" opacity="0.12" />
      <circle cx="30" cy="90" r="4" fill="currentColor" opacity="0.09" />
    </svg>
  );
}

export default function HomeCtaBanner({ data: cta }: HomeCtaBannerProps): JSX.Element {
  return (
    <section className="home-cta" aria-label={cta.ariaLabel}>
      <DecorationLeft />
      <DecorationRight />
      <div className="home-cta__content">
        <h2 className="home-cta__title">{cta.title}</h2>
        <p className="home-cta__desc">{cta.description}</p>
        <Link href={cta.buttonHref} className="home-cta__btn" aria-label={cta.buttonAriaLabel}>
          {cta.buttonLabel}
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </section>
  );
}
