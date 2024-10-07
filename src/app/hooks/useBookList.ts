import { BookListProps } from "@/types";
import { handleBookClick } from "@/utils/handleBookClick";
import React, { useEffect, useState } from "react";

const useBookList = ({ books, db, onBookClick }: BookListProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [annotationCounts, setAnnotationCounts] = useState<Record<string, number>>({});

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

  useEffect(() => {
    if (db) {
      books.forEach((book) => {
        handleBookClick({
          bookId: book.id,
          db,
          setAnnotations: () => {},
          setAnnotationCount: (count) => {
            setAnnotationCounts((prev) => ({
              ...prev,
              [book.id]: count as number,
            }));
          },
        });
      });
    }
  }, [db, books]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    selectedBookId,
    searchTerm,
    annotationCounts,
    handleBookClickInternal,
    handleSearchChange,
    filteredBooks,
  };
};

export default useBookList;