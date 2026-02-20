/**
 * 결제 완료 페이지
 * - 결제 성공 후 주문 번호, 금액, 수강 시작 CTA를 보여준다
 * - OrderCompleteContainer로 조립한다
 */

import OrderCompleteContainer from '@/components/containers/OrderCompleteContainer';

export default function OrderCompletePage() {
  return (
    <section className="order-complete-page">
      <OrderCompleteContainer />
    </section>
  );
}
