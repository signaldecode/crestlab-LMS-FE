/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 결제 페이지의 메인 조립 레이어
 * - 주문 정보 확인, 쿠폰/상품권·포인트 적용, 결제 수단 선택, 최종 결제 버튼
 * - 2칸 레이아웃: 왼쪽 주문 정보 / 오른쪽 결제 요약
 * - course prop으로 실제 강의 데이터를 표시한다
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Course } from '@/types';
import useCouponStore from '@/stores/useCouponStore';

type PaymentMethod = 'card' | 'kakao' | 'naver' | 'toss' | 'bank';

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'card', label: '신용·체크카드' },
  { key: 'kakao', label: '카카오페이' },
  { key: 'naver', label: 'N Pay' },
  { key: 'toss', label: '토스페이' },
  { key: 'bank', label: '계좌이체' },
];

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

function getBadgeVariant(badge: string): string {
  if (badge === 'ORIGINAL') return 'original';
  if (badge === 'BEST') return 'best';
  if (badge === 'NEW' || badge.includes('신규')) return 'new';
  if (badge.includes('선착순') || badge.includes('마감')) return 'urgent';
  if (badge.startsWith('LV.')) return 'level';
  return 'default';
}

function getLevelLabel(level: string): string {
  const map: Record<string, string> = { beginner: '입문', intermediate: '초급', advanced: '중급이상' };
  return map[level] ?? level;
}

interface CheckoutContainerProps {
  course: Course | null;
}

export default function CheckoutContainer({ course }: CheckoutContainerProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [voucherType, setVoucherType] = useState<'voucher' | 'point'>('voucher');
  const [voucherAmount, setVoucherAmount] = useState('0');
  const [pointAmount, setPointAmount] = useState('0');
  const [agreed, setAgreed] = useState(false);

  const coupon = useCouponStore((s) => s.coupons.find((c) => c.courseSlug === (course?.slug ?? '')) ?? null);

  if (!course) {
    return (
      <section className="checkout-container">
        <h1 className="checkout-container__title">주문결제</h1>
        <p style={{ padding: '2rem 0', color: '#888' }}>강의 정보를 찾을 수 없습니다.</p>
      </section>
    );
  }

  const couponDiscount = couponApplied && coupon
    ? Math.round(course.price * (coupon.discountRate / 100))
    : 0;
  const finalPrice = course.price - couponDiscount;

  return (
    <section className="checkout-container">
      <h1 className="checkout-container__title">주문결제</h1>

      <div className="checkout-container__layout">
        {/* ── 왼쪽: 주문 정보 ── */}
        <div className="checkout-container__main">

          {/* 주문 강의 정보 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">주문 강의</h2>
            <div className="checkout-container__course-item">
              <div className="checkout-container__course-thumb">
                <Image
                  src={course.thumbnail}
                  alt={course.thumbnailAlt || course.title}
                  width={180}
                  height={100}
                  style={{ objectFit: 'cover', borderRadius: '0.375rem' }}
                />
              </div>
              <div className="checkout-container__course-info">
                {course.badges.length > 0 && (
                  <div className="checkout-container__course-badges">
                    {course.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`checkout-container__course-badge checkout-container__course-badge--${getBadgeVariant(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                <span className="checkout-container__course-title">{course.title}</span>
                <div className="checkout-container__course-meta">
                  <span className="checkout-container__course-instructor">{course.instructor}</span>
                  <span className="checkout-container__course-meta-dot" />
                  <span className="checkout-container__course-level">{getLevelLabel(course.level)}</span>
                  <span className="checkout-container__course-meta-dot" />
                  <span className="checkout-container__course-duration">{course.duration}</span>
                </div>
                <div className="checkout-container__course-price">
                  <span className="checkout-container__course-price-final">{formatPrice(course.price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 쿠폰 */}
          <div className="checkout-container__section">
            <div className="checkout-container__section-header">
              <h2 className="checkout-container__section-title">쿠폰</h2>
              <button
                type="button"
                className="checkout-container__coupon-link"
                onClick={() => setCouponOpen(!couponOpen)}
              >
                쿠폰코드 &gt;
              </button>
            </div>
            <div className="checkout-container__select-wrap">
              <select
                className="checkout-container__select"
                disabled={!coupon}
                value={couponApplied ? 'apply' : ''}
                onChange={(e) => setCouponApplied(e.target.value === 'apply')}
              >
                {coupon ? (
                  <>
                    <option value="">쿠폰을 선택하세요</option>
                    <option value="apply">{coupon.discountRate}% 할인 쿠폰</option>
                  </>
                ) : (
                  <option value="">사용가능한 쿠폰이 없어요</option>
                )}
              </select>
              <svg className="checkout-container__select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>

          {/* 상품권 · 포인트 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">
              상품권 · 포인트
              <span className="checkout-container__section-note">*둘 중 하나만 적용 가능</span>
            </h2>

            {/* 상품권 */}
            <div className="checkout-container__voucher-row">
              <label className="checkout-container__radio-label">
                <input
                  type="radio"
                  name="voucherType"
                  checked={voucherType === 'voucher'}
                  onChange={() => setVoucherType('voucher')}
                  className="checkout-container__radio"
                />
                <span className="checkout-container__radio-text">상품권</span>
                <span className="checkout-container__available">사용 가능 0</span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                  disabled={voucherType !== 'voucher'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'voucher'}
                >
                  전액 사용
                </button>
              </div>
            </div>

            {/* 포인트 */}
            <div className="checkout-container__voucher-row">
              <label className="checkout-container__radio-label">
                <input
                  type="radio"
                  name="voucherType"
                  checked={voucherType === 'point'}
                  onChange={() => setVoucherType('point')}
                  className="checkout-container__radio"
                />
                <span className="checkout-container__radio-text">포인트</span>
                <span className="checkout-container__available">사용 가능 0</span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  disabled={voucherType !== 'point'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'point'}
                >
                  전액 사용
                </button>
              </div>
            </div>

            <p className="checkout-container__point-note">
              *실 결제 금액의 50%까지 사용 가능
            </p>
          </div>

          {/* 결제 수단 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">결제 수단</h2>
            <div className="checkout-container__payment-methods">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  className={`checkout-container__payment-option${selectedMethod === method.key ? ' checkout-container__payment-option--active' : ''}`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 오른쪽: 결제 요약 ── */}
        <aside className="checkout-container__summary">
          <div className="checkout-container__summary-sticky">
            <h2 className="checkout-container__section-title">결제 금액</h2>

            <div className="checkout-container__summary-row">
              <span>총 클래스 금액</span>
              <span>{formatPrice(course.price)}</span>
            </div>
            <div className="checkout-container__summary-row">
              <span>쿠폰 할인</span>
              <span className={couponDiscount > 0 ? 'checkout-container__summary-discount' : ''}>
                {couponDiscount > 0 ? `-${formatPrice(couponDiscount)}` : '0원'}
              </span>
            </div>
            <div className="checkout-container__summary-row">
              <span>상품권 사용</span>
              <span>0원</span>
            </div>
            <div className="checkout-container__summary-row">
              <span>포인트 사용</span>
              <span>0원</span>
            </div>

            <div className="checkout-container__summary-divider" />

            <div className="checkout-container__summary-row checkout-container__summary-row--total">
              <span>총 결제 금액</span>
              <span>{formatPrice(finalPrice)}</span>
            </div>

            <button
              type="button"
              className="checkout-container__pay-btn"
              disabled={!agreed}
            >
              {formatPrice(finalPrice)} 결제하기
            </button>

            <label className="checkout-container__agree-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="checkout-container__agree-checkbox"
              />
              <span className="checkout-container__agree-text">
                강의 및 결제 정보를 확인하였으며, 수강정책 및 환불규정에 동의합니다.
              </span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}
