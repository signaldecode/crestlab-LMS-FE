/**
 * 주문/결제 Zustand 스토어 (useOrderStore.ts)
 * - 결제 플로우의 진행 상태를 전역으로 관리한다
 * - 주문 생성 → 결제 요청 → 승인 → 완료/실패 흐름을 추적한다
 */

import { create } from 'zustand';
import type {
  CreateOrderResponse,
  ConfirmPaymentResponse,
  PaymentFailure,
} from '@/types';

type PaymentStatus = 'idle' | 'creating' | 'paying' | 'confirming' | 'done' | 'failed';

interface OrderState {
  /** 현재 진행 중인 주문 (백엔드 응답) */
  pendingOrder: CreateOrderResponse | null;
  /** 결제 완료된 주문 (승인 응답) */
  completedOrder: ConfirmPaymentResponse | null;
  /** 결제 진행 상태 */
  paymentStatus: PaymentStatus;
  /** 에러 정보 */
  error: PaymentFailure | null;

  setPendingOrder: (order: CreateOrderResponse | null) => void;
  setCompletedOrder: (order: ConfirmPaymentResponse | null) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setError: (error: PaymentFailure | null) => void;
  reset: () => void;
}

const useOrderStore = create<OrderState>((set) => ({
  pendingOrder: null,
  completedOrder: null,
  paymentStatus: 'idle',
  error: null,

  setPendingOrder: (order) => set({ pendingOrder: order }),
  setCompletedOrder: (order) => set({ completedOrder: order }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      pendingOrder: null,
      completedOrder: null,
      paymentStatus: 'idle',
      error: null,
    }),
}));

export default useOrderStore;
