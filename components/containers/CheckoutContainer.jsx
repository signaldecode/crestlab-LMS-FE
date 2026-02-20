/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 결제 페이지의 메인 조립 레이어
 * - 주문 정보 확인, 결제 수단 선택, 쿠폰/포인트 적용, 최종 결제 버튼을 구성한다
 * - lib/payments.js의 금액 계산 유틸을 활용한다
 */

export default function CheckoutContainer() {
  return (
    <section className="checkout-container">
      {/* 주문 요약 + 결제 수단 + 쿠폰 입력 + 결제 버튼이 렌더링된다 */}
    </section>
  );
}
