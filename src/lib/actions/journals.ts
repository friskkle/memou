'use server'

import { sql } from '@vercel/postgres'
import {
    Journal,
    Entry
} from '../definitions'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type State = {
    message?: string | null;
    errors?: {
        title?: string[];
    }
}

const FormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Title must be less than 100 characters" }),
    uuid: z.string(),
})

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

export async function createJournal(prevState: State, formData: FormData) {
    const validatedFields = FormSchema.safeParse({ 
        title: formData.get('title'),
        uuid: formData.get('uuid')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields, failed to create journal."
        }
    }
    const { title, uuid } = validatedFields.data
    let returning_id = 0
    try {
        const result = await sql<Journal>`
            INSERT INTO journals (uuid, title)
            VALUES (${uuid}, ${title})
            RETURNING id
        `
        returning_id = result.rows[0]?.id || 0
        revalidatePath(`/journal`)
    } catch (error) {
        console.error("Error creating journal:", error)
        return {
            message: "Database error, failed to create journal."
        }
    }
    redirect(`/journal/${returning_id}`)
}

export async function deleteJournal(id: number): Promise<void> {
    try {
        console.log("Deleting journal with ID:", id);
        const result = await sql`
            DELETE FROM journals
            WHERE id = ${id}
            RETURNING id
        `
        const returning_id = result.rows[0]?.id || 0
        console.log("Deleted journal with ID:", returning_id);
        revalidatePath(`/journal`)
    } catch (error) {
        console.error("Error deleting entry:", error)
        throw error
    }
}