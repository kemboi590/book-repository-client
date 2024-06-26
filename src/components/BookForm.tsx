import React, { useState, useEffect } from 'react';

interface BookFormProps {
  onSubmit: (book: { id?: number; title: string; author: string; year: number }) => void;
  initialData?: { id?: number; title: string; author: string; year: number };
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setYear(initialData.year.toString());
    } else {
      setTitle('');
      setAuthor('');
      setYear('');
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      id: initialData?.id,
      title,
      author,
      year: parseInt(year),
    });
    if (!initialData) {
      setTitle('');
      setAuthor('');
      setYear('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Publication Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default BookForm;
