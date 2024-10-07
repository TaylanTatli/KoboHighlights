import { Database } from "sql.js";

export interface Book {
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

export interface BookListProps {
  books: Book[];
  db: Database | null;
  onBookClick: (bookId: string) => void;
}

export interface Annotation {
  id: string;
  content: string;
}

export interface AnnotationListProps {
  annotations: Annotation[];
  selectedBookId: string;
  author: string;
  bookTitle: string;
}

export interface UseAnnotationUtilsProps {
  activeAnnotationId: string | null;
  copiedAnnotationId: string | null;
  removeTrailingEmptyLine: (content: string) => string;
  handleCellClick: (annotationId: string) => void;
  handleCopyClick: (annotationId: string, content: string) => void;
  downloadAnnotations: (
    annotations: Annotation[],
    format: "txt" | "html",
    author: string,
    bookTitle: string,
  ) => void;
}

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  isDatabaseLoaded: boolean;
}