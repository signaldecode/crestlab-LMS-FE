/**
 * 관리자 리스트/상세 테이블용 공용 액션 버튼 (AdminActionButton)
 * - href 전달 시 <Link>로, onClick 전달 시 <button>으로 렌더링
 * - 시각적으로 동일한 스타일(admin-action-btn)을 공유한다
 */

'use client';

import type { JSX, ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type Variant = 'default' | 'danger';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
}

interface LinkProps extends CommonProps {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonProps extends CommonProps {
  href?: never;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  type?: 'button' | 'submit';
  disabled?: boolean;
}

type AdminActionButtonProps = LinkProps | ButtonProps;

function resolveClassName(variant: Variant, extra?: string): string {
  const base = 'admin-action-btn';
  const variantClass = variant === 'danger' ? ' admin-action-btn--danger' : '';
  const extraClass = extra ? ` ${extra}` : '';
  return `${base}${variantClass}${extraClass}`;
}

export default function AdminActionButton(props: AdminActionButtonProps): JSX.Element {
  const { children, variant = 'default', className, ariaLabel } = props;
  const resolved = resolveClassName(variant, className);

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} aria-label={ariaLabel} className={resolved}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={ariaLabel}
      className={resolved}
    >
      {children}
    </button>
  );
}
