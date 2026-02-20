/**
 * 브레드크럼 (Breadcrumb)
 * - 현재 페이지의 위치를 계층적으로 보여주는 내비게이션 UI
 * - SEO: BreadcrumbList JSON-LD와 연동 가능하다
 * - A11y: nav + aria-label="브레드크럼"으로 접근성을 준수한다
 * - items 배열은 [{ label, href }] 형태로 data에서 가져온다
 */

import Link from 'next/link';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="브레드크럼">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumb__item">
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
