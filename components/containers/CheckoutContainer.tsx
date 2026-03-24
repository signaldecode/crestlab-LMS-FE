/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 결제 페이지의 메인 조립 레이어
 * - 주문 정보 확인, 쿠폰/상품권·포인트 적용, 결제 수단 선택, 최종 결제 버튼
 * - 2칸 레이아웃: 왼쪽 주문 정보 / 오른쪽 결제 요약
 * - API 개별 연동 키로 토스 결제창을 직접 띄운다
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Course } from '@/types';
import { getPageData } from '@/lib/data';
import { formatPrice } from '@/lib/payments';
import { createOrder } from '@/lib/api';
import { getTossPayment, resetTossPayment, TOSS_ANONYMOUS } from '@/lib/toss';
import useCouponStore from '@/stores/useCouponStore';
import useOrderStore from '@/stores/useOrderStore';
import useAuthStore from '@/stores/useAuthStore';
import CouponSelect from '@/components/payments/CouponSelect';
import PaymentMethodSelect from '@/components/payments/PaymentMethodSelect';
import type { PaymentMethodKey } from '@/components/payments/PaymentMethodSelect';
import PriceSummary from '@/components/payments/PriceSummary';

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

/** 선택된 결제수단으로 토스 결제창을 호출한다 */
async function requestTossPayment(
  payment: Awaited<ReturnType<typeof getTossPayment>>,
  method: PaymentMethodKey,
  base: { amount: { currency: 'KRW'; value: number }; orderId: string; orderName: string; customerEmail: string; customerName: string; successUrl: string; failUrl: string },
) {
  if (method === 'transfer') {
    return payment.requestPayment({ ...base, method: 'TRANSFER' });
  }
  /* 간편결제(카카오/네이버/토스)는 CARD + easyPay 조합 */
  if (method === 'kakaopay' || method === 'naverpay' || method === 'tosspay') {
    const easyPayMap = { kakaopay: 'KAKAOPAY', naverpay: 'NAVERPAY', tosspay: 'TOSSPAY' } as const;
    return payment.requestPayment({
      ...base,
      method: 'CARD',
      card: { flowMode: 'DIRECT', easyPay: easyPayMap[method] },
    });
  }
  return payment.requestPayment({ ...base, method: 'CARD' });
}

interface CheckoutContainerProps {
  course: Course | null;
}

export default function CheckoutContainer({ course }: CheckoutContainerProps) {
  const router = useRouter();

  /* ── data 기반 라벨 ── */
  const pageData = getPageData('checkout') as Record<string, unknown> | null;
  const title = (pageData?.title as string) ?? '주문결제';
  const sections = (pageData?.sections as Record<string, string>) ?? {};
  const agreement = (pageData?.agreement as Record<string, string>) ?? {};
  const summary = (pageData?.summary as Record<string, string>) ?? {};
  const errors = (pageData?.errors as Record<string, string>) ?? {};

  /* ── 상태 ── */
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodKey>('card');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [voucherType, setVoucherType] = useState<'voucher' | 'point'>('voucher');
  const [voucherAmount, setVoucherAmount] = useState('0');
  const [pointAmount, setPointAmount] = useState('0');
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ── 스토어 ── */
  const coupon = useCouponStore((s) =>
    s.coupons.find((c) => c.courseSlug === (course?.slug ?? '')) ?? null
  );
  const user = useAuthStore((s) => s.user);
  const { setPendingOrder, setPaymentStatus, setError } = useOrderStore();

  /* ── 금액 계산 ── */
  const coursePrice = course?.price ?? 0;
  const couponDiscount =
    couponApplied && coupon
      ? Math.round(coursePrice * (coupon.discountRate / 100))
      : 0;
  const finalPrice = Math.max(coursePrice - couponDiscount, 0);

  /* ── 결제 실행 ── */
  const handlePayment = useCallback(async () => {
    if (!course || !agreed || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentStatus('creating');

    try {
      /* 1. 백엔드에 주문 생성 */
      const orderResponse = await createOrder({
        courseSlugs: [course.slug],
        couponId: couponApplied && coupon ? coupon.id : undefined,
      });

      setPendingOrder(orderResponse);
      setPaymentStatus('paying');

      /* 2. 0원 결제인 경우 바로 완료 처리 */
      if (orderResponse.totalAmount === 0) {
        setPaymentStatus('done');
        router.push(`/order/complete?orderId=${orderResponse.orderId}`);
        return;
      }

      /* 3. 토스페이먼츠 결제창 호출 (API 개별 연동 키 방식) */
      const customerKey = user?.id ?? TOSS_ANONYMOUS;
      const payment = await getTossPayment(customerKey);

      await requestTossPayment(payment, selectedMethod, {
        amount: { currency: 'KRW', value: orderResponse.totalAmount },
        orderId: orderResponse.orderId,
        orderName: orderResponse.orderName,
        customerEmail: orderResponse.customerEmail,
        customerName: orderResponse.customerName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (err) {
      setPaymentStatus('failed');
      const message =
        err instanceof Error ? err.message : (errors.paymentFailed ?? '결제에 실패했습니다.');
      setErrorMessage(message);
      setError({ code: 'PAYMENT_ERROR', message });
      resetTossPayment();
    } finally {
      setIsProcessing(false);
    }
  }, [
    course, agreed, isProcessing, couponApplied, coupon, user,
    selectedMethod, errors, setPendingOrder, setPaymentStatus, setError, router,
  ]);

  /* ── 강의 없음 ── */
  if (!course) {
    return (
      <section className="checkout-container">
        <h1 className="checkout-container__title">
          {title}
        </h1>
        <p className="checkout-container__empty">강의 정보를 찾을 수 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="checkout-container">
      <h1 className="checkout-container__title">
        {title}
      </h1>

      <div className="checkout-container__layout">
        {/* ── 왼쪽: 주문 정보 ── */}
        <div className="checkout-container__main">

          {/* 주문 강의 정보 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">
              {sections.orderInfo ?? '주문 강의'}
            </h2>
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
                  <span className="checkout-container__course-price-final">
                    {formatPrice(coursePrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 쿠폰 */}
          <CouponSelect
            coupon={coupon}
            applied={couponApplied}
            onApply={setCouponApplied}
            onToggleCode={() => setCouponOpen(!couponOpen)}
          />

          {/* 상품권 · 포인트 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">
              {sections.voucher ?? '상품권 · 포인트'}
              <span className="checkout-container__section-note">
                *{sections.voucherNotice ?? '상품권과 포인트 중 하나만 적용 가능합니다.'}
              </span>
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
                <span className="checkout-container__radio-text">
                  {sections.voucherLabel ?? '상품권'}
                </span>
                <span className="checkout-container__available">
                  {sections.availablePrefix ?? '사용 가능'} 0
                </span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                  disabled={voucherType !== 'voucher'}
                  aria-label={sections.voucherLabel ?? '상품권 금액 입력'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'voucher'}
                >
                  {sections.useAll ?? '전액 사용'}
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
                <span className="checkout-container__radio-text">
                  {sections.pointLabel ?? '포인트'}
                </span>
                <span className="checkout-container__available">
                  {sections.availablePrefix ?? '사용 가능'} 0
                </span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  disabled={voucherType !== 'point'}
                  aria-label={sections.pointLabel ?? '포인트 금액 입력'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'point'}
                >
                  {sections.useAll ?? '전액 사용'}
                </button>
              </div>
            </div>

            <p className="checkout-container__point-note">
              *실 결제 금액의 50%까지 사용 가능
            </p>
          </div>

          {/* 결제 수단 */}
          <PaymentMethodSelect
            selected={selectedMethod}
            onSelect={setSelectedMethod}
          />
        </div>

        {/* ── 오른쪽: 결제 요약 ── */}
        <aside className="checkout-container__summary">
          <div className="checkout-container__summary-sticky">
            <PriceSummary
              coursePrice={coursePrice}
              couponDiscount={couponDiscount}
              pointUsed={0}
              voucherUsed={0}
            />

            {errorMessage && (
              <p className="checkout-container__error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              className="checkout-container__pay-btn"
              disabled={!agreed || isProcessing}
              onClick={handlePayment}
              aria-label={summary.submitAriaLabel ?? '최종 결제 금액으로 결제 진행'}
            >
              {isProcessing
                ? '처리 중...'
                : `${formatPrice(finalPrice)} ${summary.submitLabel ?? '결제하기'}`}
            </button>

            <label className="checkout-container__agree-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="checkout-container__agree-checkbox"
                aria-label={agreement.ariaLabel ?? '구매 조건 및 환불 규정 동의'}
              />
              <span className="checkout-container__agree-text">
                {agreement.text ?? '강의 및 결제 정보를 확인하였으며, 구매 조건 및 환불 규정에 동의합니다.'}
              </span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}
