import { ModeToggle } from "@/components/DarkModeToggle";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Book } from "@/types";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleBookClick = (bookId: string) => {
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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const t = useTranslations();

  return (
    <div className="relative h-full w-full bg-gray-600/5 dark:bg-gray-50/5">
      <div className="sticky top-0 z-10 flex flex-row gap-x-2 p-2">
        <ModeToggle />
        <Input
          type="search"
          placeholder={t("search_books")}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2"
        />
      </div>
      <Separator />
      <ScrollArea className="books h-full w-full p-0">
        <Table className="text-base">
          <TableBody>
            {filteredBooks.map((book) => (
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
    </div>
  );
};

export default BookList;
