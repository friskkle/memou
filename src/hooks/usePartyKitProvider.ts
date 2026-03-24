"use client";

import { useState, useEffect, useRef } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const url = process.env.NEXT_PUBLIC_PARTYKIT_URL || "localhost:1999";

export function usePartyKitProvider(roomId: string) {
    const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
    const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'disconnected'>('loading');
    const hasConnected = useRef(false);
    const ydocRef = useRef<Y.Doc>(new Y.Doc());
    const [ydoc, setYdoc] = useState<Y.Doc>(() => ydocRef.current);
    useEffect(() => {
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
                
                // On reconnection, create a fresh YDoc before connecting
                // so there's nothing to broadcast to the server
                if (hasConnected.current) {
                    ydocRef.current.destroy();
                    ydocRef.current = new Y.Doc();
                    setYdoc(ydocRef.current);
                }

                providerInstance = new YPartyKitProvider(
                    url,
                    roomId,
                    ydocRef.current,
                    {
                        connect: true,
                        params: { token }, // Pass token in query params
                    }
                );
                
                providerInstance.on('sync', (connected: boolean) => {
                    if(!mounted) return;
                    if (connected) {
                        hasConnected.current = true;
                    }
                    setStatus(connected ? 'connected' : 'loading');
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
            hasConnected.current = false;
            if (providerInstance) {
                providerInstance.destroy();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    return { provider, ydoc, status }
}