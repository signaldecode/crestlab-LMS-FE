/**
 * 결제 페이지
 * - 주문 정보 확인, 결제 수단 선택, 최종 결제를 처리한다
 * - URL searchParams의 slug로 강의를 조회하여 CheckoutContainer에 전달한다
 */

import CheckoutContainer from '@/components/containers/CheckoutContainer';
import { findCourseBySlug } from '@/lib/data';

interface CheckoutPageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const course = params.slug ? findCourseBySlug(params.slug) : null;

  return (
    <section className="checkout-page">
      <CheckoutContainer course={course} />
    </section>
  );
}
