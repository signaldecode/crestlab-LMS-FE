/**
 * 범용 파일 업로드 (FileUpload)
 * - 파일 선택 + 파일 목록 표시 컴포넌트
 * - 라벨/힌트/버튼 텍스트는 props로만 받아 렌더링한다
 */

'use client';

import React, { useRef } from 'react';

interface FileUploadProps {
  id: string;
  label: string;
  buttonLabel: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  removeAriaLabel?: string;
}

export default function FileUpload({
  id,
  label,
  buttonLabel,
  hint,
  accept,
  multiple = true,
  files,
  onChange,
  maxFiles = 5,
  removeAriaLabel,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const merged = [...files, ...newFiles].slice(0, maxFiles);
    onChange(merged);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload">
      <span className="file-upload__label">{label}</span>
      <div className="file-upload__area">
        <button
          type="button"
          className="file-upload__button"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= maxFiles}
        >
          + {buttonLabel}
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="file-upload__input"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          aria-label={label}
        />
      </div>
      {hint && <p className="file-upload__hint">{hint}</p>}
      {files.length > 0 && (
        <ul className="file-upload__list">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="file-upload__item">
              <span className="file-upload__filename">{file.name}</span>
              <button
                type="button"
                className="file-upload__remove"
                onClick={() => handleRemove(i)}
                aria-label={removeAriaLabel ? `${file.name} ${removeAriaLabel}` : `${file.name} 삭제`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
