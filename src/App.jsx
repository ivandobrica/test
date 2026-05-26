return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddClick={() => setIsModalOpen(true)}
        bookmarkCount={filteredBookmarks.length}
        activeCategory={activeCategory}
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
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3">
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