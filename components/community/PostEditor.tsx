/**
 * 게시글 에디터 (PostEditor)
 * - 게시글 작성/수정 폼 컴포넌트
 * - isEdit prop이 true이면 기존 데이터를 slug로 불러와 수정 모드로 동작한다
 * - Tiptap 리치 텍스트 에디터를 사용한다
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import EditorToolbar from '@/components/community/EditorToolbar';

interface PostEditorProps {
  slug?: string;
  isEdit?: boolean;
}

const categories = [
  { value: '', label: '주제 선택' },
  { value: 'free', label: '자유' },
  { value: 'qna', label: '질문/답변' },
  { value: 'review', label: '수강후기' },
];

const subCategories: Record<string, { value: string; label: string }[]> = {
  free: [
    { value: 'daily', label: '일상' },
    { value: 'tip', label: '꿀팁 공유' },
    { value: 'etc', label: '기타' },
  ],
  qna: [
    { value: 'course', label: '강의 관련' },
    { value: 'tech', label: '기술 질문' },
    { value: 'career', label: '커리어' },
  ],
  review: [
    { value: 'lecture', label: '강의 후기' },
    { value: 'book', label: '도서 후기' },
  ],
};

export default function PostEditor({ slug, isEdit = false }: PostEditorProps) {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [title, setTitle] = useState('');

  void slug;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: '내용을 입력해주세요.',
      }),
    ],
    content: '',
    immediatelyRender: false,
  });

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setSubCategory('');
  }, []);

  const handleSubmit = useCallback(() => {
    // TODO: API 연동 — editor?.getHTML()로 본문 HTML 추출
    router.push('/community');
  }, [router]);

  const handleDraftSave = useCallback(() => {
    // TODO: 임시 저장 API 연동
  }, []);

  return (
    <div className="post-editor">
      {/* 상단 액션 바 */}
      <div className="post-editor__header">
        <button
          type="button"
          className="post-editor__back"
          onClick={() => router.back()}
        >
          &larr; 돌아가기
        </button>
        <div className="post-editor__header-actions">
          <button
            type="button"
            className="post-editor__draft-btn"
            onClick={handleDraftSave}
          >
            임시 저장
          </button>
          <button
            type="button"
            className="post-editor__submit-btn"
            onClick={handleSubmit}
          >
            {isEdit ? '수정하기' : '등록하기'}
          </button>
        </div>
      </div>

      <div className="post-editor__layout">
        {/* 왼쪽: 폼 */}
        <div className="post-editor__form">
          {/* 주제 선택 */}
          <div className="post-editor__field">
            <label className="post-editor__label">
              주제 <span className="post-editor__required">*</span>
            </label>
            <div className="post-editor__select-row">
              <select
                className="post-editor__select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="주제 선택"
              >
                {categories.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                className="post-editor__select post-editor__select--sub"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!category || !subCategories[category]}
                aria-label="하위 주제 선택"
              >
                <option value="">하위 주제 선택</option>
                {category && subCategories[category]?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 제목 */}
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-title">
              제목 <span className="post-editor__required">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              className="post-editor__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
            />
          </div>

          {/* 투표 */}
          <div className="post-editor__field">
            <label className="post-editor__label">투표</label>
            <button type="button" className="post-editor__vote-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="10" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="7.5" y="6" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="13" y="2" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              투표 만들기
            </button>
          </div>

          {/* 내용 (Tiptap 에디터) */}
          <div className="post-editor__field">
            <label className="post-editor__label">
              내용 <span className="post-editor__required">*</span>
            </label>

            {/* 툴바 */}
            <EditorToolbar editor={editor} />

            {/* Tiptap 에디터 본문 */}
            <EditorContent editor={editor} className="post-editor__content" />
          </div>
        </div>

        {/* 오른쪽: 유의사항 */}
        <aside className="post-editor__sidebar">
          <div className="post-editor__notice">
            <h3 className="post-editor__notice-title">글 작성 시 유의사항</h3>
            <ul className="post-editor__notice-list">
              <li>
                과제 제출은 <strong>내 강의실</strong>에서만 제출 가능합니다.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
