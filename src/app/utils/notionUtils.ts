import { Annotation } from "@/types";

export const sendAnnotationsToNotion = async (
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
