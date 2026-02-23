/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - 탭 토글(내 강의실/프로필) + 프로필 카드 + 탭별 메뉴
 */

import type { JSX } from 'react';

type MyPageTab = 'classroom' | 'profile';

interface MyPageSidebarProps {
  activeTab: MyPageTab;
  onTabChange: (tab: MyPageTab) => void;
}

const classroomMenu = [
  { section: '강의 관련', items: ['관심 클래스', '강의 상담', '아너스 혜택', '수료증', '후기 관리', '구매 내역'] },
];

const profileMenu = [
  { section: '중개 서비스', items: ['부동산중개 BETA'] },
  { section: '고객 지원', items: ['1:1 문의', '자주 묻는 질문'] },
  { section: '계정 관리', items: ['회원정보관리', '글라이드'] },
];

export default function MyPageSidebar({ activeTab, onTabChange }: MyPageSidebarProps): JSX.Element {
  const menu = activeTab === 'classroom' ? classroomMenu : profileMenu;

  return (
    <aside className="mypage-sidebar">
      <div className="mypage-sidebar__sticky">
        {/* 탭 토글 */}
        <div className="mypage-sidebar__tabs">
          <button
            type="button"
            className={`mypage-sidebar__tab${activeTab === 'classroom' ? ' mypage-sidebar__tab--active' : ''}`}
            onClick={() => onTabChange('classroom')}
          >
            내 강의실
          </button>
          <button
            type="button"
            className={`mypage-sidebar__tab${activeTab === 'profile' ? ' mypage-sidebar__tab--active' : ''}`}
            onClick={() => onTabChange('profile')}
          >
            프로필
          </button>
        </div>

        {/* 프로필 카드 */}
        <div className="mypage-sidebar__profile">
          <div className="mypage-sidebar__avatar mypage-sidebar__skeleton-circle" />
          <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--name" />

          {activeTab === 'classroom' ? (
            <div className="mypage-sidebar__info-list">
              <div className="mypage-sidebar__info-row">
                <span>학습등급</span>
                <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--value" />
              </div>
              <div className="mypage-sidebar__info-row">
                <span>내 쿠폰</span>
                <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--value" />
              </div>
              <div className="mypage-sidebar__info-row">
                <span>상품권</span>
                <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--value" />
              </div>
              <div className="mypage-sidebar__info-row">
                <span>포인트</span>
                <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--value" />
              </div>
            </div>
          ) : (
            <>
              <div className="mypage-sidebar__level">
                <div className="mypage-sidebar__skeleton-line mypage-sidebar__skeleton-line--level" />
                <div className="mypage-sidebar__level-bar">
                  <div className="mypage-sidebar__level-fill" />
                </div>
              </div>
              <div className="mypage-sidebar__stats">
                <div className="mypage-sidebar__stat">
                  <span className="mypage-sidebar__stat-num">0</span>
                  <span className="mypage-sidebar__stat-label">팔로워</span>
                </div>
                <div className="mypage-sidebar__stat">
                  <span className="mypage-sidebar__stat-num">0</span>
                  <span className="mypage-sidebar__stat-label">작성한 글</span>
                </div>
                <div className="mypage-sidebar__stat">
                  <span className="mypage-sidebar__stat-num">0</span>
                  <span className="mypage-sidebar__stat-label">댓글</span>
                </div>
                <div className="mypage-sidebar__stat">
                  <span className="mypage-sidebar__stat-num">0</span>
                  <span className="mypage-sidebar__stat-label">배지</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 메뉴 목록 */}
        <nav className="mypage-sidebar__nav">
          {menu.map((group) => (
            <div key={group.section} className="mypage-sidebar__menu-section">
              <span className="mypage-sidebar__menu-heading">{group.section}</span>
              <ul className="mypage-sidebar__menu-list">
                {group.items.map((item) => (
                  <li key={item} className="mypage-sidebar__menu-item">
                    <a href="#" className="mypage-sidebar__menu-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
