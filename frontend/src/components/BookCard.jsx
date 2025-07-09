import React from 'react';
import { Edit2, Trash2, Star } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'star' : 'star empty'}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-image"
        />
        <div className="book-actions">
          <button
            onClick={() => onEdit(book)}
            className="action-button edit-button"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="action-button delete-button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        
        <div className="book-meta">
          <span className="genre-badge">{book.genre}</span>
          <span className="year">{book.publishedYear}</span>
        </div>
        
        <div className="rating">
          {renderStars(book.rating)}
          <span className="rating-text">({book.rating}/5)</span>
        </div>
        
        {book.description && (
          <p className="book-description">{book.description}</p>
        )}
        
        <div className="book-isbn">
          ISBN: {book.isbn}
        </div>
      </div>
    </div>
  );
};

export default BookCard;