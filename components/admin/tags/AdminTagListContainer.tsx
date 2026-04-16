/**
 * 관리자 태그 목록/CRUD 컨테이너 (AdminTagListContainer)
 * - 평면 구조(카테고리와 달리 부모/자식 없음). 백엔드는 이름 오름차순 정렬로 반환.
 * - 생성/이름 수정/삭제를 지원. 태그 삭제 시 연결된 강좌-태그 매핑은 함께 제거되고 강좌는 유지된다.
 * - 백엔드 API: /api/v1/admin/tags
 */

'use client';

import { useState } from 'react';
import type { JSX, ChangeEvent, FormEvent } from 'react';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAdminTag,
  fetchAdminTags,
  updateAdminTag,
  type AdminTagNode,
} from '@/lib/adminApi';

export interface TagsCopy {
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonAriaLabel: string;
  columns: {
    id: string;
    name: string;
    actions: string;
  };
  actionLabels: { edit: string; delete: string };
  emptyText: string;
  createModal: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    nameRequiredError: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  editModal: {
    titleTemplate: string;
    nameLabel: string;
    nameRequiredError: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  deleteModal: {
    title: string;
    descriptionTemplate: string;
    confirmLabel: string;
    cancelLabel: string;
  };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props { copy: TagsCopy; common: CommonCopy; }

export default function AdminTagListContainer({ copy, common }: Props): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminTags, []);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminTagNode | null>(null);

  const tags = data ?? [];

  if (loading && !data) return <AdminLoading label={common.loadingText} />;
  if (error && !data) {
    return (
      <AdminError
        title={common.errorTitle}
        message={error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          className="admin-list__cta-btn"
          aria-label={copy.createButtonAriaLabel}
          onClick={() => setCreateOpen(true)}
        >
          {copy.createButtonLabel}
        </button>
      </header>

      {tags.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.id}</th>
                <th scope="col" className="admin-list__th">{copy.columns.name}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td className="admin-list__td admin-list__td--narrow">{tag.id}</td>
                  <td className="admin-list__td admin-list__td--strong">{tag.name}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <AdminActionButton onClick={() => setEditTarget(tag)}>
                      {copy.actionLabels.edit}
                    </AdminActionButton>
                    <AdminDeleteAction
                      targetId={tag.id}
                      resource="tag"
                      onDeleted={refetch}
                      buttonLabel={copy.actionLabels.delete}
                      modalTitle={copy.deleteModal.title}
                      modalDescription={copy.deleteModal.descriptionTemplate.replaceAll('{name}', tag.name)}
                      confirmLabel={copy.deleteModal.confirmLabel}
                      cancelLabel={copy.deleteModal.cancelLabel}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && (
        <CreateTagModal
          copy={copy.createModal}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            refetch();
          }}
        />
      )}

      {editTarget && (
        <EditTagModal
          copy={copy.editModal}
          target={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => {
            setEditTarget(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

interface CreateTagModalProps {
  copy: TagsCopy['createModal'];
  onClose: () => void;
  onSuccess: () => void;
}

function CreateTagModal({ copy, onClose, onSuccess }: CreateTagModalProps): JSX.Element {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(copy.nameRequiredError);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createAdminTag({ name: name.trim() });
      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal isOpen onClose={onClose} title={copy.title} size="sm">
      <form onSubmit={handleSubmit} className="admin-modal__form">
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.nameLabel}</span>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder={copy.namePlaceholder}
            className="admin-modal__input"
            maxLength={50}
            autoFocus
          />
        </label>

        {formError && <p className="admin-modal__error" role="alert">{formError}</p>}

        <footer className="admin-modal__footer">
          <button type="button" onClick={onClose} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.cancelLabel}
          </button>
          <button type="submit" disabled={submitting} className="admin-modal__btn admin-modal__btn--primary">
            {copy.confirmLabel}
          </button>
        </footer>
      </form>
    </AdminModal>
  );
}

interface EditTagModalProps {
  copy: TagsCopy['editModal'];
  target: AdminTagNode;
  onClose: () => void;
  onSuccess: () => void;
}

function EditTagModal({ copy, target, onClose, onSuccess }: EditTagModalProps): JSX.Element {
  const [name, setName] = useState(target.name);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const title = copy.titleTemplate.replaceAll('{name}', target.name);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(copy.nameRequiredError);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await updateAdminTag(target.id, { name: name.trim() });
      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal isOpen onClose={onClose} title={title} size="sm">
      <form onSubmit={handleSubmit} className="admin-modal__form">
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.nameLabel}</span>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="admin-modal__input"
            maxLength={50}
            autoFocus
          />
        </label>

        {formError && <p className="admin-modal__error" role="alert">{formError}</p>}

        <footer className="admin-modal__footer">
          <button type="button" onClick={onClose} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.cancelLabel}
          </button>
          <button type="submit" disabled={submitting} className="admin-modal__btn admin-modal__btn--primary">
            {copy.confirmLabel}
          </button>
        </footer>
      </form>
    </AdminModal>
  );
}
