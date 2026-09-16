'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from './NotesPage.module.css';

interface NotesClientProps {
  tag: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: async () => {
      const fetchFn = fetchNotes as unknown as (params: {
        page: number;
        search: string;
        tag: string;
      }) => Promise<FetchNotesResponse>;

      return await fetchFn({
        page,
        search: debouncedSearch,
        tag,
      });
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <div>Loading notes...</div>;
  if (isError) return <div>Error fetching notes</div>;

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create Note +
        </Link>
      </div>

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <div className={css.empty}>No notes found</div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
