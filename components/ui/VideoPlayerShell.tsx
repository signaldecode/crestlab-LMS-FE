/**
 * 비디오 플레이어 셸 (VideoPlayerShell)
 * - 강의 플레이어 페이지의 레이아웃 뼈대
 * - 비디오 영역, 사이드바(커리큘럼 목록), 하단 탭(노트/Q&A) 등을 배치한다
 * - 실제 비디오 엘리먼트와 커리큘럼 데이터는 props/children으로 주입받는다
 */

import { ReactNode } from 'react';

interface VideoPlayerShellProps {
  video: ReactNode;
  sidebar: ReactNode;
  tabs?: ReactNode;
}

export default function VideoPlayerShell({ video, sidebar, tabs }: VideoPlayerShellProps) {
  return (
    <div className="video-player-shell">
      <div className="video-player-shell__main">
        {video}
      </div>
      <aside className="video-player-shell__sidebar">
        {sidebar}
      </aside>
      {tabs && (
        <div className="video-player-shell__tabs">
          {tabs}
        </div>
      )}
    </div>
  );
}
