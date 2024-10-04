import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Book } from "@/types";
import React from "react";

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  return (
    <ScrollArea className="books px-4 py-0 w-full h-full bg-card">
      <Table className="text-base">
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book.id}
              className="cursor-pointer"
              onClick={() => onBookClick(book.id)}
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
