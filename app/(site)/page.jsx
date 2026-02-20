/**
 * (site) 루트 페이지 — "/" 접근 시 /home으로 리다이렉트
 * - app/(site)/home/page.jsx가 실제 홈 페이지이므로,
 *   루트 접근 시 /home으로 이동시킨다
 */

import { redirect } from 'next/navigation';

export default function SiteRootPage() {
  redirect('/home');
}
