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
    <div className="flex flex-col mx-auto h-lvh w-lvw max-w-screen-xl overflow-hidden">
      <Card
        className={`flex flex-col flex-grow overflow-auto bg-background ${
          isMobile ? "m-0 rounded-none" : "border m-8 rounded-md shadow-md"
        }`}
      >
        <CardHeader className="p-3 border-b bg-gray-600/15 dark:bg-gray-50/10">
          <FileUpload
            onFileUpload={(event) =>
              handleFileUpload(event, setDb, setBookListData)
            }
          />
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-auto">
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            <ResizablePanel minSize={20} defaultSize={20}>
              <BookList
                books={bookListData}
                onBookClick={handleBookSelection}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <div
                className={`w-full h-full ${
                  isMobile ? "max-w-full max-h-full" : "max-w-5xl max-h-5xl"
                } mx-auto`}
              >
                {selectedBookId ? (
                  <AnnotationList
                    annotations={annotations}
                    selectedBookId={selectedBookId}
                  />
                ) : (
                  <p className="text-muted-foreground p-3">
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
