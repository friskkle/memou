'use client';

import { deleteEntry, deleteJournal } from '@/src/lib/actions/journals';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState } from "react";
import React, { useRef } from "react";
import { ConfirmationModal } from "@/src/components/ui/ConfirmationModal";

export function DeleteEntryButton({entry_id}: {entry_id: number}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleDelete = () => {
    formRef.current?.requestSubmit();
    setIsModalOpen(false);
  };

  return (
    <div className='flex items-center justify-center  rounded bg-transparent hover:bg-[#e0e0e06a] transition-all duration-75'>
      <form action={deleteEntry.bind(null, entry_id)} ref={formRef}>
        <input type="hidden" name="entry_id" value={entry_id} />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-2 text-red-600 font-bold"
        >
          <DeleteOutlineIcon />
        </button>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
      />
    </div>
  );
}

export function DeleteJournalButton({journal_id}: {journal_id: number}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleDelete = () => {
    formRef.current?.requestSubmit();
    setIsModalOpen(false);
  };

  return (
    <div className='flex items-center justify-center  rounded bg-transparent hover:bg-[#e0e0e06a] transition-all duration-75'>
      <form action={deleteJournal.bind(null, journal_id)} ref={formRef}>
        <input type="hidden" name="journal_id" value={journal_id} />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-2 text-red-600 font-bold"
        >
          <DeleteOutlineIcon />
        </button>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        title="Delete Journal"
        message="Are you sure you want to delete this journal and all its entries? This action cannot be undone."
      />
    </div>
  );
}