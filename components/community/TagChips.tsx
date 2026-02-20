/**
 * 태그 칩 (TagChips)
 * - 게시글에 붙은 태그를 칩(버튼) 형태로 표시한다
 * - 클릭 시 해당 태그로 필터링할 수 있다
 * - 태그 목록은 props(data)에서 받는다
 */

interface TagChipsProps {
  tags?: string[];
  activeTag?: string;
  onTagClick?: (tag: string) => void;
}

export default function TagChips({ tags = [], activeTag, onTagClick }: TagChipsProps) {
  return (
    <div className="tag-chips" role="group" aria-label="태그 필터">
      {tags.map((tag: string) => (
        <button
          key={tag}
          className={`tag-chips__chip${activeTag === tag ? ' tag-chips__chip--active' : ''}`}
          onClick={() => onTagClick?.(tag)}
          aria-pressed={activeTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
