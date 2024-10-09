import { handleFileUploadParams } from "@/types";
import { saveBookListDataToLocalStorage } from "@/utils/localStorageUtils";
import initSqlJs, { SqlJsStatic, SqlValue } from "sql.js";

export const annotationsListSQL = (contentID: string) => `
  SELECT
    '#' || row_number() OVER (PARTITION BY B.Title ORDER BY T.ContentID, T.ChapterProgress) AS row_number,
    T.Text AS text
  FROM content AS B
  JOIN bookmark AS T ON B.ContentID = T.VolumeID
  WHERE T.Text != '' AND T.Hidden = 'false' AND B.ContentID = '${contentID}'
  ORDER BY T.ContentID, T.ChapterProgress;
`;

export const handleFileUpload = async ({
  files,
  setDb,
  setBookListData,
}: handleFileUploadParams) => {
  if (files && files.length > 0) {
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer) {
        const SQL: SqlJsStatic = await initSqlJs({
          locateFile: () => "/sql-wasm.wasm",
        });
        const dbInstance = new SQL.Database(
          new Uint8Array(arrayBuffer as ArrayBuffer),
        );
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
          (await Promise.all(
            booksRes[0]?.values.map(async (row: SqlValue[]) => {
              const contentID = row[0] as string;
              const annotationsRes = dbInstance.exec(
                annotationsListSQL(contentID),
              );
              const annotations =
                annotationsRes[0]?.values.map((annotationRow: SqlValue[]) => ({
                  id: annotationRow[0] as string,
                  content: annotationRow[1] as string,
                })) || [];
              return {
                id: contentID,
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
                annotations: annotations,
              };
            }),
          )) || [];
        const sortedBooks = books.sort((a, b) =>
          a.title.localeCompare(b.title, "tr", { sensitivity: "base" }),
        );
        setBookListData(sortedBooks);
        saveBookListDataToLocalStorage(sortedBooks);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }
};
