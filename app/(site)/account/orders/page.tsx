import { redirect } from 'next/navigation';

export default function AccountOrdersPage(): never {
  redirect('/mypage/orders');
}
