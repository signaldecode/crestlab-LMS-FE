/**
 * 인증 모달 (AuthModal)
 * - 로그인 버튼 클릭 시 표시되는 모달 (로그인 전용)
 * - 회원가입은 /auth/signup 페이지로 분리
 * - 아이디/비밀번호 자체 로그인
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import Modal from '@/components/layout/Modal';
import useAuth from '@/hooks/useAuth';
import { getMainData } from '@/lib/data';
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
async function mockLogin(username: string, _password: string) {
  return {
    user: {
      id: 'user-' + Date.now(),
      username,
      name: username,
      nickname: username,
      email: '',
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

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const resetForm = useCallback(() => {
    setLoginUsername('');
    setLoginPassword('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    const result = await mockLogin(loginUsername, loginPassword);
    login(result.user, result.token);
    resetForm();
    onClose();
  }, [loginUsername, loginPassword, login, resetForm, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" closeOnOverlayClick={false}>
      <div className="auth-modal">
        <h2 className="auth-modal__title">{siteName}</h2>

        <p className="auth-modal__subtitle">
          {modalData.subtitle}
        </p>

        {/* 아이디/비밀번호 폼 */}
        <form className="auth-modal__form" onSubmit={handleLogin}>
          <input
            type="text"
            className="auth-modal__input"
            placeholder={loginData?.usernamePlaceholder}
            aria-label={loginData?.usernameLabel}
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
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
            {modalData.signupLabel}
          </Link>
        </div>
      </div>
    </Modal>
  );
}
