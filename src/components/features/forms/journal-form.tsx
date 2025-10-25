'use client';

import React, { useActionState } from 'react'
import { createJournal, State } from '@/src/lib/actions'

type JournalData = {
    title: string
    description?: string
    coverUrl?: string
    tags?: string
}

type JournalFormProps = {
    initialData?: JournalData
    mode?: 'create' | 'edit'
}

export function JournalForm({ initialData, mode = 'create' }: JournalFormProps) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createJournal, initialState);
    return (
        <form action={formAction} style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <input type='hidden' name="uuid" value={1}/>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue="New Journal"
                        aria-describedby="title-error"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                </div>
                <div id="title-error" aria-live="polite" aria-atomic="true" className="min-h-[1.25rem]">
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>
                    )}
                </div>
            </div>
        </form>
    )
}