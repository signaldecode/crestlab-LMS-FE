/**
 * 커리큘럼 페이지
 * - 배너 → 로드맵 다이어그램 → STEP별 강의 추천 → 하단 소개
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { getPageData } from '@/lib/data';
import CurriculumHero from '@/components/curriculum/CurriculumHero';
import CurriculumRoadmap from '@/components/curriculum/CurriculumRoadmap';
import CurriculumStep from '@/components/curriculum/CurriculumStep';
import CurriculumFooter from '@/components/curriculum/CurriculumFooter';

interface CurriculumStepData {
  step: number;
  title: string;
  subtitle: string;
  courseCount: number;
}

interface CurriculumPageData {
  seo: { title: string; description: string };
  steps: CurriculumStepData[];
  stepCardLinkLabel: string;
  roadmap: { goal: string; highlight: string; items: string[] }[];
  footer: { title: string; cards: string[] };
}

const curriculumData = getPageData('curriculum') as CurriculumPageData | null;

export const metadata: Metadata = {
  title: curriculumData?.seo?.title,
  description: curriculumData?.seo?.description,
};

export default function CurriculumPage(): JSX.Element {
  const steps = curriculumData?.steps ?? [];
  const roadmap = curriculumData?.roadmap ?? [];
  const footer = curriculumData?.footer ?? { title: '', cards: [] };
  const stepCardLinkLabel = curriculumData?.stepCardLinkLabel ?? '';

  return (
    <main className="curriculum-page">
      <CurriculumHero />
      <CurriculumRoadmap cols={roadmap} />
      {steps.map((s) => (
        <CurriculumStep
          key={s.step}
          step={s.step}
          title={s.title}
          subtitle={s.subtitle}
          courseCount={s.courseCount}
          cardLinkLabel={stepCardLinkLabel}
        />
      ))}
      <CurriculumFooter title={footer.title} cards={footer.cards} />
    </main>
  );
}
