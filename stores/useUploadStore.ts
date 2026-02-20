/**
 * 업로드 Zustand 스토어 (useUploadStore.ts)
 * - 영상 업로드 상태(idle/requesting/uploading/confirming/success/error)를 관리한다
 * - 진행률, 에러 키, 취소 함수를 저장한다
 */

import { create } from 'zustand';
import type { UploadStatus } from '@/types';

interface UploadState {
  status: UploadStatus;
  progress: number;
  errorKey: string | null;
  abortFn: (() => void) | null;
  setRequesting: () => void;
  setUploading: (abortFn: () => void) => void;
  setProgress: (progress: number) => void;
  setConfirming: () => void;
  setSuccess: () => void;
  setError: (errorKey: string) => void;
  cancelUpload: () => void;
  resetUpload: () => void;
}

const useUploadStore = create<UploadState>((set, get) => ({
  status: 'idle',
  progress: 0,
  errorKey: null,
  abortFn: null,

  setRequesting: () => set({ status: 'requesting', progress: 0, errorKey: null }),
  setUploading: (abortFn) => set({ status: 'uploading', abortFn }),
  setProgress: (progress) => set({ progress }),
  setConfirming: () => set({ status: 'confirming', abortFn: null }),
  setSuccess: () => set({ status: 'success', progress: 100, abortFn: null }),
  setError: (errorKey) => set({ status: 'error', errorKey, abortFn: null }),

  cancelUpload: () => {
    const { abortFn } = get();
    if (abortFn) abortFn();
    set({ status: 'idle', progress: 0, errorKey: null, abortFn: null });
  },

  resetUpload: () =>
    set({ status: 'idle', progress: 0, errorKey: null, abortFn: null }),
}));

export default useUploadStore;
