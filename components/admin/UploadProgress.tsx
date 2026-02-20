/**
 * 업로드 진행률 바 (UploadProgress)
 * - role="progressbar" + aria-valuenow + aria-live="polite"로 접근성을 준수한다
 * - 진행률 퍼센트를 시각적 바 + 텍스트로 표시한다
 */

import type { JSX } from 'react';

interface UploadProgressProps {
  progress: number;
  label: string;
}

export default function UploadProgress({ progress, label }: UploadProgressProps): JSX.Element {
  return (
    <div className="upload-progress" aria-live="polite">
      <span className="upload-progress__label">{label}</span>
      <div
        className="upload-progress__bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="upload-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="upload-progress__percent">{progress}%</span>
    </div>
  );
}
