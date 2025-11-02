'use client'

import React from 'react'
import { CreateJournalForm } from '@/src/components/features/forms/journal-form'

export default function NewJournalPage() {
    return (
        <main style={{ padding: 24 }}>
            <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
                <h1 className='font-bold' style={{ margin: 0 }}>Create New Journal</h1>
            </header>

            <CreateJournalForm />
        </main>
    )
}