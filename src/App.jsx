import React, { useState, useMemo, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { extractReelId, isValidInstagramUrl, generateThumbnailUrl } from './utils/instagram'
import Header from './components/Header'
import CategoryBar from './components/CategoryBar'
import BookmarkCard from './components/BookmarkCard'
import AddEditModal from './components/AddEditModal'
import EmptyState from './components/EmptyState'

/**
 * Parse shared content from the URL params (Web Share Target API).
 * Instagram typically shares the reel URL inside the "text" param.
 * Sometimes it comes as just the URL, sometimes wrapped in text like "Check this out: https://..."
 */
function getSharedUrl() {
  const params = new URLSearchParams(window.location.search)
  
  // No query params at all — nothing shared
  if (!window.location.search) return null

  // Try the url param first
  const url = params.get('url') || ''
  if (isValidInstagramUrl(url)) return url

  // Instagram often puts the link in the "text" param
  const text = params.get('text') || ''
  const urlMatch = text.match(/https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[^\s?]+/)
  if (urlMatch) return urlMatch[0]

  // Sometimes it's in the title
  const title = params.get('title') || ''
  const titleMatch = title.match(/https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[^\s?]+/)
  if (titleMatch) return titleMatch[0]

  // Last resort: check all param values for an instagram URL
  for (const [, value] of params) {
    const match = value.match(/https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[^\s?]+/)
    if (match) return match[0]
  }

  return null
}

export default function App() {
  const [bookmarks, setBookmarks] = useLocalStorage('reel-bookmarks', [])
  const [categories, setCategories] = useLocalStorage('reel-categories', ['Uncategorized', 'Funny', 'Recipes', 'Travel', 'Fitness'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [sharedUrl, setSharedUrl] = useState(null)

  // Handle incoming share target
  useEffect(() => {
    const url = getSharedUrl()
    if (url) {
      setSharedUrl(url)
      setIsModalOpen(true)
      // Clean up the URL so it doesn't re-trigger
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks
    if (activeCategory !== 'All') {
      filtered = filtered.filter(b => b.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q)
      )
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [bookmarks, activeCategory, searchQuery])

  const handleAddBookmark = (formData) => {
    const newBookmark = {
      id: crypto.randomUUID(),
      ...formData,
      reelId: extractReelId(formData.url),
      createdAt: new Date().toISOString(),
    }
    setBookmarks(prev => [newBookmark, ...prev])
  }

  const handleEditBookmark = (formData) => {
    setBookmarks(prev =>
      prev.map(b =>
        b.id === editingBookmark.id
          ? { ...b, ...formData, updatedAt: new Date().toISOString() }
          : b
      )
    )
    setEditingBookmark(null)
  }

  const handleDeleteBookmark = (id) => {
    if (window.confirm('Delete this bookmark?')) {
      setBookmarks(prev => prev.filter(b => b.id !== id))
    }
  }

  const handleAddCategory = (name) => {
    setCategories(prev => [...prev, name])
  }

  const handleDeleteCategory = (name) => {
    if (window.confirm(`Delete category "${name}"? Bookmarks in this category will be moved to "Uncategorized".`)) {
      setCategories(prev => prev.filter(c => c !== name))
      setBookmarks(prev =>
        prev.map(b => b.category === name ? { ...b, category: 'Uncategorized' } : b)
      )
      if (activeCategory === name) setActiveCategory('All')
    }
  }

  const openEditModal = (bookmark) => {
    setEditingBookmark(bookmark)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBookmark(null)
    setSharedUrl(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddClick={() => setIsModalOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {filteredBookmarks.length === 0 ? (
          <EmptyState
            onAddClick={() => setIsModalOpen(true)}
            hasFilter={activeCategory !== 'All' || searchQuery.trim() !== ''}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={openEditModal}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingBookmark ? handleEditBookmark : handleAddBookmark}
        bookmark={editingBookmark}
        categories={categories}
        sharedUrl={sharedUrl}
      />
    </div>
  )
}