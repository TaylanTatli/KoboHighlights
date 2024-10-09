import { Dispatch, SetStateAction } from "react";
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
  annotations: Annotation[];
}

export interface BookListProps {
  books: Book[];
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
  bookListData: Book[];
}

export interface UseAnnotationUtilsProps {
  activeAnnotationId: string | null;
  copiedAnnotationId: string | null;
  handleCellClick: (annotationId: string) => void;
  handleCopyClick: (annotationId: string, content: string) => void;
  downloadAnnotations: (
    annotations: Annotation[],
    format: "txt" | "html" | "md",
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

export interface handleFileUploadParams {
  files: File[];
  setDb: Dispatch<SetStateAction<Database | null>>;
  setBookListData: Dispatch<SetStateAction<Book[]>>;
}

export interface AnnotationListToolbarProps {
  annotations: Annotation[];
  author: string;
  bookTitle: string;
  bookListData: Book[];
  selectedBookId: string;
}

export interface HandleBookClickParams {
  bookId: string;
  setAnnotations: Dispatch<SetStateAction<Annotation[]>>;
  bookListData: Book[];
}
