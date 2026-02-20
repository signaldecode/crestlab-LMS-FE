/**
 * 카테고리 선택 (CategorySelect)
 * - 게시글 작성/수정 시 카테고리를 드롭다운으로 선택하는 컴포넌트
 * - 카테고리 목록은 data에서 가져온다
 * - Select UI 컴포넌트를 활용한다
 */

import React from 'react';
import type { CategoryOption } from '@/types';
import Select from '@/components/ui/Select';

interface CategorySelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  categories?: CategoryOption[];
}

export default function CategorySelect({ value, onChange, categories = [] }: CategorySelectProps) {
  return (
    <Select
      id="community-category"
      label="카테고리"
      options={categories}
      value={value}
      onChange={onChange}
      ariaLabel="게시글 카테고리 선택"
    />
  );
}
