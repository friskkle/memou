"use client";

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce'

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Search...", className = "" }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if(term){
      params.set('query', term);
    } else {
      params.delete('query')
    }
    replace(`${pathName}?${params.toString()}`)
  }, 250)
  return (
    <div className={`flex items-center px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-lg transition-all ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 outline-none text-sm md:text-base py-1 text-gray-700 bg-transparent"
      />
    </div>
  );
}
