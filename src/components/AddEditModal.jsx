import React, { useState, useEffect, useRef } from 'react'
import { isValidInstagramUrl, generateThumbnailUrl } from '../utils/instagram'

export default function AddEditModal({ isOpen, onClose, onSave, bookmark, categories, sharedUrl }) {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    category: 'Uncategorized',
    thumbnailUrl: '',
  })
  const [error, setError] = useState('')
  const [thumbnailSource, setThumbnailSource] = useState('auto') // 'auto' | 'upload' | 'url'
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (bookmark) {
      setFormData({
        url: bookmark.url || '',
        title: bookmark.title || '',
        description: bookmark.description || '',
        category: bookmark.category || 'Uncategorized',
        thumbnailUrl: bookmark.thumbnailUrl || '',
      })
      // Detect if existing thumbnail is a data URL (uploaded) or external
      if (bookmark.thumbnailUrl?.startsWith('data:')) {
        setThumbnailSource('upload')
      } else if (bookmark.thumbnailUrl?.includes('thum.io')) {
        setThumbnailSource('auto')
      } else if (bookmark.thumbnailUrl) {
        setThumbnailSource('url')
      } else {
        setThumbnailSource('auto')
      }
    } else if (sharedUrl) {
      setFormData({
        url: sharedUrl,
        title: '',
        description: '',
        category: 'Uncategorized',
        thumbnailUrl: generateThumbnailUrl(sharedUrl),
      })
      setThumbnailSource('auto')
    } else {
      setFormData({
        url: '',
        title: '',
        description: '',
        category: 'Uncategorized',
        thumbnailUrl: '',
      })
      setThumbnailSource('auto')
    }
    setError('')
  }, [bookmark, isOpen, sharedUrl])

  const handleUrlChange = (e) => {
    const url = e.target.value
    setFormData(f => ({ ...f, url }))
    setError('')
    // Auto-generate thumbnail when a valid URL is entered (only if source is auto)
    if (isValidInstagramUrl(url.trim()) && thumbnailSource === 'auto') {
      setFormData(f => ({ ...f, url, thumbnailUrl: generateThumbnailUrl(url.trim()) }))
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) convertFileToDataUrl(file)
  }

  const convertFileToDataUrl = (file) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(f => ({ ...f, thumbnailUrl: e.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) convertFileToDataUrl(file)
        return
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) {
      convertFileToDataUrl(file)
    }
  }

  const handleThumbnailSourceChange = (source) => {
    setThumbnailSource(source)
    if (source === 'auto' && formData.url && isValidInstagramUrl(formData.url)) {
      setFormData(f => ({ ...f, thumbnailUrl: generateThumbnailUrl(f.url.trim()) }))
    } else if (source !== 'auto') {
      // Clear thumbnail when switching away from auto so user can set their own
      if (formData.thumbnailUrl?.includes('thum.io')) {
        setFormData(f => ({ ...f, thumbnailUrl: '' }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.url.trim()) {
      setError('Please enter a URL')
      return
    }
    if (!isValidInstagramUrl(formData.url.trim())) {
      setError('Please enter a valid Instagram reel or post URL')
      return
    }
    // Ensure thumbnail is generated if not manually set
    const thumbnailUrl = formData.thumbnailUrl || generateThumbnailUrl(formData.url.trim())
    onSave({
      ...formData,
      url: formData.url.trim(),
      title: formData.title.trim() || 'Untitled Reel',
      description: formData.description.trim(),
      thumbnailUrl,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            {bookmark ? 'Edit Bookmark' : 'Add New Reel'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram Reel URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={handleUrlChange}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              disabled={!!bookmark}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="Give it a name..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="What's this reel about?"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>

            {/* Source toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => handleThumbnailSourceChange('auto')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  thumbnailSource === 'auto' ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => handleThumbnailSourceChange('upload')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors border-x border-gray-200 ${
                  thumbnailSource === 'upload' ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upload / Paste
              </button>
              <button
                type="button"
                onClick={() => handleThumbnailSourceChange('url')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  thumbnailSource === 'url' ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Image URL
              </button>
            </div>

            {/* Preview */}
            {formData.thumbnailUrl && (
              <div className="mb-3 relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 h-36 w-24">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, thumbnailUrl: '' }))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/80"
                  title="Remove thumbnail"
                >
                  ×
                </button>
              </div>
            )}

            {/* Auto mode */}
            {thumbnailSource === 'auto' && (
              <div className="flex gap-2">
                {formData.url && isValidInstagramUrl(formData.url) ? (
                  <>
                    <p className="text-xs text-gray-500 flex-1 py-2">
                      Screenshot auto-generated from the reel URL.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, thumbnailUrl: generateThumbnailUrl(f.url.trim()) }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                      title="Regenerate thumbnail"
                    >
                      ↻
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 py-2">
                    Enter a valid Instagram URL above to auto-generate a thumbnail.
                  </p>
                )}
              </div>
            )}

            {/* Upload / Paste mode */}
            {thumbnailSource === 'upload' && (
              <div>
                <div
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
                  tabIndex={0}
                >
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">Click to browse, drag & drop, or paste</p>
                  <p className="text-xs text-gray-400 mt-1">Paste a screenshot directly with Ctrl+V</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* URL mode */}
            {thumbnailSource === 'url' && (
              <div>
                <input
                  type="url"
                  value={formData.thumbnailUrl?.startsWith('data:') ? '' : formData.thumbnailUrl}
                  onChange={(e) => setFormData(f => ({ ...f, thumbnailUrl: e.target.value }))}
                  placeholder="https://... paste an image URL"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste a direct link to any image.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
            >
              {bookmark ? 'Save Changes' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
