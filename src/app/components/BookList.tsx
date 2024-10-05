import { ModeToggle } from "@/components/DarkModeToggle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Book } from "@/types";
import { handleBookClick } from "@/utils/handleBookClick";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Database } from "sql.js";

interface BookListProps {
  books: Book[];
  db: Database | null;
  onBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, db, onBookClick }) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [annotationCounts, setAnnotationCounts] = useState<{
    [key: string]: number;
  }>({});

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
        handleBookClick(
          book.id,
          db,
          () => {},
          (count) => {
            setAnnotationCounts((prev) => ({
              ...prev,
              [book.id]: count as number,
            }));
          },
        );
      });
    }
  }, [db, books]);

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
                onClick={() => handleBookClickInternal(book.id)}
              >
                <TableCell className="py-3">
                  <div className="flex flex-row items-center">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="line-clamp-1 flex w-0 flex-grow flex-col items-start truncate">
                            <span>{book.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {book.author}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                          <p>
                            {book.author} - {book.title}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Badge className="h-7 w-10 justify-center px-1 py-0 text-xs">
                              {annotationCounts[book.id] || 0}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                          <p>{annotationCounts[book.id] || 0} adet alıntı</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default BookList;
