/**
 * 토스트 알림 Zustand 스토어 (useToastStore)
 * - 전역에서 `show(message, type)` 으로 토스트를 띄운다
 * - 일정 시간 후 자동으로 사라진다 (기본 2500ms)
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  /** 같은 키라도 재트리거할 수 있도록 카운터로 식별 */
  token: number;
  show: (message: string, type?: ToastType, durationMs?: number) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  token: 0,

  show: (message, type = 'info', durationMs = 2500) => {
    if (timer) clearTimeout(timer);
    set((s) => ({ message, type, visible: true, token: s.token + 1 }));
    timer = setTimeout(() => {
      set({ visible: false });
      timer = null;
    }, durationMs);
  },

  hide: () => {
    if (timer) { clearTimeout(timer); timer = null; }
    set({ visible: false });
  },
}));

export default useToastStore;
