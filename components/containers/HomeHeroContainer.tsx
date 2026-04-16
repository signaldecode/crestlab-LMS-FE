/**
 * 홈 히어로 컨테이너 (HomeHeroContainer)
 * - 풀 블리드 단일 슬라이드 캐러셀 (한 번에 하나의 배너만 노출)
 * - 슬라이드 전환: 크로스페이드 + 부드러운 스케일 + Ken Burns 줌으로 시네마틱한 인상
 * - 자동 슬라이드 + 일시정지 + 페이지 카운터 + 좌우 화살표
 * - 데이터: 백엔드 `GET /api/v1/main` → banners (관리자가 등록한 활성 배너)
 *   - PC/모바일 이미지가 분리되어 내려오므로 viewport 기준으로 선택한다
 *   - 백엔드 데이터가 없거나 로딩 중인 경우 스켈레톤 노출
 */

'use client';

import { useState, useEffect, useCallback, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useMainPage } from '@/components/home/MainPageProvider';

const AUTO_PLAY_INTERVAL = 6000;
const MOBILE_BREAKPOINT = 768;

type Direction = 'next' | 'prev';

export default function HomeHeroContainer(): JSX.Element {
  const { data, loading } = useMainPage();
  const banners = data?.banners ?? [];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>('next');
  const [isMobile, setIsMobile] = useState(false);
  const total = banners.length;

  const prev = useCallback(() => {
    if (total === 0) return;
    setDirection('prev');
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    if (total === 0) return;
    setDirection('next');
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  // 자동 슬라이드
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setDirection('next');
      setCurrent((c) => (c + 1) % total);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [total]);

  // 뷰포트에 따라 PC/모바일 이미지 선택
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 배너 개수가 줄어들 경우 current 인덱스 보정
  useEffect(() => {
    if (current >= total && total > 0) setCurrent(0);
  }, [current, total]);

  // 로딩 / 빈 상태
  if (loading && total === 0) {
    return <section className="home-hero home-hero--loading" aria-busy="true" />;
  }
  if (total === 0) {
    return <section className="home-hero home-hero--empty" aria-hidden="true" />;
  }

  return (
    <section className="home-hero" data-direction={direction}>
      <div className="home-hero__viewport">
        {banners.map((banner, idx) => {
          const isActive = idx === current;
          const src = isMobile ? banner.mobileImageUrl : banner.pcImageUrl;
          const slide = (
            <div
              className={`home-hero__slide${isActive ? ' home-hero__slide--active' : ''}`}
              aria-hidden={!isActive}
            >
              <Image
                src={src}
                alt={banner.title}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="home-hero__image"
                unoptimized
              />
            </div>
          );

          return banner.linkUrl ? (
            <Link key={banner.id} href={banner.linkUrl} className="home-hero__link" aria-label={banner.title}>
              {slide}
            </Link>
          ) : (
            <div key={banner.id}>{slide}</div>
          );
        })}

        {/* 배너 컨트롤바 */}
        {total > 1 && (
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
        )}
      </div>
    </section>
  );
}
