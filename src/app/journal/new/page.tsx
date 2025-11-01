'use client'

import React from 'react'
import { CreateJournalForm } from '@/src/components/features/forms/journal-form'

export default function NewJournalPage() {
    return (
        <main style={{ padding: 24 }}>
            <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
                <h1 className='font-bold' style={{ margin: 0 }}>Create New Journal</h1>
                <p style={{ marginTop: 6, color: '#555' }}>Fill in the information below to create a new journal.</p>
            </header>

            <CreateJournalForm />
        </main>
    )
}