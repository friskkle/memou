'use client';

import React, { useActionState, useState } from 'react';
import { createJournal, State } from '@/src/lib/actions/journals';
import { PrimaryButton } from '../../elements/primary-button';
import { searchUsersByEmail } from '@/src/lib/actions/users';

type SharedUser = {
    id: string;
    name: string;
    email: string;
};

export function CreateJournalForm({ uuid }: { uuid: string }) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createJournal, initialState);

    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [emailInput, setEmailInput] = useState('');
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const performEmailSearch = async () => {
        if (!emailInput.trim()) return;

        // Simple email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
            setSearchError('Invalid email format');
            return;
        }

        // Check if already added
        if (sharedUsers.some(u => u.email === emailInput)) {
            setSearchError('User already added');
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const user = await searchUsersByEmail(emailInput);
            
            if (user) {
                if (user.id === uuid) {
                    setSearchError('You cannot invite yourself');
                } else {
                    setSharedUsers([...sharedUsers, { id: user.id, name: user.name, email: user.email }]);
                    setEmailInput('');
                }
            } else {
                setSearchError('User not found');
            }
        } catch (error) {
            console.error(error);
            setSearchError('Error searching user');
        } finally {
            setIsSearching(false);
        }
    };

    const handleEmailSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await performEmailSearch();
        }
    };

    const removeUser = (idToRemove: string) => {
        setSharedUsers(sharedUsers.filter(u => u.id !== idToRemove));
    };

    return (
        <form action={formAction} style={{ maxWidth: 720, margin: '0 auto' }}>
            <input type="hidden" name="shared_with" value={JSON.stringify(sharedUsers.map(u => u.id))} />
            <div className="rounded-lg bg-white p-4 md:p-6 shadow-md">
                <div className="mb-4">
                    <input type='hidden' name="uuid" value={uuid}/>
                    <label className="block text-sm font-medium text-gray-700 mb-1 px-1" htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue="New Journal"
                        aria-describedby="title-error"
                        className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-base placeholder:text-gray-500 focus:border-[#D49273] focus:ring-[#D49273] transition-all duration-75"
                    />
                </div>
                
                <div className="mb-4 border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 px-1" htmlFor="email-search">
                        Invite Co-authors (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-2 px-1">Type an exact email address and press Enter or click Add to invite.</p>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                id="email-search"
                                value={emailInput}
                                onChange={(e) => {
                                    setEmailInput(e.target.value);
                                    if (searchError) setSearchError(null);
                                }}
                                onKeyDown={handleEmailSearch}
                                placeholder="user@example.com"
                                className={`peer block w-full rounded-lg bg-gray-100 py-2 px-3 text-base placeholder:text-gray-500 transition-all duration-75 focus:outline-none focus:ring-2
                                    ${searchError ? 'border-2 border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border border-transparent hover:bg-gray-200 active:border-gray-200 focus:bg-white focus:border-[#D49273] focus:ring-[#D49273]'}`}
                                disabled={isSearching}
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-2.5">
                                    <span className="animate-spin block h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></span>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={performEmailSearch}
                            disabled={isSearching || !emailInput.trim()}
                            className="rounded-lg bg-[#D49273] px-4 py-2 text-white font-medium hover:bg-[#b07456] active:bg-[#9A654B] disabled:bg-[#9A654B] disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {searchError && (
                        <p className="mt-1 text-sm text-red-600 px-1">{searchError}</p>
                    )}
                    
                    {sharedUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {sharedUsers.map(user => (
                                <div key={user.id} className="flex items-center gap-1.5 rounded-full bg-blue-50 pl-3 pr-1.5 py-1 text-sm border border-blue-200">
                                    <span className="font-medium text-blue-800">{user.name}</span>
                                    <span className="text-blue-500 text-xs">({user.email})</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeUser(user.id)}
                                        className="ml-1 rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                        aria-label={`Remove ${user.name}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div id="title-error" aria-live="polite" aria-atomic="true" className="min-h-5">
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-600">{state.errors.title}</p>
                    )}
                </div>
                <div className="mt-4 flex justify-center">
                    <PrimaryButton size='small' type="submit" className="w-1/3">
                        Create Journal
                    </PrimaryButton>
                </div>
            </div>
        </form>
    )
}