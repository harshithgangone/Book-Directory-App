import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  onAddBook
}) => {
  return (
    <div className="search-filter-content">
      <div className="search-input-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={20} style={{ color: '#666' }} />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="select"
          >
            <option value="all">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Business">Business</option>
          </select>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select"
        >
          <option value="newest">Newest First</option>
          <option value="title">Title A-Z</option>
          <option value="author">Author A-Z</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
        </select>
        
        <button onClick={onAddBook} className="add-button">
          <Plus size={20} />
          Add Book
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;