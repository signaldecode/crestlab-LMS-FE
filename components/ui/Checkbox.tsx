/**
 * 범용 체크박스 (Checkbox)
 * - label + input[type=checkbox] 조합의 체크박스 컴포넌트
 * - htmlFor/id를 연결하여 접근성을 준수한다
 */

import React, { type ReactNode } from 'react';

interface CheckboxProps {
  id: string;
  label: ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  ariaLabel?: string;
}

export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  required,
  ariaLabel,
}: CheckboxProps) {
  return (
    <div className="checkbox-field">
      <label htmlFor={id} className="checkbox-field__label">
        <input
          id={id}
          type="checkbox"
          className="checkbox-field__input"
          checked={checked}
          onChange={onChange}
          aria-required={required}
          aria-label={ariaLabel}
        />
        <span className="checkbox-field__text">{label}</span>
      </label>
    </div>
  );
}
