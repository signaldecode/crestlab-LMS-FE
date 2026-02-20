/**
 * 본문 바로가기 (SkipToContent)
 * - 키보드/스크린리더 사용자를 위한 "본문 바로가기" 링크
 * - 웹 접근성(A11y) 필수 요소로, 탭 시 화면에 나타난다
 * - #main-content로 이동한다
 */

import type { JSX } from 'react';

export default function SkipToContent(): JSX.Element {
  return (
    <a href="#main-content" className="skip-to-content">
      본문 바로가기
    </a>
  );
}
