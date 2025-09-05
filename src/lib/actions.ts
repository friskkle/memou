'use server'

import { sql } from '@vercel/postgres'
import {
    Journal,
    Entry
} from './definitions'

export async function updateEntry(entry_id: number, title: string, content: string): Promise<void> {
    try {
        await sql<Entry>`
            UPDATE journal_entries
            SET title = ${title}, content = ${content}, last_modified = NOW()
            WHERE id = ${entry_id}
        `
    } catch (error) {
        console.error("Error updating entry:", error)
        throw error
    }
}