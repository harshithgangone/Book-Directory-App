const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://harshithmongo:HARSHAMDB1234@cluster0.kkwkg.mongodb.net/bookdirectory';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  coverImage: {
    type: String,
    default: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg'
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// GET all books
app.get('/api/books', async (req, res) => {
  try {
    const { search, genre, sort } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (genre && genre !== 'all') {
      query.genre = genre;
    }
    
    let books = Book.find(query);
    
    if (sort === 'title') {
      books = books.sort({ title: 1 });
    } else if (sort === 'author') {
      books = books.sort({ author: 1 });
    } else if (sort === 'year') {
      books = books.sort({ publishedYear: -1 });
    } else if (sort === 'rating') {
      books = books.sort({ rating: -1 });
    } else {
      books = books.sort({ createdAt: -1 });
    }
    
    const result = await books.exec();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single book
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create book
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'ISBN already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// PUT update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'ISBN already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});