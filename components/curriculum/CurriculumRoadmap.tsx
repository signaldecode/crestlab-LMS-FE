/**
 * 커리큘럼 로드맵 다이어그램 (CurriculumRoadmap)
 * - 3단계 목표(내집마련 / 순자산10억 / 순자산30억) + 하위 강의 목록
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

const roadmapCols = [
  {
    goal: '내집마련 하고 싶다면?',
    highlight: '',
    items: ['내집마련 기초반', '내집마련 중급반', '내집마련 실전반'],
  },
  {
    goal: '투자하고 싶다면?',
    highlight: '순자산 10억 달성!',
    items: ['열반스쿨 기초반', '실전 준비반', '열반스쿨 중급반', '서울투자 기초반', '지방투자 기초반'],
  },
  {
    goal: '경제적자유를 이루고 싶다면',
    highlight: '순자산 30억 달성!',
    items: ['열반스쿨 실전반', '지방투자 실전반', '월부학교'],
  },
];

export default function CurriculumRoadmap(): JSX.Element {
  return (
    <section className="curriculum-roadmap">
      <div className="curriculum-roadmap__inner">
        {roadmapCols.map((col) => (
          <div key={col.goal} className="curriculum-roadmap__col">
            <h3 className="curriculum-roadmap__goal">{col.goal}</h3>
            {col.highlight && (
              <span className="curriculum-roadmap__highlight">{col.highlight}</span>
            )}
            <div className="curriculum-roadmap__icon curriculum-roadmap__skeleton-circle" />
            <ul className="curriculum-roadmap__list">
              {col.items.map((item) => (
                <li key={item} className="curriculum-roadmap__item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
