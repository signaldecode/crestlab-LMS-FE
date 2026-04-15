/**
 * 소개(About) 페이지
 * - 본 콘텐츠 준비 전까지 ComingSoon placeholder 노출
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import ComingSoon, { type ComingSoonProps } from '@/components/common/ComingSoon';
import { getPageData } from '@/lib/data';

interface AboutPageData {
  seo: { title: string; description: string };
  comingSoon: ComingSoonProps;
}

function getCopy(): AboutPageData | null {
  return (getPageData('about') as AboutPageData | null) ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c ? { title: c.seo.title, description: c.seo.description } : { title: '소개' };
}

export default function AboutPage(): JSX.Element {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;
  return <ComingSoon {...copy.comingSoon} />;
}
