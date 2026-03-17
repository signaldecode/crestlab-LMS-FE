/**
 * 결제 완료 페이지
 * - 결제 성공 후 주문 번호, 금액, 수강 시작 CTA를 보여준다
 * - searchParams의 orderId를 OrderCompleteContainer에 전달한다
 */

import OrderCompleteContainer from '@/components/containers/OrderCompleteContainer';

interface OrderCompletePageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderCompletePage({ searchParams }: OrderCompletePageProps) {
  const params = await searchParams;

  return (
    <section className="order-complete-page">
      <OrderCompleteContainer orderId={params.orderId} />
    </section>
  );
}
