/**
 * 홈 히어로 컨테이너 (HomeHeroContainer)
 * - 풀 블리드 peek 캐러셀: 중앙 슬라이드 + 양쪽 반투명 슬라이드
 * - 자동 슬라이드 + 일시정지 + 페이지 카운터 + 좌우 화살표
 */

'use client';

import { useState, useEffect, useCallback, type JSX } from 'react';
import Image from 'next/image';

import banner1 from '@/assets/images/banners/banner1.jpg';
import banner2 from '@/assets/images/banners/banner2.png';
import banner3 from '@/assets/images/banners/banner3.jpg';
import banner4 from '@/assets/images/banners/banner4.webp';
import banner5 from '@/assets/images/banners/banner5.jpg';
import banner6 from '@/assets/images/banners/banner6.jpg';
import banner7 from '@/assets/images/banners/banner7.png';
import banner8 from '@/assets/images/banners/banner8.png';
import banner9 from '@/assets/images/banners/banner9.jpg';
import banner10 from '@/assets/images/banners/banner10.webp';
import banner11 from '@/assets/images/banners/banner11.webp';

const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10, banner11];
const AUTO_PLAY_INTERVAL = 5000;

export default function HomeHeroContainer(): JSX.Element {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = BANNERS.length;
  const prevIdx = (current - 1 + total) % total;
  const nextIdx = (current + 1) % total;

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  // 자동 슬라이드
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, total]);

  return (
    <section className="home-hero">
      <div className="home-hero__viewport">
        {/* 이전 슬라이드 */}
        <div className="home-hero__slide home-hero__slide--prev">
          <Image
            src={BANNERS[prevIdx]}
            alt={`배너 ${prevIdx + 1}`}
            fill
            sizes="100vw"
            className="home-hero__image"
          />
          <div className="home-hero__overlay" />
        </div>

        {/* 메인 슬라이드 */}
        <div className="home-hero__slide home-hero__slide--center">
          <Image
            src={BANNERS[current]}
            alt={`배너 ${current + 1}`}
            fill
            sizes="100vw"
            priority
            className="home-hero__image"
          />
        </div>

        {/* 다음 슬라이드 */}
        <div className="home-hero__slide home-hero__slide--next">
          <Image
            src={BANNERS[nextIdx]}
            alt={`배너 ${nextIdx + 1}`}
            fill
            sizes="100vw"
            className="home-hero__image"
          />
          <div className="home-hero__overlay" />
        </div>

        {/* 하단 우측 컨트롤바 */}
        <div className="home-hero__controls">
          <button
            type="button"
            className="home-hero__ctrl-btn"
            aria-label={paused ? '재생' : '일시정지'}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? '▶' : '❚❚'}
          </button>
          <span className="home-hero__counter">
            <span className="home-hero__counter-current">{current + 1}</span>
            {' / '}
            <span className="home-hero__counter-total">{total}</span>
          </span>
          <button type="button" className="home-hero__ctrl-btn" aria-label="이전 배너" onClick={prev}>
            ‹
          </button>
          <button type="button" className="home-hero__ctrl-btn" aria-label="다음 배너" onClick={next}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
