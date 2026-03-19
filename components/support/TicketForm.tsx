/**
 * 1:1 문의 작성 폼 (TicketForm)
 * - 서비스/분야 선택, 담당자/연락처/회사/이메일 입력, 문의 내용, 파일 첨부, 개인정보 동의
 * - 모든 라벨/placeholder/옵션은 data에서 가져온다
 */

'use client';

import React, { useState } from 'react';
import { supportData } from '@/data';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import Checkbox from '@/components/ui/Checkbox';

const form = supportData.ticketForm;
const { fields, privacy, actions, validation } = form;

interface FormState {
  service: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  content: string;
}

const initialState: FormState = {
  service: '',
  category: '',
  contactName: '',
  phone: '',
  email: '',
  content: '',
};

export default function TicketForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'privacy', string>>>({});

  const handleChange = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState | 'privacy', string>> = {};

    if (!formData.service) newErrors.service = validation.required;
    if (!formData.category) newErrors.category = validation.required;
    if (!formData.contactName.trim()) newErrors.contactName = validation.required;
    if (!formData.phone.trim()) {
      newErrors.phone = validation.required;
    } else if (!/^\d{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = validation.invalidPhone;
    }
    if (!formData.email.trim()) {
      newErrors.email = validation.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = validation.invalidEmail;
    }
    if (!formData.content.trim()) newErrors.content = validation.required;
    if (!privacyAgreed) newErrors.privacy = validation.privacyRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: API 연동 — POST /api/support/tickets
  };

  const handleCancel = () => {
    setFormData(initialState);
    setFiles([]);
    setPrivacyAgreed(false);
    setErrors({});
  };

  return (
    <form className="ticket-form-wrap" onSubmit={handleSubmit} noValidate>
      <div className="ticket-form-wrap__header">
        <h1 className="ticket-form-wrap__title">{form.title}</h1>
        <p className="ticket-form-wrap__subtitle">{form.subtitle}</p>
      </div>

      <div className="ticket-form-wrap__body">
        <Select
          id={fields.service.id}
          label={fields.service.label}
          placeholder={fields.service.placeholder}
          options={fields.service.options}
          value={formData.service}
          onChange={handleChange('service')}
          required={fields.service.required}
          error={errors.service}
        />

        <Select
          id={fields.category.id}
          label={fields.category.label}
          placeholder={fields.category.placeholder}
          options={fields.category.options}
          value={formData.category}
          onChange={handleChange('category')}
          required={fields.category.required}
          error={errors.category}
        />

        <Input
          id={fields.contactName.id}
          label={fields.contactName.label}
          placeholder={fields.contactName.placeholder}
          value={formData.contactName}
          onChange={handleChange('contactName')}
          required={fields.contactName.required}
          error={errors.contactName}
        />

        <Input
          id={fields.phone.id}
          label={fields.phone.label}
          placeholder={fields.phone.placeholder}
          value={formData.phone}
          onChange={handleChange('phone')}
          required={fields.phone.required}
          error={errors.phone}
        />

        <Input
          id={fields.email.id}
          label={fields.email.label}
          placeholder={fields.email.placeholder}
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required={fields.email.required}
          error={errors.email}
        />

        <Textarea
          id={fields.content.id}
          label={fields.content.label}
          placeholder={fields.content.placeholder}
          value={formData.content}
          onChange={handleChange('content')}
          rows={fields.content.rows}
          required={fields.content.required}
          error={errors.content}
        />

        <FileUpload
          id={fields.fileUpload.id}
          label={fields.fileUpload.label}
          buttonLabel={fields.fileUpload.buttonLabel}
          hint={fields.fileUpload.hint}
          accept={fields.fileUpload.accept}
          maxFiles={fields.fileUpload.maxFiles}
          files={files}
          onChange={setFiles}
          removeAriaLabel={fields.fileUpload.removeAriaLabel}
        />

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
      </div>

      <div className="ticket-form-wrap__actions">
        <button
          type="button"
          className="ticket-form-wrap__cancel-btn"
          onClick={handleCancel}
          aria-label={actions.cancelAriaLabel}
        >
          {actions.cancel}
        </button>
        <button
          type="submit"
          className="ticket-form-wrap__submit-btn"
          aria-label={actions.submitAriaLabel}
        >
          {actions.submit}
        </button>
      </div>
    </form>
  );
}
