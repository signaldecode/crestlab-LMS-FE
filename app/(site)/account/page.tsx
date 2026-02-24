/**
 * /account → /mypage 리다이렉트
 * - 기존 /account 경로 호환을 위해 /mypage로 영구 리다이렉트한다
 */

import { redirect } from 'next/navigation';

export default function AccountPage(): never {
  redirect('/mypage');
}
