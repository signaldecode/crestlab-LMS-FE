/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 피그마: 2열 레이아웃 (좌 860px: 주문정보+쿠폰+적립금+결제수단 / 우 508px: 결제금액)
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Course } from '@/types';
import { formatPrice } from '@/lib/payments';
import useCouponStore from '@/stores/useCouponStore';

const PAYMENT_METHODS = [
  { key: 'card', label: '카드결제', icon: '/images/payment/icon-card.svg' },
  { key: 'naverpay', label: '네이버페이', icon: '/images/payment/icon-naverpay.svg' },
  { key: 'kakaopay', label: '카카오페이', icon: '/images/payment/icon-kakaopay.svg' },
  { key: 'tosspay', label: '토스페이', icon: '/images/payment/icon-tosspay.svg' },
  { key: 'cash', label: '계좌이체', icon: '/images/payment/icon-cash.svg' },
] as const;

type PaymentKey = (typeof PAYMENT_METHODS)[number]['key'];

interface CheckoutContainerProps {
  course: Course | null;
}

export default function CheckoutContainer({ course }: CheckoutContainerProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentKey>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const coupon = useCouponStore((s) =>
    s.coupons.find((c) => c.courseSlug === (course?.slug ?? '')) ?? null
  );

  const coursePrice = course?.price ?? 0;
  const finalPrice = coursePrice;

  const handlePayment = useCallback(() => {
    if (!course || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      router.push(`/order/complete?orderId=ORD-${Date.now()}`);
    }, 1000);
  }, [course, isProcessing, router]);

  if (!course) {
    return (
      <section className="checkout">
        <h1 className="checkout__title">주문결제</h1>
        <p className="checkout__empty">강의 정보를 찾을 수 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="checkout__layout">
        {/* ── 좌측: 주문 정보 ── */}
        <div className="checkout__main">
          {/* 타이틀 */}
          <h1 className="checkout__title">주문결제</h1>

          {/* 주문 강의 */}
          <div className="checkout__order-section">
            <div className="checkout__course-row">
              <div className="checkout__course-thumb">
                <Image
                  src={course.thumbnail}
                  alt={course.thumbnailAlt}
                  width={280}
                  height={160}
                  className="checkout__course-image"
                />
              </div>
              <div className="checkout__course-info">
                <div className="checkout__course-text">
                  <h2 className="checkout__course-name">{course.title}</h2>
                  <p className="checkout__course-desc">{course.summary}</p>
                </div>
                <span className="checkout__course-price">{formatPrice(coursePrice)}</span>
              </div>
            </div>
          </div>

          {/* 쿠폰 */}
          <div className="checkout__section">
            <div className="checkout__section-header">
              <h3 className="checkout__section-title">쿠폰</h3>
              <button type="button" className="checkout__section-link">쿠폰코드 보기</button>
            </div>
            <div className="checkout__section-body">
              <div className="checkout__field">
                <span className="checkout__field-label">쿠폰</span>
                <div className="checkout__select">
                  <span className="checkout__select-text">쿠폰을 선택해주세요</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 8l5 5 5-5" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 적립금 */}
          <div className="checkout__section">
            <div className="checkout__section-header">
              <h3 className="checkout__section-title">적립금</h3>
              <div className="checkout__section-meta">
                <span className="checkout__section-note">사용가능</span>
                <span className="checkout__section-value">0</span>
              </div>
            </div>
            <div className="checkout__section-body">
              <div className="checkout__field">
                <span className="checkout__field-label">적립금</span>
                <div className="checkout__input-group">
                  <input
                    type="text"
                    className="checkout__input"
                    defaultValue="0"
                    aria-label="적립금 입력"
                  />
                  <button type="button" className="checkout__apply-btn">전액사용</button>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="checkout__section">
            <h3 className="checkout__section-title">결제 수단</h3>
            <div className="checkout__methods">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  className={`checkout__method${selectedMethod === method.key ? ' checkout__method--active' : ''}`}
                  onClick={() => setSelectedMethod(method.key)}
                  aria-pressed={selectedMethod === method.key}
                >
                  <Image src={method.icon} alt="" width={28} height={19} aria-hidden="true" />
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 우측: 결제금액 사이드바 ── */}
        <aside className="checkout__sidebar">
          <div className="checkout__sidebar-inner">
            {/* 결제금액 상세 */}
            <div className="checkout__price-section">
              <h3 className="checkout__price-title">결제금액</h3>
              <div className="checkout__price-rows">
                <div className="checkout__price-row">
                  <span className="checkout__price-label">총 클래스 결제 금액</span>
                  <span className="checkout__price-value">{formatPrice(coursePrice)}</span>
                </div>
                <div className="checkout__price-row">
                  <span className="checkout__price-label">쿠폰 사용</span>
                  <span className="checkout__price-value">0원</span>
                </div>
                <div className="checkout__price-row">
                  <span className="checkout__price-label">포인트 사용</span>
                  <span className="checkout__price-value">0원</span>
                </div>
              </div>
            </div>

            {/* 총 결제 금액 + 결제 버튼 */}
            <div className="checkout__total-section">
              <div className="checkout__total-row">
                <span className="checkout__total-label">총 결제 금액</span>
                <span className="checkout__total-value">{formatPrice(finalPrice)}</span>
              </div>
              <button
                type="button"
                className="checkout__pay-btn"
                disabled={isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? '처리 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
