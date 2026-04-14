/**
 * 결제 성공 리다이렉트 페이지
 * - 토스페이먼츠에서 결제 완료 후 successUrl로 리다이렉트된다
 * - searchParams에서 paymentKey, orderId, amount를 받아 백엔드에 승인 요청한다
 * - 승인 성공 시 /order/complete로 이동, 실패 시 에러 표시
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPayment } from '@/lib/userApi';
import { getPageData } from '@/lib/data';
import useOrderStore from '@/stores/useOrderStore';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCompletedOrder, setPaymentStatus, setError } = useOrderStore();

  const [status, setStatus] = useState<'confirming' | 'error'>('confirming');
  const [errorMessage, setErrorMessage] = useState('');

  const uiData = getPageData('checkout') as Record<string, unknown> | null;
  const errors = (uiData?.errors as Record<string, string>) ?? {};

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amountStr = searchParams.get('amount');

    if (!paymentKey || !orderId || !amountStr) {
      setStatus('error');
      setErrorMessage(errors.paymentFailed ?? '결제 정보가 올바르지 않습니다.');
      return;
    }

    const amount = Number(amountStr);
    if (Number.isNaN(amount)) {
      setStatus('error');
      setErrorMessage(errors.amountMismatch ?? '결제 금액이 올바르지 않습니다.');
      return;
    }

    setPaymentStatus('confirming');

    confirmPayment({ paymentKey, orderId, amount })
      .then((result) => {
        // 레거시 스토어(ConfirmPaymentResponse)와 필드가 다르므로 필요한 값만 어댑트
        setCompletedOrder({
          orderId: String(result.orderId),
          status: (result.status === 'DONE' ? 'DONE' : 'ABORTED'),
          totalAmount: result.amount,
          method: result.method,
          approvedAt: result.approvedAt,
          courseAccess: [],
        });
        setPaymentStatus('done');
        router.replace(`/order/complete?orderId=${result.orderId}`);
      })
      .catch((err) => {
        setStatus('error');
        const message = err instanceof Error
          ? err.message
          : (errors.paymentFailed ?? '결제 승인에 실패했습니다.');
        setErrorMessage(message);
        setPaymentStatus('failed');
        setError({ code: 'CONFIRM_FAILED', message });
      });
  }, [searchParams, router, setCompletedOrder, setPaymentStatus, setError, errors]);

  if (status === 'error') {
    return (
      <section className="checkout-result">
        <div className="checkout-result__card">
          <div className="checkout-result__icon checkout-result__icon--error" aria-hidden="true">✕</div>
          <h1 className="checkout-result__title">결제 승인 실패</h1>
          <p className="checkout-result__message">{errorMessage}</p>
          <div className="checkout-result__actions">
            <button
              type="button"
              className="checkout-result__btn checkout-result__btn--primary"
              onClick={() => router.back()}
            >
              다시 시도하기
            </button>
            <button
              type="button"
              className="checkout-result__btn checkout-result__btn--secondary"
              onClick={() => router.push('/cart')}
            >
              장바구니로 돌아가기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-result">
      <div className="checkout-result__card">
        <div className="checkout-result__spinner" aria-hidden="true" />
        <h1 className="checkout-result__title">결제를 처리하고 있습니다...</h1>
        <p className="checkout-result__message">잠시만 기다려주세요. 창을 닫지 마세요.</p>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <section className="checkout-result">
        <div className="checkout-result__card">
          <div className="checkout-result__spinner" aria-hidden="true" />
          <h1 className="checkout-result__title">결제를 처리하고 있습니다...</h1>
        </div>
      </section>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
