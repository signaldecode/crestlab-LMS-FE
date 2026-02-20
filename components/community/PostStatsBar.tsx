/**
 * 게시글 통계 바 (PostStatsBar)
 * - 좋아요 수, 댓글 수, 조회수를 가로 바 형태로 표시한다
 * - 각 수치의 aria-label을 data에서 가져와 접근성을 지원한다
 */

interface PostStatsBarProps {
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
}

export default function PostStatsBar({ likeCount = 0, commentCount = 0, viewCount = 0 }: PostStatsBarProps) {
  return (
    <div className="post-stats-bar" aria-label="게시글 통계">
      <span className="post-stats-bar__item">
        <span aria-label={`좋아요 ${likeCount}개`}>{likeCount}</span>
      </span>
      <span className="post-stats-bar__item">
        <span aria-label={`댓글 ${commentCount}개`}>{commentCount}</span>
      </span>
      <span className="post-stats-bar__item">
        <span aria-label={`조회수 ${viewCount}회`}>{viewCount}</span>
      </span>
    </div>
  );
}
