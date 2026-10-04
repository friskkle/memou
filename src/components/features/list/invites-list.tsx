'use client';

import { useState } from 'react';
import { JournalInvite } from '@/src/lib/definitions';
import { updateInviteStatus } from '@/src/lib/actions/journals';
import { ApproveButton, DeclineButton } from '@/src/components/elements/approve';
import { IconButton } from '@/src/components/elements/icon-button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export const InvitesList = ({ invites }: { invites: JournalInvite[] }) => {
  const [expand, setExpand] = useState(false);
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg w-full">
      <div className='flex justify-between items-center-safe p-2'>
        <h3 className="font-semibold ml-1 text-md text-gray-600">
          Invitations {invites.length > 0 && <span className="text-gray-400">({invites.length})</span>}
        </h3>
        <IconButton onClick={() => setExpand(!expand)}>
          {expand ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      {expand && (
      <div id='invites-content' className='max-h-30 overflow-y-scroll'>
        <hr className="border-solid border-gray-200" />
        {invites.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-24">
            <p className="text-gray-500 text-xs">You have no pending invitations.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {invites.map((invite) => (
              <div key={invite.id} className="flex py-1 px-2 justify-between rounded-md hover:bg-gray-100">
                <div className="flex flex-col">
                  <h4 className='text-md font-bold'>{invite.journals.title}</h4>
                  <p className='text-xs text-gray-500'>Invited by <b>{invite.user.name}</b></p>
                </div>
                <div className='flex gap-1 items-center'>
                  <ApproveButton onClick={updateInviteStatus.bind(null, invite.id, invite.journal_id, 'accepted')} />
                  <DeclineButton onClick={updateInviteStatus.bind(null, invite.id, invite.journal_id, 'declined')} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
};