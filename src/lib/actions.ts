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

export async function createEntry(journal_id: number, title: string): Promise<void> {
    try {
        await sql<Entry>`
            INSERT INTO journal_entries (journal_id, title, content, created_at, last_modified)
            VALUES (${journal_id}, ${title}, '', NOW(), NOW())
        `
    } catch (error) {
        console.error("Error creating entry:", error)
        throw error
    }
}

export async function deleteEntry(entry_id: number): Promise<void> {
    try {
        await sql`
            DELETE FROM journal_entries
            WHERE id = ${entry_id}
        `
    } catch (error) {
        console.error("Error deleting entry:", error)
        throw error
    }
}

export async function createJournal(uuid: number, title: string): Promise<void> {
    try {
        await sql<Journal>`
            INSERT INTO journals (uuid, title)
            VALUES (${uuid}, ${title})
        `
    } catch (error) {
        console.error("Error creating journal:", error)
        throw error
    }
}