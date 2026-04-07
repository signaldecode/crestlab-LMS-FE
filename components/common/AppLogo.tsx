/**
 * 앱 로고 (AppLogo)
 * - 사이트 로고를 텍스트(워드마크)로 렌더링한다
 * - 홈 링크를 포함하며, 라벨/aria 텍스트는 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getSiteData } from '@/lib/data';

export default function AppLogo(): JSX.Element {
  const site = getSiteData();

  return (
    <Link href="/" className="app-logo" aria-label={site.logo.alt}>
      <span className="app-logo__text">{site.logo.text}</span>
    </Link>
  );
}
