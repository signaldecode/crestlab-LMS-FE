/**
 * 전역 Provider (선택)
 * - Zustand hydration, 테마, 전역 이벤트/토스트 등의 Provider를 묶는 파일
 * - 필요에 따라 추가 Provider를 이곳에서 래핑한다
 */

'use client';

import type { JSX, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  return <>{children}</>;
}
