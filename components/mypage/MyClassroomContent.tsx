/**
 * 내 강의실 콘텐츠 (MyClassroomContent)
 * - 탭(강의 / 과제 관리 / 조편성) + 강의 목록 스켈레톤
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';

const tabs = ['강의', '과제 관리', '조편성'];

export default function MyClassroomContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="mypage-classroom">
      {/* 탭 */}
      <div className="mypage-classroom__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`mypage-classroom__tab${tab === activeTab ? ' mypage-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            aria-pressed={tab === activeTab}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 빈 상태 */}
      <div className="mypage-classroom__empty">
        <p className="mypage-classroom__empty-text">아직 수강한 강의가 없어요.</p>
      </div>

      {/* 프로모션 배너 스켈레톤 */}
      <div className="mypage-classroom__promo mypage-classroom__skeleton" />
    </div>
  );
}
