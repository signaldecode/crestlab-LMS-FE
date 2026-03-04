/**
 * 강의 페이지 상단 배너 (CourseBanner)
 * - navbar 아래, 강의 리스트 위에 풀블리드로 표시되는 프로모션 배너
 * - category에 따라 배너가 있을 수도 없을 수도 있다
 */

import Image from 'next/image';
import type { JSX } from 'react';

/** 카테고리별 배너 매핑 — 배너가 없는 카테고리는 여기에 넣지 않는다 */
const CATEGORY_BANNERS: Record<string, { src: string; alt: string }> = {
  '': { src: '/images/banners/course-banner.png', alt: '강의 프로모션 배너' },
  'real-estate': { src: '/images/banners/course-banner.png', alt: '부동산 강의 배너' },
  original: { src: '/images/banners/course-banner.png', alt: '오리지널 강의 배너' },
  finance: { src: '/images/banners/course-banner.png', alt: '재테크 강의 배너' },
};

interface CourseBannerProps {
  category?: string;
}

export default function CourseBanner({ category = '' }: CourseBannerProps): JSX.Element | null {
  const banner = CATEGORY_BANNERS[category];
  if (!banner) return null;

  return (
    <section className="course-banner" aria-label="강의 배너">
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        sizes="100vw"
        className="course-banner__image"
        priority
      />
    </section>
  );
}
