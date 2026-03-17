/**
 * 결제 실패 리다이렉트 페이지
 * - 토스페이먼츠에서 결제 실패/취소 시 failUrl로 리다이렉트된다
 * - searchParams에서 code, message, orderId를 받아 에러 정보를 표시한다
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPageData } from '@/lib/data';

function CheckoutFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code') ?? '';
  const message = searchParams.get('message') ?? '알 수 없는 오류가 발생했습니다.';
  const orderId = searchParams.get('orderId');

  const pageData = getPageData('paymentFail') as Record<string, string> | null;
  const title = pageData?.title ?? '결제에 실패했습니다';
  const subtitle = pageData?.subtitle ?? '아래 사유를 확인하고 다시 시도해주세요.';
  const errorCodeLabel = pageData?.errorCodeLabel ?? '오류 코드';
  const retryLabel = pageData?.retryLabel ?? '다시 결제하기';
  const goCartLabel = pageData?.goCartLabel ?? '장바구니로 돌아가기';

  return (
    <section className="checkout-result">
      <div className="checkout-result__card">
        <div className="checkout-result__icon checkout-result__icon--error" aria-hidden="true">
          ✕
        </div>
        <h1 className="checkout-result__title">{title}</h1>
        <p className="checkout-result__message">{subtitle}</p>

        <div className="checkout-result__detail">
          {code && (
            <div className="checkout-result__detail-row">
              <span className="checkout-result__detail-label">{errorCodeLabel}</span>
              <span className="checkout-result__detail-value">{code}</span>
            </div>
          )}
          <div className="checkout-result__detail-row">
            <span className="checkout-result__detail-label">사유</span>
            <span className="checkout-result__detail-value">{message}</span>
          </div>
          {orderId && (
            <div className="checkout-result__detail-row">
              <span className="checkout-result__detail-label">주문번호</span>
              <span className="checkout-result__detail-value">{orderId}</span>
            </div>
          )}
        </div>

        <div className="checkout-result__actions">
          <button
            type="button"
            className="checkout-result__btn checkout-result__btn--primary"
            onClick={() => router.back()}
            aria-label={pageData?.retryAriaLabel ?? '결제 페이지로 돌아가서 다시 시도'}
          >
            {retryLabel}
          </button>
          <button
            type="button"
            className="checkout-result__btn checkout-result__btn--secondary"
            onClick={() => router.push('/cart')}
            aria-label={pageData?.goCartAriaLabel ?? '장바구니 페이지로 이동'}
          >
            {goCartLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={
      <section className="checkout-result">
        <div className="checkout-result__card">
          <div className="checkout-result__spinner" aria-hidden="true" />
        </div>
      </section>
    }>
      <CheckoutFailContent />
    </Suspense>
  );
}
