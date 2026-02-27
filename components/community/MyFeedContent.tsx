/**
 * 내 피드 콘텐츠 (MyFeedContent)
 * - 팔로우한 사람들의 게시글을 보여준다
 * - 팔로우한 사람이 없으면 추천 게시글을 보여준다
 * - 로딩 중에는 스켈레톤 UI를 표시한다
 */

'use client';

import { useState, useEffect } from 'react';
import type { Post } from '@/types';
import PostList from '@/components/community/PostList';

/** 피드 로딩 스켈레톤 */
function FeedSkeleton() {
  return (
    <div className="my-feed__skeleton" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="my-feed__skeleton-card">
          {/* 작성자 정보 */}
          <div className="my-feed__skeleton-author">
            <div className="my-feed__skeleton-avatar" />
            <div className="my-feed__skeleton-author-info">
              <div className="my-feed__skeleton-line my-feed__skeleton-line--name" />
              <div className="my-feed__skeleton-line my-feed__skeleton-line--date" />
            </div>
          </div>
          {/* 본문 */}
          <div className="my-feed__skeleton-body">
            <div className="my-feed__skeleton-line my-feed__skeleton-line--title" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--text" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--text-short" />
          </div>
          {/* 썸네일 */}
          <div className="my-feed__skeleton-thumb" />
          {/* 하단 반응 */}
          <div className="my-feed__skeleton-stats">
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 팔로우한 사람이 없을 때 추천 피드 스켈레톤 */
function RecommendedSkeleton() {
  return (
    <div className="my-feed__skeleton" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="my-feed__skeleton-card">
          <div className="my-feed__skeleton-author">
            <div className="my-feed__skeleton-avatar" />
            <div className="my-feed__skeleton-author-info">
              <div className="my-feed__skeleton-line my-feed__skeleton-line--name" />
              <div className="my-feed__skeleton-line my-feed__skeleton-line--date" />
            </div>
          </div>
          <div className="my-feed__skeleton-body">
            <div className="my-feed__skeleton-line my-feed__skeleton-line--title" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--text" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--text-short" />
          </div>
          <div className="my-feed__skeleton-stats">
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
            <div className="my-feed__skeleton-line my-feed__skeleton-line--stat" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyFeedContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [hasFollowings, setHasFollowings] = useState(false);

  useEffect(() => {
    // TODO: 실제 API 연동 — 팔로우한 사람의 게시글 불러오기
    // GET /api/feed/following
    const timer = setTimeout(() => {
      setFollowingPosts([]);
      setRecommendedPosts([]);
      setHasFollowings(false);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  /* 로딩 중 */
  if (isLoading) {
    return (
      <section className="my-feed" aria-label="내 피드">
        <FeedSkeleton />
      </section>
    );
  }

  /* 팔로우한 사람이 있고 게시글도 있을 때 */
  if (hasFollowings && followingPosts.length > 0) {
    return (
      <section className="my-feed" aria-label="내 피드">
        <PostList posts={followingPosts} />
      </section>
    );
  }

  /* 팔로우한 사람이 없거나 게시글이 없을 때 → 추천글 */
  return (
    <section className="my-feed" aria-label="내 피드">
      <div className="my-feed__empty">
        <p className="my-feed__empty-title">
          {hasFollowings
            ? '팔로우한 사람의 새 글이 아직 없어요'
            : '아직 팔로우한 사람이 없어요'}
        </p>
        <p className="my-feed__empty-desc">
          관심 있는 멤버를 팔로우하면 이곳에서 새 글을 바로 확인할 수 있어요!
        </p>
      </div>

      <div className="my-feed__recommend">
        <h3 className="my-feed__recommend-title">추천 게시글</h3>
        {recommendedPosts.length > 0 ? (
          <PostList posts={recommendedPosts} />
        ) : (
          <RecommendedSkeleton />
        )}
      </div>
    </section>
  );
}
