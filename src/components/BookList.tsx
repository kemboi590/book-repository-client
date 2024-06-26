import React, { useState, useCallback } from 'react';

interface Book {
  id?: number;
  title: string;
  author: string;
  year: number;
}

interface BookListProps {
  books: Book[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(books.length / booksPerPage)));
  }, [books.length]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const currentBooks = books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Author</th>
            <th className="py-2 px-4">Year</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 px-4">{book.title}</td>
              <td className="py-2 px-4">{book.author}</td>
              <td className="py-2 px-4">{book.year}</td>
              <td className="py-2 px-4">
                <button onClick={() => onEdit(index + (currentPage - 1) * booksPerPage)} className="bg-green-500 text-white p-2 m-2 rounded-md hover:bg-green-600">Edit</button>
                <button onClick={() => onDelete(index + (currentPage - 1) * booksPerPage)} className="bg-red-500 text-white p-2 m-2 rounded-md hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(books.length / booksPerPage)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
