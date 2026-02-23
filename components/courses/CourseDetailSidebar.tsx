/**
 * 강의 상세 오른쪽 사이드바 (CourseDetailSidebar)
 * - 강의명, 평점, 후기 수, 가격, 할인가, 쿠폰, 수강옵션, 찜, 구매 버튼
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

export default function CourseDetailSidebar(): JSX.Element {
  return (
    <aside className="course-detail-sidebar">
      <div className="course-detail-sidebar__sticky">
        {/* 강의명 */}
        <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--title" />
        <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--title-sub" />

        {/* 평점 + 후기 */}
        <div className="course-detail-sidebar__rating">
          <span className="course-detail-sidebar__stars">★★★★★</span>
          <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--rating" />
        </div>

        {/* 가격 */}
        <div className="course-detail-sidebar__price-section">
          <div className="course-detail-sidebar__original-price">
            <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--original" />
          </div>
          <div className="course-detail-sidebar__discount-price">
            <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--discount" />
            <span className="course-detail-sidebar__first-buy">첫구매 할인가</span>
          </div>
        </div>

        {/* 쿠폰 */}
        <button type="button" className="course-detail-sidebar__coupon-btn">
          🎟 쿠폰 받기
        </button>

        {/* 수강 옵션 */}
        <div className="course-detail-sidebar__options">
          <h4 className="course-detail-sidebar__options-title">수강 옵션</h4>
          <div className="course-detail-sidebar__option-item">
            <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--option" />
            <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--option-price" />
          </div>
        </div>

        {/* 총 상품 금액 */}
        <div className="course-detail-sidebar__total">
          <span className="course-detail-sidebar__total-label">총 상품 금액</span>
          <div className="course-detail-sidebar__skeleton-line course-detail-sidebar__skeleton-line--total" />
        </div>

        {/* CTA 버튼 */}
        <div className="course-detail-sidebar__actions">
          <button type="button" className="course-detail-sidebar__wish-btn" aria-label="찜하기">
            ♡
          </button>
          <button type="button" className="course-detail-sidebar__buy-btn">
            강의 구매하기
          </button>
        </div>
      </div>
    </aside>
  );
}
