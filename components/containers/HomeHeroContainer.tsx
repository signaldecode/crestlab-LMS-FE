/**
 * 홈 히어로 컨테이너 (HomeHeroContainer)
 * - 풀 블리드 단일 슬라이드 캐러셀 (한 번에 하나의 배너만 노출)
 * - 슬라이드 전환: 크로스페이드 + 부드러운 스케일 + Ken Burns 줌으로 시네마틱한 인상
 * - 자동 슬라이드 + 일시정지 + 페이지 카운터 + 좌우 화살표
 */

'use client';

import { useState, useEffect, useCallback, type JSX } from 'react';
import Image from 'next/image';

import banner1 from '@/assets/images/banners/banner1.svg';
import banner2 from '@/assets/images/banners/banner2.svg';
import banner3 from '@/assets/images/banners/banner3.svg';
import banner4 from '@/assets/images/banners/banner4.svg';
import banner5 from '@/assets/images/banners/banner5.svg';
import banner6 from '@/assets/images/banners/banner6.svg';
import banner7 from '@/assets/images/banners/banner7.svg';
import banner8 from '@/assets/images/banners/banner8.svg';
import banner9 from '@/assets/images/banners/banner9.svg';
import banner10 from '@/assets/images/banners/banner10.svg';
import banner11 from '@/assets/images/banners/banner11.svg';

const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10, banner11];
const AUTO_PLAY_INTERVAL = 6000;

type Direction = 'next' | 'prev';

export default function HomeHeroContainer(): JSX.Element {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>('next');
  const total = BANNERS.length;

  const prev = useCallback(() => {
    setDirection('prev');
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setDirection('next');
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('next');
      setCurrent((c) => (c + 1) % total);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="home-hero" data-direction={direction}>
      <div className="home-hero__viewport">
        {BANNERS.map((banner, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              className={`home-hero__slide${isActive ? ' home-hero__slide--active' : ''}`}
              aria-hidden={!isActive}
            >
              <Image
                src={banner}
                alt={`배너 ${idx + 1}`}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="home-hero__image"
              />
            </div>
          );
        })}

        {/* 배너 컨트롤바 */}
        <div className="home-hero__controls">
          <span className="home-hero__counter">{current + 1}/{total}</span>
          <button type="button" className="home-hero__ctrl-btn" aria-label="이전 배너" onClick={prev}>
            <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden="true">
              <path d="M6 1L1 7L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="home-hero__ctrl-btn" aria-label="다음 배너" onClick={next}>
            <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden="true">
              <path d="M1 1L6 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
