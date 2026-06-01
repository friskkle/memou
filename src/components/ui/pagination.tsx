'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';

interface PaginationProps {
  totalCount: number;
  itemsPerPage?: number;
}

export function Pagination({ totalCount, itemsPerPage = 10 }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // If there are no items or only 1 page, don't show navigation buttons but maybe show count
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) {
    if (totalCount === 0) return null;
    return (
      <div className="flex flex-row justify-between items-center gap-4 mt-2 py-4 select-none">
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{startItem}</span>{' '}
          to <span className="font-bold text-gray-800">{endItem}</span> of{' '}
          <span className="font-bold text-gray-800">{totalCount}</span> entries
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 py-4 select-none">
      <p className="text-sm text-gray-500 font-medium">
        Showing <span className="font-bold text-gray-800">{startItem}</span> to{' '}
        <span className="font-bold text-gray-800">{endItem}</span> of{' '}
        <span className="font-bold text-gray-800">{totalCount}</span> entries
      </p>

      <nav className="flex items-center gap-1.5" aria-label="Pagination">
        {/* Previous Button */}
        <motion.button
          whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-lg border border-gray-200 transition-colors ${
            currentPage === 1
              ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-xs'
          }`}
          aria-label="Previous Page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Page Buttons */}
        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-400"
              >
                ...
              </span>
            );
          }

          const page = pageNum as number;
          const isActive = page === currentPage;

          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-jbrown text-white hover:bg-jbrown-hover'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </motion.button>
          );
        })}

        {/* Next Button */}
        <motion.button
          whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center p-2 rounded-lg border border-gray-200 transition-colors ${
            currentPage === totalPages
              ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-xs'
          }`}
          aria-label="Next Page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.button>
      </nav>
    </div>
  );
}
