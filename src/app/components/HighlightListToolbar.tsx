import NotionDialog from "@/components/NotionDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useHighlightUtils } from "@/hooks/useHighlightUtils";
import { HighlightListToolbarProps } from "@/types";
import { sendAllBooksToNotion, sendBookToNotion } from "@/utils/notionUtils";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const HighlightListToolbar: React.FC<HighlightListToolbarProps> = ({
  highlights,
  author,
  bookTitle,
  selectedBookId,
  bookListData,
}) => {
  const { toast } = useToast();
  const t = useTranslations();
  const { downloadHighlights } = useHighlightUtils("");

  const handleNotionSubmit = async (
    notionPageId: string,
    notionApiKey: string,
    sendAll: boolean,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    if (sendAll) {
      await sendAllBooksToNotion(
        bookListData,
        notionPageId,
        notionApiKey,
        () => {
          toast({
            title: t("success"),
            description: t("success_message_notion_all"),
          });
          onSuccess();
        },
        () => {
          toast({
            title: t("error"),
            description: t("error_message_notion"),
          });
          onError();
        },
      );
    } else {
      const selectedBook = bookListData.find(
        (book) => book.id === selectedBookId,
      );
      if (selectedBook) {
        await sendBookToNotion(
          selectedBook.highlights,
          selectedBook.author,
          selectedBook.title,
          notionPageId,
          notionApiKey,
          () => {
            toast({
              title: t("success"),
              description: t("success_message_notion"),
            });
            onSuccess();
          },
          () => {
            toast({
              title: t("error"),
              description: t("error_message_notion"),
            });
            onError();
          },
        );
      }
    }
  };

  return (
    <div className="sticky top-0 z-10 flex flex-row justify-end gap-x-2 bg-gray-600/5 p-2 dark:bg-gray-50/5">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              <FileDown className="mr-2 size-4" />
              {t("download")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "md", author, bookTitle)
              }
            >
              {t("as_md")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "txt", author, bookTitle)
              }
            >
              {t("as_txt")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "html", author, bookTitle)
              }
            >
              {t("as_html")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NotionDialog onSubmit={handleNotionSubmit} />
      </div>
    </div>
  );
};

export default HighlightListToolbar;
