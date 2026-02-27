/**
 * 내 강의실 콘텐츠 (MyClassroomContent)
 * - 기본 탭(강의 / 과제 관리 / 조편성)
 * - 사이드바 메뉴 선택 시(강의 상담 / 수료증 / 후기 관리 / 구매 내역) 해당 콘텐츠 표시
 * - 수강한 강의가 없으면 빈 상태, 있으면 스켈레톤 UI
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import useMyPageStore from '@/stores/useMyPageStore';

const defaultTabs = ['강의', '과제 관리', '조편성'];
const menuTabs = ['강의 상담', '수료증', '후기 관리', '구매 내역'];

const SK = 'mypage-classroom';

/** 강의 카드 스켈레톤 */
function CourseCardSkeleton() {
  return (
    <div className={`${SK}__course-card`} aria-hidden="true">
      <div className={`${SK}__course-thumb`} />
      <div className={`${SK}__course-body`}>
        <div className={`${SK}__course-badges`}>
          <span className={`${SK}__skel-badge`} />
          <span className={`${SK}__skel-badge ${SK}__skel-badge--wide`} />
        </div>
        <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
        <div className={`${SK}__course-meta`}>
          <span className={`${SK}__skel-circle`} />
          <span className={`${SK}__skel-line ${SK}__skel-line--instructor`} />
        </div>
        <div className={`${SK}__course-progress`}>
          <div className={`${SK}__progress-bar`}>
            <div className={`${SK}__progress-fill`} />
          </div>
          <span className={`${SK}__skel-line ${SK}__skel-line--percent`} />
        </div>
      </div>
    </div>
  );
}

/** 강의 상담 카드 스켈레톤 (강의 + 상담 상태) */
function ConsultCardSkeleton() {
  return (
    <div className={`${SK}__consult-card`} aria-hidden="true">
      <div className={`${SK}__consult-thumb`} />
      <div className={`${SK}__consult-body`}>
        <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
        <div className={`${SK}__course-meta`}>
          <span className={`${SK}__skel-circle`} />
          <span className={`${SK}__skel-line ${SK}__skel-line--instructor`} />
        </div>
        <div className={`${SK}__skel-line ${SK}__skel-line--date`} />
      </div>
      <div className={`${SK}__skel-badge ${SK}__skel-badge--status`} />
    </div>
  );
}

/** 수료증 카드 스켈레톤 */
function CertificateCardSkeleton() {
  return (
    <div className={`${SK}__cert-card`} aria-hidden="true">
      <div className={`${SK}__cert-thumb`} />
      <div className={`${SK}__cert-body`}>
        <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
        <div className={`${SK}__course-meta`}>
          <span className={`${SK}__skel-circle`} />
          <span className={`${SK}__skel-line ${SK}__skel-line--instructor`} />
        </div>
        <div className={`${SK}__cert-footer`}>
          <span className={`${SK}__skel-line ${SK}__skel-line--date`} />
          <span className={`${SK}__skel-badge ${SK}__skel-badge--download`} />
        </div>
      </div>
    </div>
  );
}

/** 후기 관리 카드 스켈레톤 */
function ReviewCardSkeleton() {
  return (
    <div className={`${SK}__review-card`} aria-hidden="true">
      <div className={`${SK}__review-thumb`} />
      <div className={`${SK}__review-body`}>
        <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
        <div className={`${SK}__review-stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`${SK}__skel-star`} />
          ))}
        </div>
        <div className={`${SK}__skel-line ${SK}__skel-line--text-long`} />
        <div className={`${SK}__skel-line ${SK}__skel-line--text-short`} />
      </div>
    </div>
  );
}

/** 구매 내역 행 스켈레톤 */
function PurchaseRowSkeleton() {
  return (
    <div className={`${SK}__purchase-row`} aria-hidden="true">
      <span className={`${SK}__skel-line ${SK}__skel-line--date`} />
      <div className={`${SK}__purchase-course`}>
        <div className={`${SK}__purchase-thumb`} />
        <div className={`${SK}__purchase-info`}>
          <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
          <div className={`${SK}__skel-line ${SK}__skel-line--instructor`} />
        </div>
      </div>
      <span className={`${SK}__skel-line ${SK}__skel-line--price`} />
      <span className={`${SK}__skel-badge ${SK}__skel-badge--status`} />
    </div>
  );
}

/** 빈 상태 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className={`${SK}__empty`}>
      <p className={`${SK}__empty-text`}>{message}</p>
    </div>
  );
}

/** 메뉴 탭 콘텐츠 */
function MenuTabContent({ menu }: { menu: string }): JSX.Element {
  // TODO: 실제 API 연동 — 수강 강의 데이터 불러오기
  const hasCourses = true;

  const skeletonMap: Record<string, { count: number; Component: () => JSX.Element }> = {
    '강의 상담': { count: 3, Component: ConsultCardSkeleton },
    '수료증': { count: 3, Component: CertificateCardSkeleton },
    '후기 관리': { count: 3, Component: ReviewCardSkeleton },
    '구매 내역': { count: 4, Component: PurchaseRowSkeleton },
  };

  const skeleton = skeletonMap[menu];

  return (
    <div className={`${SK}__menu-content`}>
      <h2 className={`${SK}__menu-title`}>{menu}</h2>
      {hasCourses ? (
        <div className={menu === '구매 내역' ? `${SK}__purchase-list` : `${SK}__course-grid`}>
          {Array.from({ length: skeleton.count }).map((_, i) => (
            <skeleton.Component key={i} />
          ))}
        </div>
      ) : (
        <EmptyState message="수강한 강의가 없습니다." />
      )}
    </div>
  );
}

export default function MyClassroomContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState(defaultTabs[0]);
  const activeMenu = useMyPageStore((s) => s.activeMenu);

  // 사이드바 메뉴가 선택되어 있으면 해당 콘텐츠 표시
  if (menuTabs.includes(activeMenu)) {
    return (
      <div className="mypage-classroom">
        <MenuTabContent menu={activeMenu} />
      </div>
    );
  }

  // 기본 탭 (강의 / 과제 관리 / 조편성)
  return (
    <div className="mypage-classroom">
      {/* 탭 */}
      <div className="mypage-classroom__tabs" role="tablist">
        {defaultTabs.map((tab) => (
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
      <EmptyState message="아직 수강한 강의가 없어요." />

      {/* 프로모션 배너 스켈레톤 */}
      <div className="mypage-classroom__promo mypage-classroom__skeleton" />
    </div>
  );
}
