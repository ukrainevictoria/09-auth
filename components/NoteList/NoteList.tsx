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
      {notes.map((note) => (
        <li key={note.id}>
          <Link href={`/notes/${note.id}`}>
            <h3>{note.title}</h3>
          </Link>
          <p>{note.content}</p>
          <span>#{note.tag}</span>
          <button onClick={() => deleteMutation.mutate(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
