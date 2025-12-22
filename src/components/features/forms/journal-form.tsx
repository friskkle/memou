'use client';

import React, { useActionState } from 'react';
import { createJournal, State } from '@/src/lib/actions/journals';
import { PrimaryButton } from '../../elements/primary-button';

export function CreateJournalForm({ uuid }: { uuid: string }) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createJournal, initialState);
    return (
        <form action={formAction} style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="rounded-lg bg-white p-4 md:p-6 shadow-md">
                <div className="mb-4">
                    <input type='hidden' name="uuid" value={uuid}/>
                    <label className="block text-sm font-medium text-gray-700 mb-1 px-1" htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue="New Journal"
                        aria-describedby="title-error"
                        className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-base placeholder:text-gray-500 transition-all duration-75"
                    />
                </div>
                <div id="title-error" aria-live="polite" aria-atomic="true" className="min-h-5">
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>
                    )}
                </div>
                <PrimaryButton size='small' type="submit" className="mt-4 w-full">
                    Create Journal
                </PrimaryButton>
            </div>
        </form>
    )
}