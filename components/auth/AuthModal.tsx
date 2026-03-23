/**
 * 인증 모달 (AuthModal)
 * - 로그인/회원가입 버튼 클릭 시 표시되는 모달
 * - mode 상태로 로그인 ↔ 회원가입 폼을 전환한다
 * - 소셜 로그인(카카오, 네이버, 구글, 애플) + 이메일/비밀번호 폼
 * - 기존 Modal 컴포넌트를 래핑한다
 */

'use client';

import { useState, useCallback, useEffect, type JSX } from 'react';
import Modal from '@/components/layout/Modal';
import useAuth from '@/hooks/useAuth';
import { getMainData } from '@/lib/data';
import { redirectToOAuth } from '@/lib/oauth';
import pagesData from '@/data/pagesData.json';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const modalData = pagesData.auth.modal;
const signupData = pagesData.auth.signup;

/**
 * 임시 로그인 처리 — 나중에 실제 API 호출로 교체한다
 * TODO: POST /api/auth/login 으로 교체
 */
async function mockLogin(email: string, _password: string) {
  return {
    user: {
      id: 'user-' + Date.now(),
      username: email.split('@')[0],
      name: email.split('@')[0],
      nickname: email.split('@')[0],
      email,
      bio: '',
    },
    token: 'mock-token-' + Date.now(),
  };
}

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

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps): JSX.Element | null {
  const data = getMainData();
  const siteName = data.site.name;
  const loginData = (data.pages as Record<string, Record<string, Record<string, string>>>)?.auth?.login;

  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // initialMode prop 변경 시 mode 동기화
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // 로그인 폼 상태
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 회원가입 폼 상태
  const [signupName, setSignupName] = useState('');
  const [signupNickname, setSignupNickname] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupBirthday, setSignupBirthday] = useState('');
  const [signupGender, setSignupGender] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const resetForm = useCallback(() => {
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupNickname('');
    setSignupUsername('');
    setSignupPassword('');
    setSignupBirthday('');
    setSignupGender('');
    setAgreeTerms(false);
    setAgreePrivacy(false);
  }, []);

  const switchMode = useCallback((nextMode: AuthMode) => {
    resetForm();
    setMode(nextMode);
  }, [resetForm]);

  const handleClose = useCallback(() => {
    resetForm();
    setMode('login');
    onClose();
  }, [resetForm, onClose]);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    const result = await mockLogin(loginEmail, loginPassword);
    login(result.user, result.token);
    resetForm();
    onClose();
  }, [loginEmail, loginPassword, login, resetForm, onClose]);

  const handleSignup: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    const result = await mockSignup({
      name: signupName,
      nickname: signupNickname,
      username: signupUsername,
      password: signupPassword,
      birthday: signupBirthday,
      gender: signupGender,
    });
    login(result.user, result.token);
    resetForm();
    onClose();
  }, [signupName, signupNickname, signupUsername, signupPassword, signupBirthday, signupGender, login, resetForm, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="auth-modal">
        {mode === 'login' ? (
          <>
            {/* ── 로그인 뷰 ── */}
            <h2 className="auth-modal__title">{siteName}</h2>

            <p className="auth-modal__subtitle">
              {modalData.subtitle}
            </p>
            <p className="auth-modal__subtitle">
              <span className="auth-modal__highlight">{modalData.highlight}</span>
            </p>

            {/* 카카오 로그인 버튼 */}
            <div className="auth-modal__social">
              <button
                type="button"
                className="auth-modal__social-btn auth-modal__social-btn--kakao"
                onClick={() => redirectToOAuth('kakao')}
              >
                💬 {loginData?.socialKakao ?? modalData.socialKakaoLabel}
              </button>
            </div>

            {/* 소셜 아이콘 (네이버, 구글, 애플) */}
            <div className="auth-modal__social-icons">
              <button type="button" className="auth-modal__social-icon auth-modal__social-icon--naver" aria-label={modalData.socialNaverAriaLabel}>
                N
              </button>
              <button
                type="button"
                className="auth-modal__social-icon auth-modal__social-icon--google"
                aria-label={modalData.socialGoogleAriaLabel}
                onClick={() => redirectToOAuth('google')}
              >
                G
              </button>
              <button type="button" className="auth-modal__social-icon auth-modal__social-icon--apple" aria-label={modalData.socialAppleAriaLabel}>
                A
              </button>
            </div>

            {/* 이메일/비밀번호 폼 */}
            <form className="auth-modal__form" onSubmit={handleLogin}>
              <input
                type="email"
                className="auth-modal__input"
                placeholder={loginData?.emailPlaceholder}
                aria-label={loginData?.emailLabel}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                className="auth-modal__input"
                placeholder={loginData?.passwordPlaceholder}
                aria-label={loginData?.passwordLabel}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button type="submit" className="auth-modal__submit">
                {loginData?.submitLabel}
              </button>
            </form>

            {/* 하단 링크 */}
            <div className="auth-modal__links">
              <button type="button" className="auth-modal__link" onClick={() => {}}>
                {modalData.findAccountLabel}
              </button>
              <span className="auth-modal__divider">|</span>
              <button type="button" className="auth-modal__link" onClick={() => switchMode('signup')}>
                {modalData.emailSignupLabel}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── 회원가입 뷰 ── */}
            <h2 className="auth-modal__title">{signupData.title}</h2>

            <form className="auth-modal__form" onSubmit={handleSignup}>
              <label className="auth-modal__field">
                <span className="auth-modal__label">{signupData.nameLabel}</span>
                <input
                  type="text"
                  className="auth-modal__input"
                  placeholder={signupData.namePlaceholder}
                  aria-label={signupData.nameLabel}
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </label>

              <div className="auth-modal__field">
                <span className="auth-modal__label">{signupData.nicknameLabel}</span>
                <div className="auth-modal__input-with-btn">
                  <input
                    type="text"
                    className="auth-modal__input"
                    placeholder={signupData.nicknamePlaceholder}
                    aria-label={signupData.nicknameLabel}
                    value={signupNickname}
                    onChange={(e) => setSignupNickname(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-modal__check-btn"
                    aria-label={signupData.nicknameDuplicateCheckAriaLabel}
                    onClick={() => {
                      // TODO: GET /api/auth/check-nickname?nickname=... 으로 교체
                    }}
                  >
                    {signupData.nicknameDuplicateCheckLabel}
                  </button>
                </div>
              </div>

              <label className="auth-modal__field">
                <span className="auth-modal__label">{signupData.usernameLabel}</span>
                <input
                  type="text"
                  className="auth-modal__input"
                  placeholder={signupData.usernamePlaceholder}
                  aria-label={signupData.usernameLabel}
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
              </label>

              <label className="auth-modal__field">
                <span className="auth-modal__label">{signupData.passwordLabel}</span>
                <input
                  type="password"
                  className="auth-modal__input"
                  placeholder={signupData.passwordPlaceholder}
                  aria-label={signupData.passwordLabel}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </label>

              <label className="auth-modal__field">
                <span className="auth-modal__label">{signupData.birthdayLabel}</span>
                <input
                  type="date"
                  className="auth-modal__input"
                  placeholder={signupData.birthdayPlaceholder}
                  aria-label={signupData.birthdayLabel}
                  value={signupBirthday}
                  onChange={(e) => setSignupBirthday(e.target.value)}
                />
              </label>

              <fieldset className="auth-modal__field auth-modal__fieldset">
                <legend className="auth-modal__label">{signupData.genderLabel}</legend>
                <div className="auth-modal__gender-group" role="radiogroup" aria-label={signupData.genderLabel}>
                  {signupData.genderOptions.map((option: { value: string; label: string }) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={signupGender === option.value}
                      className={`auth-modal__gender-btn${signupGender === option.value ? ' auth-modal__gender-btn--active' : ''}`}
                      onClick={() => setSignupGender(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 약관 동의 */}
              <div className="auth-modal__agreements">
                <label className="auth-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className="auth-modal__checkbox-label">{signupData.agreeTerms}</span>
                </label>

                <label className="auth-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                  />
                  <span className="auth-modal__checkbox-label">{signupData.agreePrivacy}</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-modal__submit"
                disabled={!agreeTerms || !agreePrivacy}
              >
                {signupData.submitLabel}
              </button>
            </form>

            {/* 로그인으로 돌아가기 */}
            <div className="auth-modal__links">
              <button type="button" className="auth-modal__link" onClick={() => switchMode('login')}>
                {modalData.backToLoginLabel ?? '로그인으로 돌아가기'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
