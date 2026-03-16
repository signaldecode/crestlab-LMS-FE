/**
 * 커리큘럼 STEP 섹션 (CurriculumStep)
 * - STEP 뱃지 + 타이틀 + 부제 + 강의 카드 1~3개 스켈레톤
 * - 세로 타임라인 연결선 포함
 */

import type { JSX } from 'react';

interface CurriculumStepProps {
  step: number;
  title: string;
  subtitle: string;
  courseCount: number;
  cardLinkLabel: string;
}

export default function CurriculumStep({ step, title, subtitle, courseCount, cardLinkLabel }: CurriculumStepProps): JSX.Element {
  return (
    <section className="curriculum-step">
      {/* 타임라인 연결선 */}
      <div className="curriculum-step__timeline" />

      {/* STEP 뱃지 + 타이틀 */}
      <div className="curriculum-step__header">
        <span className="curriculum-step__badge">STEP {step}</span>
        <h2 className="curriculum-step__title">{title}</h2>
        <p className="curriculum-step__subtitle">{subtitle}</p>
      </div>

      {/* 강의 카드 그리드 */}
      <div className="curriculum-step__cards">
        {Array.from({ length: courseCount }).map((_, i) => (
          <div key={i} className="curriculum-step__card">
            <div className="curriculum-step__card-thumb curriculum-step__skeleton" />
            <div className="curriculum-step__card-body">
              <div className="curriculum-step__skeleton-line curriculum-step__skeleton-line--title" />
              <div className="curriculum-step__skeleton-line curriculum-step__skeleton-line--title-sub" />
              <div className="curriculum-step__skeleton-line curriculum-step__skeleton-line--desc" />
              <div className="curriculum-step__skeleton-line curriculum-step__skeleton-line--desc-short" />
              <div className="curriculum-step__card-tags">
                <div className="curriculum-step__skeleton-tag" />
                <div className="curriculum-step__skeleton-tag" />
              </div>
              <span className="curriculum-step__card-link">{cardLinkLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
