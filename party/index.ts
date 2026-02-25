import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import { jwtVerify } from "jose";
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from "y-prosemirror";
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

export default class JournalServer implements Party.Server {
  constructor(public party: Party.Room) {}

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    try {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");

      if (!token) {
        return new Response("Unauthorized: Missing token", { status: 401 });
      }

      if (!BETTER_AUTH_SECRET) {
        throw new Error("BETTER_AUTH_SECRET is not defined");
      }

      const secret = new TextEncoder().encode(BETTER_AUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Successfully authenticated
      // forward user info in headers or store in lobby if needed for onConnect
      req.headers.set("x-user-id", payload.userId as string);
      return req;
    } catch (e) {
      console.error("Authentication failed", e);
      return new Response("Unauthorized: Invalid token", { status: 401 });
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
      id: ${conn.id}
      room: ${this.party.id}
      url: ${new URL(ctx.request.url).pathname}`
    );

    const userId = ctx.request.headers.get("x-user-id");
    const docId = this.party.id;
    console.log(`User ID: ${userId}`);

    return onConnect(conn, this.party, {
      async load() {
        console.log("Loading document for room...")
        const entry = await fetch(process.env.APP_API_BASE_URL +"/entries/fetch?entry=" + docId + "&userId=" + userId, {
          headers: {
            "Authorization": "Bearer " + process.env.INTERNAL_API_SECRET
          }
        })
        if(!entry.ok) {
          return null
        }
        const data = await entry.json()
        if(!data?.content) {
          return null
        }
        
        const schema = getSchema([StarterKit])
        const json = JSON.parse(data.content)
        const ydoc = prosemirrorJSONToYDoc(schema, json, "default")
        
        // Initialize the title shared type
        if (data.title) {
          ydoc.getText("title").insert(0, data.title)
        }

        return ydoc
      },
      callback: {
        handler: async (ydoc) => {
          console.log(`Document updated in room: ${this.party.id}`)
          
          // Convert Y.Doc back to ProseMirror JSON
          const json = yDocToProsemirrorJSON(ydoc, "default")
          // Get the title from the shared type
          const title = ydoc.getText("title").toString()

          console.log("Updated content (JSON summary):", JSON.stringify(json).substring(0, 100) + "...")
          console.log("Updated title:", title)

          const entry = await fetch(process.env.APP_API_BASE_URL + "/entries/update", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + process.env.INTERNAL_API_SECRET,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              entry_id: docId,
              title: title,
              content: JSON.stringify(json)
            })
          })
          if(!entry.ok) {
            console.error("Failed to update entry")
          }
        },
        debounceWait: 2000,
        debounceMaxWait: 10000,
      }
    })
  }

  async onClose(connection: Party.Connection): Promise<void> {
    const connections = [...this.party.getConnections()]
    console.log(`Connection closed: ${connection.id}`)
    console.log(`Connections left: ${connections.length}`)

    if(connections.length === 0) {
      console.log(`No connections left, deleting room: ${this.party.id}`)
      await this.party.storage.delete("doc")
    }
  }

/*   onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  } */
}

JournalServer satisfies Party.Worker;
