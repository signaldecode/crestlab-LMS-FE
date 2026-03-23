/**
 * 회원가입 컨테이너 (SignupContainer)
 * - 회원가입 전용 페이지 폼을 조립한다
 * - useAuth로 인증 상태를 관리한다
 * - 폼 label/placeholder/에러/약관 문구는 data에서 가져온다
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { redirectToOAuth } from '@/lib/oauth';
import pagesData from '@/data/pagesData.json';

const signupData = pagesData.auth.signup;
const modalData = pagesData.auth.modal;

/**
 * 임시 회원가입 처리 — 나중에 실제 API 호출로 교체한다
 * TODO: POST /api/auth/signup 으로 교체
 */
async function mockSignup(params: {
  name: string;
  nickname: string;
  username: string;
  password: string;
  birthday: string;
  gender: string;
}) {
  return {
    user: {
      id: 'user-' + Date.now(),
      username: params.username,
      name: params.name,
      nickname: params.nickname,
      birthday: params.birthday,
      gender: params.gender as 'male' | 'female' | 'none',
      bio: '',
    },
    token: 'mock-token-' + Date.now(),
  };
}

export default function SignupContainer(): JSX.Element {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const passwordMismatch = password !== passwordConfirm && passwordConfirm.length > 0;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;
    const result = await mockSignup({
      name,
      nickname,
      username,
      password,
      birthday,
      gender,
    });
    login(result.user, result.token);
    router.push('/');
  }, [name, nickname, username, password, passwordConfirm, birthday, gender, login, router]);

  return (
    <section className="signup-container">
      <h1 className="signup-container__title">{signupData.title}</h1>

      {/* {/* 소셜 회원가입 */}
      {/* <div className="signup-container__social">
        <button
          type="button"
          className="signup-container__social-btn signup-container__social-btn--kakao"
          onClick={() => redirectToOAuth('kakao')}
        >
          {modalData.socialKakaoLabel}
        </button>
      </div>

      <div className="signup-container__social-icons">
        <button type="button" className="signup-container__social-icon signup-container__social-icon--naver" aria-label={modalData.socialNaverAriaLabel}>
          N
        </button>
        <button
          type="button"
          className="signup-container__social-icon signup-container__social-icon--google"
          aria-label={modalData.socialGoogleAriaLabel}
          onClick={() => redirectToOAuth('google')}
        >
          G
        </button>
        <button type="button" className="signup-container__social-icon signup-container__social-icon--apple" aria-label={modalData.socialAppleAriaLabel}>
          A
        </button>
      </div> */}

      {/* <div className="signup-container__divider">
        <span className="signup-container__divider-text">{signupData.dividerText ?? '또는'}</span>
      </div> */}

      {/* 이메일 회원가입 폼 */}
      <form className="signup-container__form" onSubmit={handleSubmit}>
        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.nameLabel}</span>
          <input
            type="text"
            className="signup-container__input"
            placeholder={signupData.namePlaceholder}
            aria-label={signupData.nameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              type="button"
              className="signup-container__check-btn"
              aria-label={signupData.nicknameDuplicateCheckAriaLabel}
              onClick={() => {
                // TODO: GET /api/auth/check-nickname?nickname=... 으로 교체
              }}
            >
              {signupData.nicknameDuplicateCheckLabel}
            </button>
          </div>
        </div>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.usernameLabel}</span>
          <input
            type="text"
            className="signup-container__input"
            placeholder={signupData.usernamePlaceholder}
            aria-label={signupData.usernameLabel}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.passwordLabel}</span>
          <input
            type="password"
            className="signup-container__input"
            placeholder={signupData.passwordPlaceholder}
            aria-label={signupData.passwordLabel}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />
          {passwordMismatch && (
            <span className="signup-container__error" role="alert">{signupData.passwordMismatchError}</span>
          )}
        </label>

        <label className="signup-container__field">
          <span className="signup-container__label">{signupData.birthdayLabel}</span>
          <input
            type="date"
            className="signup-container__input"
            placeholder={signupData.birthdayPlaceholder}
            aria-label={signupData.birthdayLabel}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </label>

        <fieldset className="signup-container__field signup-container__fieldset">
          <legend className="signup-container__label">{signupData.genderLabel}</legend>
          <div className="signup-container__gender-group" role="radiogroup" aria-label={signupData.genderLabel}>
            {signupData.genderOptions.map((option: { value: string; label: string }) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={gender === option.value}
                className={`signup-container__gender-btn${gender === option.value ? ' signup-container__gender-btn--active' : ''}`}
                onClick={() => setGender(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 약관 동의 */}
        <div className="signup-container__agreements">
          <label className="signup-container__checkbox">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="signup-container__checkbox-label">{signupData.agreeTerms}</span>
          </label>

          <label className="signup-container__checkbox">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            <span className="signup-container__checkbox-label">{signupData.agreePrivacy}</span>
          </label>
        </div>

        <button
          type="submit"
          className="signup-container__submit"
          disabled={!agreeTerms || !agreePrivacy || password !== passwordConfirm || passwordConfirm.length === 0}
        >
          {signupData.submitLabel}
        </button>
      </form>

      {/* 로그인으로 돌아가기 */}
      <div className="signup-container__footer">
        <span className="signup-container__footer-text">{signupData.hasAccountText ?? '이미 계정이 있으신가요?'}</span>
        <a href="/auth/login" className="signup-container__footer-link">
          {modalData.backToLoginLabel ?? '로그인으로 돌아가기'}
        </a>
      </div>
    </section>
  );
}
