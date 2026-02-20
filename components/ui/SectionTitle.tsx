/**
 * 섹션 제목 (SectionTitle)
 * - 각 페이지 섹션의 제목(H2)과 부제목을 렌더링하는 공통 컴포넌트
 * - title, subtitle은 props(data)에서 받아 하드코딩하지 않는다
 */

import { ElementType } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tag?: ElementType;
}

export default function SectionTitle({ title, subtitle, tag: Tag = 'h2' }: SectionTitleProps) {
  return (
    <div className="section-title">
      <Tag className="section-title__heading">{title}</Tag>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    </div>
  );
}
