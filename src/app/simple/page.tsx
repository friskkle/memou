"use client";
import React, { useState, useEffect } from "react";
import { usePartyKitProvider } from "@/src/hooks/usePartyKitProvider";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const roomId = "47";

const CollaborativeTitle = ({ ydoc }: { ydoc: Y.Doc }) => {
    const [title, setTitle] = useState("");
    const yText = ydoc.getText("title");

    useEffect(() => {
        setTitle(yText.toString());
        const observer = () => {
            setTitle(yText.toString());
        };
        yText.observe(observer);
        return () => yText.unobserve(observer);
    }, [yText]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        ydoc.transact(() => {
            yText.delete(0, yText.length);
            yText.insert(0, newTitle);
        });
    };

    return (
        <input
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Untitled"
            className="w-full text-4xl font-bold border-none focus:outline-none mb-4 placeholder-gray-300"
        />
    );
};

const TiptapEditor = ({ provider, ydoc }: { provider: YPartyKitProvider, ydoc: Y.Doc }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // @ts-expect-error tiptap types are not updated yet
                history: false // Key for collaboration!
            }),
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCaret.configure({
                provider,
                user: {
                    name: 'Cyndi Lauper',
                    color: '#f783ac',
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px]",
            },
        },
        immediatelyRender: false,
    });

    return <EditorContent editor={editor} />;
};

export default function Simple() {
    const { ydoc, provider, status } = usePartyKitProvider(roomId);

    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Real-time Collaboration
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Type below to see changes propagate instantly via PartyKit & Yjs.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status: {status === 'connected' ? "Connected" : status === 'error' ? "Error (Unauthorized)" : "Connecting..."}
                        </span>
                        <div className="flex items-center space-x-2">
                             <div className={`h-2.5 w-2.5 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        </div>
                    </div>
                    <div className="p-6">
                        {provider ? (
                            <>
                                <CollaborativeTitle ydoc={ydoc} />
                                <TiptapEditor provider={provider} ydoc={ydoc} />
                            </>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                Connecting to room...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
