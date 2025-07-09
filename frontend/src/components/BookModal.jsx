import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';

const BookModal = ({ isOpen, onClose, onSubmit, book, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: new Date().getFullYear(),
    isbn: '',
    description: '',
    rating: 1,
    coverImage: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book && isEditing) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        publishedYear: book.publishedYear,
        isbn: book.isbn,
        description: book.description || '',
        rating: book.rating,
        coverImage: book.coverImage
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        publishedYear: new Date().getFullYear(),
        isbn: '',
        description: '',
        rating: 1,
        coverImage: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg'
      });
    }
    setErrors({});
  }, [book, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' || name === 'rating' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      newErrors.publishedYear = 'Please enter a valid year';
    }
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStars = (rating, onChange) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={24}
        className={`rating-star ${i < rating ? 'star' : 'star empty'}`}
        fill={i < rating ? 'currentColor' : 'none'}
        onClick={() => onChange(i + 1)}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter book title"
                />
                {errors.title && <div className="error-message">{errors.title}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`form-input ${errors.author ? 'error' : ''}`}
                  placeholder="Enter author name"
                />
                {errors.author && <div className="error-message">{errors.author}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="genre" className="form-label">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`form-select ${errors.genre ? 'error' : ''}`}
                >
                  <option value="">Select genre</option>
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
                {errors.genre && <div className="error-message">{errors.genre}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="publishedYear" className="form-label">
                  Published Year *
                </label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  min="1000"
                  max={new Date().getFullYear()}
                  className={`form-input ${errors.publishedYear ? 'error' : ''}`}
                />
                {errors.publishedYear && <div className="error-message">{errors.publishedYear}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="isbn" className="form-label">
                  ISBN *
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`form-input ${errors.isbn ? 'error' : ''}`}
                  placeholder="Enter ISBN"
                />
                {errors.isbn && <div className="error-message">{errors.isbn}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating *</label>
                <div className="rating-input">
                  <div className="rating-stars">
                    {renderStars(formData.rating, handleRatingChange)}
                  </div>
                  <span className="rating-text">({formData.rating}/5)</span>
                </div>
                {errors.rating && <div className="error-message">{errors.rating}</div>}
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="coverImage" className="form-label">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter book description"
              />
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
              >
                {isEditing ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookModal;