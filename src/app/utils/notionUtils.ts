import { Annotation } from "@/types";

export const sendAnnotationsToNotion = async (
  annotations: Annotation[],
  author: string,
  bookTitle: string,
  notionPageId: string,
  notionApiKey: string,
) => {
  try {
    const response = await fetch("/api/proxy", {
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
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Annotations sent to Notion successfully:", data);
  } catch (error) {
    console.error("Error sending annotations to Notion:", error);
  }
};
