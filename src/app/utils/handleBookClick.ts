import { Book, HandleBookClickParams } from "@/types";

export const handleBookClick = ({
  bookId,
  bookListData,
  setHighlights,
}: HandleBookClickParams & { bookListData: Book[] }) => {
  const selectedBook = bookListData.find((book) => book.id === bookId);
  if (selectedBook) {
    setHighlights(selectedBook.highlights);
  }
};
