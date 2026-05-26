import React from 'react'

export default function EmptyState({ onAddClick, hasFilter }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium">No reels in this category</h3>
        <p className="text-gray-400 text-sm mt-1">Try selecting a different category or add a new reel.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      </div>
      <h3 className="text-gray-700 font-semibold text-lg">No bookmarks yet</h3>
      <p className="text-gray-400 text-sm mt-1 text-center max-w-xs">
        Start saving your favorite Instagram reels. Click the button below to add your first one.
      </p>
      <button
        onClick={onAddClick}
        className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
      >
        Add Your First Reel
      </button>
    </div>
  )
}
