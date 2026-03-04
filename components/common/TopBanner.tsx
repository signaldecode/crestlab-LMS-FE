/**
 * 상단 프로모션 배너 (TopBanner)
 * - 네비바 위에 꽉 차게 표시되는 이벤트/프로모션 배너
 * - 닫기 버튼으로 숨길 수 있다
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="top-banner">
      <Link href="/courses" className="top-banner__link">
        <Image
          src="/images/banners/banner-belt.jpg"
          alt="프로모션 배너"
          fill
          sizes="100vw"
          className="top-banner__image"
          priority
        />
      </Link>
      <button
        type="button"
        className="top-banner__close"
        onClick={() => setVisible(false)}
        aria-label="배너 닫기"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
