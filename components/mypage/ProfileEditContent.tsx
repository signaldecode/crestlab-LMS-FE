/**
 * 회원정보관리 콘텐츠 (ProfileEditContent)
 * - 회원 기본정보 수정 (이름/아이디/비밀번호/휴대폰/생년월일/성별)
 * - 소셜연동 관리
 * - 마케팅 수신 설정
 * - 회원탈퇴 / 취소 / 수정 버튼
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useAuthStore from '@/stores/useAuthStore';
import ConfirmModal from '@/components/layout/ConfirmModal';
import accountData from '@/data/accountData.json';

// Social Logos
import naverLogo from '@/assets/images/logo/naver.png';
import kakaoLogo from '@/assets/images/logo/kakaotalk.png';
import googleLogo from '@/assets/images/logo/google.png';
import appleLogo from '@/assets/images/logo/apple.png';

const profileEdit = accountData.profileEdit;

export default function ProfileEditContent(): JSX.Element {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // 비밀번호
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 휴대폰
  const [phone, setPhone] = useState(user?.phone ?? '');

  // 생년월일
  const [birthday, setBirthday] = useState(user?.birthday ?? '');

  // 성별
  const [gender, setGender] = useState<'male' | 'female'>(user?.gender ?? 'male');

  // 마케팅 동의
  const [personalInfoConsent, setPersonalInfoConsent] = useState(user?.marketingConsent?.personalInfo ?? false);
  const [smsConsent, setSmsConsent] = useState(user?.marketingConsent?.sms ?? false);
  const [emailConsent, setEmailConsent] = useState(user?.marketingConsent?.email ?? false);
  const [nightAdConsent, setNightAdConsent] = useState(user?.marketingConsent?.nightAd ?? false);

  // 회원탈퇴 확인 모달
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleWithdrawConfirm = useCallback(() => {
    setIsWithdrawOpen(false);
    // TODO: 실제 회원탈퇴 API 호출
  }, []);

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!user) return;
    setUser({
      ...user,
      phone,
      birthday,
      gender,
      marketingConsent: {
        personalInfo: personalInfoConsent,
        sms: smsConsent,
        email: emailConsent,
        nightAd: nightAdConsent,
      },
    });
    router.push('/mypage');
  }, [user, phone, birthday, gender, personalInfoConsent, smsConsent, emailConsent, nightAdConsent, setUser, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const socialAccounts = user?.socialAccounts ?? [];

  // Social Logo mapping
  const getSocialLogo = (id: string) => {
    switch (id) {
      case 'naver': return naverLogo;
      case 'kakao': return kakaoLogo;
      case 'google': return googleLogo;
      case 'apple': return appleLogo;
      default: return null;
    }
  };

  return (
    <div className="member-edit">
      <h2 className="member-edit__title">{profileEdit.title}</h2>
      <hr className="member-edit__divider" />

      {/* 회원 기본정보 폼 */}
      <div className="member-edit__form">
        {/* 이름 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-name">
            {profileEdit.fields.name.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-name"
              type="text"
              className="member-edit__input member-edit__input--readonly"
              value={user?.name ?? ''}
              readOnly
              aria-label={profileEdit.fields.name.ariaLabel}
            />
          </div>
        </div>

        {/* 아이디 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-email">
            {profileEdit.fields.email.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-email"
              type="text"
              className="member-edit__input member-edit__input--readonly"
              value={user?.email ?? ''}
              readOnly
              aria-label={profileEdit.fields.email.ariaLabel}
            />
          </div>
        </div>

        {/* 현재 비밀번호 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-current-pw">
            {profileEdit.fields.currentPassword.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-current-pw"
              type="password"
              className="member-edit__input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={profileEdit.fields.currentPassword.placeholder}
              aria-label={profileEdit.fields.currentPassword.ariaLabel}
            />
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-new-pw">
            {profileEdit.fields.newPassword.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-new-pw"
              type="password"
              className="member-edit__input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={profileEdit.fields.newPassword.placeholder}
              aria-label={profileEdit.fields.newPassword.ariaLabel}
            />
          </div>
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-confirm-pw">
            {profileEdit.fields.confirmPassword.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-confirm-pw"
              type="password"
              className="member-edit__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={profileEdit.fields.confirmPassword.placeholder}
              aria-label={profileEdit.fields.confirmPassword.ariaLabel}
            />
          </div>
        </div>

        {/* 휴대폰 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-phone">
            {profileEdit.fields.phone.label}
          </label>
          <div className="member-edit__field member-edit__field--with-btn">
            <input
              id="member-phone"
              type="tel"
              className="member-edit__input"
              value={phone}
              onChange={handlePhoneChange}
              aria-label={profileEdit.fields.phone.ariaLabel}
            />
            <button type="button" className="member-edit__verify-btn">
              {profileEdit.buttons.verifyPhone}
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-birthday">
            {profileEdit.fields.birthday.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-birthday"
              type="text"
              className="member-edit__input"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              aria-label={profileEdit.fields.birthday.ariaLabel}
            />
          </div>
        </div>

        {/* 성별 */}
        <div className="member-edit__row">
          <span className="member-edit__label">
            {profileEdit.fields.gender.label}
          </span>
          <div className="member-edit__field member-edit__field--radio" role="radiogroup" aria-label={profileEdit.fields.gender.ariaLabel}>
            {profileEdit.genderOptions.map((option) => (
              <label key={option.value} className="member-edit__radio-label">
                <input
                  type="radio"
                  name="gender"
                  className="member-edit__radio"
                  value={option.value}
                  checked={gender === option.value}
                  onChange={() => setGender(option.value as 'male' | 'female')}
                />
                <span className="member-edit__radio-text">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 소셜연동 */}
        <div className="member-edit__row member-edit__row--social">
          <span className="member-edit__label">
            {profileEdit.fields.socialAccounts.label}
          </span>
          <div className="member-edit__field member-edit__field--social">
            {profileEdit.socialProviders.map((provider) => {
              const account = socialAccounts.find((a) => a.provider === provider.id);
              const isConnected = account?.connected ?? false;

              return (
                <div key={provider.id} className="member-edit__social-row">
                  <div className="member-edit__social-info">
                    <span
                      className="member-edit__social-icon"
                      aria-hidden="true"
                    >
                      {getSocialLogo(provider.id) ? (
                        <Image
                          src={getSocialLogo(provider.id)!}
                          alt={provider.label}
                          width={20}
                          height={20}
                          className="member-edit__social-logo"
                        />
                      ) : (
                        <span
                          className="member-edit__social-dot"
                          data-provider={provider.id}
                        />
                      )}
                    </span>
                    <span className="member-edit__social-name">
                      {provider.label}
                      {provider.note && (
                        <span className="member-edit__social-note">{provider.note}</span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`member-edit__social-btn${isConnected ? ' member-edit__social-btn--connected' : ''}`}
                    aria-label={`${provider.label} ${isConnected ? profileEdit.buttons.socialDisconnect : profileEdit.buttons.socialConnect}`}
                  >
                    {profileEdit.buttons.socialConnect}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 가입일 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-join-date">
            {profileEdit.fields.joinDate.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-join-date"
              type="text"
              className="member-edit__input member-edit__input--readonly"
              value={user?.joinDate ?? ''}
              readOnly
              aria-label={profileEdit.fields.joinDate.ariaLabel}
            />
          </div>
        </div>

        {/* 등급 */}
        <div className="member-edit__row">
          <label className="member-edit__label" htmlFor="member-grade">
            {profileEdit.fields.grade.label}
          </label>
          <div className="member-edit__field">
            <input
              id="member-grade"
              type="text"
              className="member-edit__input member-edit__input--readonly"
              value={user?.grade ?? ''}
              readOnly
              aria-label={profileEdit.fields.grade.ariaLabel}
            />
          </div>
        </div>
      </div>

      {/* 마케팅 수신 설정 */}
      <section className="member-edit__marketing" aria-labelledby="marketing-title">
        <h3 id="marketing-title" className="member-edit__marketing-title">
          {profileEdit.marketing.title}
        </h3>
        <hr className="member-edit__divider" />

        {/* 개인정보 동의 */}
        <div className="member-edit__row">
          <span className="member-edit__label">
            {profileEdit.marketing.personalInfo.label}
          </span>
          <div className="member-edit__field">
            <label className="member-edit__checkbox-label">
              <input
                type="checkbox"
                className="member-edit__checkbox"
                checked={personalInfoConsent}
                onChange={(e) => setPersonalInfoConsent(e.target.checked)}
              />
              <span className="member-edit__checkbox-text">
                {profileEdit.marketing.personalInfo.description}
              </span>
            </label>
          </div>
        </div>

        {/* 광고성 정보 수신 동의 */}
        <div className="member-edit__row">
          <span className="member-edit__label member-edit__label--multiline">
            {profileEdit.marketing.adConsent.label}
          </span>
          <div className="member-edit__field member-edit__field--checkbox-group">
            <label className="member-edit__checkbox-label">
              <input
                type="checkbox"
                className="member-edit__checkbox"
                checked={smsConsent}
                onChange={(e) => setSmsConsent(e.target.checked)}
              />
              <span className="member-edit__checkbox-text">
                {profileEdit.marketing.adConsent.options[0]}
              </span>
            </label>
            <label className="member-edit__checkbox-label">
              <input
                type="checkbox"
                className="member-edit__checkbox"
                checked={emailConsent}
                onChange={(e) => setEmailConsent(e.target.checked)}
              />
              <span className="member-edit__checkbox-text">
                {profileEdit.marketing.adConsent.options[1]}
              </span>
            </label>
          </div>
        </div>

        {/* 광고성 정보 야간 동의 */}
        <div className="member-edit__row">
          <span className="member-edit__label member-edit__label--multiline">
            {profileEdit.marketing.nightAdConsent.label}
          </span>
          <div className="member-edit__field">
            <label className="member-edit__checkbox-label">
              <input
                type="checkbox"
                className="member-edit__checkbox"
                checked={nightAdConsent}
                onChange={(e) => setNightAdConsent(e.target.checked)}
              />
              <span className="member-edit__checkbox-text">
                {profileEdit.marketing.nightAdConsent.description}
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div className="member-edit__actions">
        <button
          type="button"
          className="member-edit__withdraw-btn"
          onClick={() => setIsWithdrawOpen(true)}
        >
          {profileEdit.buttons.withdraw}
        </button>
        <div className="member-edit__actions-right">
          <button
            type="button"
            className="member-edit__cancel-btn"
            onClick={handleCancel}
          >
            {profileEdit.buttons.cancel}
          </button>
          <button
            type="button"
            className="member-edit__submit-btn"
            onClick={handleSubmit}
          >
            {profileEdit.buttons.submit}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isWithdrawOpen}
        message={profileEdit.buttons.withdrawConfirmMessage}
        onCancel={() => setIsWithdrawOpen(false)}
        onConfirm={handleWithdrawConfirm}
      />
    </div>
  );
}
