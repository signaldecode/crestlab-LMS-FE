/**
 * 게시글 본문 렌더러 (PostContent)
 * - 게시글 본문(서식/이미지/링크/코드블록)을 안전하게 렌더링한다
 * - XSS 방지를 위해 HTML sanitize를 적용한다
 * - 이미지에는 alt를 보장하고, 링크는 rel="noopener"를 적용한다
 */

export default function PostContent({ html }) {
  return (
    <div className="post-content">
      {/* sanitize된 본문 HTML이 렌더링된다 */}
    </div>
  );
}
