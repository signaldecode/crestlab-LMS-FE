/**
 * Legacy redirect: /mypage/tickets/[id] → /support/tickets/[id]
 */

import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MyPageTicketDetailRedirect({ params }: PageProps): Promise<never> {
  const { id } = await params;
  redirect(`/support/tickets/${id}`);
}
