import React from 'react'

export default function Header({ onAddClick, bookmarkCount, activeCategory }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
          <div>
            <h1 className="text-xl font-bold">Reel Bookmarks</h1>
            <p className="text-xs text-white/80">
              {bookmarkCount} {bookmarkCount === 1 ? 'reel' : 'reels'}{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Reel</span>
        </button>
      </div>
    </header>
  )
}