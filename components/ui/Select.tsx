/**
 * 범용 셀렉트 (Select)
 * - label + select 조합의 드롭다운 컴포넌트
 * - options 배열을 props로 받아 렌더링한다
 * - htmlFor/id 연결로 접근성을 준수한다
 */

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label: string;
  options?: SelectOption[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
}

export default function Select({ id, label, options = [], value, onChange, ariaLabel }: SelectProps) {
  return (
    <div className="select-field">
      <label htmlFor={id} className="select-field__label">{label}</label>
      <select
        id={id}
        className="select-field__select"
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
      >
        {options.map((opt: SelectOption) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
