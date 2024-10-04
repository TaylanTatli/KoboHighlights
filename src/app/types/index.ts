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

export interface Annotation {
  id: string;
  content: string;
}