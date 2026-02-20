/**
 * 툴팁 (Tooltip)
 * - 호버/포커스 시 보조 설명을 말풍선으로 표시하는 UI
 * - A11y: role="tooltip", aria-describedby로 연결한다
 * - 키보드 포커스에서도 동작해야 한다
 */

'use client';

import { useState, useId, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const tooltipId: string = useId();

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span aria-describedby={isVisible ? tooltipId : undefined}>
        {children}
      </span>
      {isVisible && (
        <span id={tooltipId} className="tooltip" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
