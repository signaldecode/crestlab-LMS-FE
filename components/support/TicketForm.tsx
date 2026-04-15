/**
 * 1:1 문의 작성 폼 (TicketForm)
 * - 백엔드 계약: POST /api/v1/inquiries { category, title, content, attachmentUrls? (max 3) }
 * - 첨부 이미지는 Presigned URL 로 S3 업로드 → CloudFront publicUrl 을 attachmentUrls 에 담아 전송
 * - 모든 라벨/placeholder/옵션은 supportData.ticketForm 에서 가져온다
 */

'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supportData } from '@/data';
import { createInquiry, type InquiryCategory } from '@/lib/userApi';
import { uploadImage, validateImageFile } from '@/lib/upload';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';

const form = supportData.ticketForm;
const { fields, privacy, actions, validation } = form;

interface FormState {
  category: '' | InquiryCategory;
  title: string;
  content: string;
}

interface AttachmentItem {
  id: string;
  previewUrl: string;
  /** 업로드 완료 후 채워지는 publicUrl */
  publicUrl: string | null;
  /** 업로드 진행 상태 */
  status: 'uploading' | 'done' | 'error';
  errorMessage?: string;
}

const initialState: FormState = {
  category: '',
  title: '',
  content: '',
};

export default function TicketForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormState>(initialState);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'privacy' | 'attachments' | 'submit', string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value as FormState[K];
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSelectFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!files.length) return;

    const remaining = fields.attachments.maxFiles - attachments.length;
    if (remaining <= 0) {
      setErrors((prev) => ({ ...prev, attachments: validation.tooManyAttachments }));
      return;
    }

    const accepted = files.slice(0, remaining);
    const rejected = files.length - accepted.length;
    if (rejected > 0) {
      setErrors((prev) => ({ ...prev, attachments: validation.tooManyAttachments }));
    } else if (errors.attachments) {
      setErrors((prev) => ({ ...prev, attachments: undefined }));
    }

    accepted.forEach((file) => {
      const validationError = validateImageFile(file);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const previewUrl = URL.createObjectURL(file);

      if (validationError) {
        setAttachments((prev) => [
          ...prev,
          {
            id,
            previewUrl,
            publicUrl: null,
            status: 'error',
            errorMessage: validationError === 'invalidFormat'
              ? validation.invalidImageFormat
              : validation.imageTooLarge,
          },
        ]);
        return;
      }

      setAttachments((prev) => [
        ...prev,
        { id, previewUrl, publicUrl: null, status: 'uploading' },
      ]);

      uploadImage(file, 'NOTICE_IMAGE').promise
        .then(({ publicUrl }) => {
          setAttachments((prev) => prev.map((a) =>
            a.id === id ? { ...a, publicUrl, status: 'done' } : a
          ));
        })
        .catch(() => {
          setAttachments((prev) => prev.map((a) =>
            a.id === id ? { ...a, status: 'error', errorMessage: validation.uploadFailed } : a
          ));
        });
    });
  }, [attachments.length, errors.attachments]);

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
    if (errors.attachments) setErrors((prev) => ({ ...prev, attachments: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!formData.category) next.category = validation.required;
    if (!formData.title.trim()) next.title = validation.required;
    else if (formData.title.trim().length > fields.title.maxLength) next.title = validation.titleTooLong;
    if (!formData.content.trim()) next.content = validation.required;
    if (!privacyAgreed) next.privacy = validation.privacyRequired;

    const stillUploading = attachments.some((a) => a.status === 'uploading');
    if (stillUploading) next.attachments = validation.uploadFailed;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const attachmentUrls = attachments
      .filter((a) => a.status === 'done' && a.publicUrl)
      .map((a) => a.publicUrl as string);

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));
    try {
      await createInquiry({
        category: formData.category as InquiryCategory,
        title: formData.title.trim(),
        content: formData.content.trim(),
        attachmentUrls: attachmentUrls.length ? attachmentUrls : undefined,
      });
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setErrors((prev) => ({ ...prev, submit: message || validation.submitFailed }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
    setFormData(initialState);
    setAttachments([]);
    setPrivacyAgreed(false);
    setErrors({});
    router.push(form.successAction.href);
  };

  if (success) {
    return (
      <div className="ticket-form-wrap">
        <div className="ticket-form-wrap__success" role="status" aria-live="polite">
          <p className="ticket-form-wrap__success-text">{form.successMessage}</p>
          <Link
            href={form.successAction.href}
            className="ticket-form-wrap__submit-btn"
            aria-label={form.successAction.ariaLabel}
          >
            {form.successAction.label}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="ticket-form-wrap" onSubmit={handleSubmit} noValidate>
      <div className="ticket-form-wrap__header">
        <h1 className="ticket-form-wrap__title">{form.title}</h1>
        <p className="ticket-form-wrap__subtitle">{form.subtitle}</p>
      </div>

      <div className="ticket-form-wrap__body">
        <Select
          id={fields.category.id}
          label={fields.category.label}
          placeholder={fields.category.placeholder}
          options={fields.category.options}
          value={formData.category}
          onChange={setField('category')}
          required={fields.category.required}
          error={errors.category}
        />

        <Input
          id={fields.title.id}
          label={fields.title.label}
          placeholder={fields.title.placeholder}
          value={formData.title}
          onChange={setField('title')}
          required={fields.title.required}
          error={errors.title}
        />

        <Textarea
          id={fields.content.id}
          label={fields.content.label}
          placeholder={fields.content.placeholder}
          value={formData.content}
          onChange={setField('content')}
          rows={fields.content.rows}
          required={fields.content.required}
          error={errors.content}
        />

        <div className="ticket-form-wrap__attachments">
          <span className="ticket-form-wrap__attachments-label">{fields.attachments.label}</span>
          <p className="ticket-form-wrap__attachments-hint">{fields.attachments.hint}</p>

          {attachments.length > 0 && (
            <ul className="ticket-form-wrap__attachments-list">
              {attachments.map((a) => (
                <li key={a.id} className={`ticket-form-wrap__attachment ticket-form-wrap__attachment--${a.status}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.previewUrl} alt="" className="ticket-form-wrap__attachment-thumb" />
                  {a.status === 'uploading' && (
                    <span className="ticket-form-wrap__attachment-status">{fields.attachments.uploadingLabel}</span>
                  )}
                  {a.status === 'error' && a.errorMessage && (
                    <span className="ticket-form-wrap__attachment-error">{a.errorMessage}</span>
                  )}
                  <button
                    type="button"
                    className="ticket-form-wrap__attachment-remove"
                    onClick={() => handleRemoveAttachment(a.id)}
                    aria-label={fields.attachments.removeAriaLabel}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {attachments.length < fields.attachments.maxFiles && (
            <>
              <input
                ref={fileInputRef}
                id={fields.attachments.id}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleSelectFiles}
                className="ticket-form-wrap__attachments-input"
              />
              <button
                type="button"
                className="ticket-form-wrap__attachments-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {fields.attachments.buttonLabel}
              </button>
            </>
          )}

          {errors.attachments && (
            <p className="input-field__error" role="alert">{errors.attachments}</p>
          )}
        </div>

        <div className="ticket-form-wrap__privacy">
          <Checkbox
            id="privacy-agree"
            label={privacy.label}
            checked={privacyAgreed}
            onChange={(e) => {
              setPrivacyAgreed(e.target.checked);
              if (errors.privacy) setErrors((prev) => ({ ...prev, privacy: undefined }));
            }}
            required
          />
          <button
            type="button"
            className="ticket-form-wrap__privacy-toggle"
            onClick={() => setPrivacyOpen(!privacyOpen)}
            aria-expanded={privacyOpen}
            aria-label={privacy.toggleAriaLabel}
          >
            {privacy.toggleLabel} {privacyOpen ? '∧' : '∨'}
          </button>
        </div>
        {errors.privacy && (
          <p className="input-field__error" role="alert">{errors.privacy}</p>
        )}
        {privacyOpen && (
          <div className="ticket-form-wrap__privacy-content">
            {privacy.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < privacy.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        )}

        {errors.submit && (
          <p className="input-field__error" role="alert">{errors.submit}</p>
        )}
      </div>

      <div className="ticket-form-wrap__actions">
        <button
          type="button"
          className="ticket-form-wrap__cancel-btn"
          onClick={handleCancel}
          aria-label={actions.cancelAriaLabel}
          disabled={submitting}
        >
          {actions.cancel}
        </button>
        <button
          type="submit"
          className="ticket-form-wrap__submit-btn"
          aria-label={actions.submitAriaLabel}
          disabled={submitting}
        >
          {submitting ? actions.submitting : actions.submit}
        </button>
      </div>
    </form>
  );
}
