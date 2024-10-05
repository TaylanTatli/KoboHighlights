"use client";

import AnnotationList from "@/components/AnnotationList";
import BookList from "@/components/BookList";
import FileUpload from "@/components/FileUpload";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Annotation, Book } from "@/types";
import { handleBookClick } from "@/utils/handleBookClick";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useState } from "react";
import { Database } from "sql.js";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function Home() {
  const [bookListData, setBookListData] = useState<Book[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [db, setDb] = useState<Database | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleBookSelection = (bookId: string) => {
    setSelectedBookId(bookId);
    handleBookClick(bookId, db, setAnnotations);
  };

  const t = useTranslations();

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
              handleFileUpload(event, setDb, setBookListData)
            }
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
                    annotations={annotations}
                    selectedBookId={selectedBookId}
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
    </div>
  );
}
