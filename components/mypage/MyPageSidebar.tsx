/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - 탭 토글(내 강의실/프로필) + 프로필 카드 + 탭별 메뉴
 * - 모든 메뉴 아이템은 Link 기반 라우팅으로 동작한다
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import useCouponStore from '@/stores/useCouponStore';

type MyPageTab = 'classroom' | 'profile';

interface MyPageSidebarProps {
  activeTab: MyPageTab;
  userId?: string;
}

/** 메뉴 아이템 → 라우트 매핑 */
const menuLinks: Record<string, string> = {
  '관심 클래스': '/mypage/wishlist',
  '내 쿠폰': '/mypage/coupons',
  '상품권': '/mypage/giftcards',
  '포인트': '/mypage/points',
  '강의 상담': '/mypage/consultations',
  '수료증': '/mypage/certificates',
  '후기 관리': '/mypage/reviews',
  '구매 내역': '/mypage/orders',
  '1:1 문의': '/support/tickets',
  '자주 묻는 질문': '/support',
  '회원정보관리': '/mypage/profile/edit',
};

const classroomMenu = [
  { section: '강의 관련', items: ['관심 클래스', '강의 상담', '수료증', '후기 관리', '구매 내역'] },
  { section: '고객 지원', items: ['1:1 문의', '자주 묻는 질문'] },
  { section: '계정 관리', items: ['회원정보관리', '로그아웃'] },
];

const profileMenu = [
  { section: '고객 지원', items: ['1:1 문의', '자주 묻는 질문'] },
  { section: '계정 관리', items: ['회원정보관리', '로그아웃'] },
];

export default function MyPageSidebar({ activeTab, userId }: MyPageSidebarProps): JSX.Element {
  const menu = activeTab === 'classroom' ? classroomMenu : profileMenu;
  const authUser = useAuthStore((s) => s.user);
  const currentUserId = userId || authUser?.id || 'me';
  const profileHref = `/mypage/${currentUserId}`;

  const pathname = usePathname();
  const couponCount = useCouponStore((s) => s.coupons.length);

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
          <div className="mypage-sidebar__avatar mypage-sidebar__avatar--default">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div className="mypage-sidebar__name-row">
            <span className="mypage-sidebar__username">
              {authUser?.nickname || authUser?.name || '회원'}
            </span>
            {activeTab === 'profile' && (
              <Link
                href="/mypage/profile/edit"
                className="mypage-sidebar__edit-btn"
                aria-label="프로필 수정"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 13l1.2-3.2L12 2a1.2 1.2 0 011.6 0l.4.4a1.2 1.2 0 010 1.6L6.2 11.8 3 13z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>

          {activeTab === 'classroom' ? (
            <div className="mypage-sidebar__info-list">
              <div className="mypage-sidebar__info-row">
                <span>학습등급</span>
                <span className="mypage-sidebar__info-badge">입문</span>
              </div>
              <div className="mypage-sidebar__info-row">
                <span>내 쿠폰</span>
                <Link
                  href="/mypage/coupons"
                  className="mypage-sidebar__info-value mypage-sidebar__info-value--link"
                >
                  {couponCount}장
                </Link>
              </div>
              <div className="mypage-sidebar__info-row">
                <span>상품권</span>
                <Link
                  href="/mypage/giftcards"
                  className="mypage-sidebar__info-value mypage-sidebar__info-value--link"
                >
                  0원
                </Link>
              </div>
              <div className="mypage-sidebar__info-row">
                <span>포인트</span>
                <Link
                  href="/mypage/points"
                  className="mypage-sidebar__info-value mypage-sidebar__info-value--link"
                >
                  0원
                </Link>
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
                {group.items.map((item) => {
                  const href = menuLinks[item];
                  const isActive = href ? pathname === href : false;

                  if (!href) {
                    return (
                      <li key={item} className="mypage-sidebar__menu-item">
                        <button type="button" className="mypage-sidebar__menu-link">
                          {item}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={item} className="mypage-sidebar__menu-item">
                      <Link
                        href={href}
                        className={`mypage-sidebar__menu-link${isActive ? ' mypage-sidebar__menu-link--active' : ''}`}
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
