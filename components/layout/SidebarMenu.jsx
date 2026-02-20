/**
 * 사이드바 메뉴 (SidebarMenu)
 * - 모바일 또는 대시보드에서 사용되는 슬라이드 사이드바 메뉴
 * - 열기/닫기 상태를 관리하며, 키보드 접근성을 지원한다
 */

export default function SidebarMenu({ isOpen, onClose }) {
  return (
    <aside className={`sidebar-menu${isOpen ? ' sidebar-menu--open' : ''}`} aria-hidden={!isOpen}>
      {/* data 기반 사이드바 메뉴 항목이 렌더링된다 */}
    </aside>
  );
}
