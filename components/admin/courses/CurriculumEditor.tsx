/**
 * 관리자 커리큘럼 편집기 (CurriculumEditor)
 * - 섹션(Section) → 강의(Lecture) 2단 계층을 drag & drop으로 정렬한다
 * - CRUD: 생성/수정/삭제/정렬 각각 lib/adminApi 엔드포인트에 매핑
 * - 섹션 정렬: reorderAdminSections (PUT /courses/{courseId}/sections/order)
 * - 강의 정렬: reorderAdminLectures (PUT /sections/{sectionId}/lectures/order)
 *
 * 문구/라벨은 모두 props로 주입 (data/*.json에서 관리)
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createAdminLecture,
  createAdminSection,
  deleteAdminLecture,
  deleteAdminSection,
  fetchAdminCourseCurriculum,
  reorderAdminLectures,
  reorderAdminSections,
  updateAdminLecture,
  updateAdminSection,
  type AdminLecture,
  type AdminSectionWithLectures,
} from '@/lib/adminApi';
import VideoEncodingStatus, {
  type VideoEncodingStatusCopy,
} from '@/components/admin/courses/VideoEncodingStatus';
import LectureVideoUpload, {
  type LectureVideoUploadCopy,
} from '@/components/admin/courses/LectureVideoUpload';

export interface CurriculumEditorCopy extends LectureVideoUploadCopy {
  addSectionLabel: string;
  addLectureLabel: string;
  sectionTitlePlaceholder: string;
  lectureTitlePlaceholder: string;
  editLabel: string;
  deleteLabel: string;
  saveLabel: string;
  cancelLabel: string;
  dragHandleLabel: string;
  previewToggleLabel: string;
  emptySectionsText: string;
  emptyLecturesText: string;
  loadErrorText: string;
  confirmDeleteSectionText: string;
  confirmDeleteLectureText: string;
  encoding: VideoEncodingStatusCopy;
}

interface Props {
  courseId: number;
  copy: CurriculumEditorCopy;
}

export default function CurriculumEditor({ courseId, copy }: Props): JSX.Element {
  const [sections, setSections] = useState<AdminSectionWithLectures[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminCourseCurriculum(courseId);
        if (!cancelled) {
          setSections([...data].sort((a, b) => a.sortOrder - b.sortOrder));
        }
      } catch {
        if (!cancelled) setLoadError(copy.loadErrorText);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [courseId, copy.loadErrorText]);

  const handleAddSection = useCallback(async () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    const nextOrder = sections.length + 1;
    const created = await createAdminSection(courseId, { title, sortOrder: nextOrder });
    setSections((prev) => [...prev, { ...created, lectures: [] }]);
    setNewSectionTitle('');
    setAddingSection(false);
  }, [courseId, newSectionTitle, sections.length]);

  const handleSectionDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const next = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        sortOrder: i + 1,
      }));
      setSections(next);

      const payload = next.map((s) => ({ id: s.id, sortOrder: s.sortOrder }));
      void reorderAdminSections(courseId, { sectionOrders: payload });
    },
    [courseId, sections],
  );

  const updateSectionLocal = useCallback(
    (id: number, patch: Partial<AdminSectionWithLectures>) => {
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    },
    [],
  );

  const handleSectionSave = useCallback(
    async (id: number, title: string) => {
      const updated = await updateAdminSection(courseId, id, { title });
      updateSectionLocal(id, { title: updated.title });
    },
    [courseId, updateSectionLocal],
  );

  const handleSectionDelete = useCallback(
    async (id: number) => {
      if (!window.confirm(copy.confirmDeleteSectionText)) return;
      await deleteAdminSection(courseId, id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    },
    [courseId, copy.confirmDeleteSectionText],
  );

  const handleLectureChange = useCallback(
    (sectionId: number, lectures: AdminLecture[]) => {
      updateSectionLocal(sectionId, { lectures });
    },
    [updateSectionLocal],
  );

  if (loading) return <p className="curriculum-editor__loading">…</p>;
  if (loadError) return <p className="curriculum-editor__error">{loadError}</p>;

  return (
    <div className="curriculum-editor">
      {sections.length === 0 ? (
        <p className="curriculum-editor__empty">{copy.emptySectionsText}</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ul className="curriculum-editor__section-list">
              {sections.map((section) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  copy={copy}
                  onSave={handleSectionSave}
                  onDelete={handleSectionDelete}
                  onLecturesChange={(lectures) => handleLectureChange(section.id, lectures)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {addingSection ? (
        <div className="curriculum-editor__add-form">
          <input
            type="text"
            className="curriculum-editor__input"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder={copy.sectionTitlePlaceholder}
            autoFocus
          />
          <button type="button" className="curriculum-editor__btn curriculum-editor__btn--primary" onClick={handleAddSection}>
            {copy.saveLabel}
          </button>
          <button
            type="button"
            className="curriculum-editor__btn"
            onClick={() => { setAddingSection(false); setNewSectionTitle(''); }}
          >
            {copy.cancelLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="curriculum-editor__btn curriculum-editor__btn--add"
          onClick={() => setAddingSection(true)}
        >
          + {copy.addSectionLabel}
        </button>
      )}
    </div>
  );
}

/* ──────────── Section Row ──────────── */

interface SectionRowProps {
  section: AdminSectionWithLectures;
  copy: CurriculumEditorCopy;
  onSave: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onLecturesChange: (lectures: AdminLecture[]) => void;
}

function SectionRow({ section, copy, onSave, onDelete, onLecturesChange }: SectionRowProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(section.title);
  const [addingLecture, setAddingLecture] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleSave = async () => {
    const title = draftTitle.trim();
    if (!title || title === section.title) {
      setEditing(false);
      setDraftTitle(section.title);
      return;
    }
    await onSave(section.id, title);
    setEditing(false);
  };

  const handleAddLecture = async () => {
    const title = newLectureTitle.trim();
    if (!title) return;
    const nextOrder = section.lectures.length + 1;
    const created = await createAdminLecture(section.id, {
      title,
      sortOrder: nextOrder,
      isPreview: false,
      durationSeconds: 0,
    });
    onLecturesChange([...section.lectures, created]);
    setNewLectureTitle('');
    setAddingLecture(false);
  };

  return (
    <li ref={setNodeRef} style={style} className="curriculum-editor__section">
      <div className="curriculum-editor__section-header">
        <button
          type="button"
          className="curriculum-editor__drag-handle"
          aria-label={copy.dragHandleLabel}
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        {editing ? (
          <>
            <input
              type="text"
              className="curriculum-editor__input"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              autoFocus
            />
            <button type="button" className="curriculum-editor__btn curriculum-editor__btn--primary" onClick={handleSave}>
              {copy.saveLabel}
            </button>
            <button
              type="button"
              className="curriculum-editor__btn"
              onClick={() => { setEditing(false); setDraftTitle(section.title); }}
            >
              {copy.cancelLabel}
            </button>
          </>
        ) : (
          <>
            <span className="curriculum-editor__section-title">{section.title}</span>
            <button type="button" className="curriculum-editor__btn" onClick={() => setEditing(true)}>
              {copy.editLabel}
            </button>
            <button
              type="button"
              className="curriculum-editor__btn curriculum-editor__btn--danger"
              onClick={() => void onDelete(section.id)}
            >
              {copy.deleteLabel}
            </button>
          </>
        )}
      </div>

      <LectureList
        sectionId={section.id}
        lectures={section.lectures}
        copy={copy}
        onChange={onLecturesChange}
      />

      {addingLecture ? (
        <div className="curriculum-editor__add-form curriculum-editor__add-form--inner">
          <input
            type="text"
            className="curriculum-editor__input"
            value={newLectureTitle}
            onChange={(e) => setNewLectureTitle(e.target.value)}
            placeholder={copy.lectureTitlePlaceholder}
            autoFocus
          />
          <button type="button" className="curriculum-editor__btn curriculum-editor__btn--primary" onClick={handleAddLecture}>
            {copy.saveLabel}
          </button>
          <button
            type="button"
            className="curriculum-editor__btn"
            onClick={() => { setAddingLecture(false); setNewLectureTitle(''); }}
          >
            {copy.cancelLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="curriculum-editor__btn curriculum-editor__btn--add curriculum-editor__btn--inner"
          onClick={() => setAddingLecture(true)}
        >
          + {copy.addLectureLabel}
        </button>
      )}
    </li>
  );
}

/* ──────────── Lecture List ──────────── */

interface LectureListProps {
  sectionId: number;
  lectures: AdminLecture[];
  copy: CurriculumEditorCopy;
  onChange: (lectures: AdminLecture[]) => void;
}

function LectureList({ sectionId, lectures, copy, onChange }: LectureListProps): JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lectures.findIndex((l) => l.id === active.id);
    const newIndex = lectures.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(lectures, oldIndex, newIndex).map((l, i) => ({
      ...l,
      sortOrder: i + 1,
    }));
    onChange(next);
    void reorderAdminLectures(sectionId, {
      lectureOrders: next.map((l) => ({ id: l.id, sortOrder: l.sortOrder })),
    });
  };

  const handleUpdate = async (id: number, patch: { title: string; isPreview: boolean }) => {
    const updated = await updateAdminLecture(sectionId, id, patch);
    onChange(lectures.map((l) => (l.id === id ? updated : l)));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(copy.confirmDeleteLectureText)) return;
    await deleteAdminLecture(sectionId, id);
    onChange(lectures.filter((l) => l.id !== id));
  };

  const handleVideoLinked = (id: number, videoId: number) => {
    onChange(lectures.map((l) => (l.id === id ? { ...l, videoId } : l)));
  };

  if (lectures.length === 0) {
    return <p className="curriculum-editor__empty curriculum-editor__empty--inner">{copy.emptyLecturesText}</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={lectures.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <ul className="curriculum-editor__lecture-list">
          {lectures.map((lecture) => (
            <LectureRow
              key={lecture.id}
              lecture={lecture}
              copy={copy}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onVideoLinked={handleVideoLinked}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

/* ──────────── Lecture Row ──────────── */

interface LectureRowProps {
  lecture: AdminLecture;
  copy: CurriculumEditorCopy;
  onUpdate: (id: number, patch: { title: string; isPreview: boolean }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onVideoLinked: (id: number, videoId: number) => void;
}

function LectureRow({ lecture, copy, onUpdate, onDelete, onVideoLinked }: LectureRowProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lecture.id });
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(lecture.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleSave = async () => {
    const title = draftTitle.trim();
    if (!title) {
      setEditing(false);
      setDraftTitle(lecture.title);
      return;
    }
    await onUpdate(lecture.id, { title, isPreview: lecture.isPreview });
    setEditing(false);
  };

  const handleTogglePreview = async () => {
    await onUpdate(lecture.id, { title: lecture.title, isPreview: !lecture.isPreview });
  };

  return (
    <li ref={setNodeRef} style={style} className="curriculum-editor__lecture">
      <button
        type="button"
        className="curriculum-editor__drag-handle"
        aria-label={copy.dragHandleLabel}
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      {editing ? (
        <>
          <input
            type="text"
            className="curriculum-editor__input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
          />
          <button type="button" className="curriculum-editor__btn curriculum-editor__btn--primary" onClick={handleSave}>
            {copy.saveLabel}
          </button>
          <button
            type="button"
            className="curriculum-editor__btn"
            onClick={() => { setEditing(false); setDraftTitle(lecture.title); }}
          >
            {copy.cancelLabel}
          </button>
        </>
      ) : (
        <>
          <span className="curriculum-editor__lecture-title">{lecture.title}</span>
          {lecture.videoId != null && (
            <VideoEncodingStatus videoId={lecture.videoId} copy={copy.encoding} />
          )}
          <LectureVideoUpload
            lectureId={lecture.id}
            hasVideo={lecture.videoId != null}
            copy={copy}
            onLinked={(videoId) => onVideoLinked(lecture.id, videoId)}
          />
          <label className="curriculum-editor__preview">
            <input type="checkbox" checked={lecture.isPreview} onChange={handleTogglePreview} />
            <span>{copy.previewToggleLabel}</span>
          </label>
          <button type="button" className="curriculum-editor__btn" onClick={() => setEditing(true)}>
            {copy.editLabel}
          </button>
          <button
            type="button"
            className="curriculum-editor__btn curriculum-editor__btn--danger"
            onClick={() => void onDelete(lecture.id)}
          >
            {copy.deleteLabel}
          </button>
        </>
      )}
    </li>
  );
}
