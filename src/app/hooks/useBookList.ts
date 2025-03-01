import { BookListProps } from "@/types";
import React, { useEffect, useState } from "react";

const useBookList = ({ books, onBookClick }: BookListProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleBookClickInternal = (bookId: string) => {
    setSelectedBookId(bookId);
    onBookClick(bookId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    selectedBookId,
    searchTerm,
    handleBookClickInternal,
    handleSearchChange,
    filteredBooks,
  };
};

export default useBookList;
