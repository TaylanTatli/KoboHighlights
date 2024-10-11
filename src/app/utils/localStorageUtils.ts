import { Book, Highlight } from "@/types";

export const saveBookListDataToLocalStorage = (bookListData: Book[]) => {
  localStorage.setItem("bookListData", JSON.stringify(bookListData));
};

export const getBookListDataFromLocalStorage = (): Book[] | null => {
  const data = localStorage.getItem("bookListData");
  if (!data) return null;

  try {
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.every(isValidBook)) {
      return parsedData;
    }
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
  }

  return null;
};

const isValidBook = (book: Book): book is Book => {
  return (
    typeof book === "object" &&
    book !== null &&
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    Array.isArray(book.highlights) && // highlights alanının varlığını ve bir array olduğunu kontrol ediyoruz
    book.highlights.every(isValidHighlight)
  );
};

const isValidHighlight = (highlight: Highlight): boolean => {
  return (
    typeof highlight === "object" &&
    highlight !== null &&
    typeof highlight.id === "string" &&
    typeof highlight.content === "string"
  );
};
