'use server'

import { fetchEntryId } from "@/src/lib/journals"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const authorization = req.headers.get("Authorization")
    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get Bearer token
    const token = authorization.replace("Bearer ", "")
    if (!token) {
    return new NextResponse('Invalid token format', { status: 401 });
    }

    if(token != process.env.INTERNAL_API_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get entry ID from query params
    const searchParams = req.nextUrl.searchParams
    const entry_id = searchParams.get("entry")
    if (!entry_id) {
        return NextResponse.json({ error: "Missing entry ID" }, { status: 400 })
    }

    const userId = searchParams.get("userId") || undefined

    const entry = await fetchEntryId(entry_id, userId)
    return NextResponse.json(entry)
}
