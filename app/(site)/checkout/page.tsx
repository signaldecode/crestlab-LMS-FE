/**
 * 결제 페이지
 * - 주문 정보 확인, 결제 수단 선택, 최종 결제를 처리한다
 * - CheckoutContainer로 조립한다
 */

import CheckoutContainer from '@/components/containers/CheckoutContainer';

export default function CheckoutPage() {
  return (
    <section className="checkout-page">
      <CheckoutContainer />
    </section>
  );
}
