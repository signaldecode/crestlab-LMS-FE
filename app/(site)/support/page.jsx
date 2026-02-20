/**
 * 고객센터 페이지
 * - 자주 묻는 질문(FAQ), 공지사항, 1:1 문의 링크를 제공한다
 * - SupportContainer로 조립한다
 */

import SupportContainer from '@/components/containers/SupportContainer';

export default function SupportPage() {
  return (
    <section className="support-page">
      <SupportContainer />
    </section>
  );
}
