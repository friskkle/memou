'use server'

import { createEntry } from '@/src/lib/actions/journals'

export async function POST(request: Request) {
    const data = await request.json()
    const { journal_id } = data
    
    try {
        const entry_id = await createEntry(journal_id, 'New Entry')
        
        return new Response(JSON.stringify({ entry_id, redirect_url: `/journal/${journal_id}/${entry_id}` }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
        } catch (error) {
        return new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}