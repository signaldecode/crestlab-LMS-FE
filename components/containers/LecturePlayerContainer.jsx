/**
 * 강의 플레이어 컨테이너 (LecturePlayerContainer)
 * - 강의 영상 재생 페이지의 메인 조립 레이어
 * - VideoPlayerShell에 비디오, 커리큘럼 사이드바, 노트/Q&A 탭을 조립한다
 * - usePlayerStore에서 이어보기/진행률 상태를 관리한다
 */

import VideoPlayerShell from '@/components/ui/VideoPlayerShell';

export default function LecturePlayerContainer({ courseSlug, lectureId }) {
  return (
    <div className="lecture-player-container">
      <VideoPlayerShell
        video={null}
        sidebar={null}
        tabs={null}
      />
    </div>
  );
}
