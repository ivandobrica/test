import React, { useState } from 'react'

export default function CategoryBar({ categories, activeCategory, onCategoryChange, onAddCategory, onDeleteCategory }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      onAddCategory(trimmed)
    }
    setNewCategory('')
    setIsAdding(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => onCategoryChange('All')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'All'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <div key={cat} className="relative group shrink-0">
              <button
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
              {cat !== 'Uncategorized' && (
                <button
                  onClick={() => onDeleteCategory(cat)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center leading-none"
                  title={`Delete "${cat}" category`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="px-3 py-1.5 border border-gray-300 rounded-full text-sm w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                onBlur={() => { if (!newCategory.trim()) setIsAdding(false) }}
              />
              <button type="submit" className="text-purple-600 text-sm font-medium">Add</button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              + Category
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
