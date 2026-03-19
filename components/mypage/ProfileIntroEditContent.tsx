/**
 * 프로필 소개글 편집 콘텐츠 (ProfileIntroEditContent)
 * - 커버 이미지 + 프로필 이미지 편집
 * - 닉네임 수정 + 중복확인
 * - 소개문구 작성 (textarea)
 * - 대표글 관리
 * - 우측 프로필 완성도 진행률 카드
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import useAuthStore from '@/stores/useAuthStore';
import useMyPageStore from '@/stores/useMyPageStore';
import accountData from '@/data/accountData.json';

const editData = accountData.mypage.profileIntroEdit;
const introData = accountData.mypage.profileIntro;

export default function ProfileIntroEditContent(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setActiveSection = useMyPageStore((s) => s.setActiveSection);

  // 닉네임
  const [nickname, setNickname] = useState(user?.nickname ?? user?.name ?? '');

  // 소개문구
  const [bio, setBio] = useState(user?.bio ?? '');

  // 이미지 미리보기 (실제 업로드는 API 연동 시 구현)
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profileImage ?? null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 완성도 계산
  const completedItems = [
    !!profilePreview,
    !!coverPreview,
    bio.trim().length > 0,
    (user?.featuredPostIds?.length ?? 0) > 0,
  ];
  const completedCount = completedItems.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / completedItems.length) * 100);

  // SVG 원형 진행률 바 계산
  const circleRadius = 70;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }, []);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePreview(url);
  }, []);

  const handleSave = useCallback(() => {
    if (!user) return;
    setUser({
      ...user,
      nickname,
      bio,
    });
    setActiveSection('profile');
  }, [user, nickname, bio, setUser, setActiveSection]);

  return (
    <div className="profile-intro-edit">
      <div className="profile-intro-edit__main">
        {/* 커버 + 프로필 이미지 */}
        <div className="profile-intro-edit__cover-area">
          <div className="profile-intro-edit__cover">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt=""
                fill
                className="profile-intro-edit__cover-img"
              />
            ) : (
              <div className="profile-intro-edit__cover-placeholder" />
            )}
          </div>
          <div className="profile-intro-edit__avatar-wrap">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt=""
                width={80}
                height={80}
                className="profile-intro-edit__avatar-img"
              />
            ) : (
              <div className="profile-intro-edit__avatar profile-intro-edit__avatar--default">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 이미지 편집 버튼 */}
        <div className="profile-intro-edit__image-actions">
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            className="profile-intro-edit__file-input"
            onChange={handleProfileChange}
            aria-label={editData.profileImageEditLabel}
          />
          <button
            type="button"
            className="profile-intro-edit__image-btn"
            onClick={() => profileInputRef.current?.click()}
          >
            {editData.profileImageEditLabel}
          </button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="profile-intro-edit__file-input"
            onChange={handleCoverChange}
            aria-label={editData.coverImageEditLabel}
          />
          <button
            type="button"
            className="profile-intro-edit__image-btn profile-intro-edit__image-btn--primary"
            onClick={() => coverInputRef.current?.click()}
          >
            {editData.coverImageEditLabel}
          </button>
        </div>

        {/* 닉네임 수정 */}
        <div className="profile-intro-edit__section">
          <h3 className="profile-intro-edit__section-title">{editData.nicknameTitle}</h3>
          <div className="profile-intro-edit__nickname-field">
            <input
              type="text"
              className="profile-intro-edit__input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={editData.nicknamePlaceholder}
              aria-label={editData.nicknameTitle}
            />
            <button type="button" className="profile-intro-edit__check-btn">
              {editData.nicknameDuplicateCheckLabel}
            </button>
          </div>
        </div>

        {/* 소개문구 */}
        <div className="profile-intro-edit__section">
          <h3 className="profile-intro-edit__section-title">{editData.bioTitle}</h3>
          <textarea
            className="profile-intro-edit__textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={editData.bioPlaceholder}
            aria-label={editData.bioTitle}
            rows={6}
          />
        </div>

        {/* 대표글 */}
        <div className="profile-intro-edit__section">
          <div className="profile-intro-edit__featured-header">
            <h3 className="profile-intro-edit__section-title">{editData.featuredTitle}</h3>
            <span className="profile-intro-edit__featured-count">
              {user?.featuredPostIds?.length ?? 0}
            </span>
          </div>

          <div className="profile-intro-edit__featured-empty">
            <p className="profile-intro-edit__featured-label">{introData.featuredAddLabel}</p>
            <p className="profile-intro-edit__featured-desc">
              {editData.featuredAddDescLine1}
              <br />
              {editData.featuredAddDescLine2}
            </p>
            <button type="button" className="profile-intro-edit__featured-add-btn">
              {editData.featuredAddBtnLabel}
            </button>
          </div>
        </div>
      </div>

      {/* 우측 프로필 완성도 카드 */}
      <aside className="profile-intro-edit__progress-card">
        <h3 className="profile-intro-edit__progress-title">{editData.progressTitle}</h3>

        {/* 원형 진행률 */}
        <div className="profile-intro-edit__progress-circle">
          <svg viewBox="0 0 160 160" className="profile-intro-edit__progress-svg">
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="profile-intro-edit__progress-track"
            />
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              className="profile-intro-edit__progress-fill"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <span className="profile-intro-edit__progress-text">{progressPercent}%</span>
        </div>

        {/* 체크리스트 */}
        <ul className="profile-intro-edit__checklist">
          {editData.progressItems.map((item, i) => (
            <li
              key={item.key}
              className={`profile-intro-edit__checklist-item${completedItems[i] ? ' profile-intro-edit__checklist-item--done' : ''}`}
            >
              <span className="profile-intro-edit__checklist-label">{item.label}</span>
              <span className="profile-intro-edit__checklist-icon">
                {completedItems[i] ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="profile-intro-edit__save-btn"
          onClick={handleSave}
        >
          {editData.saveLabel}
        </button>
      </aside>
    </div>
  );
}
