import { Editor } from '@/src/components/editor/editor'
import React from 'react'

export default function Journal(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <h1 className="font-serif text-3xl mb-6">Journal</h1>
      <Editor />
      
      {/* Helper text */}
      <p className="text-sm text-gray-600 mt-4">
        💡 Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to open formatting options
      </p>
    </div>
  )
}