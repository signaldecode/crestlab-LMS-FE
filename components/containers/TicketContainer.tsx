/**
 * 1:1 문의 컨테이너 (TicketContainer)
 * - 1:1 문의 작성/목록 페이지의 조립 레이어
 * - mode='create'일 때 TicketForm을 렌더링한다
 * - mode='list'일 때 문의 목록을 렌더링한다
 */

import type { JSX } from 'react';
import TicketForm from '@/components/support/TicketForm';

interface TicketContainerProps {
  mode?: 'list' | 'create';
}

export default function TicketContainer({ mode = 'list' }: TicketContainerProps): JSX.Element {
  return (
    <section className="ticket-container">
      {mode === 'create' && <TicketForm />}
      {mode === 'list' && (
        <div>{/* 문의 목록 — 추후 구현 */}</div>
      )}
    </section>
  );
}
