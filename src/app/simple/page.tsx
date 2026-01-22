"use client";

import { usePartyKitProvider } from "@/src/hooks/usePartyKitProvider";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import { useEffect, useState } from "react";

const roomId = "simple-room";

export default function Simple() {
    const { ydoc, provider } = usePartyKitProvider(roomId);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // @ts-ignore
                history: false // Key for collaboration!
            }),
            Collaboration.configure({
                document: ydoc,
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px]",
            },
        },
        immediatelyRender: false,
    });

    // Handle provider connection status if needed, but Tiptap works reactively with the Y.Doc
    
    if (!editor) {
        return null; // or a loading spinner
    }

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
                            Status: {provider ? "Connected" : "Connecting..."}
                        </span>
                        <div className="flex items-center space-x-2">
                             <div className={`h-2.5 w-2.5 rounded-full ${provider ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        </div>
                    </div>
                    <div className="p-6">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
        </div>
    )
}
