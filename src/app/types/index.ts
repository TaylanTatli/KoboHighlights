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
  highlights: Highlight[];
}

export interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

export interface Highlight {
  id: string;
  content: string;
}

export interface HighlightListProps {
  highlights: Highlight[];
  selectedBookId: string;
  author: string;
  bookTitle: string;
  bookListData: Book[];
}

export interface UseHighlightUtilsProps {
  activeHighlightId: string | null;
  copiedHighlightId: string | null;
  handleCellClick: (highlightId: string) => void;
  handleCopyClick: (highlightId: string, content: string) => void;
  downloadHighlights: (
    highlights: Highlight[],
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

export interface LocalStorageConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  setBookListData: Dispatch<SetStateAction<Book[]>>;
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

export interface HighlightListToolbarProps {
  highlights: Highlight[];
  author: string;
  bookTitle: string;
  bookListData: Book[];
  selectedBookId: string;
}

export interface HandleBookClickParams {
  bookId: string;
  setHighlights: Dispatch<SetStateAction<Highlight[]>>;
  bookListData: Book[];
}
