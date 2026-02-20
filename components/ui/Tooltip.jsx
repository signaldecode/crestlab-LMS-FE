/**
 * 툴팁 (Tooltip)
 * - 호버/포커스 시 보조 설명을 말풍선으로 표시하는 UI
 * - A11y: role="tooltip", aria-describedby로 연결한다
 * - 키보드 포커스에서도 동작해야 한다
 */

'use client';

import { useState, useId } from 'react';

export default function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

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
