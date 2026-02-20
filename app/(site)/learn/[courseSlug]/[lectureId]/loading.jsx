/**
 * 강의 플레이어 로딩 UI (선택)
 * - 강의 플레이어 페이지가 로드되는 동안 표시되는 로딩 상태
 * - Next.js App Router의 loading.jsx 컨벤션을 활용한다
 */

import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LecturePlayerLoading() {
  return (
    <div className="lecture-player-loading">
      <LoadingSpinner label="강의를 불러오는 중" />
    </div>
  );
}
