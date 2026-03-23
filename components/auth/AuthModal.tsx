/**
 * 인증 모달 (AuthModal)
 * - 로그인 버튼 클릭 시 표시되는 모달 (로그인 전용)
 * - 회원가입은 /auth/signup 페이지로 분리
 * - 소셜 로그인(카카오, 네이버, 구글, 애플) + 이메일/비밀번호 폼
 * - 기존 Modal 컴포넌트를 래핑한다
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import Modal from '@/components/layout/Modal';
import useAuth from '@/hooks/useAuth';
import { getMainData } from '@/lib/data';
import { redirectToOAuth } from '@/lib/oauth';
import pagesData from '@/data/pagesData.json';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalData = pagesData.auth.modal;

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

export default function AuthModal({ isOpen, onClose }: AuthModalProps): JSX.Element | null {
  const data = getMainData();
  const siteName = data.site.name;
  const loginData = (data.pages as Record<string, Record<string, Record<string, string>>>)?.auth?.login;

  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const resetForm = useCallback(() => {
    setLoginEmail('');
    setLoginPassword('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    const result = await mockLogin(loginEmail, loginPassword);
    login(result.user, result.token);
    resetForm();
    onClose();
  }, [loginEmail, loginPassword, login, resetForm, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" closeOnOverlayClick={false}>
      <div className="auth-modal">
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
            {loginData?.socialKakao ?? modalData.socialKakaoLabel}
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
          <Link href="/auth/signup" className="auth-modal__link" onClick={handleClose}>
            {modalData.emailSignupLabel}
          </Link>
        </div>
      </div>
    </Modal>
  );
}
