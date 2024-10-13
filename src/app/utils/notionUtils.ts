import { Book, Highlight } from "@/types";
import { removeTrailingEmptyLine } from "@/utils/stringUtils";

export const sendBookToNotion = async (
  highlights: Highlight[],
  author: string,
  bookTitle: string,
  notionPageId: string,
  notionApiKey: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  try {
    const cleanedHighlights = highlights.map((highlight) =>
      removeTrailingEmptyLine(highlight.content),
    );
    const response = await fetch("/api/proxy/notion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notionApiKey,
        payload: {
          parent: { page_id: notionPageId },
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: `${bookTitle} - ${author}`,
                  },
                },
              ],
            },
          },
          children: cleanedHighlights.map((highlight) => ({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: highlight,
                  },
                },
              ],
            },
          })),
        },
        url: "/v1/pages",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.statusText} - ${errorText}`);
    }
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error sending highlights to Notion:", error);
  }
};

export const sendAllBooksToNotion = async (
  books: Book[],
  notionPageId: string,
  notionApiKey: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  try {
    for (const book of books) {
      await sendBookToNotion(
        book.highlights,
        book.author,
        book.title,
        notionPageId,
        notionApiKey,
        () => {
          console.log(`Successfully sent highlights for book: ${book.title}`);
        },
        () => {
          console.error(`Error sending highlights for book: ${book.title}`);
        },
      );
    }
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error sending all books to Notion:", error);
  }
};
