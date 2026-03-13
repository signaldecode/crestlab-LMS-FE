/**
 * PlayerLayout — vidstack 플레이어 내부 커스텀 UI 레이아웃
 *
 * - <MediaPlayer> 하위에 배치하여 vidstack Context를 공유한다
 * - Step 3에서 VideoControls를 vidstack 훅 기반으로 리와이어할 때 이 레이아웃에 통합한다
 * - 현재는 PlayerOverlay + children(컨트롤 슬롯)을 조립하는 래퍼
 */

'use client';

import { type JSX, type ReactNode } from 'react';
import type { PlayerError } from '@/types';
import PlayerOverlay from './PlayerOverlay';

interface PlayerLayoutProps {
  /** 외부 에러 (스트리밍 세션 에러 등) */
  externalError?: PlayerError | null;
  /** 에러 재시도 콜백 */
  onRetry?: () => void;
  /** 하단 컨트롤 슬롯 (VideoControls가 들어올 자리) */
  children?: ReactNode;
}

export default function PlayerLayout({
  externalError,
  onRetry,
  children,
}: PlayerLayoutProps): JSX.Element {
  return (
    <>
      <PlayerOverlay externalError={externalError} onRetry={onRetry} />
      {children}
    </>
  );
}
