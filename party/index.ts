import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class JournalServer implements Party.Server {
  constructor(public party: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

/*     // let's send a message to the connection
    conn.send(`Hello, you are connected to the journal room: ${this.party.id}`); */

    return onConnect(conn, this.party, {
      persist: {
        mode: "snapshot",
      },
      callback: {
        handler: async (ydoc) => {
          console.log(`Document updated in room: ${this.party.id}`)
        }
      }
    })
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
