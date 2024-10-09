import { Annotation, Book } from "@/types";

export const sendBookToNotion = async (
  annotations: Annotation[],
  author: string,
  bookTitle: string,
  notionPageId: string,
  notionApiKey: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  try {
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
          children: annotations.flatMap((annotation) => {
            const chunks = annotation.content.match(/.{1,2000}/g) || [];
            return chunks.map((chunk) => ({
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: chunk,
                    },
                  },
                ],
              },
            }));
          }),
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
    console.error("Error sending annotations to Notion:", error);
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
        book.annotations,
        book.author,
        book.title,
        notionPageId,
        notionApiKey,
        () => {
          console.log(`Successfully sent annotations for book: ${book.title}`);
        },
        () => {
          console.error(`Error sending annotations for book: ${book.title}`);
        },
      );
    }
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error sending all books to Notion:", error);
  }
};
