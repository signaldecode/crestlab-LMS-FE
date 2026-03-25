/**
 * 홈 커뮤니티 섹션 (HomeCommunity)
 * - 커뮤니티 글 목록 + 페이지네이션 UI
 * - 모든 텍스트/aria는 data/homeData.json의 homeCommunity에서 가져온다
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import type { HomeCommunityPost } from '@/types';
import { getHomeCommunity } from '@/lib/data';

function CommunityPostItem({ post }: { post: HomeCommunityPost }): JSX.Element {
  const initial = post.authorNickname.charAt(0);

  return (
    <article className="home-community__post" aria-label={post.ariaLabel}>
      <div className="home-community__post-body">
        <div className="home-community__post-author">
          <span
            className={`home-community__avatar home-community__avatar--${post.avatarColor}`}
            aria-hidden="true"
          >
            {initial}
          </span>
          <span className="home-community__nickname">{post.authorNickname}</span>
          <span className="home-community__category">{post.category}</span>
        </div>
        <h3 className="home-community__post-title">{post.title}</h3>
        <p className="home-community__post-content">{post.content}</p>
        <div className="home-community__post-stats">
          <span className="home-community__stat">
            <span aria-hidden="true">&#9825;</span> {post.likeCount}
          </span>
          <span className="home-community__stat">
            <span aria-hidden="true">&#128172;</span> {post.commentCount}
          </span>
        </div>
      </div>
      <div className="home-community__post-thumb">
        <Image
          src={post.thumbnail}
          alt={post.thumbnailAlt}
          width={160}
          height={120}
          className="home-community__post-image"
        />
      </div>
    </article>
  );
}

export default function HomeCommunity(): JSX.Element {
  const { meta, posts, pagination } = getHomeCommunity();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = pagination.totalPages;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className="home-community" aria-label={meta.ariaLabel}>
      <h2 className="home-community__title">{meta.title}</h2>

      <div className="home-community__list">
        {posts.map((post) => (
          <CommunityPostItem key={post.id} post={post} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <nav className="home-community__pagination" aria-label={pagination.ariaLabel}>
        <button
          className="home-community__page-btn home-community__page-btn--arrow"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          aria-label="이전 페이지"
        >
          &lt;
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`home-community__page-btn${page === currentPage ? ' home-community__page-btn--active' : ''}`}
            onClick={() => setCurrentPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`${page} 페이지`}
          >
            {page}
          </button>
        ))}
        <span className="home-community__page-ellipsis" aria-hidden="true">...</span>
        <button
          className="home-community__page-btn home-community__page-btn--arrow"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </nav>
    </section>
  );
}
