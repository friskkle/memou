"use client";

import { useState, useEffect } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const url = process.env.NEXT_PUBLIC_PARTYKIT_URL || "localhost:1999";

export function usePartyKitProvider(roomId: string) {
    const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
    const [ydoc] = useState(() => new Y.Doc());
    const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'disconnected'>('loading');

    useEffect(() => {
        console.log("Connecting to PartyKit, url: " + url)
        let mounted = true;
        let providerInstance: YPartyKitProvider | null = null;
        setStatus('loading');

        const connect = async () => {
            try {
                // Fetch auth token
                const res = await fetch("/api/auth/token");
                if (!res.ok) {
                    if (mounted) setStatus('error');
                    console.error("Failed to fetch auth token:", res.statusText);
                    return;
                }
                const { token } = await res.json();

                if (!mounted) return;

                providerInstance = new YPartyKitProvider(
                    url,
                    roomId,
                    ydoc,
                    {
                        connect: true,
                        params: { token }, // Pass token in query params
                    }
                );
                
                providerInstance.on('sync', (connected: boolean) => {
                    if (mounted) setStatus(connected ? 'connected' : 'loading');
                });
                
                providerInstance.on('connection-error', () => {
                   if (mounted) setStatus('error');
                });

                setProvider(providerInstance);
            } catch (err) {
                console.error("Error connecting to PartyKit:", err);
                if (mounted) setStatus('error');
            }
        };

        connect();

        return () => {
            mounted = false;
            if (providerInstance) {
                providerInstance.destroy();
            }
        };
    }, [roomId, ydoc]);

    return { provider, ydoc, status }
}