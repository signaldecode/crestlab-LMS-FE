/**
 * useCart — 장바구니 + 쿠폰 + 결제 계산 통합 Hook
 *
 * useCartStore, useCouponStore, lib/payments.ts를 하나로 묶어
 * 컴포넌트에서 한 줄 호출로 장바구니/결제 기능을 모두 사용할 수 있게 한다.
 */

'use client';

import { useMemo } from 'react';
import useCartStore from '@/stores/useCartStore';
import useCouponStore from '@/stores/useCouponStore';
import { calcSubtotal, calcDiscount, calcTotal, formatPrice } from '@/lib/payments';
import type { CartItem, Coupon } from '@/types';

export default function useCart() {
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const setCouponCode = useCartStore((s) => s.setCouponCode);

  const coupons = useCouponStore((s) => s.coupons);
  const claimCoupon = useCouponStore((s) => s.claimCoupon);
  const hasCoupon = useCouponStore((s) => s.hasCoupon);
  const getCoupon = useCouponStore((s) => s.getCoupon);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);

  /** 현재 적용 중인 쿠폰 객체 (couponCode 기반 매칭) */
  const activeCoupon: Coupon | null = useMemo(() => {
    if (!couponCode) return null;
    const found = coupons.find((c) => c.id === couponCode);
    if (!found) return null;
    return {
      type: 'percent' as const,
      value: found.discountRate,
      code: found.id,
    };
  }, [couponCode, coupons]);

  const discount = useMemo(() => calcDiscount(subtotal, activeCoupon), [subtotal, activeCoupon]);
  const total = useMemo(() => calcTotal(items, activeCoupon), [items, activeCoupon]);

  return {
    /** 장바구니 아이템 목록 */
    items,
    /** 장바구니 아이템 수 */
    itemCount: items.length,
    /** 소계 */
    subtotal,
    /** 할인 금액 */
    discount,
    /** 최종 결제 금액 */
    total,
    /** 적용 중인 쿠폰 코드 */
    couponCode,
    /** 적용 중인 쿠폰 객체 */
    activeCoupon,

    /** 장바구니 액션 */
    addItem: (course: CartItem) => addItem(course),
    removeItem: (slug: string) => removeItem(slug),
    clearCart,
    setCouponCode,

    /** 쿠폰 액션 */
    claimedCoupons: coupons,
    claimCoupon,
    hasCoupon: (courseSlug: string) => hasCoupon(courseSlug),
    getCoupon: (courseSlug: string) => getCoupon(courseSlug),

    /** 가격 포맷팅 */
    formatPrice,
  };
}
