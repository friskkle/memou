'use server'

import { sql } from '@vercel/postgres'
import {
    Journal,
    Entry
} from './definitions'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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

export async function createEntry(journal_id: number, title: string) {
    let returning_id = 0
    try {
        const result = await sql<Entry>`
            INSERT INTO journal_entries (journal_id, title, content, created_date, last_modified)
            VALUES (${journal_id}, ${title}, '', NOW(), NOW())
            RETURNING id
        `
        returning_id = result.rows[0]?.id || 0
        revalidatePath(`/journal/${journal_id}`)
    } catch (error) {
        console.error("Error creating entry:", error)
        throw error
    } finally {
        redirect(`/journal/${journal_id}/${returning_id}`)
    }
}

export async function deleteEntry(entry_id: number): Promise<void> {
    try {
        console.log("Deleting entry with ID:", entry_id);
        const result = await sql`
            DELETE FROM journal_entries
            WHERE id = ${entry_id}
            RETURNING journal_id
        `
        const returning_id = result.rows[0]?.journal_id || 0
        console.log("Deleted entry with ID:", entry_id, "from journal ID:", returning_id);
        revalidatePath(`/journal/${returning_id}`)
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