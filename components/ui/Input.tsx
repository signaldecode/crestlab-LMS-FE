/**
 * 범용 텍스트 입력 (Input)
 * - label + input 조합의 폼 입력 컴포넌트
 * - htmlFor/id를 연결하여 접근성을 준수한다
 * - 에러/힌트는 aria-describedby로 연결 가능하다
 */

import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
}

export default function Input({ id, label, type = 'text', placeholder, value, onChange, error, hint }: InputProps) {
  const descId: string | undefined = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="input-field">
      <label htmlFor={id} className="input-field__label">{label}</label>
      <input
        id={id}
        className={`input-field__input${error ? ' input-field__input--error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={descId}
      />
      {error && <p id={`${id}-error`} className="input-field__error" role="alert">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} className="input-field__hint">{hint}</p>}
    </div>
  );
}
