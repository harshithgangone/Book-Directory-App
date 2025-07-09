import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, CheckCircle, X } from 'lucide-react';
import BookCard from './components/BookCard.jsx';
import BookModal from './components/BookModal.jsx';
import SearchAndFilter from './components/SearchAndFilter.jsx';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now().toString();
    const notification = { id, type, message };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        genre: selectedGenre,
        sort: sortBy
      });
      
      const response = await fetch(`${API_BASE_URL}/books?${params}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      addNotification('error', 'Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedGenre, sortBy]);

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add book');
      }

      const newBook = await response.json();
      setBooks(prev => [newBook, ...prev]);
      addNotification('success', 'Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      addNotification('error', error instanceof Error ? error.message : 'Failed to add book');
    }
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook) return;

    try {
      const response = await fetch(`${API_BASE_URL}/books/${editingBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update book');
      }

      const updatedBook = await response.json();
      setBooks(prev => prev.map(book => book._id === editingBook._id ? updatedBook : book));
      addNotification('success', 'Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      addNotification('error', error instanceof Error ? error.message : 'Failed to update book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete book');
      }

      setBooks(prev => prev.filter(book => book._id !== bookId));
      addNotification('success', 'Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      addNotification('error', error instanceof Error ? error.message : 'Failed to delete book');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmitBook = (bookData) => {
    if (editingBook) {
      handleUpdateBook(bookData);
    } else {
      handleAddBook(bookData);
    }
    handleCloseModal();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  return (
    <div className="container">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
          >
            {getNotificationIcon(notification.type)}
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="notification-close"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="header-title">Book Directory</h1>
            <p className="header-subtitle">Manage your book collection</p>
          </div>
        </div>
        <div className="stats">
          <div className="stats-number">{books.length}</div>
          <div className="stats-label">Total Books</div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAddBook={() => setIsModalOpen(true)}
        />
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h3 className="empty-title">No books found</h3>
          <p className="empty-description">
            {searchTerm || selectedGenre !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start building your book collection by adding your first book'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBook}
        book={editingBook}
        isEditing={!!editingBook}
      />
    </div>
  );
}

export default App;