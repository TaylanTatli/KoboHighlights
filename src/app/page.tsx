"use client";

import { useState } from "react";
import initSqlJs, { Database, SqlJsStatic, SqlValue } from "sql.js";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: number;
  releaseDate: string;
  series: string;
  seriesNumber: number;
  rating: number;
  readPercent: number;
  lastRead: string;
  fileSize: number;
  source: string;
}

interface Annotation {
  id: string;
  content: string;
}

export default function Home() {
  const [bookListData, setBookListData] = useState<Book[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [db, setDb] = useState<Database | null>(null);

  const cleanContentID = (contentID: string): string => {
    const parts = contentID.split(/!|!!/);
    return parts[0];
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const SQL: SqlJsStatic = await initSqlJs({
            locateFile: () => "/sql-wasm.wasm",
          });
          const dbInstance = new SQL.Database(new Uint8Array(arrayBuffer));
          setDb(dbInstance);

          const bookListSQL = `
            SELECT
              IFNULL(ContentID,'') as 'id',
              IFNULL(Title,'') as 'title',
              IFNULL(Attribution,'') as 'author',
              IFNULL(Publisher,'') as 'publisher',
              IFNULL(ISBN,0) as 'isbn',
              IFNULL(date(DateCreated),'') as 'releaseDate',
              IFNULL(Series,'') as 'series',
              IFNULL(SeriesNumber,0) as 'seriesNumber',
              IFNULL(AverageRating,0) as 'rating',
              IFNULL(___PercentRead,0) as 'readPercent',
              IFNULL(CASE WHEN ReadStatus>0 THEN datetime(DateLastRead) END,'') as 'lastRead',
              IFNULL(___FileSize,0) as 'fileSize',
              IFNULL(CASE WHEN Accessibility=1 THEN 'Store' ELSE CASE WHEN Accessibility=-1 THEN 'Import' ELSE CASE WHEN Accessibility=6 THEN 'Preview' ELSE 'Other' END END END,'') as 'source'
            FROM content
            WHERE ContentType=6
            AND ___UserId IS NOT NULL
            AND ___UserId != ''
            AND ___UserId != 'removed'
            AND MimeType != 'application/x-kobo-html+pocket'
            AND EXISTS (
              SELECT 1
              FROM bookmark
              WHERE bookmark.VolumeID = content.ContentID
              AND bookmark.Text != ''
              AND bookmark.Hidden = 'false'
            )
            ORDER BY Source desc, Title`;

          const booksRes = dbInstance.exec(bookListSQL);
          const books =
            booksRes[0]?.values.map((row: SqlValue[]) => ({
              id: cleanContentID(row[0] as string),
              title: row[1] as string,
              author: row[2] as string,
              publisher: row[3] as string,
              isbn: row[4] as number,
              releaseDate: row[5] as string,
              series: row[6] as string,
              seriesNumber: row[7] as number,
              rating: row[8] as number,
              readPercent: row[9] as number,
              lastRead: row[10] as string,
              fileSize: row[11] as number,
              source: row[12] as string,
            })) || [];
          setBookListData(
            books.sort((a, b) =>
              a.title.localeCompare(b.title, "tr", { sensitivity: "base" })
            )
          );
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const handleBookClick = (bookId: string) => {
    if (!db) return;

    const selectedBookAnnotationsSQL = `
      SELECT
        '#' || row_number() over (partition by B.Title order by T.ContentID, T.ChapterProgress) as 'id',
        T.Text as 'content'
      FROM content AS B, bookmark AS T
      WHERE B.ContentID = T.VolumeID AND T.Text != '' AND T.Hidden = 'false'
      AND B.MimeType != 'application/x-kobo-html+pocket'
      AND B.ContentID = ?
      ORDER BY T.ContentID, T.ChapterProgress`;

    const annotationsRes = db.exec(selectedBookAnnotationsSQL, [bookId]);
    const annotations =
      annotationsRes[0]?.values.map((row: SqlValue[]) => ({
        id: row[0] as string,
        content: row[1] as string,
      })) || [];
    setAnnotations(annotations);
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <input
        type="file"
        accept=".sqlite"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <div className="flex flex-grow overflow-hidden">
        <div className="books border-r pr-4 overflow-y-auto">
          {bookListData.map((book) => (
            <div
              key={book.id}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => handleBookClick(book.id)}
            >
              {book.title}
            </div>
          ))}
        </div>
        <div className="annotations pl-4 overflow-y-auto">
          {annotations.length > 0 ? (
            annotations.map((annotation) => (
              <div key={annotation.id} className="whitespace-pre-line mb-2">
                {annotation.content}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No annotations available</div>
          )}
        </div>
      </div>
    </div>
  );
}
