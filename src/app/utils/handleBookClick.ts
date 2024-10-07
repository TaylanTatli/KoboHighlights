import { HandleBookClickParams } from "@/types";
import { SqlValue } from "sql.js";

export const handleBookClick = ({
  bookId,
  db,
  setAnnotations,
  setAnnotationCount,
}: HandleBookClickParams) => {
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
  if (setAnnotationCount) {
    setAnnotationCount(annotations.length);
  }
};