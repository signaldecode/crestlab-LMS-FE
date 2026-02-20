/**
 * 강의 플레이어 페이지
 * - /learn/[courseSlug]/[lectureId] 경로로 접근한다
 * - 강의 영상 재생, 커리큘럼 사이드바, 노트/Q&A 탭을 제공한다
 * - LecturePlayerContainer로 조립한다
 */

import LecturePlayerContainer from '@/components/containers/LecturePlayerContainer';

export default function LecturePlayerPage({ params }) {
  return (
    <div className="lecture-player-page">
      <LecturePlayerContainer
        courseSlug={params.courseSlug}
        lectureId={params.lectureId}
      />
    </div>
  );
}
