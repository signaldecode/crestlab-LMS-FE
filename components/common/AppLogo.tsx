/**
 * 앱 로고 (AppLogo)
 * - 사이트 로고 이미지를 렌더링한다
 * - 홈 링크를 포함하며, alt 텍스트는 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteData } from '@/lib/data';

export default function AppLogo(): JSX.Element {
  const site = getSiteData();

  return (
    <Link href="/" className="app-logo" aria-label={site.logo.alt}>
      <Image
        src={site.logo.src}
        alt={site.logo.alt}
        className="app-logo__image"
        width={160}
        height={60}
        priority
      />
    </Link>
  );
}
