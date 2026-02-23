/**
 * 인증 트리거 (AuthTrigger)
 * - 로그인/회원가입 버튼을 렌더링하고, 클릭 시 AuthModal을 띄운다
 * - AppHeader 상단바의 auth 영역을 대체한다
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import AuthModal from '@/components/auth/AuthModal';

interface AuthTriggerProps {
  loginLabel: string;
  signupLabel: string;
}

export default function AuthTrigger({ loginLabel, signupLabel }: AuthTriggerProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <div className="app-header__auth">
        <button
          type="button"
          className="app-header__auth-link"
          onClick={openModal}
        >
          {loginLabel}
        </button>
        <button
          type="button"
          className="app-header__auth-link app-header__auth-link--signup"
          onClick={openModal}
        >
          {signupLabel}
        </button>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
