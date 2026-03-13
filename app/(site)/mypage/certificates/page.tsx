/**
 * 수료증 페이지 (/mypage/certificates)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import CertificateContent from '@/components/mypage/CertificateContent';

export default function CertificatesPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <CertificateContent />
        </div>
      </div>
    </section>
  );
}