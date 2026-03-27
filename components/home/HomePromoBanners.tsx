/**
 * 홈 프로모 배너 캐러셀 (HomePromoBanners)
 * - 2열 레이아웃으로 배너를 표시하고, 도트 페이지네이션 + 좌우 화살표로 슬라이드
 * - 데이터는 lib/data.ts의 getHomePromoBanners()에서 로드
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HomePromoBannerSection } from '@/types';

interface HomePromoBannersProps {
  section: HomePromoBannerSection;
}

const BANNERS_PER_PAGE = 2;

export default function HomePromoBanners({ section }: HomePromoBannersProps): JSX.Element {
  const { meta, banners } = section;
  const totalPages = Math.ceil(banners.length / BANNERS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  const shiftPercent = currentPage * 100;

  return (
    <section className="home-promo" aria-label={meta.ariaLabel}>
      <div className="home-promo__carousel">
        <div
          className="home-promo__track"
          style={{ transform: `translateX(-${shiftPercent}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="home-promo__slide">
              <Link href={banner.href} className="home-promo__link" aria-label={banner.ariaLabel}>
                <div className="home-promo__image-wrap">
                  <Image
                    src={banner.thumbnail}
                    alt={banner.thumbnailAlt}
                    fill
                    sizes="(max-width: 639px) 100vw, 50vw"
                    className="home-promo__image"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 도트 페이지네이션 + 화살표 */}
      <nav className="home-promo__nav" aria-label={meta.ariaLabel}>
        <button
          type="button"
          className="home-promo__arrow"
          onClick={handlePrev}
          disabled={currentPage === 0}
          aria-label="이전 배너"
        >
          &#8249;
        </button>

        <div className="home-promo__dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`home-promo__dot${i === currentPage ? ' home-promo__dot--active' : ''}`}
              onClick={() => setCurrentPage(i)}
              aria-label={`${i + 1}페이지`}
              aria-current={i === currentPage ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          className="home-promo__arrow"
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          aria-label="다음 배너"
        >
          &#8250;
        </button>
      </nav>
    </section>
  );
}
