/**
 * 강의 플레이어 에러 UI (선택)
 * - 강의 플레이어 로드 중 에러 발생 시 표시되는 폴백 화면
 * - Next.js App Router의 error.jsx 컨벤션을 활용한다
 * - "다시 시도" 버튼으로 복구를 시도한다
 */

'use client';

export default function LecturePlayerError({ error, reset }) {
  return (
    <div className="lecture-player-error">
      <h2>강의를 불러올 수 없습니다</h2>
      <p>{error?.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
