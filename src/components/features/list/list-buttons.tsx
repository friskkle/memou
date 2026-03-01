'use client';

import { deleteEntry, deleteJournal } from '@/src/lib/actions/journals';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useState, useRef } from "react";
import React from "react";
import { ConfirmationModal } from "@/src/components/ui/ConfirmationModal";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import { motion } from "framer-motion";


export function JournalActionMenu({ journal_id }: { journal_id: number }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleClose();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    formRef.current?.requestSubmit();
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center">
      <IconButton
        aria-label="more"
        id="journal-action-button"
        aria-controls={open ? 'journal-action-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disableRipple
        sx={{
          borderRadius: '8px',
          p: '6px',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#e0e0e06a',
          }
        }}
      >
        <motion.div
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           className="flex items-center justify-center"
        >
          <MoreVertIcon />
        </motion.div>
      </IconButton>
      <Menu
        id="journal-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ disablePadding: true }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              minWidth: '150px',
              mt: 0.5,
              p: 0.5, // Padding inside the menu to make items look "padded in"
            }
          }
        }}
      >
        <MenuItem
          onClick={handleClose}
          disableRipple
          sx={{
            py: 1,
            px: 2,
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <ListItemIcon sx={{ minWidth: '36px !important' }}>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          disableRipple
          sx={{
            py: 1,
            px: 2,
            borderRadius: '8px',
            color: '#d32f2f',
            '&:hover': { backgroundColor: '#fef2f2' }
          }}
        >
          <ListItemIcon sx={{ minWidth: '36px !important', color: 'inherit' }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </MenuItem>
      </Menu>

      <form action={deleteJournal.bind(null, journal_id)} ref={formRef} className="hidden">
        <input type="hidden" name="journal_id" value={journal_id} />
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        title="Delete Journal"
        message="Are you sure you want to delete this journal and all its entries? This action cannot be undone."
      />
    </div>
  );
}

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

export function EntryActionMenu({ entry_id }: { entry_id: number }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleClose();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    formRef.current?.requestSubmit();
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center">
      <IconButton
        aria-label="more"
        id="entry-action-button"
        aria-controls={open ? 'entry-action-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disableRipple
        sx={{
          borderRadius: '8px',
          p: '6px',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#e0e0e06a',
          }
        }}
      >
        <motion.div
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           className="flex items-center justify-center"
        >
          <MoreVertIcon />
        </motion.div>
      </IconButton>
      <Menu
        id="entry-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ disablePadding: true }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              minWidth: '150px',
              mt: 0.5,
              p: 0.5,
            }
          }
        }}
      >
        <MenuItem
          onClick={handleClose}
          disableRipple
          sx={{
            py: 1,
            px: 2,
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <ListItemIcon sx={{ minWidth: '36px !important' }}>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          disableRipple
          sx={{
            py: 1,
            px: 2,
            borderRadius: '8px',
            color: '#d32f2f',
            '&:hover': { backgroundColor: '#fef2f2' }
          }}
        >
          <ListItemIcon sx={{ minWidth: '36px !important', color: 'inherit' }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </MenuItem>
      </Menu>

      <form action={deleteEntry.bind(null, entry_id)} ref={formRef} className="hidden">
        <input type="hidden" name="entry_id" value={entry_id} />
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
      />
    </div>
  );
}