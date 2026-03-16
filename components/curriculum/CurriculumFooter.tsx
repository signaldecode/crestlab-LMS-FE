/**
 * 커리큘럼 하단 소개 섹션 (CurriculumFooter)
 * - 타이틀 + 4개 이미지+캡션 카드
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

interface CurriculumFooterProps {
  title: string;
  cards: string[];
}

export default function CurriculumFooter({ title, cards }: CurriculumFooterProps): JSX.Element {
  return (
    <section className="curriculum-footer">
      <h2 className="curriculum-footer__title">{title}</h2>
      <div className="curriculum-footer__grid">
        {cards.map((text) => (
          <div key={text} className="curriculum-footer__card">
            <div className="curriculum-footer__card-img curriculum-footer__skeleton" />
            <p className="curriculum-footer__card-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
