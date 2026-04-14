/**
 * 회원가입 컨테이너 (SignupContainer)
 * - 백엔드 /api/v1/auth/signup 실 연동
 * - SMS 인증 2단계: 발송 → 검증 → 가입 submit
 * - 폼 필드: 이메일, 비밀번호(+확인), 닉네임, 휴대폰(+인증번호), 약관 동의
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import {
  checkEmailAvailability,
  checkNicknameAvailability,
  sendSmsCode,
  signup,
  verifySmsCode,
  UserApiError,
} from '@/lib/userApi';
import pagesData from '@/data/pagesData.json';

const signupData = pagesData.auth.signup;
const modalData = pagesData.auth.modal;

export default function SignupContainer(): JSX.Element {
  const router = useRouter();
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'NONE'>('NONE');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsVerifying, setSmsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [smsInfo, setSmsInfo] = useState('');

  /**
   * 중복 확인 상태 — 입력값을 함께 기억해서,
   * 사용자가 확인 후 값을 변경하면 상태가 자동으로 무효화되도록 한다.
   */
  type DupState = { checkedValue: string; available: boolean | null; message: string };
  const [emailDup, setEmailDup] = useState<DupState>({ checkedValue: '', available: null, message: '' });
  const [nicknameDup, setNicknameDup] = useState<DupState>({ checkedValue: '', available: null, message: '' });
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const emailChecked = emailDup.available === true && emailDup.checkedValue === email.trim();
  const nicknameChecked = nicknameDup.available === true && nicknameDup.checkedValue === nickname.trim();

  const handleCheckEmail = useCallback(async () => {
    setErrorMsg('');
    const value = email.trim();
    if (!value) { setErrorMsg(signupData.emailRequiredError); return; }
    setCheckingEmail(true);
    try {
      const { available } = await checkEmailAvailability(value);
      setEmailDup({
        checkedValue: value,
        available,
        message: available ? signupData.emailAvailableMessage : signupData.emailUnavailableMessage,
      });
    } catch (e) {
      setEmailDup({ checkedValue: value, available: false, message: e instanceof UserApiError ? e.message : signupData.signupErrorMessage });
    } finally {
      setCheckingEmail(false);
    }
  }, [email]);

  const handleCheckNickname = useCallback(async () => {
    setErrorMsg('');
    const value = nickname.trim();
    if (!value) { setErrorMsg(signupData.nicknameRequiredError); return; }
    setCheckingNickname(true);
    try {
      const { available } = await checkNicknameAvailability(value);
      setNicknameDup({
        checkedValue: value,
        available,
        message: available ? signupData.nicknameAvailableMessage : signupData.nicknameUnavailableMessage,
      });
    } catch (e) {
      setNicknameDup({ checkedValue: value, available: false, message: e instanceof UserApiError ? e.message : signupData.signupErrorMessage });
    } finally {
      setCheckingNickname(false);
    }
  }, [nickname]);

  const passwordMismatch = password !== passwordConfirm && passwordConfirm.length > 0;

  const handleSendSms = useCallback(async () => {
    setErrorMsg('');
    setSmsInfo('');
    if (!phone.trim()) { setErrorMsg(signupData.phoneRequiredError); return; }
    setSmsSending(true);
    try {
      await sendSmsCode(phone.trim(), 'SIGNUP');
      setSmsSent(true);
      setSmsVerified(false);
      setSmsInfo(signupData.codeSentMessage);
    } catch (e) {
      setErrorMsg(e instanceof UserApiError ? e.message : signupData.signupErrorMessage);
    } finally {
      setSmsSending(false);
    }
  }, [phone]);

  const handleVerifySms = useCallback(async () => {
    setErrorMsg('');
    setSmsInfo('');
    if (!smsCode.trim()) { setErrorMsg(signupData.codeRequiredError); return; }
    setSmsVerifying(true);
    try {
      await verifySmsCode(phone.trim(), smsCode.trim(), 'SIGNUP');
      setSmsVerified(true);
      setSmsInfo(signupData.codeVerifiedMessage);
    } catch (e) {
      setSmsVerified(false);
      setErrorMsg(e instanceof UserApiError ? e.message : signupData.signupErrorMessage);
    } finally {
      setSmsVerifying(false);
    }
  }, [phone, smsCode]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setErrorMsg('');
      if (!email.trim()) { setErrorMsg(signupData.emailRequiredError); return; }
      if (!emailChecked) { setErrorMsg(signupData.duplicateCheckRequiredError); return; }
      if (!name.trim()) { setErrorMsg(signupData.nameRequiredError); return; }
      if (!nickname.trim()) { setErrorMsg(signupData.nicknameRequiredError); return; }
      if (!nicknameChecked) { setErrorMsg(signupData.duplicateCheckRequiredError); return; }
      if (!password || password.length < 8) { setErrorMsg(signupData.passwordRequiredError); return; }
      if (password !== passwordConfirm) return;
      if (!smsVerified) { setErrorMsg(signupData.phoneNotVerifiedError); return; }

      setSubmitting(true);
      try {
        await signup({
          email: email.trim(),
          password,
          nickname: nickname.trim(),
          name: name.trim(),
          gender,
          phone: phone.trim(),
        });
        router.push('/');
        openLoginModal();
      } catch (err) {
        setErrorMsg(err instanceof UserApiError ? err.message : signupData.signupErrorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [email, emailChecked, name, nickname, nicknameChecked, gender, password, passwordConfirm, phone, smsVerified, router, openLoginModal],
  );

  return (
    <section className="signup-container">
      <h1 className="signup-container__title">{signupData.title}</h1>

      <form className="signup-container__form" onSubmit={handleSubmit}>
        <div className="signup-container__field">
          <span className="signup-container__label">{signupData.emailLabel}</span>
          <div className="signup-container__input-with-btn">
            <input
              type="email"
              className="signup-container__input"
              placeholder={signupData.emailPlaceholder}
              aria-label={signupData.emailLabel}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailDup({ checkedValue: '', available: null, message: '' }); }}
              autoComplete="email"
              required
            />
            <button
              type="button"
              className="signup-container__check-btn"
              aria-label={signupData.emailDuplicateCheckAriaLabel}
              onClick={handleCheckEmail}
              disabled={checkingEmail || !email.trim()}
            >
              {signupData.emailDuplicateCheckLabel}
            </button>
          </div>
          {emailDup.message && emailDup.checkedValue === email.trim() && (
            <span
              className={`signup-container__dup-msg${emailDup.available ? ' signup-container__dup-msg--ok' : ' signup-container__dup-msg--ng'}`}
              role="status"
            >
              {emailDup.message}
            </span>
          )}
        </div>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.nameLabel}</span>
          <input
            type="text"
            className="signup-container__input"
            placeholder={signupData.namePlaceholder}
            aria-label={signupData.nameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <div className="signup-container__field">
          <span className="signup-container__label">{signupData.nicknameLabel}</span>
          <div className="signup-container__input-with-btn">
            <input
              type="text"
              className="signup-container__input"
              placeholder={signupData.nicknamePlaceholder}
              aria-label={signupData.nicknameLabel}
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setNicknameDup({ checkedValue: '', available: null, message: '' }); }}
              required
            />
            <button
              type="button"
              className="signup-container__check-btn"
              aria-label={signupData.nicknameDuplicateCheckAriaLabel}
              onClick={handleCheckNickname}
              disabled={checkingNickname || !nickname.trim()}
            >
              {signupData.nicknameDuplicateCheckLabel}
            </button>
          </div>
          {nicknameDup.message && nicknameDup.checkedValue === nickname.trim() && (
            <span
              className={`signup-container__dup-msg${nicknameDup.available ? ' signup-container__dup-msg--ok' : ' signup-container__dup-msg--ng'}`}
              role="status"
            >
              {nicknameDup.message}
            </span>
          )}
        </div>

        <div className="signup-container__field">
          <span className="signup-container__label">{signupData.genderLabel}</span>
          <div className="signup-container__gender-group" role="radiogroup" aria-label={signupData.genderLabel}>
            {([
              { value: 'MALE' as const, label: signupData.genderOptions[0].label },
              { value: 'FEMALE' as const, label: signupData.genderOptions[1].label },
              { value: 'NONE' as const, label: signupData.genderOptions[2].label },
            ]).map((opt) => (
              <label key={opt.value} className="signup-container__radio">
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  checked={gender === opt.value}
                  onChange={() => setGender(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.passwordLabel}</span>
          <input
            type="password"
            className="signup-container__input"
            placeholder={signupData.passwordPlaceholder}
            aria-label={signupData.passwordLabel}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.passwordConfirmLabel}</span>
          <input
            type="password"
            className={`signup-container__input${passwordMismatch ? ' signup-container__input--error' : ''}`}
            placeholder={signupData.passwordConfirmPlaceholder}
            aria-label={signupData.passwordConfirmLabel}
            aria-invalid={passwordMismatch}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
          {passwordMismatch && (
            <span className="signup-container__error" role="alert">{signupData.passwordMismatchError}</span>
          )}
        </label>

        <div className="signup-container__field">
          <span className="signup-container__label">{signupData.phoneLabel}</span>
          <div className="signup-container__input-with-btn">
            <input
              type="tel"
              className="signup-container__input"
              placeholder={signupData.phonePlaceholder}
              aria-label={signupData.phoneLabel}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              disabled={smsVerified}
              required
            />
            <button
              type="button"
              className="signup-container__check-btn"
              aria-label={signupData.sendCodeAriaLabel}
              onClick={handleSendSms}
              disabled={smsSending || smsVerified}
            >
              {signupData.sendCodeLabel}
            </button>
          </div>
        </div>

        {smsSent && !smsVerified && (
          <div className="signup-container__field">
            <span className="signup-container__label">{signupData.codeLabel}</span>
            <div className="signup-container__input-with-btn">
              <input
                type="text"
                className="signup-container__input"
                placeholder={signupData.codePlaceholder}
                aria-label={signupData.codeLabel}
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
              />
              <button
                type="button"
                className="signup-container__check-btn"
                aria-label={signupData.verifyCodeAriaLabel}
                onClick={handleVerifySms}
                disabled={smsVerifying}
              >
                {signupData.verifyCodeLabel}
              </button>
            </div>
          </div>
        )}

        {smsInfo && <p className="signup-container__info" role="status">{smsInfo}</p>}

        <div className="signup-container__agreements">
          <label className="signup-container__checkbox">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <span className="signup-container__checkbox-label">{signupData.agreeTerms}</span>
          </label>
          <label className="signup-container__checkbox">
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
            <span className="signup-container__checkbox-label">{signupData.agreePrivacy}</span>
          </label>
        </div>

        {errorMsg && <p className="signup-container__error" role="alert">{errorMsg}</p>}

        <button
          type="submit"
          className="signup-container__submit"
          disabled={
            !agreeTerms || !agreePrivacy
            || !emailChecked || !nicknameChecked
            || password !== passwordConfirm || passwordConfirm.length === 0
            || !smsVerified || submitting
          }
        >
          {submitting ? signupData.submittingLabel : signupData.submitLabel}
        </button>
      </form>

      <div className="signup-container__footer">
        <span className="signup-container__footer-text">{signupData.hasAccountText}</span>
        <button
          type="button"
          className="signup-container__footer-link"
          onClick={() => { router.push('/'); openLoginModal(); }}
        >
          {modalData.backToLoginLabel}
        </button>
      </div>
    </section>
  );
}
