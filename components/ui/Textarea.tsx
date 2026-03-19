/**
 * 범용 텍스트영역 (Textarea)
 * - label + textarea 조합의 멀티라인 입력 컴포넌트
 * - htmlFor/id를 연결하여 접근성을 준수한다
 * - 에러/힌트는 aria-describedby로 연결 가능하다
 */

import React from 'react';

interface TextareaProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  hint?: string;
  required?: boolean;
}

export default function Textarea({
  id,
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  error,
  hint,
  required,
}: TextareaProps) {
  const descId: string | undefined = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="textarea-field">
      <label htmlFor={id} className="textarea-field__label">
        {label}
        {required && <span className="textarea-field__required" aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={id}
        className={`textarea-field__textarea${error ? ' textarea-field__textarea--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        aria-describedby={descId}
        aria-required={required}
      />
      {error && <p id={`${id}-error`} className="textarea-field__error" role="alert">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} className="textarea-field__hint">{hint}</p>}
    </div>
  );
}
