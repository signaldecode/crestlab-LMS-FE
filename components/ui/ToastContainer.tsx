/**
 * ToastContainer — 전역 토스트 렌더러
 * - 루트 Providers 아래에 한 번만 마운트된다
 * - `useToastStore.show(...)` 호출로 트리거
 */

'use client';

import type { JSX } from 'react';
import useToastStore from '@/stores/useToastStore';
import Toast from '@/components/ui/Toast';

export default function ToastContainer(): JSX.Element {
  const message = useToastStore((s) => s.message);
  const type = useToastStore((s) => s.type);
  const visible = useToastStore((s) => s.visible);

  return <Toast message={message} type={type} isVisible={visible} />;
}
