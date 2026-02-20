/**
 * 탭 (Tabs)
 * - 탭 기반 콘텐츠 전환 UI
 * - role="tablist", role="tab", role="tabpanel" 등 A11y를 준수한다
 * - 탭 label은 props(data)에서 받아 하드코딩하지 않는다
 */

'use client';

import { useState, ReactNode } from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs?: TabItem[];
  ariaLabel?: string;
}

export default function Tabs({ tabs = [], ariaLabel }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab: TabItem, index: number) => (
          <button
            key={index}
            role="tab"
            id={`tab-${index}`}
            className={`tabs__tab${activeIndex === index ? ' tabs__tab--active' : ''}`}
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab: TabItem, index: number) => (
        <div
          key={index}
          id={`tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          hidden={activeIndex !== index}
          className="tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
