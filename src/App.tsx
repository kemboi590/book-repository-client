import React, { useReducer, useEffect, useState } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

interface Book {
  id?: number;
  title: string;
  author: string;
  year: number;
}

type ActionType =
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: { index: number; book: Book } }
  | { type: 'DELETE_BOOK'; payload: number }
  | { type: 'SET_BOOKS'; payload: Book[] };

const bookReducer = (state: Book[], action: ActionType): Book[] => {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, action.payload];
    case 'UPDATE_BOOK':
      return state.map((book, index) =>
        index === action.payload.index ? action.payload.book : book
      );
    case 'DELETE_BOOK':
      return state.filter((book) => book.id !== action.payload);
    case 'SET_BOOKS':
      return action.payload;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [books, dispatch] = useReducer(bookReducer, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8081/books');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch({ type: 'SET_BOOKS', payload: data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (book: Book) => {
    try {
      if (editingIndex !== null) {
        const response = await fetch(`http://localhost:8081/books/${book.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const updatedBook = await response.json();
        dispatch({ type: 'UPDATE_BOOK', payload: { index: editingIndex, book: updatedBook } });
        setEditingIndex(null);
      } else {
        const response = await fetch('http://localhost:8081/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newBook = await response.json();
        dispatch({ type: 'ADD_BOOK', payload: newBook });
        fetchBooks(); // Refetch the list of books after adding a new book
      }
    } catch (error) {
      console.error('Error adding/updating book:', error);
    }
  };

  const handleEditBook = (index: number) => {
    setEditingIndex(index);
  };

  const handleDeleteBook = async (index: number) => {
    try {
      const bookId = books[index].id;
      const response = await fetch(`http://localhost:8081/books/${bookId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      dispatch({ type: 'DELETE_BOOK', payload: bookId! });
      fetchBooks(); // Refetch the list of books after deleting a book
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Book Repository</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <BookForm onSubmit={handleAddBook} initialData={editingIndex !== null ? books[editingIndex] : undefined} />
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-md mt-4 text-black"
        />
        <BookList books={filteredBooks} onEdit={handleEditBook} onDelete={handleDeleteBook} />
      </div>
    </div>
  );
};

export default App;
