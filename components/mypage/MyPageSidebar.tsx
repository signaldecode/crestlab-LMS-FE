/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - 탭 토글(내 강의실/프로필) + 프로필 카드 + 탭별 메뉴
 * - 탭은 Link 기반 라우팅: 내 강의실 → /mypage, 프로필 → /mypage/[userId]
 * - useAuthStore에서 현재 로그인 유저 ID를 읽어 프로필 링크를 구성한다
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import useAuthStore from '@/stores/useAuthStore';

type MyPageTab = 'classroom' | 'profile';

interface MyPageSidebarProps {
  activeTab: MyPageTab;
  userId?: string;
}

const classroomMenu = [
  { section: '강의 관련', items: ['관심 클래스', '강의 상담', '수료증', '후기 관리', '구매 내역'] },
  { section: '고객 지원', items: ['1:1 문의', '자주 묻는 질문'] },
  { section: '계정 관리', items: ['회원정보관리', '로그아웃'] },
];

const profileMenu = [
  // { section: '중개 서비스', items: ['부동산중개 BETA'] },
  { section: '고객 지원', items: ['1:1 문의', '자주 묻는 질문'] },
  { section: '계정 관리', items: ['회원정보관리', '로그아웃'] },
];

export default function MyPageSidebar({ activeTab, userId }: MyPageSidebarProps): JSX.Element {
  const menu = activeTab === 'classroom' ? classroomMenu : profileMenu;
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = userId || authUser?.id || 'me';
  const profileHref = `/mypage/${currentUserId}`;

  return (
    <aside className="mypage-sidebar">
      <div className="mypage-sidebar__sticky">
        {/* 탭 토글 (Link 기반 라우팅) */}
        <div className="mypage-sidebar__tabs">
          <Link
            href="/mypage"
            className={`mypage-sidebar__tab${activeTab === 'classroom' ? ' mypage-sidebar__tab--active' : ''}`}
          >
            내 강의실
          </Link>
          <Link
            href={profileHref}
            className={`mypage-sidebar__tab${activeTab === 'profile' ? ' mypage-sidebar__tab--active' : ''}`}
          >
            프로필
          </Link>
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
