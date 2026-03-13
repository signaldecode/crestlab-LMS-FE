/**
 * 내 강의실 콘텐츠 (MyClassroomContent)
 * - 기본 탭(강의 / 과제 관리 / 조편성) 표시
 * - 메뉴별 상세 콘텐츠는 /mypage/xxx 하위 라우트에서 별도 렌더링
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import mypageBanner from '@/assets/images/banners/mypage-banner.jpg';
import accountData from '@/data/accountData.json';

const classroomData = accountData.mypage.classroom;

const SK = 'mypage-classroom';

export default function MyClassroomContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState(classroomData.tabs[0]);

  return (
    <div className="mypage-classroom">
      {/* 탭 */}
      <div className="mypage-classroom__tabs" role="tablist">
        {classroomData.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === activeTab}
            className={`mypage-classroom__tab${tab === activeTab ? ' mypage-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 강의 탭 콘텐츠 */}
      <div className={`${SK}__empty`}>
        <p className={`${SK}__empty-text`}>{classroomData.emptyText}</p>
      </div>

      {/* 프로모션 배너 */}
      <div className="mypage-classroom__promo">
        <Image
          src={mypageBanner}
          alt={classroomData.promoBannerAlt}
          fill
          sizes="(max-width: 767px) 100vw, 700px"
          className="mypage-classroom__promo-img"
        />
      </div>
    </div>
  );
}
