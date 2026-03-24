/**
 * 에디터 툴바 (EditorToolbar)
 * - Tiptap 에디터의 서식 툴바를 분리한 컴포넌트
 * - PostEditor에서 사용한다
 */

'use client';

import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
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
  );
}
