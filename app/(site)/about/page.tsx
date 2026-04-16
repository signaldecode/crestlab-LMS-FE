/**
 * 브랜드 소개(About) 페이지
 * - Figma `브랜드소개` 프레임(592:23295) 기준 6개 섹션 구성
 *   Hero → Data → Experience → Evolution → Professionals → Trust
 * - Data·Experience·Evolution 구간은 다크 배경 band로 묶는다
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { getPageData } from '@/lib/data';
import AboutHero, { type AboutHeroData } from '@/components/about/AboutHero';
import AboutData, { type AboutDataData } from '@/components/about/AboutData';
import AboutExperience, { type AboutExperienceData } from '@/components/about/AboutExperience';
import AboutEvolution, { type AboutEvolutionData } from '@/components/about/AboutEvolution';
import AboutProfessionals, { type AboutProfessionalsData } from '@/components/about/AboutProfessionals';
import AboutTrust, { type AboutTrustData } from '@/components/about/AboutTrust';

interface AboutPageData {
  seo: { title: string; description: string };
  ariaLabel: string;
  hero: AboutHeroData;
  data: AboutDataData;
  experience: AboutExperienceData;
  evolution: AboutEvolutionData;
  professionals: AboutProfessionalsData;
  trust: AboutTrustData;
}

function getCopy(): AboutPageData | null {
  return (getPageData('about') as AboutPageData | null) ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c
    ? { title: c.seo.title, description: c.seo.description }
    : { title: '브랜드 소개' };
}

export default function AboutPage(): JSX.Element {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  return (
    <main className="about" aria-label={copy.ariaLabel}>
      <AboutHero data={copy.hero} />
      <div className="about__dark">
        <AboutData data={copy.data} />
        <AboutExperience data={copy.experience} />
        <AboutEvolution data={copy.evolution} />
      </div>
      <AboutProfessionals data={copy.professionals} />
      <AboutTrust data={copy.trust} />
    </main>
  );
}
