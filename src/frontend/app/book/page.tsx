"use client";
import { useCallback, useEffect, useState } from "react";
export default function Home() {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [patrons, setPatrons] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchPatrons();
  }, []);

  const fetchBooks = useCallback(async () => {
    const response = await fetch("/api/book");
    const data = await response.json();
    setBooks(data);
  }, []);
  const fetchPatrons = useCallback(async () => {
    const response = await fetch("/api/patron");
    const data = await response.json();
    setPatrons(data);
  }, []);
  const addBook = async (isbn, title, author) => {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isbn, title, author }),
    });
    const newBook = await response.json();
    setBooks([...books, newBook]);
  };

  const signOutBook = async (id, patronId) => {
    const book = books.find((t) => t.id === id);
    if (book) {
      const response = await fetch(`/api/book/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patronId: patronId ? patronId : null }),
      });
      const updatedBook = await response.json();
      setBooks(books.map((t) => (t.id === id ? updatedBook : t)));
    }
  };

  const deleteBook = async (id) => {
    await fetch(`/api/book/${id}`, { method: "DELETE" });
    setBooks(books.filter((t) => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addBook(isbn.trim(), title.trim(), author.trim());
      setTitle("");
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="ISBN"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Book
        </button>
      </form>

      <ul>
        {books.map((book) => (
          <li key={book.id} className="flex items-center mb-2">
            <select
              onChange={(e) => signOutBook(book.id, e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="">In Stock</option>
              {patrons.map((patron) => (
                <option key={patron.id} value={patron.id}>
                  {patron.name}
                </option>
              ))}
            </select>
            <span className={book.patronId ? "line-through" : ""}>
              {book.title} - {book.author} ({book.isbn})
            </span>
            <button onClick={() => deleteBook(book.id)} className="ml-auto">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
