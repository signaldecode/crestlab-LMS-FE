/**
 * 강의 플레이어 사이드바 (LectureSidebar)
 * - 세로 아이콘 탭(커리큘럼, Q&A, 노트, 채팅, 스크립트) + 탭별 콘텐츠 패널
 * - 커리큘럼 데이터는 props로 주입받아 렌더링한다 (data 기반)
 */

'use client';

import { useState, type ReactNode } from 'react';
import { uiData } from '@/data';

type SidebarTab = 'curriculum' | 'qna' | 'note' | 'chat' | 'script';

export interface CurriculumItem {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface CurriculumSection {
  title: string;
  items: CurriculumItem[];
}

interface LectureSidebarProps {
  sections: CurriculumSection[];
  currentLectureId: string;
  onSelectLecture?: (lectureId: string) => void;
}

const TAB_ICONS: Record<SidebarTab, ReactNode> = {
  curriculum: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    </svg>
  ),
  qna: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
    </svg>
  ),
  note: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  ),
  script: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
};

const TAB_KEYS: SidebarTab[] = ['curriculum', 'qna', 'note', 'chat', 'script'];

export default function LectureSidebar({
  sections,
  currentLectureId,
  onSelectLecture,
}: LectureSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('curriculum');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarLabels = uiData.sidebar;

  const handleTabClick = (tabKey: SidebarTab) => {
    if (activeTab === tabKey) {
      setIsCollapsed((prev) => !prev);
    } else {
      setActiveTab(tabKey);
      setIsCollapsed(false);
    }
  };

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = sections.reduce((sum, s) => sum + s.items.filter((i) => i.isCompleted).length, 0);
  const progressText = sidebarLabels.progressFormat
    .replace('{completed}', String(completedItems))
    .replace('{total}', String(totalItems));

  return (
    <aside
      className={`lecture-sidebar ${isCollapsed ? 'lecture-sidebar--collapsed' : ''}`}
      aria-label={sidebarLabels.ariaLabel}
    >
      {/* 세로 탭 아이콘 */}
      <nav className="lecture-sidebar__tabs" aria-label={sidebarLabels.tabsAriaLabel}>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            className={`lecture-sidebar__tab ${activeTab === key && !isCollapsed ? 'lecture-sidebar__tab--active' : ''}`}
            onClick={() => handleTabClick(key)}
            aria-label={sidebarLabels.tabs[key]}
            aria-selected={activeTab === key && !isCollapsed}
            role="tab"
          >
            {TAB_ICONS[key]}
            <span className="lecture-sidebar__tab-label">{sidebarLabels.tabs[key]}</span>
          </button>
        ))}
      </nav>

      {/* 탭 콘텐츠 패널 */}
      <div className="lecture-sidebar__panel" role="tabpanel">
        {activeTab === 'curriculum' && (
          <div className="lecture-sidebar__curriculum">
            {/* 진행률 헤더 */}
            <div className="lecture-sidebar__progress-header">
              <span className="lecture-sidebar__progress-text">{progressText}</span>
              <div className="lecture-sidebar__progress-bar">
                <div
                  className="lecture-sidebar__progress-fill"
                  style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 섹션 목록 */}
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="lecture-sidebar__section">
                <div className="lecture-sidebar__section-header">
                  <span className="lecture-sidebar__section-title">{section.title}</span>
                  <span className="lecture-sidebar__section-count">
                    {section.items.filter((i) => i.isCompleted).length}/{section.items.length}
                  </span>
                </div>
                <ul className="lecture-sidebar__list">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        className={`lecture-sidebar__item ${item.id === currentLectureId ? 'lecture-sidebar__item--active' : ''} ${item.isCompleted ? 'lecture-sidebar__item--completed' : ''}`}
                        onClick={() => onSelectLecture?.(item.id)}
                        aria-current={item.id === currentLectureId ? 'true' : undefined}
                      >
                        <span className="lecture-sidebar__item-check" aria-hidden="true">
                          {item.isCompleted ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          )}
                        </span>
                        <span className="lecture-sidebar__item-info">
                          <span className="lecture-sidebar__item-title">{item.title}</span>
                          <span className="lecture-sidebar__item-duration">{item.duration}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="lecture-sidebar__empty">
            <p>{sidebarLabels.empty.qna}</p>
            <button className="lecture-sidebar__empty-btn">{sidebarLabels.empty.qnaButton}</button>
          </div>
        )}

        {activeTab === 'note' && (
          <div className="lecture-sidebar__empty">
            <p>{sidebarLabels.empty.note}</p>
            <button className="lecture-sidebar__empty-btn">{sidebarLabels.empty.noteButton}</button>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="lecture-sidebar__empty">
            <p>{sidebarLabels.empty.chat}</p>
          </div>
        )}

        {activeTab === 'script' && (
          <div className="lecture-sidebar__empty">
            <p>{sidebarLabels.empty.script}</p>
          </div>
        )}
      </div>
    </aside>
  );
}