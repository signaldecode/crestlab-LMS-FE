/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 백엔드 /v1/payments/orders 로 주문 생성 → 토스 SDK 결제창 호출
 * - 결제 성공 시 /checkout/success 로 리다이렉트되어 승인 처리 수행
 */

'use client';

import { useCallback, useState, type JSX } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/payments';
import { createOrder, fetchUserCourseById, UserApiError } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import { getTossPayment, TOSS_ANONYMOUS } from '@/lib/toss';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import useAuth from '@/hooks/useAuth';

/**
 * 토스 SDK의 method 타입은 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE' 등
 * easy-pay(네이버/카카오/토스페이)는 provider 파라미터로 구분됨. MVP는 CARD/TRANSFER만 직접 지원.
 */
const PAYMENT_METHODS = [
  { key: 'card', label: '카드결제', icon: '/images/payment/icon-card.svg', tossMethod: 'CARD' as const },
  { key: 'cash', label: '계좌이체', icon: '/images/payment/icon-cash.svg', tossMethod: 'TRANSFER' as const },
] as const;

type PaymentKey = (typeof PAYMENT_METHODS)[number]['key'];

interface CheckoutContainerProps {
  courseId: number | null;
}

export default function CheckoutContainer({ courseId }: CheckoutContainerProps): JSX.Element {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentKey>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: detail, loading } = useAdminQuery(
    () => (courseId != null ? fetchUserCourseById(courseId) : Promise.resolve(null)),
    [courseId],
  );

  const info = detail?.courseInfo;
  const hasDiscount = info?.discountPrice != null && info.discountPrice < info.price;
  const coursePrice = info ? (hasDiscount ? (info.discountPrice as number) : info.price) : 0;
  const finalPrice = coursePrice;

  const handlePayment = useCallback(async () => {
    if (!info || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      // 1) 주문 생성 → orderNumber / finalAmount 확보
      const order = await createOrder({ courseId: info.id });

      // 2) 토스 SDK 결제창 호출
      const customerKey = user?.id ? String(user.id) : TOSS_ANONYMOUS;
      const payment = await getTossPayment(customerKey);

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const common = {
        amount: { currency: 'KRW' as const, value: order.finalAmount },
        orderId: order.orderNumber,
        orderName: order.courseName,
        customerEmail: user?.email,
        customerName: user?.name,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
      };

      if (selectedMethod === 'cash') {
        await payment.requestPayment({ ...common, method: 'TRANSFER', transfer: { cashReceipt: { type: '소득공제' } } });
      } else {
        await payment.requestPayment({ ...common, method: 'CARD', card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false } });
      }
      // 결제창이 열리면 이후 success/fail 페이지로 리다이렉트됨 → 여기 이후 코드는 실행 안 됨
    } catch (err) {
      const msg = err instanceof UserApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : '결제 요청에 실패했습니다.';
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  }, [info, isProcessing, selectedMethod, user]);

  if (!info) {
    return (
      <section className="checkout">
        <h1 className="checkout__title">주문결제</h1>
        <p className="checkout__empty">
          {loading ? '불러오는 중...' : '강의 정보를 찾을 수 없습니다.'}
        </p>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="checkout__layout">
        <div className="checkout__main">
          <h1 className="checkout__title">주문결제</h1>

          <div className="checkout__order-section">
            <div className="checkout__course-row">
              <div className="checkout__course-thumb">
                <Image
                  src={resolveThumb(info.thumbnailUrl)}
                  alt={info.title}
                  width={280}
                  height={160}
                  className="checkout__course-image"
                />
              </div>
              <div className="checkout__course-info">
                <div className="checkout__course-text">
                  <h2 className="checkout__course-name">{info.title}</h2>
                  <p className="checkout__course-desc">{info.description}</p>
                </div>
                <span className="checkout__course-price">{formatPrice(coursePrice)}</span>
              </div>
            </div>
          </div>

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

        <aside className="checkout__sidebar">
          <div className="checkout__sidebar-inner">
            <div className="checkout__price-section">
              <h3 className="checkout__price-title">결제금액</h3>
              <div className="checkout__price-rows">
                <div className="checkout__price-row">
                  <span className="checkout__price-label">총 클래스 결제 금액</span>
                  <span className="checkout__price-value">{formatPrice(coursePrice)}</span>
                </div>
              </div>
            </div>

            <div className="checkout__total-section">
              <div className="checkout__total-row">
                <span className="checkout__total-label">총 결제 금액</span>
                <span className="checkout__total-value">{formatPrice(finalPrice)}</span>
              </div>
              {errorMessage && (
                <p className="checkout__error" role="alert">{errorMessage}</p>
              )}
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
