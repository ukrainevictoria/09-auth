'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import { Note } from '@/types/note';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (!notes || notes.length === 0) {
    return <div>No notes available</div>;
  }

  return (
    <ul>
      {notes.map((note) => {
        const item = note as unknown as {
          id?: string;
          _id?: string;
          title: string;
          content: string;
          tag?: string;
        };
        const noteId = (item.id || item._id) as string;

        return (
          <li key={noteId}>
            <Link href={`/notes/${noteId}`}>
              <h3>{note.title}</h3>
            </Link>
            <p>{note.content}</p>
            {note.tag && <span>#{note.tag}</span>}
            <button onClick={() => deleteMutation.mutate(noteId)}>
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
