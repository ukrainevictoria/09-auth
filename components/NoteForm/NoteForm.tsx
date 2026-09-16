'use client';

import { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft.title?.trim() || !draft.tag) return;

    createMutation.mutate({
      title: draft.title,
      content: draft.content || '',
      tag: draft.tag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.fieldGroup}>
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={draft.title || ''}
          onChange={handleChange}
          className={css.input}
          required
        />
      </div>

      <div className={css.fieldGroup}>
        <textarea
          name="content"
          placeholder="Note content..."
          value={draft.content || ''}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>

      <div className={css.fieldGroup}>
        <select
          name="tag"
          value={draft.tag || ''}
          onChange={handleChange}
          className={css.select}
          required
        >
          <option value="" disabled>
            Select Tag
          </option>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className={css.submitButton}
        >
          {createMutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
