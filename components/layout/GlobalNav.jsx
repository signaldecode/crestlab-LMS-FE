/**
 * 글로벌 내비게이션 (GlobalNav)
 * - 헤더 내부의 주요 메뉴 링크를 렌더링한다
 * - 메뉴 항목(label, href, ariaLabel)은 data에서 가져온다
 * - 시맨틱 <nav> 태그를 사용한다
 */

export default function GlobalNav() {
  return (
    <nav className="global-nav" aria-label="주요 메뉴">
      {/* data 기반 내비게이션 링크 목록이 렌더링된다 */}
    </nav>
  );
}
