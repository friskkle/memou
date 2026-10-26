import { routePartykitRequest } from 'partyserver';
import type { Connection, ConnectionContext } from 'partyserver';
import { YServer } from 'y-partyserver';
import * as Y from 'yjs';
import { jwtVerify } from 'jose';
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from 'y-prosemirror';
import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

type Env = {
  Main: DurableObjectNamespace<JournalServer>;
  APP_API_BASE_URL: string;
  INTERNAL_API_SECRET: string;
  BETTER_AUTH_SECRET: string;
};

export class JournalServer extends YServer<Env> {
  static options = { hibernate: true };

  static callbackOptions = {
    debounceWait: 2000,
    debounceMaxWait: 10000,
  };

  async onLoad(): Promise<Y.Doc | void> {
    const docId = this.name;
    const userId = await this.ctx.storage.get<string>('userId');
    console.log(`Loading document for room: ${docId} for user: ${userId}`);

    const query = userId
      ? `entry=${docId}&userId=${userId}`
      : `entry=${docId}`;
    const entry = await fetch(
      `${this.env.APP_API_BASE_URL}/entries/fetch?${query}`,
      {
        headers: {
          Authorization: 'Bearer ' + this.env.INTERNAL_API_SECRET,
        },
      },
    );
    if (!entry.ok) {
      return;
    }
    const data = (await entry.json()) as {
      content?: string;
      title?: string;
    };
    if (!data?.content) {
      return;
    }

    const schema = getSchema([StarterKit]);
    const json = JSON.parse(data.content);
    const ydoc = prosemirrorJSONToYDoc(schema, json, 'default');

    if (data.title) {
      ydoc.getText('title').insert(0, data.title);
    }

    return ydoc;
  }

  async onSave(): Promise<void> {
    const docId = this.name;
    const userId = await this.ctx.storage.get<string>('userId');

    const json = yDocToProsemirrorJSON(this.document, 'default');
    const title = this.document.getText('title').toString();

    console.log(
      'Updated content (JSON summary):',
      JSON.stringify(json).substring(0, 100) + '...',
    );
    console.log('Updated title:', title);

    const entry = await fetch(this.env.APP_API_BASE_URL + '/entries/update', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.env.INTERNAL_API_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry_id: parseInt(docId),
        title: title,
        content: JSON.stringify(json),
        userId: userId ?? '',
      }),
    });
    if (!entry.ok) {
      console.error('Failed to update entry');
    }
  }

  async onConnect(
    connection: Connection,
    ctx: ConnectionContext,
  ): Promise<void> {
    console.log(
      `Connected:
      id: ${connection.id}
      room: ${this.name}
      url: ${new URL(ctx.request.url).pathname}`,
    );

    const userId = ctx.request.headers.get('x-user-id');
    if (userId) {
      const existing = await this.ctx.storage.get<string>('userId');
      if (!existing) {
        await this.ctx.storage.put('userId', userId);
      }
    }
    console.log(`User ID: ${userId}`);

    return super.onConnect(connection, ctx);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env, {
        onBeforeConnect: async (req) => {
          try {
            const url = new URL(req.url);
            const token = url.searchParams.get('token');

            if (!token) {
              return new Response('Unauthorized: Missing token', {
                status: 401,
              });
            }

            if (!env.BETTER_AUTH_SECRET) {
              throw new Error('BETTER_AUTH_SECRET is not defined');
            }

            const secret = new TextEncoder().encode(env.BETTER_AUTH_SECRET);
            const { payload } = await jwtVerify(token, secret);

            req.headers.set('x-user-id', payload.userId as string);
            console.log('Authenticated user:', payload.userId);
            return req;
          } catch (e) {
            console.error('Authentication failed', e);
            return new Response('Unauthorized: Invalid token', { status: 401 });
          }
        },
      })) || new Response('Not Found', { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
