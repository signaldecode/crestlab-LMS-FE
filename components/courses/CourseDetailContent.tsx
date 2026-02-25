/**
 * 강의 상세 왼쪽 콘텐츠 (CourseDetailContent)
 * - 썸네일, 베스트 수강후기 4개, 앵커 탭(소개/질문·답변/커리큘럼/크리에이터/후기)
 * - ?tab= 쿼리 파라미터로 외부에서 탭 지정 가능
 * - 스켈레톤 UI
 */

'use client';

import { useState, useEffect, useRef, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';

const TABS = ['소개', '질문 · 답변', '커리큘럼', '크리에이터', '후기'];

export default function CourseDetailContent(): JSX.Element {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabsRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState('소개');

  // ?tab= 쿼리 파라미터로 탭 활성화 + 탭 위치로 스크롤
  useEffect(() => {
    if (tabParam) {
      const matched = TABS.find((t) => t.replace(/\s/g, '') === tabParam.replace(/\s/g, ''));
      if (matched) {
        setActiveTab(matched);
        // 탭 바 위치로 스크롤
        requestAnimationFrame(() => {
          tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [tabParam]);

  return (
    <div className="course-detail-content">
      {/* 브레드크럼 */}
      <div className="course-detail-content__breadcrumb">
        <span className="course-detail-content__breadcrumb-skeleton" />
      </div>

      {/* 강의 썸네일 */}
      <div className="course-detail-content__thumb course-detail-content__skeleton" />

      {/* 베스트 수강 후기 */}
      <div className="course-detail-content__reviews-section">
        <h3 className="course-detail-content__section-title">베스트 수강 후기</h3>
        <div className="course-detail-content__reviews-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="course-detail-content__review-card">
              <div className="course-detail-content__review-header">
                <div className="course-detail-content__review-avatar course-detail-content__skeleton-circle" />
                <div className="course-detail-content__review-meta">
                  <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--name" />
                  <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--rating" />
                </div>
              </div>
              <div className="course-detail-content__review-body">
                <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--text" />
                <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--text-short" />
                <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--text-shorter" />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="course-detail-content__reviews-all">
          전체 후기 보기
        </button>
      </div>

      {/* 앵커 탭 */}
      <div ref={tabsRef} className="course-detail-content__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`course-detail-content__tab${tab === activeTab ? ' course-detail-content__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 스켈레톤 */}
      <div className="course-detail-content__tab-panel">
        {activeTab === '소개' && (
          <>
            <h3 className="course-detail-content__section-title">수강 정보</h3>
            <div className="course-detail-content__info-grid">
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">수강 기간</span>
                <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--info" />
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">구성</span>
                <div className="course-detail-content__skeleton-line course-detail-content__skeleton-line--info" />
              </div>
            </div>

            <h3 className="course-detail-content__section-title">강의 설명</h3>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="course-detail-content__skeleton-line course-detail-content__skeleton-line--desc"
                style={{ width: `${90 - i * 8}%` }}
              />
            ))}
          </>
        )}

        {activeTab === '질문 · 답변' && (
          <div className="course-detail-content__placeholder">
            <p>아직 질문이 없습니다.</p>
          </div>
        )}

        {activeTab === '커리큘럼' && (
          <div className="course-detail-content__placeholder">
            <h3 className="course-detail-content__section-title">커리큘럼</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="course-detail-content__skeleton-line course-detail-content__skeleton-line--desc"
                style={{ width: `${85 - i * 10}%` }}
              />
            ))}
          </div>
        )}

        {activeTab === '크리에이터' && (
          <div className="course-detail-content__placeholder">
            <p>크리에이터 정보를 불러오는 중입니다.</p>
          </div>
        )}

        {activeTab === '후기' && (
          <div className="course-detail-content__placeholder">
            <p>수강 후기를 불러오는 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
