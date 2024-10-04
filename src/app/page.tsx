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

export default function Home() {
  const [bookListData, setBookListData] = useState<Book[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [db, setDb] = useState<Database | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-col mx-auto h-lvh w-lvw max-w-screen-xl overflow-hidden">
      <Card
        className={`flex flex-col flex-grow overflow-auto bg-background ${
          isMobile ? "m-0 rounded-none" : "border m-8 rounded-md shadow-2xl"
        }`}
      >
        <CardHeader className="border-b bg-gray-50/10">
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
                onBookClick={(bookId) =>
                  handleBookClick(bookId, db, setAnnotations)
                }
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div
                className={`w-full h-full ${
                  isMobile ? "max-w-full max-h-full" : "max-w-5xl max-h-5xl"
                } mx-auto`}
              >
                <AnnotationList annotations={annotations} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
}
