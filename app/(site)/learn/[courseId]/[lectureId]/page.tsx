/**
 * 강의 플레이어 페이지
 * - /learn/[courseId]/[lectureId] 경로로 접근한다
 * - 강의 영상 재생, 커리큘럼 사이드바, 노트/Q&A 탭을 제공한다
 */

import LecturePlayerContainer from '@/components/containers/LecturePlayerContainer';

interface LecturePlayerPageProps {
  params: Promise<{ courseId: string; lectureId: string }>;
}

export default async function LecturePlayerPage({ params }: LecturePlayerPageProps) {
  const { courseId, lectureId } = await params;

  return (
    <div className="lecture-player-page">
      <LecturePlayerContainer
        courseId={Number(courseId)}
        lectureId={lectureId}
      />
    </div>
  );
}
