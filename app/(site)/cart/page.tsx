/**
 * 장바구니 페이지
 * - 담은 강의 목록, 쿠폰/포인트 적용, 총 금액 확인 후 결제로 이동한다
 * - CartContainer로 조립한다
 */

import CartContainer from '@/components/containers/CartContainer';

export default function CartPage() {
  return (
    <section className="cart-page">
      <CartContainer />
    </section>
  );
}
