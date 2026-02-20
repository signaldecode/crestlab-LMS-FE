/**
 * 장바구니 Zustand 스토어 (useCartStore.js)
 * - 장바구니에 담긴 강의 목록, 수량, 쿠폰 코드 등을 전역 관리한다
 * - 추가/삭제/전체삭제/쿠폰 적용 액션을 제공한다
 */

import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  couponCode: '',

  addItem: (course) => {
    const exists = get().items.find((item) => item.slug === course.slug);
    if (!exists) {
      set((state) => ({ items: [...state.items, course] }));
    }
  },
  removeItem: (slug) => {
    set((state) => ({ items: state.items.filter((item) => item.slug !== slug) }));
  },
  clearCart: () => set({ items: [], couponCode: '' }),
  setCouponCode: (couponCode) => set({ couponCode }),
}));

export default useCartStore;
