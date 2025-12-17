'use client';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: SearchBarProps) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-0">
        {/* Search Input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#E0D5C7',
              background: 'white',
              color: '#1F2937',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--museum-orange)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E0D5C7';
            }}
          />
        </div>

        {/* Category Selector */}
        <div className="relative w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 text-sm sm:text-base border-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all text-gray-900"
            style={{
              borderColor: '#E0D5C7',
              background: 'white',
              color: '#1F2937',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D2691E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--museum-orange)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E0D5C7';
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category} className="text-gray-900 bg-white">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'All Categories') && (
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 max-w-4xl mx-auto px-2 sm:px-0">
          {searchQuery && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm"
                  style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-red-600 transition-colors text-base sm:text-lg"
              >
                ✕
              </button>
            </span>
          )}
          {selectedCategory !== 'All Categories' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm"
                  style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className="hover:text-red-600 transition-colors text-base sm:text-lg"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
