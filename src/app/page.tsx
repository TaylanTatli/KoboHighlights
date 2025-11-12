"use client";

import BookList from "@/components/BookList";
import FileUpload from "@/components/FileUpload";
import HighlightList from "@/components/HighlightList";
import LocalStorageDialog from "@/components/LocalStorageDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/toaster";
import { Book, Highlight } from "@/types";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { getBookListDataFromLocalStorage } from "@/utils/localStorageUtils";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Database } from "sql.js";

export default function Home() {
  const [bookListData, setBookListData] = useState<Book[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [, setDb] = useState<Database | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLocalStorageData, setIsLocalStorageData] = useState(false);

  useEffect(() => {
    const localStorageData = getBookListDataFromLocalStorage();
    if (localStorageData) {
      setBookListData(localStorageData);
      setIsLocalStorageData(true);
    }
  }, []);

  const handleBookSelection = (bookId: string) => {
    const selectedBook = bookListData.find((book) => book.id === bookId);
    if (selectedBook) {
      setSelectedBookId(bookId);
      setHighlights(selectedBook.highlights);
    }
  };

  const selectedBook = bookListData.find((book) => book.id === selectedBookId);

  const t = useTranslations();

  return (
    <div className="mx-auto flex h-lvh w-lvw flex-col overflow-hidden">
      <Card
        className={`flex grow flex-col overflow-auto bg-background ${
          isMobile ? "m-0 rounded-none" : "m-2 rounded-lg border drop-shadow-md"
        }`}
      >
        <CardHeader className="border-b bg-card p-2">
          <FileUpload
            onFileUpload={(event) =>
              handleFileUpload({
                files: event,
                setDb,
                setBookListData,
              })
            }
            isDatabaseLoaded={bookListData.length > 0}
          />
        </CardHeader>
        <CardContent className="grow overflow-auto p-0">
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            <ResizablePanel
              minSize={isMobile ? 35 : 20}
              defaultSize={isMobile ? 35 : 20}
            >
              <BookList
                books={bookListData}
                onBookClick={handleBookSelection}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={isMobile ? 65 : 80}>
              <div className="h-full max-h-full w-full max-w-full">
                {selectedBookId ? (
                  <HighlightList
                    bookListData={bookListData}
                    highlights={highlights}
                    selectedBookId={selectedBookId}
                    author={selectedBook?.author || ""}
                    bookTitle={selectedBook?.title || ""}
                  />
                ) : (
                  <p className="p-3 text-muted-foreground">
                    {t("not_uploaded_or_not_selected")}
                  </p>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
      <Toaster />

      <LocalStorageDialog
        open={isLocalStorageData}
        onOpenChange={setIsLocalStorageData}
        onConfirm={() => setIsLocalStorageData(false)}
        setBookListData={setBookListData}
      />
    </div>
  );
}
