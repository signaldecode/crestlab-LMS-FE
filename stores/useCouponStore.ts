/**
 * 쿠폰 Zustand 스토어 (useCouponStore.ts)
 * - 강의 상세에서 받은 쿠폰을 저장하고, 결제/마이페이지에서 표시한다
 * - localStorage로 새로고침 후에도 유지한다
 * - SSR hydration 불일치를 방지하기 위해 빈 상태로 시작 후 클라이언트에서 복원한다
 */

import { create } from 'zustand';
import { useEffect } from 'react';

export interface CouponItem {
  id: string;
  courseSlug: string;
  discountRate: number;
  amount: number;
  description: string;
  validFrom: string;
  validTo: string;
}

interface CouponState {
  coupons: CouponItem[];
  _hydrated: boolean;
  _hydrate: () => void;
  claimCoupon: (coupon: Omit<CouponItem, 'id'>) => void;
  hasCoupon: (courseSlug: string) => boolean;
  getCoupon: (courseSlug: string) => CouponItem | null;
}

function migrateCoupon(c: Record<string, unknown>): CouponItem {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  return {
    id: (c.id as string) || `coupon-${Date.now()}-${Math.random()}`,
    courseSlug: (c.courseSlug as string) || '',
    discountRate: (c.discountRate as number) || 0,
    amount: (c.amount as number) || 0,
    description: (c.description as string) || '',
    validFrom: (c.validFrom as string) || today,
    validTo: (c.validTo as string) || today,
  };
}

function loadCoupons(): CouponItem[] {
  try {
    const raw = localStorage.getItem('claimedCoupons');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map(migrateCoupon);
  } catch {
    return [];
  }
}

function saveCoupons(coupons: CouponItem[]): void {
  try {
    localStorage.setItem('claimedCoupons', JSON.stringify(coupons));
  } catch { /* noop */ }
}

const useCouponStoreBase = create<CouponState>((set, get) => ({
  coupons: [],
  _hydrated: false,

  _hydrate: () => {
    if (!get()._hydrated) {
      set({ coupons: loadCoupons(), _hydrated: true });
    }
  },

  claimCoupon: (coupon) => {
    const current = get().coupons;
    if (current.some((c) => c.courseSlug === coupon.courseSlug)) return;
    const next = [...current, { ...coupon, id: `coupon-${Date.now()}` }];
    saveCoupons(next);
    set({ coupons: next });
  },

  hasCoupon: (courseSlug) => get().coupons.some((c) => c.courseSlug === courseSlug),

  getCoupon: (courseSlug) => get().coupons.find((c) => c.courseSlug === courseSlug) ?? null,
}));

/** 클라이언트 hydration을 자동으로 수행하는 래퍼 훅 */
export default function useCouponStore<T>(selector: (s: CouponState) => T): T {
  const hydrate = useCouponStoreBase((s) => s._hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return useCouponStoreBase(selector);
}

/** 스토어 직접 접근 (컴포넌트 외부에서 사용) */
export { useCouponStoreBase };
