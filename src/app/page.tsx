"use client";

import AnnotationList from "@/components/AnnotationList";
import BookList from "@/components/BookList";
import FileUpload from "@/components/FileUpload";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/toaster";
import { Annotation, Book } from "@/types";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { getBookListDataFromLocalStorage } from "@/utils/localStorageUtils";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Database } from "sql.js";
import LocalStorageDialog from "./components/LocalStorageDialog";

export default function Home() {
  const [bookListData, setBookListData] = useState<Book[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [db, setDb] = useState<Database | null>(null);
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
      setAnnotations(selectedBook.annotations);
    }
  };

  const selectedBook = bookListData.find((book) => book.id === selectedBookId);

  const t = useTranslations();

  console.log(bookListData);

  return (
    <div className="mx-auto flex h-lvh w-lvw flex-col overflow-hidden">
      <Card
        className={`flex flex-grow flex-col overflow-auto bg-background ${
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
            isDatabaseLoaded={!!db}
          />
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-0">
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
                  <AnnotationList
                    bookListData={bookListData}
                    annotations={annotations}
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
      />
    </div>
  );
}
