/**
 * 커뮤니티 검색 바 (CommunitySearchBar)
 * - 커뮤니티 게시글을 키워드로 검색하는 인풋 UI
 * - 자동완성(선택), 검색 아이콘 버튼을 포함한다
 * - useCommunityStore의 query 상태와 연동한다
 */

'use client';

import type { ChangeEvent, FormEvent } from 'react';

interface CommunitySearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder: string;
}

export default function CommunitySearchBar({ value, onChange, onSubmit, placeholder }: CommunitySearchBarProps) {
  return (
    <form className="community-search-bar" role="search" onSubmit={onSubmit}>
      <label htmlFor="community-search" className="sr-only">커뮤니티 검색</label>
      <input
        id="community-search"
        className="community-search-bar__input"
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button className="community-search-bar__btn" type="submit" aria-label="검색">
        {/* 검색 아이콘이 렌더링된다 */}
      </button>
    </form>
  );
}
