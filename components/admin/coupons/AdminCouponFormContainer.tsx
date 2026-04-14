/**
 * 관리자 쿠폰 발행 폼 (AdminCouponFormContainer)
 * - 백엔드: POST /api/v1/admin/coupons
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminMutation } from '@/hooks/useAdminQuery';
import { createAdminCoupon } from '@/lib/adminApi';
import type { AdminCouponDiscountType } from '@/types';

interface Fields {
  codeLabel: string; codePlaceholder: string;
  nameLabel: string; namePlaceholder: string;
  discountTypeLabel: string; discountValueLabel: string;
  minOrderAmountLabel: string; maxDiscountAmountLabel: string;
  totalQuantityLabel: string;
  startsAtLabel: string; expiresAtLabel: string;
}
interface Errors {
  codeRequired: string; codeFormatInvalid: string; nameRequired: string;
  discountValueInvalid: string; percentRange: string;
  quantityInvalid: string; datesRequired: string; datesInvalid: string;
}

export interface CouponFormCopy {
  createTitle: string; subtitle: string;
  backLinkLabel: string; backLinkHref: string;
  fields: Fields;
  discountTypeOptions: Record<AdminCouponDiscountType, string>;
  errors: Errors;
  actions: { submitLabel: string; cancelLabel: string };
}

interface Props { copy: CouponFormCopy; }

const CODE_PATTERN = /^[A-Z0-9]+$/;

export default function AdminCouponFormContainer({ copy }: Props): JSX.Element {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<AdminCouponDiscountType>('PERCENT');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('0');
  const [totalQuantity, setTotalQuantity] = useState('100');
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});

  const mutation = useAdminMutation(
    async () => createAdminCoupon({
      code: code.trim(),
      name: name.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscountAmount: Number(maxDiscountAmount),
      totalQuantity: Number(totalQuantity),
      startsAt,
      expiresAt,
    }),
    () => router.push('/admin/coupons'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!code.trim()) e.codeRequired = copy.errors.codeRequired;
    else if (!CODE_PATTERN.test(code)) e.codeFormatInvalid = copy.errors.codeFormatInvalid;
    if (!name.trim()) e.nameRequired = copy.errors.nameRequired;
    const dv = Number(discountValue);
    if (!discountValue || Number.isNaN(dv) || dv <= 0) e.discountValueInvalid = copy.errors.discountValueInvalid;
    else if (discountType === 'PERCENT' && (dv < 1 || dv > 100)) e.percentRange = copy.errors.percentRange;
    const qty = Number(totalQuantity);
    if (Number.isNaN(qty) || qty < 1) e.quantityInvalid = copy.errors.quantityInvalid;
    if (!startsAt || !expiresAt) e.datesRequired = copy.errors.datesRequired;
    else if (new Date(expiresAt) < new Date(startsAt)) e.datesInvalid = copy.errors.datesInvalid;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [code, name, discountType, discountValue, totalQuantity, startsAt, expiresAt, copy.errors, mutation]);

  return (
    <div className="admin-form-page">
      <header className="admin-form-page__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">← {copy.backLinkLabel}</Link>
        <h1 className="admin-form-page__title">{copy.createTitle}</h1>
        <p className="admin-form-page__subtitle">{copy.subtitle}</p>
      </header>

      <div className="admin-form-page__field-group">
        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.codeLabel}</span>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={copy.fields.codePlaceholder} className="admin-form-page__input" />
          {errors.codeRequired && <span className="admin-modal__error">{errors.codeRequired}</span>}
          {errors.codeFormatInvalid && <span className="admin-modal__error">{errors.codeFormatInvalid}</span>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.nameLabel}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={copy.fields.namePlaceholder} className="admin-form-page__input" />
          {errors.nameRequired && <span className="admin-modal__error">{errors.nameRequired}</span>}
        </label>

        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.discountTypeLabel}</span>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value as AdminCouponDiscountType)}
              className="admin-form-page__select">
              <option value="PERCENT">{copy.discountTypeOptions.PERCENT}</option>
              <option value="FIXED">{copy.discountTypeOptions.FIXED}</option>
            </select>
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.discountValueLabel}</span>
            <input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
              className="admin-form-page__input" />
            {errors.discountValueInvalid && <span className="admin-modal__error">{errors.discountValueInvalid}</span>}
            {errors.percentRange && <span className="admin-modal__error">{errors.percentRange}</span>}
          </label>
        </div>

        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.minOrderAmountLabel}</span>
            <input type="number" min={0} value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)}
              className="admin-form-page__input" />
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.maxDiscountAmountLabel}</span>
            <input type="number" min={0} value={maxDiscountAmount} onChange={(e) => setMaxDiscountAmount(e.target.value)}
              className="admin-form-page__input" />
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.totalQuantityLabel}</span>
            <input type="number" min={1} value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)}
              className="admin-form-page__input" />
            {errors.quantityInvalid && <span className="admin-modal__error">{errors.quantityInvalid}</span>}
          </label>
        </div>

        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.startsAtLabel}</span>
            <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
              className="admin-form-page__input" />
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.expiresAtLabel}</span>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              className="admin-form-page__input" />
          </label>
        </div>
        {errors.datesRequired && <span className="admin-modal__error">{errors.datesRequired}</span>}
        {errors.datesInvalid && <span className="admin-modal__error">{errors.datesInvalid}</span>}
      </div>

      {mutation.error && <p className="admin-form-page__error" role="alert">{mutation.error.message}</p>}

      <footer className="admin-form-page__footer">
        <Link href={copy.backLinkHref} className="admin-modal__btn admin-modal__btn--ghost">{copy.actions.cancelLabel}</Link>
        <button type="button" onClick={handleSubmit} disabled={mutation.submitting} className="admin-modal__btn admin-modal__btn--primary">{copy.actions.submitLabel}</button>
      </footer>
    </div>
  );
}
