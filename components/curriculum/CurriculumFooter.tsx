/**
 * 커리큘럼 하단 소개 섹션 (CurriculumFooter)
 * - "대한민국 직장인들이 부자가 되는 곳" + 4개 이미지+캡션 카드
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

const cards = [
  '대한민국 흙수저로 시작해\n자수성가한 부자들이 모인 곳',
  '수강생도 부자로 만드는\n실효적이고 구체적인 강의',
  '국내유일! 직장인을 위한\n체계적인 재테크 교육 시스템',
  '서로 독려하며 끝까지\n성장할 수 있는 커뮤니티',
];

export default function CurriculumFooter(): JSX.Element {
  return (
    <section className="curriculum-footer">
      <h2 className="curriculum-footer__title">대한민국 직장인들이 부자가 되는 곳</h2>
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
