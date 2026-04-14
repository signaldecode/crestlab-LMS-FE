/**
 * 결제 페이지
 * - `?courseId=` 로 강의 id 를 받고 클라이언트에서 API 로 조회
 */

import CheckoutContainer from '@/components/containers/CheckoutContainer';

interface CheckoutPageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { courseId } = await searchParams;
  const numericId = courseId ? Number(courseId) : NaN;

  return (
    <section className="checkout-page">
      <CheckoutContainer courseId={Number.isFinite(numericId) ? numericId : null} />
    </section>
  );
}
