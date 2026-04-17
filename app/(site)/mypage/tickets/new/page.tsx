/**
 * Legacy redirect: /mypage/tickets/new → /support/tickets/new
 */

import { redirect } from 'next/navigation';

export default function MyPageTicketNewRedirect(): never {
  redirect('/support/tickets/new');
}
