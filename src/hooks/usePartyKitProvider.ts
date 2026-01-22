"use client";

import { useState, useEffect } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

export function usePartyKitProvider(roomId: string) {
    const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
    const [ydoc] = useState(() => new Y.Doc());

    useEffect(() => {
        const provider = new YPartyKitProvider(
            'localhost:1999',
            roomId,
            ydoc,
            {
                connect: true,
            }
        );
        setProvider(provider);
        return () => {
            provider.destroy();
        };
    }, [roomId, ydoc]);

    return {provider, ydoc}
}