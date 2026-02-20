/**
 * 결제 유틸 (payments.js)
 * - 금액 계산, 쿠폰 할인, 가격 포맷팅 등 결제 관련 헬퍼 함수를 제공한다
 * - 컴포넌트에서 직접 계산 로직을 두지 않고 이 유틸을 활용한다
 */

/** 장바구니 총 금액 계산 */
export function calcSubtotal(items = []) {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

/** 쿠폰 할인 금액 계산 */
export function calcDiscount(subtotal, coupon) {
  if (!coupon) return 0;

  if (coupon.type === 'percent') {
    return Math.round(subtotal * (coupon.value / 100));
  }
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}

/** 최종 결제 금액 계산 */
export function calcTotal(items = [], coupon = null) {
  const subtotal = calcSubtotal(items);
  const discount = calcDiscount(subtotal, coupon);
  return Math.max(subtotal - discount, 0);
}

/** 금액을 한국 원화 형식으로 포맷팅 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}
