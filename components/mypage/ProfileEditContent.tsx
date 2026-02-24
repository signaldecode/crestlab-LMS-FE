/**
 * 프로필 수정 콘텐츠 (ProfileEditContent)
 * - 닉네임 입력 + 중복확인
 * - 소개글 텍스트 입력
 * - 대표글 추가
 * - 프로필 완성도 사이드바
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { JSX, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import ProfileImage from '@/components/ui/ProfileImage';

export default function ProfileEditContent(): JSX.Element {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [profileImage, setProfileImage] = useState(user?.profileImage ?? '');

  // 프로필 완성도 계산
  const completionItems = [
    { label: '프로필 사진', done: !!profileImage },
    { label: '자기소개', done: bio.trim().length > 0 },
    { label: '대표글', done: false },
  ];
  const completionPercent = Math.round(
    (completionItems.filter((item) => item.done).length / completionItems.length) * 100,
  );

  const handleNicknameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameChecked(false);
    setNicknameError('');
  }, []);

  const handleNicknameCheck = useCallback(() => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    if (trimmed.length > 20) {
      setNicknameError('닉네임은 20자 이하여야 합니다.');
      return;
    }
    // TODO: 서버 중복확인 API 연동
    setNicknameChecked(true);
    setNicknameError('');
  }, [nickname]);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    if (!user) return;

    setUser({
      ...user,
      nickname: nickname.trim() || undefined,
      bio: bio.trim() || undefined,
      profileImage: profileImage || undefined,
    });

    router.push(`/mypage/${user.id}`);
  }, [user, nickname, bio, profileImage, setUser, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="profile-edit">
      {/* 돌아가기 */}
      <button type="button" className="profile-edit__back" onClick={handleBack}>
        &larr; 돌아가기
      </button>

      <h2 className="profile-edit__title">프로필 수정</h2>

      <div className="profile-edit__layout">
        {/* 왼쪽: 편집 폼 */}
        <div className="profile-edit__form">
          {/* 프로필 이미지 */}
          <div className="profile-edit__image-section">
            <button
              type="button"
              className="profile-edit__image-btn"
              onClick={handleImageClick}
              aria-label="프로필 사진 변경"
            >
              <ProfileImage
                src={profileImage || undefined}
                alt={user?.name ?? '프로필'}
                size={96}
              />
              <span className="profile-edit__image-overlay">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 16l1.5-4L14 3.5a1.5 1.5 0 012 0l.5.5a1.5 1.5 0 010 2L8 14.5 4 16z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-edit__image-input"
              onChange={handleImageChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* 닉네임 */}
          <div className="profile-edit__field">
            <div className="profile-edit__nickname-row">
              <input
                type="text"
                className={`profile-edit__input${nicknameError ? ' profile-edit__input--error' : ''}`}
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                aria-label="닉네임"
              />
              <button
                type="button"
                className="profile-edit__check-btn"
                onClick={handleNicknameCheck}
              >
                중복확인
              </button>
            </div>
            {nicknameError && (
              <p className="profile-edit__error">{nicknameError}</p>
            )}
            {nicknameChecked && !nicknameError && (
              <p className="profile-edit__success">사용 가능한 닉네임입니다.</p>
            )}
          </div>

          {/* 소개글 */}
          <div className="profile-edit__field">
            <textarea
              className="profile-edit__textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={`${user?.name ?? '회원'}님을 더 잘 이해할 수 있도록 소개를 남겨주세요.\n어떤 목표로 월부에서 활동 중인지, 현재 상황이나 관심사를 적어주시면\n비슷한 멤버들과 연결되고 더 풍부한 대화를 나눌 수 있어요.`}
              rows={6}
              aria-label="자기소개"
            />
          </div>

          {/* 대표글 */}
          <div className="profile-edit__featured">
            <div className="profile-edit__featured-header">
              <h3 className="profile-edit__featured-title">대표글</h3>
              <span className="profile-edit__featured-count">0</span>
            </div>

            <div className="profile-edit__featured-empty">
              <span className="profile-edit__featured-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="24" fill="#EEF2FF" />
                  <path
                    d="M20 18h8m-8 4h8m-8 4h5"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="profile-edit__featured-label">글 추가하기</p>
              <p className="profile-edit__featured-desc">
                나의 이야기를 보여줄 글을 골라
                <br />
                프로필에 고정해보세요.
              </p>
              <button
                type="button"
                className="profile-edit__featured-add"
                aria-label="대표글 추가"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 프로필 완성도 */}
        <aside className="profile-edit__sidebar">
          <div className="profile-edit__completion">
            <h3 className="profile-edit__completion-title">프로필 완성도</h3>
            <span className="profile-edit__completion-percent">{completionPercent}%</span>

            {/* 프로그레스 바 */}
            <div className="profile-edit__progress">
              <div className="profile-edit__progress-track">
                <div
                  className="profile-edit__progress-fill"
                  style={{ width: `${completionPercent}%` }}
                />
                <span
                  className="profile-edit__progress-label"
                  style={{ left: `${Math.max(completionPercent, 5)}%` }}
                >
                  완성도
                </span>
              </div>
              <div className="profile-edit__progress-labels">
                <span>부족해요</span>
                <span>평균</span>
                <span>만점이에요</span>
              </div>
            </div>

            <p className="profile-edit__completion-hint">
              정보를 더 채울수록 나와 비슷한 상황의 멤버들을 더 쉽게 만날 수 있어요.
            </p>

            {/* 체크리스트 */}
            <ul className="profile-edit__checklist">
              {completionItems.map((item) => (
                <li
                  key={item.label}
                  className={`profile-edit__checklist-item${item.done ? ' profile-edit__checklist-item--done' : ''}`}
                >
                  <span className="profile-edit__checklist-label">{item.label}</span>
                  <span className="profile-edit__checklist-icon" aria-hidden="true">
                    {item.done ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="2" />
                        <path d="M6 10l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#e5e7eb" strokeWidth="2" />
                      </svg>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="profile-edit__save-btn"
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
