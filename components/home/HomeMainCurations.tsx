/**
 * 홈 메인 큐레이션 어댑터 (HomeMainCurations)
 * - useMainPage() 데이터를 HomeMainCourseSection 에 매핑
 * - BEST / RECOMMENDED / NEW 3개 섹션
 * - 메타 텍스트는 data/homeData.json 에서 받는다
 */

'use client';

import type { JSX } from 'react';
import HomeMainCourseSection from '@/components/home/HomeMainCourseSection';
import { useMainPage } from '@/components/home/MainPageProvider';
import homeData from '@/data/homeData.json';

const META = homeData.homeMainCurations;

export function HomeBestCourses(): JSX.Element {
  const { data, loading, error } = useMainPage();
  return (
    <HomeMainCourseSection
      subtitle={META.best.subtitle}
      title={META.best.title}
      courses={data?.bestCourses ?? []}
      badge="best"
      loading={loading}
      error={error}
    />
  );
}

export function HomeRecommendedCourses(): JSX.Element {
  const { data, loading, error } = useMainPage();
  return (
    <HomeMainCourseSection
      subtitle={META.recommended.subtitle}
      title={META.recommended.title}
      courses={data?.recommendedCourses ?? []}
      badge="hot"
      loading={loading}
      error={error}
    />
  );
}

export function HomeNewCourses(): JSX.Element {
  const { data, loading, error } = useMainPage();
  return (
    <HomeMainCourseSection
      subtitle={META.new.subtitle}
      title={META.new.title}
      courses={data?.newCourses ?? []}
      badge="new"
      loading={loading}
      error={error}
    />
  );
}
