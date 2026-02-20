/**
 * 강의 접근 불가 / 없음 UI
 * - 존재하지 않거나 접근 권한이 없는 강의에 접근 시 표시되는 화면
 * - Next.js App Router의 not-found.jsx 컨벤션을 활용한다
 */

import Link from 'next/link';

export default function LectureNotFound() {
  return (
    <div className="lecture-not-found">
      <h2>강의를 찾을 수 없습니다</h2>
      <p>요청하신 강의가 존재하지 않거나 수강 권한이 없습니다.</p>
      <Link href="/learn">내 강의실로 돌아가기</Link>
    </div>
  );
}
