import { Book, HandleBookClickParams } from "@/types";

export const handleBookClick = ({
  bookId,
  bookListData,
  setAnnotations,
}: HandleBookClickParams & { bookListData: Book[] }) => {
  const selectedBook = bookListData.find((book) => book.id === bookId);
  if (selectedBook) {
    setAnnotations(selectedBook.annotations);
  }
};
