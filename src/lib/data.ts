"use server";

import { prisma } from "./prisma"
import {
    Journal,
    Entry
} from './definitions'
import { auth } from "./auth";
import { headers } from "next/headers";

export async function fetchEntryId(entry_id: string): Promise<Entry> {
    
    try {
        const entry = await prisma.journal_entries.findUnique({
            where: {
                id: parseInt(entry_id)
            }
        })

        if (!entry) {
            return {
                id: 0,
                journal_id: 0,
                title: "Untitled",
                content: "",
                created_date: new Date(),
                last_modified: new Date()
            }
        }

        return {
            id: entry.id,
            journal_id: entry.journal_id,
            title: entry.title || "Untitled",
            content: entry.content || "",
            created_date: entry.created_date,
            last_modified: entry.last_modified
        }
    } catch (error) {
        console.error("Error fetching entry:", error)
        throw error
    }
}

export async function fetchEntries(journal_id: string): Promise<Entry[]> {
    try {
        const entries = await prisma.journal_entries.findMany({
            where: {
                journal_id: parseInt(journal_id)
            },
            orderBy: {
                last_modified: 'desc'
            }
        })
        
        return entries.map((entry: Entry) => ({
            id: entry.id,
            journal_id: entry.journal_id,
            title: entry.title || "Untitled",
            content: entry.content || "",
            created_date: entry.created_date,
            last_modified: entry.last_modified
        }))
    }
    catch (error) {
        console.error("Error fetching entries:", error)
        throw error
    }
}

export async function fetchJournals(): Promise<Journal[]> {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        throw new Error("Unauthorized")
    }

    const uid = session.user.id
    try {
        const journals = await prisma.journals.findMany({
            where: {
                OR: [
                    { uuid: uid },
                    { shared_with: { has: uid } }
                ]
            },
            orderBy: {
                id: 'desc'
            }
        })
        
        return journals.map((journal: Journal) => ({
            id: journal.id,
            uuid: journal.uuid,
            title: journal.title || "",
            shared_with: journal.shared_with
        }))
    } catch (error) {
        console.error("Error fetching journals:", error)
        throw error
    }
}