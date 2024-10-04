import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Book } from "@/types";
import React, { useState } from "react";

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    onBookClick(bookId);
  };

  return (
    <ScrollArea className="books p-0 w-full h-full bg-gray-50/5">
      <Table className="text-base">
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book.id}
              className={`cursor-pointer ${
                selectedBookId === book.id ? "bg-muted/50" : ""
              }`}
              onClick={() => handleBookClick(book.id)}
            >
              <TableCell className="py-3">{book.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default BookList;
