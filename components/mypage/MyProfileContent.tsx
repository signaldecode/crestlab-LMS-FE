/**
 * 프로필 콘텐츠 (MyProfileContent)
 * - 탭(소개 / 작성 및 활동 / 팔로우) + 활동 내역 스켈레톤
 */

import type { JSX } from 'react';

const tabs = ['소개', '작성 및 활동', '팔로우'];
const activityFilters = ['작성한 글', '맷글단 글', '저장한 글', '배지'];

export default function MyProfileContent(): JSX.Element {
  return (
    <div className="mypage-profile">
      {/* 탭 */}
      <div className="mypage-profile__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`mypage-profile__tab${tab === '작성 및 활동' ? ' mypage-profile__tab--active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 활동 필터 */}
      <div className="mypage-profile__filters">
        {activityFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`mypage-profile__filter${filter === '작성한 글' ? ' mypage-profile__filter--active' : ''}`}
          >
            {filter} <span className="mypage-profile__filter-count">0</span>
          </button>
        ))}
      </div>

      {/* 검색 + 정렬 */}
      <div className="mypage-profile__toolbar">
        <select className="mypage-profile__select" aria-label="필터">
          <option>전체</option>
        </select>
        <input
          type="search"
          className="mypage-profile__search"
          placeholder="검색어를 입력하세요"
          aria-label="검색"
        />
      </div>

      <div className="mypage-profile__result-info">
        <span>글 0건</span>
        <div className="mypage-profile__sort">
          <button type="button" className="mypage-profile__sort-btn mypage-profile__sort-btn--active">최신순</button>
          <button type="button" className="mypage-profile__sort-btn">오래된순</button>
        </div>
      </div>

      {/* 빈 상태 */}
      <div className="mypage-profile__empty">
        <p>아직은 비어있지만, 여기에 내 경험이 쌓일거에요.</p>
        <p>오늘 어떤 이야기를 남겨볼까요?</p>
        <button type="button" className="mypage-profile__write-btn">+ 글쓰기</button>
      </div>
    </div>
  );
}
