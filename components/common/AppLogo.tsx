/**
 * 앱 로고 (AppLogo)
 * - 사이트 로고 이미지 또는 텍스트를 렌더링한다
 * - 홈 링크를 포함하며, alt 텍스트는 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';

export default function AppLogo(): JSX.Element {
  return (
    <Link href="/" className="app-logo">
      {/* data 기반 로고 이미지/텍스트가 렌더링된다 */}
    </Link>
  );
}
