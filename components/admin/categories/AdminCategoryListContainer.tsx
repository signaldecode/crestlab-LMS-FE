/**
 * 관리자 카테고리 목록/트리 관리 컨테이너 (AdminCategoryListContainer)
 * - 2단계 트리(대분류 → 소분류) 구조를 렌더링한다
 * - 대분류/소분류 추가, 이름/순서 수정, 삭제, 순서 이동(↑↓)을 지원
 * - 백엔드 API: /api/v1/admin/categories (tree, create, update, delete, order)
 */

'use client';

import { useCallback, useState } from 'react';
import type { JSX, ChangeEvent, FormEvent } from 'react';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAdminCategory,
  fetchAdminCategoryTree,
  reorderAdminCategories,
  updateAdminCategory,
  type AdminCategoryNode,
} from '@/lib/adminApi';

export interface CategoriesCopy {
  title: string;
  subtitle: string;
  createRootButtonLabel: string;
  createRootButtonAriaLabel: string;
  columns: {
    sortOrder: string;
    name: string;
    courseCount: string;
    childCount: string;
    actions: string;
  };
  actionLabels: {
    addChild: string;
    edit: string;
    delete: string;
    moveUp: string;
    moveDown: string;
  };
  unitLabels: { course: string; child: string };
  emptyText: string;
  createModal: {
    titleRoot: string;
    titleChildTemplate: string;
    nameLabel: string;
    namePlaceholder: string;
    nameRequiredError: string;
    sortOrderLabel: string;
    sortOrderHelp: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  editModal: {
    titleTemplate: string;
    nameLabel: string;
    nameRequiredError: string;
    sortOrderLabel: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  deleteModal: {
    title: string;
    descriptionTemplate: string;
    blockedWithCoursesTemplate: string;
    blockedWithChildrenTemplate: string;
    confirmLabel: string;
    cancelLabel: string;
  };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props { copy: CategoriesCopy; common: CommonCopy; }

type CreateTarget = { parentId: number | null; parentName: string | null };

export default function AdminCategoryListContainer({ copy, common }: Props): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminCategoryTree, []);

  const [createTarget, setCreateTarget] = useState<CreateTarget | null>(null);
  const [editTarget, setEditTarget] = useState<AdminCategoryNode | null>(null);

  const tree = [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleMove = useCallback(
    async (siblings: AdminCategoryNode[], index: number, direction: 'up' | 'down') => {
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= siblings.length) return;
      const reordered = [...siblings];
      [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
      await reorderAdminCategories({
        categoryOrders: reordered.map((n, i) => ({ id: n.id, sortOrder: i + 1 })),
      });
      refetch();
    },
    [refetch],
  );

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
          aria-label={copy.createRootButtonAriaLabel}
          onClick={() => setCreateTarget({ parentId: null, parentName: null })}
        >
          {copy.createRootButtonLabel}
        </button>
      </header>

      {tree.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table admin-category-tree">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.sortOrder}</th>
                <th scope="col" className="admin-list__th">{copy.columns.name}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.courseCount}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.childCount}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {tree.map((parent, pIdx) => {
                const children = [...(parent.children ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
                return (
                  <CategoryRows
                    key={parent.id}
                    parent={parent}
                    parentIndex={pIdx}
                    parentSiblings={tree}
                    childNodes={children}
                    copy={copy}
                    onCreateChild={(p) => setCreateTarget({ parentId: p.id, parentName: p.name })}
                    onEdit={(n) => setEditTarget(n)}
                    onMove={handleMove}
                    onDeleted={refetch}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {createTarget && (
        <CreateCategoryModal
          copy={copy.createModal}
          parent={createTarget}
          onClose={() => setCreateTarget(null)}
          onSuccess={() => {
            setCreateTarget(null);
            refetch();
          }}
        />
      )}

      {editTarget && (
        <EditCategoryModal
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

interface CategoryRowsProps {
  parent: AdminCategoryNode;
  parentIndex: number;
  parentSiblings: AdminCategoryNode[];
  childNodes: AdminCategoryNode[];
  copy: CategoriesCopy;
  onCreateChild: (parent: AdminCategoryNode) => void;
  onEdit: (node: AdminCategoryNode) => void;
  onMove: (siblings: AdminCategoryNode[], index: number, direction: 'up' | 'down') => void;
  onDeleted: () => void;
}

function CategoryRows({
  parent,
  parentIndex,
  parentSiblings,
  childNodes,
  copy,
  onCreateChild,
  onEdit,
  onMove,
  onDeleted,
}: CategoryRowsProps): JSX.Element {
  return (
    <>
      <CategoryRow
        node={parent}
        depth={0}
        siblingIndex={parentIndex}
        siblings={parentSiblings}
        canAddChild
        copy={copy}
        onCreateChild={() => onCreateChild(parent)}
        onEdit={() => onEdit(parent)}
        onMove={onMove}
        onDeleted={onDeleted}
      />
      {childNodes.map((child, cIdx) => (
        <CategoryRow
          key={child.id}
          node={child}
          depth={1}
          siblingIndex={cIdx}
          siblings={childNodes}
          canAddChild={false}
          copy={copy}
          onCreateChild={() => undefined}
          onEdit={() => onEdit(child)}
          onMove={onMove}
          onDeleted={onDeleted}
        />
      ))}
    </>
  );
}

interface CategoryRowProps {
  node: AdminCategoryNode;
  depth: 0 | 1;
  siblingIndex: number;
  siblings: AdminCategoryNode[];
  canAddChild: boolean;
  copy: CategoriesCopy;
  onCreateChild: () => void;
  onEdit: () => void;
  onMove: (siblings: AdminCategoryNode[], index: number, direction: 'up' | 'down') => void;
  onDeleted: () => void;
}

function CategoryRow({
  node,
  depth,
  siblingIndex,
  siblings,
  canAddChild,
  copy,
  onCreateChild,
  onEdit,
  onMove,
  onDeleted,
}: CategoryRowProps): JSX.Element {
  const childCount = node.children?.length ?? 0;
  const hasCourses = node.courseCount > 0;
  const hasChildren = childCount > 0;
  const deleteBlocked = hasCourses || hasChildren;

  const deleteDescription = hasCourses
    ? copy.deleteModal.blockedWithCoursesTemplate.replaceAll('{count}', String(node.courseCount))
    : hasChildren
      ? copy.deleteModal.blockedWithChildrenTemplate.replaceAll('{count}', String(childCount))
      : copy.deleteModal.descriptionTemplate.replaceAll('{name}', node.name);

  return (
    <tr className={`admin-category-tree__row admin-category-tree__row--depth-${depth}`}>
      <td className="admin-list__td admin-list__td--narrow">{node.sortOrder}</td>
      <td className="admin-list__td admin-list__td--strong">
        {depth === 1 && (
          <span className="admin-category-tree__branch" aria-hidden="true">└</span>
        )}
        <span className="admin-category-tree__name">{node.name}</span>
      </td>
      <td className="admin-list__td admin-list__td--num">
        {node.courseCount}
        {copy.unitLabels.course}
      </td>
      <td className="admin-list__td admin-list__td--num">
        {depth === 0 ? `${childCount}${copy.unitLabels.child}` : '—'}
      </td>
      <td className="admin-list__td admin-list__td--actions">
        <AdminActionButton
          onClick={() => onMove(siblings, siblingIndex, 'up')}
          disabled={siblingIndex === 0}
          ariaLabel={copy.actionLabels.moveUp}
        >
          ↑
        </AdminActionButton>
        <AdminActionButton
          onClick={() => onMove(siblings, siblingIndex, 'down')}
          disabled={siblingIndex === siblings.length - 1}
          ariaLabel={copy.actionLabels.moveDown}
        >
          ↓
        </AdminActionButton>
        {canAddChild && (
          <AdminActionButton onClick={onCreateChild}>
            {copy.actionLabels.addChild}
          </AdminActionButton>
        )}
        <AdminActionButton onClick={onEdit}>
          {copy.actionLabels.edit}
        </AdminActionButton>
        <AdminDeleteAction
          targetId={node.id}
          resource="category"
          onDeleted={onDeleted}
          buttonLabel={copy.actionLabels.delete}
          modalTitle={copy.deleteModal.title}
          modalDescription={deleteDescription}
          confirmLabel={deleteBlocked ? copy.deleteModal.cancelLabel : copy.deleteModal.confirmLabel}
          cancelLabel={copy.deleteModal.cancelLabel}
          variant={deleteBlocked ? 'primary' : 'danger'}
        />
      </td>
    </tr>
  );
}

interface CreateCategoryModalProps {
  copy: CategoriesCopy['createModal'];
  parent: CreateTarget;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateCategoryModal({ copy, parent, onClose, onSuccess }: CreateCategoryModalProps): JSX.Element {
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const title = parent.parentName
    ? copy.titleChildTemplate.replaceAll('{parent}', parent.parentName)
    : copy.titleRoot;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(copy.nameRequiredError);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createAdminCategory({
        name: name.trim(),
        parentId: parent.parentId ?? undefined,
        sortOrder,
      });
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
            placeholder={copy.namePlaceholder}
            className="admin-modal__input"
            autoFocus
          />
        </label>

        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.sortOrderLabel}</span>
          <input
            type="number"
            min={1}
            value={sortOrder}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSortOrder(Number(e.target.value))}
            className="admin-modal__input"
          />
          <span className="admin-modal__field-help">{copy.sortOrderHelp}</span>
        </label>

        {formError && <p className="admin-modal__error" role="alert">{formError}</p>}

        <footer className="admin-modal__footer">
          <button type="button" onClick={onClose} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.cancelLabel}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="admin-modal__btn admin-modal__btn--primary"
          >
            {copy.confirmLabel}
          </button>
        </footer>
      </form>
    </AdminModal>
  );
}

interface EditCategoryModalProps {
  copy: CategoriesCopy['editModal'];
  target: AdminCategoryNode;
  onClose: () => void;
  onSuccess: () => void;
}

function EditCategoryModal({ copy, target, onClose, onSuccess }: EditCategoryModalProps): JSX.Element {
  const [name, setName] = useState(target.name);
  const [sortOrder, setSortOrder] = useState(target.sortOrder);
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
      await updateAdminCategory(target.id, { name: name.trim(), sortOrder });
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
            autoFocus
          />
        </label>

        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.sortOrderLabel}</span>
          <input
            type="number"
            min={1}
            value={sortOrder}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSortOrder(Number(e.target.value))}
            className="admin-modal__input"
          />
        </label>

        {formError && <p className="admin-modal__error" role="alert">{formError}</p>}

        <footer className="admin-modal__footer">
          <button type="button" onClick={onClose} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.cancelLabel}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="admin-modal__btn admin-modal__btn--primary"
          >
            {copy.confirmLabel}
          </button>
        </footer>
      </form>
    </AdminModal>
  );
}
