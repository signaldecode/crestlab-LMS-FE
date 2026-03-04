/**
 * 강의 상세 오른쪽 사이드바 (CourseDetailSidebar)
 * - 강의명, 평점, 후기 수, 가격, 쿠폰, 수강옵션, 찜, 구매 버튼
 * - 쿠폰 받기 클릭 시 모달 표시
 */

'use client';

import { useEffect, useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import type { Course } from '@/types';
import useWishlistStore from '@/stores/useWishlistStore';
import useCouponStore from '@/stores/useCouponStore';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
}

interface CourseDetailSidebarProps {
  course: Course;
}

/** 쿠폰 모달 */
function CouponModal({ discountRate, onClose }: { discountRate: number; onClose: () => void }): JSX.Element {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="coupon-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="쿠폰 받기 완료">
      <div className="coupon-modal__card" onClick={(e) => e.stopPropagation()}>
        <h3 className="coupon-modal__title">쿠폰 받기 완료!</h3>
        <p className="coupon-modal__desc">2026.03.06까지 할인받고 구매하세요.</p>

        <div className="coupon-modal__coupon">
          <span className="coupon-modal__label">혜택 쿠폰</span>
          <span className="coupon-modal__amount">{discountRate}%</span>
        </div>

        <button type="button" className="coupon-modal__confirm" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

const DISCOUNT_RATE = 15;

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps): JSX.Element {
  const discountedPrice = Math.round(course.price * (1 - DISCOUNT_RATE / 100));
  const toggleWish = useWishlistStore((s) => s.toggleWish);
  const addRecent = useWishlistStore((s) => s.addRecent);
  const wished = useWishlistStore((s) => s.slugs.includes(course.slug));
  const claimCoupon = useCouponStore((s) => s.claimCoupon);
  const couponClaimed = useCouponStore((s) => s.coupons.some((c) => c.courseSlug === course.slug));
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    addRecent(course.slug);
  }, [course.slug, addRecent]);

  const handleCouponClick = () => {
    if (!couponClaimed) {
      const amount = Math.round(course.price * (DISCOUNT_RATE / 100));
      const today = new Date();
      const validFrom = today.toISOString().slice(0, 10).replace(/-/g, '.');
      const expiry = new Date(today);
      expiry.setDate(expiry.getDate() + 2);
      const validTo = expiry.toISOString().slice(0, 10).replace(/-/g, '.');
      const amountLabel = amount >= 10000
        ? `${Math.round(amount / 10000)}만원`
        : `${amount.toLocaleString('ko-KR')}원`;
      claimCoupon({
        courseSlug: course.slug,
        discountRate: DISCOUNT_RATE,
        amount,
        description: `[첫구매 ${amountLabel} 쿠폰] ${course.title}`,
        validFrom,
        validTo,
      });
      setShowCoupon(true);
    }
  };

  const handleCloseCoupon = useCallback(() => setShowCoupon(false), []);

  return (
    <aside className="course-detail-sidebar">
      <div className="course-detail-sidebar__sticky">
        {/* 강의명 */}
        <h2 className="course-detail-sidebar__title">{course.title}</h2>

        {/* 평점 + 후기 */}
        {course.rating != null && (
          <div className="course-detail-sidebar__rating">
            <span className="course-detail-sidebar__stars">★ {course.rating.toFixed(2)}</span>
            <span className="course-detail-sidebar__review-count">
              ({formatReviewCount(course.reviewCount ?? 0)}개 후기)
            </span>
          </div>
        )}

        {/* 가격 */}
        <div className="course-detail-sidebar__price-section">
          <div className="course-detail-sidebar__original-price">
            {formatPrice(course.price)}
          </div>
          <div className="course-detail-sidebar__discount-price">
            <span className="course-detail-sidebar__discount-rate">{DISCOUNT_RATE}%</span>
            <span className="course-detail-sidebar__final-price">{formatPrice(discountedPrice)}</span>
            <span className="course-detail-sidebar__first-buy">첫구매 할인가</span>
          </div>
        </div>

        {/* 쿠폰 */}
        <button
          type="button"
          className={`course-detail-sidebar__coupon-btn${couponClaimed ? ' course-detail-sidebar__coupon-btn--claimed' : ''}`}
          onClick={handleCouponClick}
          disabled={couponClaimed}
        >
          {couponClaimed ? '✓ 쿠폰 받음' : '쿠폰 받기'}
        </button>

        {/* 수강 옵션 */}
        <div className="course-detail-sidebar__options">
          <h4 className="course-detail-sidebar__options-title">수강 옵션</h4>
          <div className="course-detail-sidebar__option-item course-detail-sidebar__option-item--selected">
            <div className="course-detail-sidebar__option-info">
              <span className="course-detail-sidebar__option-name">{course.title}</span>
              <span className="course-detail-sidebar__option-duration">{course.duration} · 무제한 수강</span>
            </div>
            <span className="course-detail-sidebar__option-price">{formatPrice(discountedPrice)}</span>
          </div>
        </div>

        {/* 총 상품 금액 */}
        <div className="course-detail-sidebar__total">
          <span className="course-detail-sidebar__total-label">총 상품 금액</span>
          <span className="course-detail-sidebar__total-price">{formatPrice(discountedPrice)}</span>
        </div>

        {/* CTA 버튼 */}
        <div className="course-detail-sidebar__actions">
          <button
            type="button"
            className={`course-detail-sidebar__wish-btn${wished ? ' course-detail-sidebar__wish-btn--active' : ''}`}
            onClick={() => toggleWish(course.slug)}
            aria-label={wished ? '찜 해제' : '찜하기'}
          >
            {wished ? '♥' : '♡'}
          </button>
          <Link
            href={`/checkout?slug=${course.slug}`}
            className="course-detail-sidebar__buy-btn"
          >
            강의 구매하기
          </Link>
        </div>
      </div>

      {/* 쿠폰 모달 */}
      {showCoupon && <CouponModal discountRate={DISCOUNT_RATE} onClose={handleCloseCoupon} />}
    </aside>
  );
}
