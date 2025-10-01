import { sql } from "@vercel/postgres"
import {
    Journal,
    Entry
} from './definitions'

export async function fetchEntryId(entry_id: string): Promise<Entry> {
    
    try {
        const data = await sql<Entry>`
            SELECT * FROM journal_entries
            WHERE id = ${entry_id}
            LIMIT 1
        `

        const id = data.rows[0]?.id || 0
        const journal_id = data.rows[0]?.journal_id || 0
        const title = data.rows[0]?.title || "Untitled"
        const content = data.rows[0]?.content || ""
        const created_date = data.rows[0]?.created_date || new Date()
        const last_modified = data.rows[0]?.last_modified || new Date()

        return {
            id,
            journal_id,
            title,
            content,
            created_date,
            last_modified
        }
    } catch (error) {
        console.error("Error fetching entry:", error)
        throw error
    }
}

export async function fetchEntries(journal_id: string): Promise<Entry[]> {
    try {
        const data = await sql<Entry>`
            SELECT * FROM journal_entries
            WHERE journal_id = ${journal_id}
            ORDER BY last_modified DESC
        `
        
        return data.rows
    }
    catch (error) {
        console.error("Error fetching entries:", error)
        throw error
    }
}

export async function fetchJournals(uuid: string): Promise<Journal[]> {
    try {
        const data = await sql<Journal>`
            SELECT * FROM journals
            WHERE uuid = ${uuid}
            ORDER BY id DESC
        `
        return data.rows
    } catch (error) {
        console.error("Error fetching journals:", error)
        throw error
    }
}