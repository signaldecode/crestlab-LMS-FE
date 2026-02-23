/**
 * 커리큘럼 페이지
 * - 배너 → 로드맵 다이어그램 → STEP별 강의 추천 → 하단 소개
 */

import type { JSX } from 'react';
import CurriculumHero from '@/components/curriculum/CurriculumHero';
import CurriculumRoadmap from '@/components/curriculum/CurriculumRoadmap';
import CurriculumStep from '@/components/curriculum/CurriculumStep';
import CurriculumFooter from '@/components/curriculum/CurriculumFooter';

const steps = [
  {
    step: 1,
    title: '부동산투자 기초클래스',
    subtitle: '부동산투자 기초부터 노후준비까지',
    courseCount: 3,
  },
  {
    step: 2,
    title: '부동산투자 중급클래스',
    subtitle: '서울부터 지방까지 실전 투자 노하우',
    courseCount: 2,
  },
  {
    step: 3,
    title: '부동산투자 실전클래스',
    subtitle: '직장인이 부동산 투자자로 성장하는 법',
    courseCount: 2,
  },
  {
    step: 4,
    title: '부동산투자 마스터클래스',
    subtitle: '직장인 투자자로 경제적 자유를 달성!',
    courseCount: 1,
  },
];

export default function CurriculumPage(): JSX.Element {
  return (
    <main className="curriculum-page">
      <CurriculumHero />
      <CurriculumRoadmap />
      {steps.map((s) => (
        <CurriculumStep
          key={s.step}
          step={s.step}
          title={s.title}
          subtitle={s.subtitle}
          courseCount={s.courseCount}
        />
      ))}
      <CurriculumFooter />
    </main>
  );
}
