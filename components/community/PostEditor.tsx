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

  const handleHeadingChange = useCallback((value: string) => {
    if (!editor) return;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(value) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, [editor]);

  const handleAddLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL을 입력하세요');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleAddImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const currentHeading = (() => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    return 'paragraph';
  })();

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
            <div className="post-editor__toolbar">
              <div className="post-editor__toolbar-group">
                <select
                  className="post-editor__toolbar-select"
                  aria-label="글꼴 크기"
                  value={currentHeading}
                  onChange={(e) => handleHeadingChange(e.target.value)}
                >
                  <option value="paragraph">기본</option>
                  <option value="1">제목1</option>
                  <option value="2">제목2</option>
                  <option value="3">제목3</option>
                </select>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('bold') ? ' is-active' : ''}`}
                  aria-label="굵게"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                  <b>B</b>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('italic') ? ' is-active' : ''}`}
                  aria-label="기울임"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                  <i>I</i>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('underline') ? ' is-active' : ''}`}
                  aria-label="밑줄"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                >
                  <u>U</u>
                </button>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className="post-editor__toolbar-btn"
                  aria-label="글자 색"
                  onClick={() => {
                    const color = window.prompt('색상 코드를 입력하세요 (예: #dc2626)');
                    if (color) editor?.chain().focus().setColor(color).run();
                  }}
                >
                  <span className="post-editor__toolbar-color post-editor__toolbar-color--red">A</span>
                </button>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive({ textAlign: 'left' }) ? ' is-active' : ''}`}
                  aria-label="왼쪽 정렬"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 6h8M2 9h12M2 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive({ textAlign: 'center' }) ? ' is-active' : ''}`}
                  aria-label="가운데 정렬"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M4 6h8M2 9h12M4 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('orderedList') ? ' is-active' : ''}`}
                  aria-label="순서 목록"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3h8M6 8h8M6 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M2 3h1M2 8h1M2 13h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('bulletList') ? ' is-active' : ''}`}
                  aria-label="비순서 목록"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3h8M6 8h8M6 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="2.5" cy="3" r="1" fill="currentColor" /><circle cx="2.5" cy="8" r="1" fill="currentColor" /><circle cx="2.5" cy="13" r="1" fill="currentColor" /></svg>
                </button>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className="post-editor__toolbar-btn"
                  aria-label="구분선"
                  onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('blockquote') ? ' is-active' : ''}`}
                  aria-label="인용"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5h4v4H5l-1 3M9 5h4v4h-2l-1 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <span className="post-editor__toolbar-divider" />
              <div className="post-editor__toolbar-group">
                <button
                  type="button"
                  className="post-editor__toolbar-btn"
                  aria-label="이미지"
                  onClick={handleAddImage}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><circle cx="5.5" cy="5.5" r="1.25" stroke="currentColor" strokeWidth="1" /><path d="M2 11l3-3 2 2 3-3 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  type="button"
                  className={`post-editor__toolbar-btn${editor?.isActive('link') ? ' is-active' : ''}`}
                  aria-label="링크"
                  onClick={handleAddLink}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 9l2-2M5.5 10.5a2.5 2.5 0 010-3.5l1-1a2.5 2.5 0 013.5 0M9.5 5.5a2.5 2.5 0 010 3.5l-1 1a2.5 2.5 0 01-3.5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>

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
