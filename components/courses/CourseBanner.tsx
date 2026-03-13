/**
 * 강의 페이지 상단 배너 (CourseBanner)
 * - navbar 아래, 강의 리스트 위에 풀블리드로 표시되는 프로모션 배너
 * - category에 따라 배너가 있을 수도 없을 수도 있다
 * - 배너 매핑은 pagesData.json에서 관리한다
 */

import Image from 'next/image';
import type { JSX } from 'react';
import pagesData from '@/data/pagesData.json';

const detail = (pagesData as unknown as Record<string, Record<string, unknown>>).courses
  .detail as Record<string, unknown>;
const BANNERS = detail.banners as Record<string, { src: string; alt: string }>;
const BANNER_ARIA_LABEL = detail.bannerAriaLabel as string;

interface CourseBannerProps {
  category?: string;
}

export default function CourseBanner({ category = '' }: CourseBannerProps): JSX.Element | null {
  const banner = BANNERS[category];
  if (!banner) return null;

  return (
    <section className="course-banner" aria-label={BANNER_ARIA_LABEL}>
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
