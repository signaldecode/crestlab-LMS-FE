/**
 * Legacy redirect: /mypage/tickets → /support/tickets
 * - 1:1 문의는 /support/tickets 단독 페이지로 이전됨 (2026-04)
 */

import { redirect } from 'next/navigation';

export default function MyPageTicketsRedirect(): never {
  redirect('/support/tickets');
}
