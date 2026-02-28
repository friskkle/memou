'use server';

import { editEntry } from '@/src/lib/journals';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get Bearer token
  const token = authorization.replace('Bearer ', '');
  if (!token) {
    return new NextResponse('Invalid token format', { status: 401 });
  } else if (token != process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get new content from body
  const body = await req.json();
  const entry_id = body.entry_id;
  const title = body.title;
  const content = body.content;
  const userId = body.userId;

  if (!entry_id) {
    return NextResponse.json({ error: 'Invalid entry_id' }, { status: 400 });
  }

  console.log('Editing entry, new content length:', content?.length);
  try {
    await editEntry(entry_id, title || 'Untitled', content || '', userId);
    return NextResponse.json(
      { message: 'Entry updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Database update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 },
    );
  }
}
