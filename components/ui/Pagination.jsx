/**
 * 페이지네이션 (Pagination)
 * - 목록(강의, 게시글 등)의 페이지 전환 UI
 * - 현재 페이지, 총 페이지 수, 페이지 변경 콜백을 props로 받는다
 * - nav + aria-label로 접근성을 준수한다
 */

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="페이지 탐색">
      <ul className="pagination__list">
        <li className="pagination__item">
          <button
            className="pagination__btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="이전 페이지"
          >
            이전
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className="pagination__item">
            <button
              className={`pagination__btn${currentPage === page ? ' pagination__btn--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="pagination__item">
          <button
            className="pagination__btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="다음 페이지"
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  );
}
