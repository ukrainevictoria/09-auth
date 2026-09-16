'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading)
    return (
      <Modal onClose={handleClose}>
        <div>Loading...</div>
      </Modal>
    );
  if (isError || !note)
    return (
      <Modal onClose={handleClose}>
        <div>Error loading note</div>
      </Modal>
    );

  return (
    <Modal onClose={handleClose}>
      <div className={css.content}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <div>Tag: {note.tag}</div>
        {note.createdAt && (
          <div>Created: {new Date(note.createdAt).toLocaleDateString()}</div>
        )}
      </div>
    </Modal>
  );
}
