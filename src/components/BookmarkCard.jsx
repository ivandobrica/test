import React, { useState } from 'react'

export default function BookmarkCard({ bookmark, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false)

  const handleOpen = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border sm:border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Thumbnail */}
      <div
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 cursor-pointer"
        onClick={handleOpen}
      >
        {bookmark.thumbnailUrl && !imgError ? (
          <img
            src={bookmark.thumbnailUrl}
            alt={bookmark.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        )}
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Category badge */}
        {bookmark.category && bookmark.category !== 'Uncategorized' && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {bookmark.category}
          </span>
        )}
        {/* Instagram icon */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2"/>
            <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="hidden sm:block p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{bookmark.title || 'Untitled Reel'}</h3>
        {bookmark.description && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{bookmark.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(bookmark)}
              className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(bookmark.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
