/**
 * 커뮤니티 왼쪽 사이드바 (CommunitySidebar)
 * - 프로필 영역 + 네비게이션 메뉴 스켈레톤
 */

import type { JSX } from 'react';
import MyPostsButton from '@/components/community/MyPostsButton';

const navSections = [
  {
    icon: '🏠',
    title: '커뮤니티홈',
    href: '/community',
    items: [],
  },
  {
    icon: '📢',
    title: '공지사항',
    items: ['강의일정', '알림&이벤트', '신규멤버필독', '어제의게시글'],
  },
  {
    icon: '📋',
    title: '전문가인사이트',
    items: ['전문가칼럼', '전문가피드', '10억달성기'],
  },
  {
    icon: '💬',
    title: '투자후기',
    items: [
      '오늘의응원',
      '실전투자경험',
      '내집마련성공기',
      '1억달성기',
      '투자공부방',
      '부업수익인증',
    ],
  },
];

export default function CommunitySidebar(): JSX.Element {
  return (
    <aside className="community-sidebar">
      <div className="community-sidebar__sticky">
      {/* 프로필 영역 */}
      <div className="community-sidebar__profile">
        <div className="community-sidebar__avatar community-sidebar__skeleton-circle" />
        <span className="community-sidebar__login-label">로그인</span>
        <MyPostsButton />
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="community-sidebar__nav">
        {navSections.map((section) => (
          <div key={section.title} className="community-sidebar__section">
            <div
              className={`community-sidebar__section-title${
                section.title === '커뮤니티홈' ? ' community-sidebar__section-title--active' : ''
              }`}
            >
              <span className="community-sidebar__section-icon">{section.icon}</span>
              {section.title}
            </div>
            {section.items.length > 0 && (
              <ul className="community-sidebar__list">
                {section.items.map((item) => (
                  <li key={item} className="community-sidebar__list-item">
                    <a href="#" className="community-sidebar__link">{item}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      </div>
    </aside>
  );
}
