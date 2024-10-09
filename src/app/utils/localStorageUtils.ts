import { Book } from "@/types";

export const saveBookListDataToLocalStorage = (bookListData: Book[]) => {
  localStorage.setItem("bookListData", JSON.stringify(bookListData));
};

export const getBookListDataFromLocalStorage = (): Book[] | null => {
  const data = localStorage.getItem("bookListData");
  return data ? JSON.parse(data) : null;
};
