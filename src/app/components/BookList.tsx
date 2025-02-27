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
import useBookList from "@/hooks/useBookList";
import { BookListProps } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  const {
    selectedBookId,
    searchTerm,
    handleBookClickInternal,
    handleSearchChange,
    filteredBooks,
  } = useBookList({ books, onBookClick });

  const t = useTranslations();

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-600/5 dark:bg-gray-50/5">
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
                          <div className="line-clamp-1 flex w-0 grow flex-col items-start">
                            <span className="line-clamp-1 inline-block max-w-full truncate">
                              {book.title}
                            </span>
                            <span className="line-clamp-1 inline-block max-w-full truncate text-sm text-muted-foreground">
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
                            <Badge className="h-4 w-8 justify-center p-1 text-xs">
                              {book.highlights.length || 0}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                          <p>
                            {book.highlights.length || 0} {t("highlight")}
                          </p>
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
